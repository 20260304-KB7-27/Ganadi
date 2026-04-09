<template>
  <div class="set-group header-box">
    <h5>default값 설정</h5>
    <button class="add-btn" @click="openModal">+</button>
  </div>

  <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <span class="tag">고정 지출 추가</span>
        <button class="close-x" @click="closeModal">X</button>
      </div>

      <div class="selection-section">
        <label class="section-label">카테고리 선택</label>
        <div class="category-grid">
          <div
            v-for="cat in categories"
            :key="cat.categoryId"
            class="cat-item"
            :class="{
              selected: selectedCategory?.categoryId === cat.categoryId,
            }"
            @click="selectedCategory = cat"
          >
            <div
              class="icon-circle"
              :style="{ backgroundColor: cat.iconColor }"
            >
              <i :class="`bi bi-${cat.iconType}`"></i>
            </div>
            <span class="cat-name">{{ cat.name }}</span>
          </div>
        </div>
      </div>

      <div class="selection-section">
        <label class="section-label">가격</label>
        <div class="input-box">
          <input type="number" v-model="amount" placeholder="0" />
          <span class="unit">원</span>
          <i class="bi bi-pencil"></i>
        </div>
      </div>

      <div class="selection-section">
        <label class="section-label">지정 날짜</label>
        <div class="date-selector-wrapper">
          <div class="date-display" @click="isDateListOpen = !isDateListOpen">
            매월 <span>{{ selectedDay ? selectedDay : '___' }}</span> 일
          </div>

          <div v-if="isDateListOpen" class="date-list-popup">
            <div
              v-for="day in 31"
              :key="day"
              class="date-option"
              @click="selectDay(day)"
            >
              {{ day }}일
            </div>
          </div>
        </div>
      </div>

      <button class="complete-btn" @click="saveDefault">완료</button>
    </div>
  </div>

  <ul class="fixed-list">
    <li
      v-for="item in displayList"
      :key="item.fixedCostId"
      class="fixed-item-card"
    >
      <div class="icon-circle" :style="{ backgroundColor: item.iconColor }">
        <i :class="`bi bi-${item.iconType}`"></i>
      </div>

      <div class="amount-text">
        <span v-if="item.type === 'payment'">-{{ format(item.amount) }}원</span>
        <span v-else>{{ format(item.amount) }}원</span>
      </div>

      <div class="date-text">매월 {{ item.day }}일</div>

      <button class="remove-btn" @click="removeItem(item.fixedCostId)">
        -
      </button>
    </li>
  </ul>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import db from '/db.json';

const fixedCosts = ref([]);
const categories = ref([]);
const icons = ref([]);
const colors = ref([]);

const isModalOpen = ref(false);
const isDateListOpen = ref(false); // 날짜 리스트 열림 여부

const amount = ref('');
const selectedCategory = ref(null);
const selectedDay = ref(null);

const openModal = () => {
  isModalOpen.value = true;
};

const fetchFixedCosts = () => {
  fixedCosts.value = db['fixed-cost'];
  categories.value = db['category'];
  icons.value = db['icons'];
  colors.value = db['colors'];
};

const selectDay = (day) => {
  selectedDay.value = day;
  isDateListOpen.value = false; // 선택 후 닫기
};

// 모달 닫기 및 초기화
const closeModal = () => {
  isModalOpen.value = false;
  amount.value = '';
  selectedCategory.value = null;
  selectedDay.value = null;
  isDateListOpen.value = false;
};

const displayList = computed(() => {
  return fixedCosts.value.map((item) => {
    const matchedCategory = categories.value.find(
      (c) => c.categoryId === item.categoryId,
    );
    console.log(matchedCategory);
    console.log(categories.value);

    let matchedIcon = null;
    let matchedColor = null;

    if (matchedCategory) {
      matchedIcon = icons.value?.find(
        (i) => i.iconId === matchedCategory.iconId,
      );
      matchedColor = colors.value?.find(
        (c) => c.colorId === matchedCategory.colorId,
      );
    }

    return {
      ...item,
      iconType: matchedIcon ? matchedIcon.value : 'bag',
      iconColor: matchedColor ? matchedColor.value : '#e0e0e0',
    };
  });
});

const removeItem = (id) => {
  fixedCosts.value = fixedCosts.value.filter((item) => item.fixedCostId !== id);
};

const format = (num) => {
  return new Intl.NumberFormat().format(num);
};

onMounted(fetchFixedCosts);
</script>

<style scoped>
/* ul 기본 스타일 제거 */
.fixed-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

/* --- 헤더 박스 디자인 --- */
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

.header-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

.add-btn {
  background: none;
  border: none;
  font-size: 26px;
  font-weight: bold;
  cursor: pointer;
  line-height: 1;
  padding: 0 5px;
}

/* --- 리스트 아이템 카드 디자인 --- */
.fixed-item-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border: 1px solid #ccc; /* 얇은 테두리 */
  border-radius: 8px;
  padding: 12px 15px;
  margin-bottom: 10px;
}

/* 왼쪽 아이콘 원형 배경 */
.icon-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: #ffcce0; /* 목업과 비슷한 핑크색 (필요시 변경) */
  border-radius: 50%;
  border: 1px solid #111; /* 원형 테두리 */
  font-size: 20px;
  margin-right: 15px;
}

/* 금액 텍스트 (flex-grow: 1을 줘서 우측 요소들을 밀어냅니다) */
.amount-text {
  flex-grow: 1;
  font-size: 20px;
  font-weight: 500;
}

/* 날짜 텍스트 */
.date-text {
  font-size: 14px;
  color: #333;
  margin-right: 20px; /* 삭제 버튼과의 간격 */
}

/* 삭제(마이너스) 버튼 */
.remove-btn {
  background: none;
  border: none;
  font-size: 32px;
  font-weight: 500;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  color: #111;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* 다른 요소보다 위에 */
}

/* 실제 팝업 박스 */
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 15px;
  width: 85%;
  max-width: 400px;
  border: 1px solid #000;
}

.date-display {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  font-size: 18px;
  cursor: pointer;
}
.date-display span {
  border-bottom: 2px solid #000;
  padding: 0 10px;
  margin: 0 5px;
}

/* 날짜 팝업 리스트 (스크롤 가능하게) */
.date-list-popup {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px; /* 목업처럼 높이 제한 */
  overflow-y: auto; /* 스크롤 생기게 */
  background: white;
  border: 1px solid #ccc;
  border-radius: 0 0 8px 8px;
  z-index: 10;
}

.date-option {
  padding: 10px;
  border-bottom: 1px solid #eee;
  text-align: center;
}
.date-option:hover {
  background-color: #f0f0f0;
}

/* 카테고리 선택 시 파란색 테두리 하이라이트 */
.cat-item.selected .icon-circle {
  outline: 3px solid #007bff;
  transform: scale(1.1);
}
</style>
