<template>
  <div class="layout">
    <main class="content">
      <RouterView />
    </main>

    <aside class="footer-area">
      <Footer />
    </aside>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import Footer from '@/view/components/Footer.vue';
</script>

<style scoped>
/* 전체 레이아웃 */
.layout {
  display: grid;
  grid-template-areas:
    'content'
    'footer';
  grid-template-rows: 1fr auto;
  min-height: 100vh;
}

/* 메인 콘텐츠 */
.content {
  grid-area: content;
  padding: 16px;
}

/* Footer 영역 */
.footer-area {
  grid-area: footer;
}

/* =========================
   💻 PC / 태블릿 이상
   ========================= */
@media (min-width: 768px) {
  .layout {
    grid-template-areas: 'footer content';
    grid-template-columns: 220px 1fr;
    /* grid-template-areas: 'content footer '; 오른쪽 */
    /* grid-template-columns: 1fr 220px; */
  }
}
</style>
