<template>
  <div class="set-group header-box">
    <h5>{{ targetMonth }}월 목표지출 설정</h5>
  </div>

  <div class="budget-row">
    <input type="number" v-model="goalAmount" placeholder="금액을 입력하세요" />
    <button @click="updateBudget">수정</button>
  </div>
</template>

<script setup>
import { ref, reactive, provide, computed, onMounted } from 'vue';
import axios from 'axios';

const targetMonth = ref(new Date().getMonth() + 1);
const goalAmount = ref('');
const BASEURI = '/api/budget';

const state = reactive({
  budgetlist: [],
});

const formattedMonth = computed(() => {
  return `2026-${String(targetMonth.value).padStart(2, '0')}`;
}); //json에서 날짜 맞춰주는 코드

const fetchBudgets = async () => {
  try {
    const response = await axios.get(BASEURI);
    if (response.status === 200) {
      state.budgetlist = response.data;
      goalAmount.value = '';
    }
  } catch (err) {
    console.error('데이터 로드 실패:', err);
  }
};

const updateBudget = async () => {
  if (!goalAmount.value) {
    alert('금액을 입력해주세요.');
    return;
  }

  const existingItem = state.budgetlist.find(
    (item) => item.targetMonth === formattedMonth.value,
  );

  try {
    if (existingItem) {
      // 수정 (PATCH)
      const res = await axios.patch(`${BASEURI}/${existingItem.id}`, {
        amount: String(goalAmount.value),
      });
      if (res.status === 200) {
        existingItem.amount = String(goalAmount.value);
        alert(`${formattedMonth.value} 수정 완료!`);
      }
    } else {
      // 신규 저장 (POST)
      const payload = {
        budgetId: String(Date.now()),
        amount: String(goalAmount.value),
        targetMonth: formattedMonth.value,
      };
      const res = await axios.post(BASEURI, payload);
      if (res.status === 201) {
        state.budgetlist.push(res.data);
        alert(`${formattedMonth.value} 저장 완료!`);
      }
    }
  } catch (err) {
    alert('반영 실패: ' + err);
  }
};

provide(
  'budgetList',
  computed(() => state.budgetlist),
);
provide('budgetActions', { updateBudget, fetchBudgets });

onMounted(() => {
  fetchBudgets();
});
</script>

<style scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #e0e0e0; /* 목업의 연한 회색 */
  border: 1px solid #111;
  border-radius: 6px;
  padding: 10px 15px;
  margin-top: 20px;
  margin-bottom: 10px;
}

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
