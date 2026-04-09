<template>
  <div class="set-group">
    <h2>{{ targetMonth }}월 목표지출 설정</h2>
  </div>

  <div class="budget-row">
    <input type="number" v-model="goalAmount" placeholder="금액을 입력하세요" />
    <button @click="updateBudget">수정</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const targetMonth = ref(new Date().getMonth() + 1);
const goalAmount = ref('');

const updateBudget = () => {
  alert(`목표 금액: ${goalAmount.value}원`);
};
</script>

<style scoped>
.set-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.budget-row {
  display: flex;
  align-items: center;
}

input {
  width: 400px;
  font-size: 18px;
  border: none;
  border-bottom: 1px solid #aaa;
  background: transparent;
}

button {
  margin-left: 8px;
  padding: 6px 10px;
  border-radius: 8px;
  background: #ddd;
}
</style>
