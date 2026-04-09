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
import GraphHeader from '../components/graph/graphHeader.vue';
import GraphCategoryList from '../components/graph/graphCategoryList.vue';
import GraphChart from '../components/graph/graphChart.vue';
import { graphMockData } from '@/model/mock/graphMockData';

const graphData = graphMockData;
</script>

<style scoped>
.graph-page {
    /* min-height: 100vh; */
    padding: 16px 16px 90px;
    display: flex;
    flex-direction: column;
}
</style>
