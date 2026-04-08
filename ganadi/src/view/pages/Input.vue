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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'; // ⭐️ axios 추가

const router = useRouter();

// ⭐️ 서버에서 받아올 데이터를 담을 반응형 변수
const categories = ref([]);
const icons = ref([]);
const colors = ref([]);

const transactionType = ref('payment');
const today = new Date().toISOString().split('T')[0];
const date = ref(today);
const memo = ref('');
const amount = ref('0');
const isTyping = ref(true);
const selectedCategoryId = ref(null);
const isCategoryPopupOpen = ref(false);

// ⭐️ 서버 데이터 로드 함수
const fetchInitialData = async () => {
  try {
    const [resCat, resIcon, resColor] = await Promise.all([
      axios.get('http://localhost:3000/category'),
      axios.get('http://localhost:3000/icons'),
      axios.get('http://localhost:3000/colors'),
    ]);
    categories.value = resCat.data;
    icons.value = resIcon.data;
    colors.value = resColor.data;
  } catch (err) {
    console.error('데이터 로드 실패:', err);
  }
};

const filteredCategories = computed(() => {
  return categories.value.filter((cat) => cat.type === transactionType.value);
});

const formattedAmount = computed(() => {
  if (!amount.value || amount.value === '0') return '0';
  return Number(amount.value).toLocaleString();
});

// ⭐️ db.json의 icons 배열을 참조하여 부트스트랩 클래스로 변환
const getIcon = (iconId) => {
  const iconObj = icons.value.find((i) => i.iconId === String(iconId));
  const iconValue = iconObj ? iconObj.value : '';

  const iconMap = {
    cafe: 'bi-cup-hot',
    fare: 'bi-bus-front',
    hospital: 'bi-hospital',
    salary: 'bi-coin', // 예시 추가
  };
  return iconMap[iconValue] || 'bi-question-circle';
};

// ⭐️ db.json의 colors 배열에서 색상값 찾기
const getColor = (colorId) => {
  return (
    colors.value.find((c) => c.colorId === String(colorId))?.value || '#ccc'
  );
};

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
};

const handleKeyDown = (event) => {
  if (/^[0-9]$/.test(event.key)) handleKeyClick(event.key);
  else if (event.key === 'Backspace') handleKeyClick('BACK');
  else if (event.key === 'Enter') handleSave();
};

// ⭐️ 서버(json-server)에 저장하는 로직
const handleSave = async () => {
  if (amount.value === '0') {
    alert('금액을 입력해주세요!');
    return;
  }
  if (transactionType.value === 'payment' && !selectedCategoryId.value) {
    alert('카테고리를 선택해주세요!');
    return;
  }

  const newTransaction = {
    amount: String(amount.value), // db.json 형식에 맞춰 문자열로 저장
    date: date.value,
    type: transactionType.value,
    categoryId: selectedCategoryId.value,
    memo: memo.value,
  };

  try {
    // ⭐️ axios.post로 db.json에 실제 데이터 추가
    await axios.post('http://localhost:3000/transactions', newTransaction);
    alert('성공적으로 서버에 저장되었습니다!');
    router.push('/');
  } catch (err) {
    alert('저장에 실패했습니다. 서버가 켜져있는지 확인해주세요.');
  }
};

onMounted(() => {
  fetchInitialData(); // ⭐️ 시작 시 서버 데이터 가져오기
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
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
