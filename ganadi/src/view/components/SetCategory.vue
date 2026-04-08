<template>
  <div class="set-group">
    <h2>카테고리 추가</h2>
  </div>
  <div class="category-container">
    <div
      v-for="item in categoryList"
      :key="item.categoryId"
      class="category-card"
      :style="{ borderColor: item.iconColor }"
    >
      <div class="icon-circcle" :style="{ backgroundColor: item.iconColor }">
        <i :class="`bi bi-${item.iconType}`"></i>
      </div>
    </div>
    <div class="category-item add-btn" @click="isModalOpen = true">
      <div class="icon-circle plus-design">
        <span>+</span>
      </div>
    </div>
  </div>

  <div class="main-screen-overlay">
    <div class="overlay-modal" v-if="isModalOpen">
      <div class="modal-header">
        <span class="tag">카테고리 추가</span>
        <button class="close-btn" @click="closeModal">X</button>
      </div>

      <div class="input-section">
        <label>이름 :</label>
        <input type="text" v-model="categoryName" />
      </div>

      <div class="tab-buttons">
        <button
          :class="{ active: activeTab === 'color' }"
          @click="activeTab = 'color'"
        >
          색상
        </button>
        <div class="v-divider"></div>
        <button
          :class="{ active: activeTab === 'icon' }"
          @click="activeTab = 'icon'"
        >
          아이콘
        </button>
      </div>

      <div class="grid-content-area">
        <div v-if="activeTab === 'color'" class="selection-grid">
          <div
            v-for="color in colorList"
            :key="color.colorId"
            class="color-circle"
            :style="{ backgroundColor: color.value }"
            :class="{ selected: selectedColor === color }"
            @click="selectedColor = color"
          ></div>
        </div>
      </div>

      <div v-if="activeTab === 'icon'" class="selection-grid">
        <div
          v-for="icon in iconList"
          :key="icon.iconId"
          class="icon-item"
          :class="{ selected: selectedIcon === icon }"
          @click="selectedIcon = icon"
        >
          <i :class="`bi bi-${icon.value}`"></i>
        </div>
      </div>
      <div class="modal-footer">
            <button class="complete-btn" @click="addCategory">완료</button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import categories from '@/model/data/category.json';
import presets from '@/model/data/preset_options.json';

const categoryList = ref([]);
const categoryName = ref('');
const iconList = ref([]);
const colorList = ref([]);
const activeTab = ref('color'); //color or icon

const isModalOpen = ref(false);

const selectedColor = ref('');
const selectedIcon = ref('');

const loadCategory = async () => {
  try {
    // const [resCategory, resPreset] = await Promise.all([
    //   axios.get('@/src/model/data/category.json'),
    //   axios.get('@/src/model/data/preset_options.json'),
    // ]);

    // const categories = resCategory.data;
    // console.log(categories);
    // const icons = resPreset.data.icons;  // 이렇게 하는거 맞나?
    // const colors = resPreset.data.colors;
    iconList.value = presets.icons;
    colorList.value = presets.colors;

    categoryList.value = categories.category.map((cat) => {
      const matchedIcon = iconList.value.find(
        (icon) => icon.iconId === cat.iconId,
      );
      const matchedColor = colorList.value.find(
        (color) => color.colorId === cat.colorId,
      );

      return {
        ...cat,
        iconType: matchedIcon ? matchedIcon.value : 'circle', //해당되는 icon없을시 디폴트 아이콘으로
        iconColor: matchedColor ? matchedColor.value : '#000000',
      };
    });
  } catch (e) {
    console.error('카테고리 불러오기 실패 : ', e);
  }
};

const addCategory = () => {
  isModalOpen.value = false;
  if (!categoryName.value || !selectedColor.value || !selectedIcon.value) {
    alert('이름, 색상, 아이콘을 모두 선택해주세요!');
    return;
  }

  const newCategory = {
    categoryId: categoryList.value.length + 1,
    name: categoryName.value,
    iconId: selectedIcon.value.iconId,
    colorId: selectedColor.value.colorId,
    type: 'payment',
  };

  categoryList.value.push(newCategory);

  
//   저장은 아직 안되서 추후 보완해야함!!!!!!!!!!!!


  closeModal();
};

const closeModal = () => {
  isModalOpen.value = false;
  categoryName.value = '';
  selectedColor.value = '';
  selectedIcon.value = '';
  activeTab.value = 'color';
};

onMounted(() => {
  loadCategory();
});
</script>

<style scoped>
/* 그리드 배경 레이아웃 */
.grid-content-area {
  background-color: #f0f0f0; /* 목업의 회색 배경 */
  padding: 15px;
  border-radius: 12px;
  margin-top: 10px;
  min-height: 200px; /* 최소 높이 설정 */
}

/* 아이템들을 가로로 나열 */
.selection-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5열로 나열 */
  gap: 15px;
}

/* 색상 원 디자인 (중요: 크기 미지정 시 안 보임) */
.color-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: transform 0.2s;
}

/* 아이콘 디자인 */
.icon-item {
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

/* 선택되었을 때의 표시 */
.selected {
  outline: 3px solid #6c5ce7; /* 선택 시 강조 테두리 */
  transform: scale(1.1);
}
</style>
