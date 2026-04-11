<template>
  <div class="set-group header-box">
    <h5>카테고리 추가</h5>
  </div>
  <div class="category-container">
    <div
      v-for="item in categoryList"
      :key="item.categoryId"
      class="category-card"
      :style="{ borderColor: item.iconColor }"
    >
      <div class="icon-circle" :style="{ backgroundColor: item.iconColor }">
        <i :class="`bi bi-${item.iconType}`"></i>
      </div>
    </div>
    <div class="category-item add-btn" @click="isModalOpen = true">
      <div class="icon-circle plus-design">
        <span>+</span>
      </div>
    </div>
  </div>

  <div class="main-screen-overlay" v-if="isModalOpen">
    <div class="overlay-modal">
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
      </div>

      <div class="modal-footer">
        <button class="complete-btn" @click="addCategory">완료</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import db from "/db.json";
import axios from "axios";

const categoryList = ref([]);
const categoryName = ref("");
const iconList = ref([]);
const colorList = ref([]);
const activeTab = ref("color"); //color or icon
const BASE_URL = "http://localhost:3000";

const isModalOpen = ref(false);

const selectedColor = ref("");
const selectedIcon = ref("");

const loadCategory = async () => {
  try {
    const [resCats, resIcons, resColors] = await Promise.all([
      axios.get(`${BASE_URL}/category`),
      axios.get(`${BASE_URL}/icons`),
      axios.get(`${BASE_URL}/colors`),
    ]);

    const fetchedCategories = resCats.data;
    iconList.value = resIcons.data;
    colorList.value = resColors.data;

    categoryList.value = fetchedCategories.map((cat) => {
      const matchedIcon = iconList.value.find(
        (icon) => String(icon.iconId) === String(cat.iconId),
      );
      const matchedColor = colorList.value.find(
        (color) => String(color.colorId) === String(cat.colorId),
      );

      return {
        ...cat,
        iconType: matchedIcon ? matchedIcon.value : "circle", //해당되는 icon없을시 디폴트 아이콘으로
        iconColor: matchedColor ? matchedColor.value : "#000000",
      };
    });
  } catch (e) {
    console.error("카테고리 불러오기 실패 : ", e);
  }
};

const addCategory = async () => {
  try {
    isModalOpen.value = false;
    if (!categoryName.value || !selectedColor.value || !selectedIcon.value) {
      alert("이름, 색상, 아이콘을 모두 선택해주세요!");
      return;
    }

    const newCategory = {
      categoryId: categoryList.value.length + 1,
      name: categoryName.value,
      iconId: selectedIcon.value.iconId,
      colorId: selectedColor.value.colorId,
      type: "expense",
    };

    categoryList.value.push(newCategory);

    await axios.post(`${BASE_URL}/category`, newCategory);
    await loadCategory();
    //   저장은 아직 안되서 추후 보완해야함!!!!!!!!!!!!

    closeModal();
  } catch (e) {
    console.error('카테고리 추가 실패 : ', e);
  }
};

const closeModal = () => {
  isModalOpen.value = false;
  categoryName.value = "";
  selectedColor.value = "";
  selectedIcon.value = "";
  activeTab.value = "color";
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
.tag {
  background-color: #e0e0e0;
  border-radius: 15px;
  padding: 2px 10px;
}
.close-btn {
  background: none; /* 배경 제거 */
  border: none; /* 테두리 제거 */
  font-size: 28px; /* 크기 키우기 */
  font-family: "Arial", sans-serif; /* 폰트 설정 (X 모양을 위해) */
  font-weight: 300; /* 선 두께 조절 */
  cursor: pointer;
  line-height: 1; /* 높이 조절 */
  padding: 0;
}
.close-btn:hover {
  color: #888;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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

.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #e0e0e0; /* 목업의 연한 회색 */
  border: 1px solid #111;
  border-radius: 6px;
  padding: 10px 15px;
  margin-top: 20px;
  margin-bottom: 10px;
}
.main-screen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

/* 실제 모달 박스 */
.overlay-modal {
  background: white;
  width: 85%;
  max-width: 400px;
  padding: 20px;
  border-radius: 16px;
  border: 2px solid #000;
}

/* 이름 입력 섹션 */
.input-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
}
.input-section input {
  border: none;
  outline: none;
  flex: 1;
}

/* 탭 버튼 디자인 (목업 스타일) */
.tab-buttons {
  display: flex;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
}
.tab-buttons button {
  flex: 1;
  padding: 10px;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: bold;
}
.tab-buttons button.active {
  background: #d9d9d9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.v-divider {
  width: 1px;
  background: #ccc;
  margin: 8px 0;
}

/* 그리드 내용 영역 */
.grid-content-area {
  background-color: #d9d9d9; /* 조금 더 짙은 회색 */
  padding: 20px;
  border-radius: 12px;
  min-height: 180px;
  max-height: 250px;
  overflow-y: auto; /* 아이콘이 많아지면 스크롤 */
}

/* 카테고리 추가 목록 (메인 화면의 아이콘들) */
.category-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 10px;
}

.icon-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}

.plus-design {
  border: 2px dashed #999;
  background: none;
  color: #999;
  cursor: pointer;
}
</style>
