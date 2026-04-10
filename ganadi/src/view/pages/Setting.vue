<template>
    <div class="card">
        <Budget />
        <SetDefault />
        <SetCategory />
    </div>
</template>
<script setup>
import Budget from '../components/Budget.vue';
import SetCategory from '../components/SetCategory.vue';
import SetDefault from '../components/SetDefault.vue';
</script>

<style scoped>
.card {
    background: #f5f5f5;
    padding: 20px;
    border-radius: 16px;
    /* width: 320px; */
}
</style>
