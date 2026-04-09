<template>
    <div class="card card -body">
        <div class="graph-page">
            <GraphHeader :total-expense="graphData.totalExpense" />
            <GraphChart
                :items="graphData.categorySummary"
                :level="graphData.characterLevel"
            />
            <GraphCategoryList :items="graphData.categorySummary" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import GraphHeader from '../components/graph/graphHeader.vue';
import GraphCategoryList from '../components/graph/graphCategoryList.vue';
import GraphChart from '../components/graph/graphChart.vue';
import { getGraphRawData } from '@/model/services/graphService';
import { adaptGraphData } from '@/utils/graphAdapter';
// import { graphMockData } from '@/model/mock/graphMockData';

// const graphData = graphMockData;

const graphData = ref({
    totalExpense: 0,
    monthlyGoal: 0,
    goalRate: 0,
    characterLevel: 1,
    categorySummary: [],
});

onMounted(async () => {
    try {
        const rawData = await getGraphRawData();
        graphData.value = adaptGraphData(rawData);
    } catch (error) {
        console.log(`그래프 데이터 불러오기 실패: `, error);
    }
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
