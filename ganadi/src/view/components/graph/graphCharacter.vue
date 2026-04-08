<template>
    <div class="character-center">
        <p class="level-text">LEVEL {{ level }}</p>
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

.level-text {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 8px;
}

.character-image {
    width: 92px;
    height: 92px;
    object-fit: contain;
}
</style>
