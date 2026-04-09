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
<style>
/* =========================
   📱 스크롤바 숨기기 (전역)
   ========================= */

/* 크롬, 사파리 */
::-webkit-scrollbar {
  display: none;
}

/* 파이어폭스 */
* {
  scrollbar-width: none;
}

/* IE, Edge */
body {
  -ms-overflow-style: none;
}

/* =========================
   📱 전체 레이아웃
   ========================= */
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

  /* 👇 footer 고정 대비 (가려짐 방지) */
  padding-bottom: 80px;
}

/* =========================
   📱 모바일: 하단 고정 footer
   ========================= */
.footer-area {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;

  z-index: 1000;
}

/* =========================
   💻 PC / 태블릿 이상
   ========================= */
@media (min-width: 768px) {
  .layout {
    grid-template-areas: 'footer content';
    grid-template-columns: 220px 1fr;
  }

  /* 사이드바 고정 */
  .footer-area {
    position: fixed;
    top: 0;
    bottom: auto;
    left: 0;

    width: 220px;
    height: 100vh;
  }

  /* 콘텐츠 밀어주기 */
  /* .content {
    margin-left: 220px;
    padding-bottom: 16px;
  } */
}
</style>
