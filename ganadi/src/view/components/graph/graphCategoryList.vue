<template>
    <div class="category-list-wrapper">
        <div v-if="items.length === 0" class="empty-message">
            해당 월의 지출 내역이 없습니다.
        </div>

        <div v-else class="category-list">
            <GraphCategoryItem
                v-for="item in items"
                :key="item.categoryId"
                :item="item"
            />
        </div>
    </div>
</template>

<script setup>
import GraphCategoryItem from './graphCategoryItem.vue';

defineProps({
    items: {
        type: Array,
        required: true,
    },
});
</script>

<style scoped>
.category-list-wrapper {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 14px 12px;
    min-height: 180px;
}

.category-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.empty-message {
    text-align: center;
    color: #666;
    padding: 40px 0;
    font-size: 16px;
}

@media (min-width: 1024px) {
    .category-list-wrapper {
        min-height: 700px;
        padding: 18px 18px;
        border-radius: 18px;
    }

    .category-list {
        gap: 18px;
    }
}
</style>
