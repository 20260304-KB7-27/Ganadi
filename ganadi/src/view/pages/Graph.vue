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
            <div class="graph-content">
                <section class="graph-left">
                    <GraphHeader :total-expense="graphData.totalExpense" />
                    <GraphChart
                        :items="graphData.categorySummary"
                        :level="characterStore.level"
                    />
                </section>
                <section class="graph-right">
                    <GraphCategoryList :items="graphData.categorySummary" />
                </section>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCharacterStore } from '@/stores/characterStore';

import GraphMonthSelector from '../components/graph/graphMonthSelector.vue';
import GraphHeader from '../components/graph/graphHeader.vue';
import GraphCategoryList from '../components/graph/graphCategoryList.vue';
import GraphChart from '../components/graph/graphChart.vue';

import { getGraphRawData } from '@/api/graphService';
import { evaluateCharacterLevelIfNeeded } from '@/api/characterService';
import { adaptGraphData } from '@/utils/graphAdapter';
import { useCalendarStore } from '@/stores/calendarStore';

const route = useRoute();
const characterStore = useCharacterStore();
const calendarStore = useCalendarStore();

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

const initialYear = route.query.year ? Number(route.query.year) : currentYear;
const initialMonth = route.query.month
    ? Number(route.query.month)
    : currentMonth;

const selectedYear = ref(initialYear);
const selectedMonth = ref(initialMonth);

calendarStore.setDate(new Date(initialYear, initialMonth - 1, 1));

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
        selectedYear.value === currentYear &&
        selectedMonth.value === currentMonth
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
    calendarStore.setDate(
        new Date(selectedYear.value, selectedMonth.value - 1, 1),
    );
    updateGraphData();
});
</script>

<style scoped>
.graph-page {
    /* min-height: 100vh; */
    padding: 16px 16px 90px;
    display: flex;
    flex-direction: column;
    width: 100%;
}

.graph-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.graph-left,
.graph-right {
    width: 100%;
}

@media (min-width: 1024px) {
    .graph-page {
        min-height: 78vh;
    }

    .graph-content {
        flex-direction: row;
        align-items: stretch;
        justify-content: space-between;
        gap: 40px;
        min-height: 78vh;
    }

    .graph-left {
        flex: 1 1 52%;
        max-width: 560px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .graph-right {
        flex: 1 1 48%;
        min-width: 360px;
        max-width: 520px;

        display: flex;
        flex-direction: column;
        justify-content: center;

        margin-right: 40px;
    }
}
</style>
