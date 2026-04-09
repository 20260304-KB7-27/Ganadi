<template>
    <div class="month-selector">
        <button class="nav-btn" @click="$emit('prev-month')">
            <i class="bi bi-chevron-left"></i>
        </button>

        <div class="month-text">{{ selectedYear }}년 {{ selectedMonth }}월</div>

        <button
            class="nav-btn"
            @click="$emit('next-month')"
            :disabled="isCurrentMonth"
        >
            <i class="bi bi-chevron-right"></i>
        </button>
    </div>
</template>

<script setup>
defineProps({
    selectedYear: {
        type: Number,
        required: true,
    },
    selectedMonth: {
        type: Number,
        required: true,
    },
    isCurrentMonth: {
        type: Boolean,
        required: true,
    },
});

defineEmits(['prev-month', 'next-month']);
</script>

<style scoped>
.month-selector {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 20px;
}

.nav-btn {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 50%;
    background-color: white;
    cursor: pointer;
}

.nav-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.month-text {
    font-size: 20px;
    font-weight: 700;
}
</style>
