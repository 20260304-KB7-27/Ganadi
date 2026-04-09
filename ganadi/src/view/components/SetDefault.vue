<template>
  <div class="set-group header-box">
    <h5>default값 설정</h5>
    <button class="add-btn">+</button>
  </div>

  <ul class="fixed-list">
    <li v-for="item in displayList" :key="item.fixedCostId" class="fixed-item-card">
      <!--  -->
      <div class="icon-circle" :style="{ backgroundColor: item.iconColor }">
        <i :class="`bi bi-${item.iconType}`"></i>
      </div>
      <!--  -->
      <div class="amount-text">
        <span v-if="item.type === 'payment'">-{{ format(item.amount) }}원</span>
        <span v-else>{{ format(item.amount) }}원</span>
      </div>

      <div class="date-text">
        매월 {{ item.day }}일
      </div>

      <button class="remove-btn" @click="removeItem(item.fixedCostId)">-</button>

    </li>


  </ul>


  <!-- <div class="set-group">
    <h2>default값 설정</h2>
    <button>+</button>
  </div>

  <ul>
    <li v-for="item in fixedCosts" :key="item.fixedCostId" class="fixed-items">
      <span>💳</span>

      <span v-if="item.type === 'payment'"> -{{ format(item.amount) }}원 </span>
      <span v-else> {{ format(item.amount) }}원 </span>

      <span>매월 {{ item.day }}일</span>

      <button @click="removeItem(item.fixedCostId)">-</button>
    </li>
  </ul> -->
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import db from '/db.json';

const fixedCosts = ref([]);
const categories = ref([]);
const icons = ref([]);
const colors = ref([]);

const fetchFixedCosts = () => {
  fixedCosts.value = db['fixed-cost'];
  categories.value = db['category'];
  icons.value = db['icons'];
  colors.value = db['colors'];
};

const displayList = computed(() => {
  return fixedCosts.value.map((item) => {
    const matchedCategory = categories.value.find(c => c.categoryId === item.categoryId);
    console.log(matchedCategory);
    console.log(categories.value);

    let matchedIcon = null;
    let matchedColor = null;

    if (matchedCategory) {
      matchedIcon = icons.value?.find(i => i.iconId === matchedCategory.iconId);
      matchedColor = colors.value?.find(c => c.colorId === matchedCategory.colorId);
    }

    return {
      ...item, 
      iconType: matchedIcon ? matchedIcon.value : 'bag', 
      iconColor: matchedColor ? matchedColor.value : '#e0e0e0'
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
</style>
