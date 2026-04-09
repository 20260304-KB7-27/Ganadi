<template>
    <div class="chart-wrapper">
        <div class="chart-box">
            <div class="chart-layer">
                <Doughnut :data="chartData" :options="chartOptions" />
            </div>
            <div class="character-layer">
                <GraphCharacter :level="level" />
            </div>
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

const safeItems = computed(() => props.items || []);

const isEmptyData = computed(() => safeItems.value.length === 0);

const chartData = computed(() => {
    if (isEmptyData.value) {
        return {
            labels: ['empty'],
            datasets: [
                {
                    data: [1],
                    backgroundColor: ['#d9d9d9'],
                    borderWidth: 0,
                    hoverOffset: 0,
                },
            ],
        };
    }
    return {
        labels: safeItems.value.map((item) => item.name),
        datasets: [
            {
                data: safeItems.value.map((item) => item.amount),
                backgroundColor: safeItems.value.map((item) => item.color),
                borderWidth: 0,
                hoverOffset: 0,
            },
        ],
    };
});

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

.character-layer {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
}

.chart-layer {
    position: relative;
    z-index: 1;
}
</style>
