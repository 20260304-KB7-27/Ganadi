<template>
  <div class="card card-body">
    <Header
      :month="currentMonth"
      @prev-month="goPreMonth"
      @next-month="goNextMonth"
      :expense="expense"
      :income="income"
      :balance="balance"
    ></Header>

    <ProgressBar
      bgcolor="#C0FFBE"
      :completedRate="completed_rate"
      :goalMoney="goal_money"
    />
    <div class="calendar-wrapper">
      <CalendarView
        :items="items"
        :show-date="showDate"
        class="account-calendar"
      >
        <template #day-content="{ day }">
          <div
            class="day-cell"
            :class="{
              selected: selectedDate === formatDate(day),
              'other-month': !isCurrentMonth(day),
              sunday: isSunday(day),
            }"
            @click="selectDate(formatDate(day))"
          >
            <!-- 날짜 숫자 -->
            <div class="day-number">{{ day.getDate() }}</div>
          </div>
        </template>
      </CalendarView>
      <!-- 장식 이미지 레이어 -->
      <div class="calendar-deco-layer">
        <img
          src="@/assets/images/calendar/ganadi_cat.png"
          class="deco-img deco-top-left"
          :style="{ width: '60px', height: '70px' }"
        />
        <img
          src="@/assets/images/calendar/ganadi_hart.png"
          class="deco-img deco-top-right"
          :style="{ width: '80px', height: '120px' }"
        />
        <img
          src="@/assets/images/calendar/ganadi_shy.png"
          class="deco-img deco-middle"
          :style="{ width: '80px', height: '80px' }"
        />
        <img
          src="@/assets/images/calendar/ganadi_with_cat.png"
          class="deco-img deco-bottom-left"
          :style="{ width: '120px', height: '100px' }"
        />
        <img
          src="@/assets/images/calendar/gnadi_fight.png"
          class="deco-img deco-bottom-right"
          :style="{ width: '80px', height: '100px' }"
        />
      </div>
    </div>
    <div class="detail-section">
      <RouterLink
        :to="{ path: '/input', query: { date: selectedDate } }"
        class="add-button"
      >
        <img
          src="@/assets/images/home_image/add.png"
          alt="plus"
          class="plus-image"
        />
      </RouterLink>
      <!-- 상세내역 -->
      <DailyDetail
        :selectedDate="selectedDate"
        :transactions="transactions"
        :categoryData="categoryData"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { CalendarView } from "vue-simple-calendar";
import "vue-simple-calendar/dist/vue-simple-calendar.css";
import ProgressBar from "../components/ProgressBar.vue";
import Header from "../components/Header.vue";
import DailyDetail from "../components/DailyDetail.vue";
import axios from "axios";
import {
  getMonthlyExpense,
  getMonthlyIncome,
  getCategory,
} from "@/utils/graphAdapter";
import { useCalendarStore } from "@/stores/calendarStore";

export default {
  name: "Home",
  components: {
    CalendarView,
    ProgressBar,
    Header,
    DailyDetail,
  },

  setup() {
    const calendarStore = useCalendarStore();
    const route = useRoute();

    const now = new Date();

    const initialYear = route.query.year
      ? Number(route.query.year)
      : now.getFullYear();
    const initialMonth = route.query.month
      ? Number(route.query.month)
      : now.getMonth() + 1;

    const showDate = ref(new Date(initialYear, initialMonth - 1, 1));

    const items = ref([]);

    // 기본 선택 날짜: 오늘
    const selectedDate = ref(new Date().toISOString().split("T")[0]);

    // 처음 페이지 진입 시 현재 보고 있는 달 store에 저장
    calendarStore.setDate(showDate.value);

    const selectDate = (date) => {
      selectedDate.value = date;
    };

    const getTargetMonth = (dateObj) => {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      return `${year}-${month}`;
    };
    const updateGoalMoney = () => {
      const currentTargetMonth = getTargetMonth(showDate.value);
      const currentBudget = budgetList.value.find(
        (item) => item.targetMonth === currentTargetMonth,
      );
      goal_money.value = currentBudget ? Number(currentBudget.amount) : 0;
    };
    const transactions = ref([]);
    const categoryData = ref([]);
    onMounted(async () => {
      try {
        const [transRes, budRes, categoryRes, iconsRes, colorsRes] =
          await Promise.all([
            axios.get("/api/transactions"),
            axios.get("/api/budget"),
            axios.get("/api/category"),
            axios.get("/api/icons"),
            axios.get("/api/colors"),
          ]);
        transactions.value = transRes.data;
        categoryData.value = getCategory(
          categoryRes.data,
          iconsRes.data,
          colorsRes.data,
        );
        const budgetData = budRes.data;
        budgetList.value = budgetData;

        updateGoalMoney();

        const grouped = {};

        transactions.value.forEach((transaction) => {
          const date = transaction.date;

          if (!grouped[date]) {
            grouped[date] = {
              income: 0,
              expense: 0,
            };
          }

          if (transaction.type === "income") {
            grouped[date].income += Number(transaction.amount);
          } else if (transaction.type === "expense") {
            grouped[date].expense += Number(transaction.amount);
          }
        });

        const transactionItems = [];

        Object.keys(grouped).forEach((date) => {
          const dayData = grouped[date];

          if (dayData.income > 0) {
            transactionItems.push({
              id: Date.now(),
              startDate: date,
              endDate: date,
              title: "+" + dayData.income.toLocaleString(),
              classes: ["income-item"],
            });
          }

          if (dayData.expense > 0) {
            transactionItems.push({
              id: Date.now(),
              startDate: date,
              endDate: date,
              title: "-" + dayData.expense.toLocaleString(),
              classes: ["expense-item"],
            });
          }
        });

        items.value = transactionItems;
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    });
    //입금,소비,잔액,목표금액
    const expense = computed(() => {
      return getMonthlyExpense(
        transactions.value,
        showDate.value.getFullYear(),
        showDate.value.getMonth() + 1,
      );
    });
    const income = computed(() => {
      return getMonthlyIncome(
        transactions.value,
        showDate.value.getFullYear(),
        showDate.value.getMonth() + 1,
      );
    });
    const balance = computed(() => {
      return income.value - expense.value;
    });
    const goal_money = ref(0);
    const budgetList = ref([]);
    //달성률
    const completed_rate = computed(() => {
      if (goal_money.value === 0) return 0;
      return Math.round((expense.value / goal_money.value) * 100);
    });

    // showDate 바뀔 때마다 store 갱신
    watch(showDate, (newDate) => {
      updateGoalMoney();
      calendarStore.setDate(newDate);
    });

    const currentMonth = computed(() => {
      return showDate.value.getMonth() + 1; // 월은 0부터 시작하므로 +1
    });

    //이전 달로 이동
    const goPreMonth = () => {
      const d = showDate.value;
      showDate.value = new Date(d.getFullYear(), d.getMonth() - 1, 1);
    };

    //다음 달로 이동
    const goNextMonth = () => {
      const d = showDate.value;
      showDate.value = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    };

    const formatDate = (dateObj) => {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    //다른 달의 날짜 회색처리를 위한
    const isCurrentMonth = (dateObj) => {
      return (
        dateObj.getFullYear() === showDate.value.getFullYear() &&
        dateObj.getMonth() === showDate.value.getMonth()
      );
    };
    //일요일 판별
    const isSunday = (dateObj) => {
      return dateObj.getDay() === 0;
    };
    return {
      showDate,
      items,
      currentMonth,
      income,
      expense,
      balance,
      completed_rate,
      goal_money,
      goPreMonth,
      goNextMonth,
      selectedDate,
      selectDate,
      formatDate,
      transactions,
      categoryData,
      isCurrentMonth,
      isSunday,
    };
  },
};
</script>

<style>
.add-button {
  position: absolute;
  top: 32px;
  bottom: 20px;
  right: 20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: white;
  border: black 1px solid;
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.add-button:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 8px rgba(3, 3, 3, 2);
}

.plus-image {
  width: 70px;
  height: 70px;
}

.card-body {
  position: relative;
}
.detail-section {
  position: relative;
}

/* 데일리 수입/지출 내역과 그리드 너비 */
.account-calendar .cv-item {
  background: transparent !important;
  border: none !important;
  padding: 10px !important;
  /* 각 셀에서 hover 버벅이는 문제 해결 코드 */
  pointer-events: none;
}

.account-calendar .cv-item.income-item {
  color: rgb(30, 255, 0);
  font-size: small;
}
.account-calendar .cv-item.expense-item {
  color: rgb(255, 0, 0);
  font-size: small;
}

.account-calendar .cv-week {
  min-height: 80px !important;
}

/* 오늘 날짜 표시 */
.account-calendar .cv-day.today {
  background-color: #efefef;
  color: red;
  font-weight: bold;
}

/* 날짜 셀 커스텀 */
.day-cell {
  width: 100%;
  box-sizing: border-box;
  padding: 5px;
  cursor: pointer;
}

/* hover 효과 */
.day-cell:hover {
  background-color: #fff0fd;
}

/* 선택된 날짜 */
.day-cell.selected {
  border: 2px solid #ffc5f7;
  background-color: #fff0fd;
}

/* 날짜 숫자 */
.day-number {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
}
.account-calendar .cv-day-number {
  display: none;
}

/* 현재 화면에서 다른 달의 날짜를 회색처리 */
.day-cell.other-month {
  color: #bdbdbd;
  opacity: 0.5;
}
/* 일요일 빨간색 */
.day-cell.sunday .day-number {
  color: red;
  font-weight: bold;
}
/* 다른 달 + 일요일 (덮어쓰기) */
.day-cell.other-month.sunday .day-number {
  color: #bdbdbd !important;
  font-weight: normal;
}

.calendar-wrapper {
  position: relative;
}

.calendar-deco-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

.deco-img {
  position: absolute;
  width: 48px;
  height: 48px;
  object-fit: contain;
}

/* 원하는 위치에 배치 */
.deco-top-left {
  top: 18%;
  left: 23%;
}

.deco-top-right {
  top: -5px;
  right: -40px;
}

.deco-middle {
  top: 55%;
  left: 42%;
  transform: translateX(-50%);
}

.deco-bottom-left {
  bottom: -50px;
  left: -30px;
}

.deco-bottom-right {
  bottom: 45px;
  right: 50px;
}
</style>
