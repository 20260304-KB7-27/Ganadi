<template>
    <div class="category-item">
        <div class="left-area">
            <div class="icon-box" :style="{ backgroundColor: item.color }">
                <i :class="`bi bi-${item.iconType}`"></i>
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
    border-radius: 18px;
    padding: 14px 16px;
    min-height: 72px;
    box-sizing: border-box;
    border: 1px solid #ddd;
}

.left-area {
    display: flex;
    align-items: center;
    gap: 10px;
}

.icon-box {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.icon-box i {
    font-size: 18px;
    color: #111;
}

.name {
    font-size: 18px;
    font-weight: 500;
}

.amount {
    font-size: 18px;
    font-weight: 600;
}

.right-area {
    display: flex;
    align-items: center;
}

@media (min-width: 1024px) {
    .category-item {
        min-height: 96px;
        border-radius: 24px;
        padding: 20px 24px;
    }

    .icon-box {
        width: 56px;
        height: 56px;
    }

    .icon-box i {
        font-size: 24px;
    }

    .name {
        font-size: 24px;
    }

    .amount {
        font-size: 22px;
    }
}
</style>
