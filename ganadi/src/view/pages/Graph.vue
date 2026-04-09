<template>
  <div class="card card -body">
    <div class="graph-page">
      <GraphMonthSelector
        :selected-year="selectedYear"
        :selected-month="selectedMonth"
        :is-current-month="isCurrentMonth"
        @prev-month="goToPrevMonth"
        @next-month="goToNextMonth"
      />
      <GraphHeader :total-expense="graphData.totalExpense" />
      <GraphChart
        :items="graphData.categorySummary"
        :level="characterStore.level"
      />
      <GraphCategoryList :items="graphData.categorySummary" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useCharacterStore } from '@/stores/characterStore';

import GraphMonthSelector from '../components/graph/graphMonthSelector.vue';
import GraphHeader from '../components/graph/graphHeader.vue';
import GraphCategoryList from '../components/graph/graphCategoryList.vue';
import GraphChart from '../components/graph/graphChart.vue';

import { getGraphRawData } from '@/api/graphService';
import { evaluateCharacterLevelIfNeeded } from '@/api/characterService';
import { adaptGraphData } from '@/utils/graphAdapter';
// import { graphMockData } from '@/model/mock/graphMockData';

// const graphData = graphMockData;

const characterStore = useCharacterStore();
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

const selectedYear = ref(now.getFullYear());
const selectedMonth = ref(now.getMonth() + 1);

const rawData = ref(null);

const graphData = ref({
  totalExpense: 0,
  monthlyGoal: 0,
  goalRate: 0,
  characterLevel: 1,
  categorySummary: [],
});

const updateGraphData = () => {
  if (!rawData.value) return;

  graphData.value = adaptGraphData(rawData.value, {
    year: selectedYear.value,
    month: selectedMonth.value,
    characterLevel: characterStore.level,
  });
};

const goToPrevMonth = () => {
  if (selectedMonth.value === 1) {
    selectedYear.value -= 1;
    selectedMonth.value = 12;
  } else {
    selectedMonth.value -= 1;
  }
};

const goToNextMonth = () => {
  // 미래의 달로는 못 넘어가게
  if (
    selectedYear.value === currentYear &&
    selectedMonth.value === currentMonth
  ) {
    return;
  }

  if (selectedMonth.value === 12) {
    selectedYear.value += 1;
    selectedMonth.value = 1;
  } else {
    selectedMonth.value += 1;
  }
};

const isCurrentMonth = computed(() => {
  return (
    selectedYear.value === currentYear && selectedMonth.value === currentMonth
  );
});

onMounted(async () => {
  try {
    rawData.value = await getGraphRawData();

    const character = await evaluateCharacterLevelIfNeeded({
      transactions: rawData.value.transactions,
      budgets: rawData.value.budget,
    });

    characterStore.setCharacter(character);
    updateGraphData();
  } catch (error) {
    console.log(`그래프 데이터 불러오기 실패: `, error);
  }
});

watch([selectedYear, selectedMonth], () => {
  updateGraphData();
});
</script>

<style scoped>
.graph-page {
  /* min-height: 100vh; */
  padding: 16px 16px 90px;
  display: flex;
  flex-direction: column;
}
</style>
