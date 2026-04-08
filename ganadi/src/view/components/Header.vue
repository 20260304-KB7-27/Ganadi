<template>
  <header class="header-row">
    <button @click="emit('prev-month')">◀</button>

    <span class="navbar-brand">{{ month }}월</span>
    <div class="header-money">
      <div class="money-item">
        <span>수입</span>
        <span :style="{ color: '#25FF5F' }">{{ income }}원</span>
      </div>
      <div class="money-item money-item--underline">
        <span>지출</span>
        <span :style="{ color: 'red' }">{{ expense }}원</span>
      </div>
      <div class="money-item">
        <span>잔액</span>
        <span>{{ balance }}원</span>
      </div>
    </div>

    <button @click="emit('next-month')">▶</button>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';

defineProps({
  month: Number,
  expense: Number,
  income: Number,
  balance: Number,
});

const emit = defineEmits(['prev-month', 'next-month']);


</script>

<style>
.header-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar-brand {
  font-weight: bold;
  font-size: large
}

.header-money {
  margin-left: auto;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: right;
}

.money-item {
  display: flex;
  justify-content: space-between;
  gap: 3rem;
}

.money-item--underline {
  border-bottom: 1px solid #ccc;
  padding-bottom: 4px;
}

button {
  display: inline;
  border: none;
  background: none;
  color: rgb(177, 177, 177);
  cursor: pointer;
}

button:first-child {
  margin-right: 3%;
}

button:last-child {
  margin-left: 3%;
}

button:hover {
  color: #000;
}
</style>
