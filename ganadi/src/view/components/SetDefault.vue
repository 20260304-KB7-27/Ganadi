<template>
    <div class="set-group">
        <h2>default값 설정</h2>
        <button>+</button>
    </div>
    <div>
        <ul>
            <li v-for="item in fixedCosts" :key="item.fixedCostId" class="fixed-items">
                <span>아이콘</span>
                <div>
                    <span v-if="item.type==='payment'">-{{ item.amount }}원</span>
                    <span v-else-if="item.type===`income`">{{ item.amount }}원</span>
                </div>
                <span>매월 {{ item.day }}일</span>
                <button>-</button>

            </li>
        </ul>
    </div>
</template>

<script setup>
    import {ref, onMounted} from 'vue';
    import axios from 'axios';
    import db from '/db.json';


    const fixedCosts = ref([]);
    
    const response = db[`fixed-cost`];
    
    const fetchFixedCosts = () => {
        try {
            fixedCosts.value = response;
        } catch (e) {
            console.error('데이터를 받아오는데 실패했습니다. => ', e);
        }
    }

    onMounted(() => {
        fetchFixedCosts();
    })
</script>

<style scoped>

</style>