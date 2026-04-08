<template>
  <div class="container">
    <RouterView></RouterView>

    <Footer></Footer>
  </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router';

import Footer from '@/view/components/Footer.vue';
</script>

<style></style>

<!-- 
.container {
  text-align: center;
  margin-top: 10px;
} -->
