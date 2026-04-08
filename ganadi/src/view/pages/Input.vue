<template>
  <div class="record-page">
    <main class="input-form">
      <div class="control-row">
        <div class="toggle-group">
          <button
            :class="[
              'toggle-btn',
              { 'income-active': transactionType === 'income' },
            ]"
            @click="transactionType = 'income'"
          >
            입금
          </button>
          <button
            :class="[
              'toggle-btn',
              { 'expense-active': transactionType === 'payment' },
            ]"
            @click="transactionType = 'payment'"
          >
            출금
          </button>
        </div>
        <div class="date-wrapper">
          <input type="date" class="date-selector" v-model="date" />
        </div>
      </div>

      <div class="input-box memo-box">
        <img src="@/assets/images/input.png" />
        <input
          type="text"
          v-model="memo"
          placeholder="상세내역을 입력해주세요"
        />
      </div>

      <div class="input-box amount-box">
        <span class="currency">₩</span>
        <div class="amount-wrapper">
          <span class="amount-text">{{ formattedAmount }}</span>
          <span class="cursor" v-show="isTyping">|</span>
        </div>
      </div>

      <div class="category-box" v-if="transactionType === 'payment'">
        <span class="category-title">카테고리 선택</span>
        <div class="category-list">
          <button
            v-for="cat in filteredCategories"
            :key="cat.categoryId"
            class="category-icon"
            :class="{ active: selectedCategoryId === cat.categoryId }"
            :style="{
              borderColor:
                selectedCategoryId === cat.categoryId
                  ? getColor(cat.colorId)
                  : 'transparent',
            }"
            @click="selectCategory(cat.categoryId)"
          >
            <i :class="['bi', getIcon(cat.iconId)]"></i>
          </button>

          <button
            class="category-icon add-btn"
            @click="isCategoryPopupOpen = true"
          >
            <i class="bi bi-plus-lg"></i>
          </button>
        </div>
      </div>
    </main>

    <section class="custom-keypad">
      <div class="keypad-grid">
        <button
          v-for="n in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0']"
          :key="n"
          class="key-btn"
          @click="handleKeyClick(n)"
        >
          {{ n }}
        </button>
        <button class="key-btn action-key" @click="handleKeyClick('BACK')">
          ⌫
        </button>
      </div>

      <button class="save-btn" @click="handleSave">저장하기</button>
    </section>

    <Transition name="fade">
      <div
        v-if="isCategoryPopupOpen"
        class="popup-overlay"
        @click.self="isCategoryPopupOpen = false"
      >
        <div class="popup-content">
          <div class="popup-header">
            <span class="badge">전체 카테고리</span>
            <button class="close-x" @click="isCategoryPopupOpen = false">
              ✕
            </button>
          </div>
          <div class="category-selection-grid">
            <button
              v-for="cat in filteredCategories"
              :key="cat.categoryId"
              class="popup-cat-item"
              @click="
                selectCategory(cat.categoryId);
                isCategoryPopupOpen = false;
              "
            >
              <div
                class="cat-circle"
                :style="{ backgroundColor: getColor(cat.colorId) + '22' }"
              >
                <i :class="['bi', getIcon(cat.iconId)]"></i>
              </div>
              <span class="cat-name">{{ cat.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import categoryData from '@/data/category.json';
import presetData from '@/data/preset_options.json';

const router = useRouter();

const categoriesJSON = categoryData.category;
const iconsJSON = presetData.icons;
const colorsJSON = presetData.colors;

const transactionType = ref('payment');
const today = new Date().toISOString().split('T')[0];
const date = ref(today);
const memo = ref('');
const amount = ref('0');
const isTyping = ref(true);
const selectedCategoryId = ref(null);
const isCategoryPopupOpen = ref(false);

const filteredCategories = computed(() => {
  return categoriesJSON.filter((cat) => cat.type === transactionType.value);
});

const formattedAmount = computed(() => {
  if (!amount.value || amount.value === '0') return '0';
  return Number(amount.value).toLocaleString();
});

// JSON의 iconId를 바탕으로 부트스트랩 클래스명을 반환하는 번역기
const getIcon = (iconId) => {
  // 아이콘 ID와 부트스트랩 클래스를 매칭합니다.
  const iconMap = {
    1: 'bi-cup-hot', // 카페
    2: 'bi-bus-front', // 교통
    3: 'bi-hospital', // 병원
    4: 'bi-fork-knife', // 식비 (egg-fried 대신 범용적인 포크나이프로 변경)
  };
  // 문자열로 변환하여 매핑하고, 없으면 기본 물음표 아이콘을 띄웁니다.
  return iconMap[String(iconId)] || 'bi-question-circle';
};

const getColor = (id) =>
  colorsJSON.find((c) => c.colorId === id)?.value || '#ccc';

const selectCategory = (categoryId) => {
  selectedCategoryId.value = categoryId;
};

const handleKeyClick = (key) => {
  if (key === 'BACK') {
    amount.value = amount.value.length > 1 ? amount.value.slice(0, -1) : '0';
    return;
  }
  if (amount.value === '0') {
    if (key === '0' || key === '00') return;
    amount.value = key;
  } else if (amount.value.length < 11) {
    amount.value += key;
  }

  //   // ⭐️ 실제 저장 로직
  //   const handleSave = () => {
  //     // 1. 필수 입력값 검사 (유효성 검사)
  //     if (amount.value === '0') {
  //       alert('금액을 입력해주세요!');
  //       return;
  //     }
  //     if (transactionType.value === 'payment' && !selectedCategoryId.value) {
  //       alert('카테고리를 선택해주세요!');
  //       return;
  //     }

  //     // 2. 저장할 새 데이터 객체 생성
  //     const newTransaction = {
  //       transactionId: Date.now().toString(), // 현재 시간으로 고유 ID 생성
  //       amount: Number(amount.value), // 숫자 형태로 변환하여 저장
  //       date: date.value,
  //       type: transactionType.value,
  //       categoryId: selectedCategoryId.value,
  //       memo: memo.value,
  //     };

  //     // 3. 브라우저 로컬 스토리지에 저장 (기존 데이터 보존)
  //     const existingData = JSON.parse(localStorage.getItem('transactions')) || [];
  //     existingData.push(newTransaction);
  //     localStorage.setItem('transactions', JSON.stringify(existingData));

  //     // 4. 저장 완료 처리 및 화면 이동
  //     alert('성공적으로 저장되었습니다!');

  //     // 저장 후 메인 화면으로 돌아가기 (원치 않으시면 아래 줄을 지워주세요)
  //     router.push('/');
  //   };
};
</script>

<style scoped>
/* 기존 스타일 그대로 유지 */
.record-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
  max-width: 480px;
  margin: 0 auto;
  position: relative;
  overflow-y: auto;
}
.input-form {
  flex: 1;
  padding: 20px;
  background-color: white;
}
.control-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.toggle-group {
  display: flex;
  gap: 10px;
}
.toggle-btn {
  padding: 8px 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}
.income-active {
  background-color: #4ade80;
  color: white;
  border-color: #4ade80;
}
.expense-active {
  background-color: #f87171;
  color: white;
  border-color: #f87171;
}
.date-selector {
  padding: 8px 15px;
  background: #e5e7eb;
  border-radius: 4px;
  font-weight: bold;
}

.input-box {
  background: #e5e7eb;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}
.memo-box input {
  background: none;
  border: none;
  outline: none;
  margin-left: 10px;
  width: 100%;
  font-size: 16px;
}
.memo-box img {
  width: 30px;
  height: auto;
  margin-right: 10px;
  vertical-align: middle;
}
.amount-box {
  justify-content: space-between;
  padding: 20px 15px;
}
.amount-wrapper {
  display: flex;
  align-items: center;
  margin-left: auto;
  text-align: right;
}
.amount-text {
  font-size: 40px;
  font-weight: bold;
}
.cursor {
  font-size: 40px;
  animation: blink 1s step-end infinite;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}

.category-box {
  background: #e5e7eb;
  border-radius: 8px;
  padding: 15px;
}
.category-title {
  font-size: 12px;
  color: black;
  display: block;
  margin-bottom: 10px;
}
.category-list {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}
.category-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid transparent;
  background: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.category-icon.active {
  border-color: #10b981;
}

.custom-keypad {
  background: white;
  padding: 20px;
  border-top: 1px solid #eee;
}
.keypad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}
.key-btn {
  padding: 15px 0;
  font-size: 24px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
}

.save-btn {
  width: 100%;
  padding: 16px;
  background-color: #333;
  color: white;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.save-btn:active {
  background-color: #555;
}

.bottom-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px 0;
  background: #f9f9f9;
  border-top: 1px solid #ddd;
}
.nav-icon {
  background: none;
  border: none;
  cursor: pointer;
}
.nav-icon img {
  width: 28px;
  height: 28px;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.popup-content {
  background: white;
  width: 90%;
  max-width: 360px;
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.badge {
  background: #333;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}
.close-x {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
}
.category-selection-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px 10px;
  max-height: 300px;
  overflow-y: auto;
  padding-bottom: 10px;
}
.popup-cat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  gap: 8px;
  cursor: pointer;
}
.cat-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
.cat-name {
  font-size: 12px;
  color: #555;
  font-weight: bold;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
