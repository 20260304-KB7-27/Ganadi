<template>
  <div class="daily-detail">
    <p>{{ selectedDate }} 상세내역</p>
    <div v-if="filteredTransactions.length === 0" class="no-data">
      해당 날짜에 거래 내역이 없습니다.
    </div>
    <div v-else class="transaction-list">
      <div
        v-for="transaction in filteredTransactions"
        :key="transaction.id"
        class="transaction-item"
        :class="{ 'income': transaction.type === 'income', 'expense': transaction.type === 'expense' }"
      >
        <div class="transaction-info">
          <div class="category-name">{{ getCategoryName(transaction.categoryId) }}</div>
          <div class="memo">{{ transaction.memo }}</div>
        </div>
        <div class="amount">
          {{ transaction.type === 'income' ? '+' : '-' }}{{ Number(transaction.amount).toLocaleString() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'DailyDetail',
  props: {
    selectedDate: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const transactions = ref([]);
    const categories = ref([]);

    onMounted(async () => {
      try {
        const [transRes, catRes] = await Promise.all([
          axios.get('/api/transactions'),
          axios.get('/api/category')
        ]);
        transactions.value = transRes.data;
        categories.value = catRes.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    });

    const filteredTransactions = computed(() => {
      return transactions.value.filter(t => t.date === props.selectedDate);
    });

    const getCategoryName = (categoryId) => {
      const category = categories.value.find(c => c.categoryId === categoryId);
      return category ? category.name : 'Unknown';
    };

    return {
      filteredTransactions,
      getCategoryName
    };
  }
};
</script>

<style scoped>
.daily-detail {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.transaction-list {
  margin-top: 10px;
}

.transaction-item {
  display: flex;
  width: 90%;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 4px;
  background-color: white;
}

.transaction-item.income {
  border-left: 4px solid green;
  color:green;
}

.transaction-item.expense {
  border-left: 4px solid red;
  color:red;
}

.transaction-info {
  flex: 1;
}

.category-name {
  font-size: 12px;
  font-weight: normal;
  color:#666;
}

.memo {
  font-weight: bold;
  font-size: 16px;
  color: #666;
}

.amount {
  font-weight: bold;
  font-size: 16px;
  padding-left: 20%;
  padding-right: 5%;
}

.no-data {
  text-align: center;
  color: #999;
  font-style: italic;
}
</style>