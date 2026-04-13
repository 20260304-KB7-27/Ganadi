<template>
    <img :src="LogoImg" alt="로고" class="logo" />
</template>

<script setup>
import Logo from '@/assets/images/ganandiLogo.png';

const LogoImg = Logo;
</script>

<style scoped>
.logo {
    height: 50px;
    width: auto;
    object-fit: contain;
    display: block; /* inline 기본 정렬 문제 제거 */
    flex-shrink: 0; /* flex 환경에서 찌그러짐 방지 */
    margin-bottom: 10px;
}
</style>
