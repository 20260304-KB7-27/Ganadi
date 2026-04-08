<template>
    <div class="category-list-wrapper">
        <div class="category-list">
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
    background-color: #dcdcdc;
    border-radius: 18px;
    padding: 12px 10px;
    margin-top: 8px;
}

.category-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
</style>
