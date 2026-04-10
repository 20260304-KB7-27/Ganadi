<template>
    <div class="graph-header">
        <p class="title">이번 달 총 지출액</p>
        <h3 class="amount">{{ formattedExpense }}</h3>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    totalExpense: {
        type: Number,
        required: true,
    },
});

const formattedExpense = computed(() => {
    return props.totalExpense.toLocaleString('ko-KR');
});
</script>

<style scoped>
.graph-header {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
}

.amount {
    font-size: 32px;
    font-weight: 700;
    color: red;
    margin: 0;
}

@media (min-width: 1024px) {
    .title {
        font-size: 20px;
    }

    .amount {
        font-size: 40px;
    }
}
</style>
