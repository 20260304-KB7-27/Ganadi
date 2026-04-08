<template>
    <div class="chart-wrapper">
        <div class="chart-box">
            <Doughnut :data="chartData" :options="chartOptions" />
            <GraphCharacter :level="level"></GraphCharacter>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import GraphCharacter from './graphCharacter.vue';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
    level: {
        type: Number,
        required: true,
    },
});

const chartData = computed(() => ({
    labels: props.items.map((item) => item.name),
    datasets: [
        {
            data: props.items.map((item) => item.amount),
            backgroundColor: props.items.map((item) => item.color),
            borderWidth: 0,
            hoverOffset: 0,
        },
    ],
}));

const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%', // 도넛 두께 조절
    plugins: {
        legend: {
            display: false,
        },
        // tooltip: {
        //     callbacks: {
        //         label: (context) => {
        //             const label = context.label || '';
        //             const value = Number(context.raw || 0).toLocaleString(
        //                 'ko-KR',
        //             );
        //             return `${label}: ${value}원`;
        //         },
        //     },
        // },
        tooltip: {
            enabled: false,
        },
    },
}));
</script>

<style scoped>
.chart-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 28px;
}

.chart-box {
    position: relative;
    width: 280px;
    height: 280px;
}
</style>
