<template>
  <div class="set-group">
    <h2>default값 설정</h2>
    <button>+</button>
  </div>

  <ul>
    <li v-for="item in fixedCosts" :key="item.fixedCostId" class="fixed-items">
      <span>💳</span>

      <span v-if="item.type === 'payment'"> -{{ format(item.amount) }}원 </span>
      <span v-else> {{ format(item.amount) }}원 </span>

      <span>매월 {{ item.day }}일</span>

      <button @click="removeItem(item.fixedCostId)">-</button>
    </li>
  </ul>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import db from '/db.json';

const fixedCosts = ref([]);

const fetchFixedCosts = () => {
  fixedCosts.value = db['fixed-cost'];
};

const removeItem = (id) => {
  fixedCosts.value = fixedCosts.value.filter((item) => item.fixedCostId !== id);
};

const format = (num) => {
  return new Intl.NumberFormat().format(num);
};

onMounted(fetchFixedCosts);
</script>

<style scoped>
.set-group {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.fixed-items {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

button {
  border-radius: 50%;
  width: 24px;
  height: 24px;
}
</style>
