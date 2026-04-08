<template>
    <div class="category-list">
        <GraphCategoryItem
            v-for="item in items"
            :key="item.categoryId"
            :item="item"
        />
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
.category-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
</style>
