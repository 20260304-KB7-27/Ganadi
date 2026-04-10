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
        :class="{
          income: transaction.type === 'income',
          expense: transaction.type === 'expense',
        }"
        @click="goEdit(transaction.id)"
      >
        <div class="transaction-info">
          <div class="left-area">
            <div
              class="category-icon"
              :style="{ backgroundColor: transaction.color }"
            >
              <i :class="`bi bi-${transaction.iconType}`"></i>
            </div>
          </div>
          <div class="memo">
            {{ transaction.memo }}
          </div>
        </div>
        <div class="amount">
          {{ transaction.type === "income" ? "+" : "-"
          }}{{ Number(transaction.amount).toLocaleString() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  selectedDate: {
    type: String,
    required: true,
  },
  transactions: {
    type: Array,
    required: true,
  },
  categoryData: {
    type: Array,
    required: true,
  },
});

const filteredTransactions = computed(() => {
  return props.transactions
    .filter((t) => t.date === props.selectedDate)
    .map((t) => {
      const category = props.categoryData.find(
        (c) => String(c.categoryId) === String(t.categoryId),
      );

      return {
        ...t,
        categoryName: category ? category.name : "기타",
        iconType: category ? category.iconType : "coin",
        color: category ? category.color : "#d9d9d9",
      };
    });
});

const goEdit = (id) => {
  router.push({
    path: "/input",
    query: {
      id,
      mode: "edit",
    },
  });
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
  cursor: pointer;
}

.transaction-item.income {
  border-left: 4px solid green;
  color: green;
}

.transaction-item.expense {
  border-left: 4px solid red;
  color: red;
}

.transaction-info {
  display: flex;
  align-items: center;
  gap: 12px;
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

.category-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #222;
  font-size: 16px;
  flex-shrink: 0;
}

/* 왼쪽 (아이콘 + 카테고리 세로) */
.left-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50px;
}
</style>
