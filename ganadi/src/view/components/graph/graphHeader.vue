<template>
    <div class="graph-header">
        <p class="title">이번 달 총 지출액</p>
        <h3 class="amount">
            {{ formattedExpense }}
            <label class="won">원</label>
        </h3>
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
    margin-top: 20px;
    margin-left: 10px;
}

.title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
}

.amount {
    font-size: 32px;
    font-weight: 700;
    color: rgb(255, 114, 114);
    margin: 0;
}

.won {
    color: black;
    font-size: 28px;
}

@media (min-width: 1024px) {
    .graph-header {
        margin-top: 30px;
        align-items: center;
    }

    .title {
        font-size: 20px;
    }

    .amount {
        font-size: 40px;
    }

    .won {
        font-size: 32px;
    }
}
</style>
