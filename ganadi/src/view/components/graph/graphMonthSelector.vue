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
    gap: 18px;
    margin-bottom: 4px;
}

.nav-btn {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 50%;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #111;
}

.nav-btn i {
    font-size: 24px;
}

.nav-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.month-text {
    font-size: 20px;
    font-weight: 700;
    min-width: 150px;
    text-align: center;
}

@media (min-width: 1024px) {
    .month-selector {
        justify-content: center;
        gap: 24px;
        margin-bottom: 12px;
    }

    .month-text {
        min-width: auto;
        text-align: left;
        font-size: 24px;
    }
}
</style>
