<template>
  <div class="container">
    <Header></Header>

    <RouterView></RouterView>
  </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router';

import Header from '@/view/components/Header.vue';
</script>

<style></style>

<!-- 
.container {
  text-align: center;
  margin-top: 10px;
} -->
