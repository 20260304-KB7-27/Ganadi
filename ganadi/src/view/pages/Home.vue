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
    <CalendarView :items="items" :show-date="showDate" class="account-calendar">
      <template #day-content="{ day }">
        <div
          class="day-cell"
          :class="{ selected: selectedDate === formatDate(day) }"
          @click="selectDate(formatDate(day))"
        >
          <!-- 날짜 숫자 -->
          <div class="day-number">{{ day.getDate() }}</div>
        </div>
      </template>
    </CalendarView>

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
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { CalendarView } from 'vue-simple-calendar';
import 'vue-simple-calendar/dist/vue-simple-calendar.css';
import ProgressBar from '../components/ProgressBar.vue';
import Header from '../components/Header.vue';

export default {
  name: 'Home',
  components: {
    CalendarView,
    ProgressBar,
    Header,
  },

  setup() {
    //입금,소비,잔액,목표금액
    const expense = ref(2000000);
    const income = ref(500000);
    const balance = computed(() => {
      return income.value - expense.value;
    });
    const goal_money = ref(100000);
    //달성률
    const completed_rate = computed(() => {
      return (expense.value / goal_money.value) * 100;
    });

    const showDate = ref(new Date());

    const items = ref([]);

    // 기본 선택 날짜: 오늘
    const selectedDate = ref(new Date().toISOString().split('T')[0]);
    const selectDate = (date) => {
      selectedDate.value = date;
    };
    onMounted(async () => {
      try {
        const response = await fetch('http://localhost:3000/transactions');
        const transactions = await response.json();

        const grouped = {};

        transactions.forEach((transaction) => {
          const date = transaction.date;

          if (!grouped[date]) {
            grouped[date] = {
              income: 0,
              expense: 0,
            };
          }

          if (transaction.type === 'income') {
            grouped[date].income += Number(transaction.amount);
          } else if (transaction.type === 'expense') {
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
              title: '+' + dayData.income.toLocaleString(),
              classes: ['income-item'],
            });
          }

          if (dayData.expense > 0) {
            transactionItems.push({
              id: Date.now(),
              startDate: date,
              endDate: date,
              title: '-' + dayData.expense.toLocaleString(),
              classes: ['expense-item'],
            });
          }
        });

        items.value = transactionItems;
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
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
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
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
    };
  },
};
</script>

<style>
.add-button {
  position: absolute;
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
  border: 3px solid #ffd8fa;
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
</style>
