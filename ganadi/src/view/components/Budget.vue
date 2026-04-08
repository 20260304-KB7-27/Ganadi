<template>
    <div class="set-group">
        <h2>{{ targetMonth }}월 목표지출 설정</h2>
    </div>
    <div>
        <!-- 숫자에 , 찍기 위해 -->
        <input type="number" pattern="[0-9]*" min="0" id="target-amount" placeholder="금액을 입력하세요"> 
        <button type="button">수정</button>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    const targetMonth = ref(''); // 이번 달
    const goalAmount = ref('');
</script>

<style scoped>

</style>