<template>
    <nav class="footer">
        <ul class="menu">
            <li v-for="menu in menus" :key="menu.path">
                <router-link
                    :to="getMenuTarget(menu)"
                    class="menu-item"
                    active-class="active"
                >
                    <i
                        :class="[
                            'bi',
                            isActive(menu.path) ? menu.activeIcon : menu.icon,
                            'icon',
                        ]"
                    ></i>
                    <span class="label">{{ menu.name }}</span>
                </router-link>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useCalendarStore } from '@/stores/calendarStore';

const route = useRoute();
const calendarStore = useCalendarStore();

const menus = [
    { name: '홈', path: '/', icon: 'bi-house', activeIcon: 'bi-house-fill' },
    {
        name: '통계',
        path: '/graph',
        icon: 'bi-bar-chart',
        activeIcon: 'bi-bar-chart-fill',
    },
    {
        name: '설정',
        path: '/setting',
        icon: 'bi-gear',
        activeIcon: 'bi-gear-fill',
    },
    // {
    //   name: '추가',
    //   path: '/input',
    //   icon: 'bi-plus',
    //   activeIcon: 'bi-plus-circle-fill',
    // },
];

const getSafeDate = (date) => {
    const now = new Date();

    const selectedYear = date.getFullYear();
    const selectedMonth = date.getMonth() + 1;

    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (
        selectedYear > currentYear ||
        (selectedYear === currentYear && selectedMonth >= currentMonth)
    ) {
        return new Date(currentYear, currentMonth - 1, 1);
    }

    return date;
};

const getMenuTarget = (menu) => {
    const safeDate = getSafeDate(calendarStore.currentDate);

    if (menu.path === '/graph' || menu.path === '/') {
        return {
            path: menu.path,
            query: {
                year: safeDate.getFullYear(),
                month: safeDate.getMonth() + 1,
            },
        };
    }

    return { path: menu.path };
};

// 활성 메뉴 체크 (하위 경로 대응)
const isActive = (path) => {
    return route.path === path || route.path.startsWith(path + '/');
};
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
    transition: all 0.2s ease;
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

/* =========================
   💻 PC 버전
   ========================= */
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
