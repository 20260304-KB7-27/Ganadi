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
.footer {
  background: #dcdcdc;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
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
  color: #555;
  font-size: 12px;
}

.icon {
  font-size: 26px;
  color: #333;
}

.menu-item.active {
  color: #000;
  font-weight: 600;
}

.menu-item.active .icon {
  color: #000;
  transform: scale(1.15);
}

.label {
  display: none;
}

@media (min-width: 768px) {
  .footer {
    height: 100%;
    border-top: none;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    padding: 20px 12px;
  }

  .menu {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .menu-item {
    flex-direction: row;
    gap: 16px;
    font-size: 16px;
    color: #555;
  }

  .icon {
    font-size: 22px;
  }

  .label {
    display: inline;
    font-size: 16px;
    margin: 0;
  }
}
</style>
