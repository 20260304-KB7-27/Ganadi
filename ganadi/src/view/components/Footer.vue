<template>
  <nav class="footer">
    <ul class="menu">
      <li v-for="menu in menus" :key="menu.path">
        <router-link :to="menu.path" class="menu-item" active-class="active">
          <span class="label">{{ menu.name }}</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
const menus = [
  { name: '홈', path: '/' },
  { name: '통계', path: '/graph' },
  { name: '설정', path: '/setting' },
];
</script>

<style scoped>
/* ===== 기본 (모바일: 하단 탭바) ===== */
.footer {
  background: #222;
  color: white;
  border-top: 1px solid #333;
}

.menu {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20px 0;
  margin: 0;
  list-style: none;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #bbb;
  font-size: 12px;
}

.menu-item.active {
  color: #fff;
  font-weight: bold;
}

.label {
  margin-top: 4px;
}

/* ===== PC: 사이드바 형태 ===== */
@media (min-width: 768px) {
  .footer {
    height: 100%;
    border-top: none;
    border-left: 1px solid #333;
    padding: 20px 10px;
  }

  .menu {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .menu-item {
    flex-direction: row;
    font-size: 14px;
  }

  .label {
    margin: 0;
  }
}
</style>
