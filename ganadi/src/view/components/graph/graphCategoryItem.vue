<template>
    <div class="category-item">
        <div class="left-area">
            <div class="icon-box" :style="{ backgroundColor: item.color }">
                {{ item.icon }}
            </div>
            <span class="name">{{ item.name }}</span>
        </div>

        <div class="right-area">
            <span class="amount">{{ formattedAmount }}원</span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

const formattedAmount = computed(() => {
    return Number(props.item.amount).toLocaleString('kr-KO');
});
</script>

<style scoped>
.category-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    border-radius: 16px;
    padding: 12px 14px;
}

.left-area {
    display: flex;
    align-items: center;
    gap: 10px;
}

.icon-box {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 20px;
    font-weight: 700;
}

.name {
    font-size: 18px;
    font-weight: 500;
}

.amount {
    font-size: 18px;
    font-weight: 600;
}
</style>
