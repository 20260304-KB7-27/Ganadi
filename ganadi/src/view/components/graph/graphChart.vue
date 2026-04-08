<template>
    <div class="chart-wrapper">
        <div class="donut-chart">
            <div
                class="donut-fill"
                :style="{ background: conicGradientStyle }"
            ></div>
            <GraphCharacter :level="level"></GraphCharacter>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import GraphCharacter from './graphCharacter.vue';

const props = defineProps({
    chartData: {
        type: Array,
        required: true,
    },
    goalRate: {
        type: Number,
        required: true,
    },
    level: {
        type: Number,
        required: true,
    },
});

const conicGradientStyle = computed(() => {
    if (!props.chartData.length) {
        return '#ddd 0deg 360deg';
    }

    let currentDeg = 0;
    const segments = props.chartData.map((item) => {
        const start = currentDeg;
        const deg = (item.percent / 100) * 360;
        currentDeg += deg;
        return `${item.color} ${start}deg ${currentDeg}deg`;
    });

    return `conic-gradient(${segments.join(', ')})`;
});
</script>

<style scoped>
.chart-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 28px;
}

.donut-char {
    position: relative;
    width: 280px;
    height: 280px;
}

.donut-fill {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: relative;
}

.donut-fill::after {
    content: '';
    position: absolute;
    inset: 40px;
    background: #efefef;
    border-radius: 50%;
}
</style>
