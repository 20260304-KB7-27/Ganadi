<template>
  <div class="card card-body">
    <Header 
    :month="currentMonth" 
    @prev-month="goPreMonth"
    @next-month="goNextMonth"
     :expense="expense" :income="income" :balance="balance" ></Header>

    <ProgressBar bgcolor="#C0FFBE" :completedRate="completed_rate" :goalMoney="goal_money" />
    <CalendarView :items="items" :show-date="showDate" />

    <RouterLink to="/input" class="add-button">
      <img src="@/assets/images/home_image/add.png" alt="plus" class="plus-image"/>  
    </RouterLink>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { CalendarView } from "vue-simple-calendar";
import "vue-simple-calendar/dist/vue-simple-calendar.css";
import ProgressBar from "../components/ProgressBar.vue";
import Header from "../components/Header.vue";

export default {
  name: "Home",
  components: {
    CalendarView,
    ProgressBar,
    Header,
  },

  setup() {
    //입금,소비,잔액,목표금액
    const expense = ref(2000000);
    const income = ref(500000);
    const balance = computed(() => {return income.value - expense.value;});
    const goal_money = ref(100000);
//달성률
  const completed_rate = computed(() => {
  return (expense.value / goal_money.value) * 100;
});

    const showDate = ref(new Date());
    
    const items = ref([]);
    
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
          id: date,
          startDate: date,
          endDate: date,
          title: "+" + dayData.income.toLocaleString(),
        });
      }

      if (dayData.expense > 0) {
        transactionItems.push({
          id: date,
          startDate: date,
          endDate: date,
          title: "-"+dayData.expense.toLocaleString(),
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
      showDate.value= new Date(d.getFullYear(), d.getMonth() - 1, 1);
    };

    //다음 달로 이동
    const goNextMonth = () => {
      const d = showDate.value;
      showDate.value = new Date(d.getFullYear(), d.getMonth() + 1, 1);
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
    };
  },
};
</script>

<style>
.add-button {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
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
  width: 50px;
  height: 50px;
}

.card-body {
  position: relative;
}
</style>