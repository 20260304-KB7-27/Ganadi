<template>
  <nav class="footer">
    <ul class="menu">
      <li v-for="menu in menus" :key="menu.path">
        <router-link :to="menu.path" class="menu-item" active-class="active">
          <i :class="['bi', menu.icon, 'icon']"></i>
          <span class="label">{{ menu.name }}</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
const menus = [
  { name: '홈', path: '/', icon: 'bi-house' },
  { name: '통계', path: '/graph', icon: 'bi-bar-chart' },
  { name: '설정', path: '/setting', icon: 'bi-gear' },
];
</script>

<style scoped>
/* =========================
   📱 모바일 (기본: 하단 탭바)
   ========================= */
.footer {
  background: #222;
  color: white;
  border-top: 1px solid #333;
}

.menu {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 14px 0;
  margin: 0;
  list-style: none;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  color: #bbb;
  font-size: 12px;
}

/* 아이콘 */
.icon {
  font-size: 26px;
}

/* 활성 상태 */
.menu-item.active {
  color: #fff;
  font-weight: bold;
}

.menu-item.active .icon {
  transform: scale(1.15);
}

/* 텍스트 */
.label {
  display: none;
}

/* =========================
   💻 PC (사이드바)
   ========================= */
@media (min-width: 768px) {
  .footer {
    height: 100%;
    border-top: none;
    border-left: none;
    border-right: 1px solid #333;
    padding: 20px 12px;
  }

  .menu {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .menu-item {
    flex-direction: row;
    gap: 30px;
    font-size: 14px;
  }

  .icon {
    font-size: 35px;
  }

  .label {
    display: inline;
    font-size: 35px;
    margin: 0;
  }
}
</style>
