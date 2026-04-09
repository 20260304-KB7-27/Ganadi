<template>
    <div class="character-center">
        <div class="text-box">
            <p class="level-text">Lv{{ level }}</p>
            <p class="level-desc">{{ levelText }}</p>
        </div>
        <img
            :src="characterImage"
            :alt="`level-${level}`"
            class="character-image"
        />
    </div>
</template>

<script setup>
import { computed } from 'vue';

import level1Image from '@/assets/images/characters/level1.png';
import level2Image from '@/assets/images/characters/level2.png';
import level3Image from '@/assets/images/characters/level3.png';
import level4Image from '@/assets/images/characters/level4.png';

const props = defineProps({
    level: {
        type: Number,
        required: true,
    },
});

const characterImage = computed(() => {
    const imageMap = {
        1: level1Image,
        2: level2Image,
        3: level3Image,
        4: level4Image,
    };

    return imageMap[props.level] || level1Image;
});

const levelText = computed(() => {
    const map = {
        1: '거지 가나디',
        2: '서민 가나디',
        3: '해삐 가나디',
        4: '부자 가나디',
    };

    return map[props.level] || '가나디';
});
</script>

<style scoped>
.character-center {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
}

.text-box {
    transform: translateY(12px);
    display: flex;
    flex-direction: column;
    align-items: center; /* 🔥 가로 가운데 정렬 핵심 */
    text-align: center;
}

.level-text {
    font-size: 14px;
    color: #666;
    margin-bottom: 6px;
}

.level-desc {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #666;
}

.character-image {
    width: 92px;
    height: 92px;
    object-fit: contain;
}
</style>
