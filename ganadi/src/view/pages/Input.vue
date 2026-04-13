<template>
    <div class="record-page split-layout">
        <div class="left-panel">
            <main class="input-form">
                <div class="control-row">
                    <div class="toggle-group">
                        <button
                            :class="[
                                'toggle-btn',
                                {
                                    'income-active':
                                        transactionType === 'income',
                                },
                            ]"
                            @click="transactionType = 'income'"
                        >
                            입금
                        </button>
                        <button
                            :class="[
                                'toggle-btn',
                                {
                                    'expense-active':
                                        transactionType === 'expense',
                                },
                            ]"
                            @click="transactionType = 'expense'"
                        >
                            출금
                        </button>
                    </div>
                    <div class="date-wrapper">
                        <input
                            type="date"
                            class="date-selector"
                            v-model="date"
                        />
                    </div>
                </div>

                <div class="input-box memo-box">
                    <img src="@/assets/images/input.png" />
                    <input
                        type="text"
                        v-model="memo"
                        @focus="isMemoActive = true"
                        @blur="isMemoActive = false"
                        placeholder="상세내역을 입력해주세요"
                    />
                </div>

                <div class="input-box amount-box" @click.stop="isTyping = true">
                    <span class="currency">₩</span>
                    <div class="amount-wrapper">
                        <span class="amount-text">{{ formattedAmount }}</span>
                        <span class="cursor" v-show="isTyping">|</span>
                    </div>
                </div>

                <div class="category-box" v-if="transactionType === 'expense'">
                    <span class="category-title">카테고리 선택</span>
                    <div class="category-list">
                        <button
                            v-for="cat in filteredCategories"
                            :key="cat.categoryId"
                            class="category-icon"
                            :class="{
                                active: selectedCategoryId === cat.categoryId,
                            }"
                            :style="{ backgroundColor: getColor(cat.colorId) }"
                            @click="selectCategory(cat.categoryId)"
                        >
                            <i :class="`bi ${getIcon(cat.iconId)}`"></i>
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
        </div>

        <div class="right-panel">
            <section class="custom-keypad">
                <div class="keypad-grid">
                    <button
                        v-for="n in [
                            '1',
                            '2',
                            '3',
                            '4',
                            '5',
                            '6',
                            '7',
                            '8',
                            '9',
                            '00',
                            '0',
                        ]"
                        :key="n"
                        class="key-btn"
                        @click="handleKeyClick(n)"
                    >
                        {{ n }}
                    </button>
                    <button
                        class="key-btn action-key"
                        @click="handleKeyClick('BACK')"
                    >
                        ⌫
                    </button>
                </div>
                <div class="button-group">
                    <button
                        type="button"
                        class="delete-btn"
                        @click="handleCancel"
                    >
                        취소
                    </button>
                    <button type="button" class="save-btn" @click="handleSave">
                        저장
                    </button>
                </div>
            </section>
        </div>

        <div
            v-if="isCategoryPopupOpen"
            class="popup-overlay"
            @click.self="isCategoryPopupOpen = false"
        >
            <div class="popup-content">
                <div class="popup-header">
                    <span class="badge">카테고리 선택</span>
                    <button
                        class="close-x"
                        @click="isCategoryPopupOpen = false"
                    >
                        ✕
                    </button>
                </div>

                <div class="category-selection-grid">
                    <button
                        v-for="cat in state.categories"
                        :key="cat.categoryId"
                        class="popup-cat-item"
                        @click="
                            selectCategory(cat.categoryId);
                            isCategoryPopupOpen = false;
                        "
                    >
                        <div
                            class="cat-circle"
                            :style="{ backgroundColor: getColor(cat.colorId) }"
                        >
                            <i :class="`bi ${getIcon(cat.iconId)}`"></i>
                        </div>
                        <span class="cat-name">{{ cat.name }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const isMemoActive = ref(false);

const transactionType = ref('expense');
const today = new Date().toISOString().split('T')[0];
const date = ref(route.query.date || today);
const memo = ref('');
const amount = ref('0');
const isTyping = ref(false);
const selectedCategoryId = ref(null);
const isCategoryPopupOpen = ref(false);
// 수정모드
const isEditMode = computed(() => route.query.mode === 'edit');
const editId = computed(() => route.query.id || null);
const fetchTransactionDetail = async () => {
    if (!isEditMode.value || !editId.value) return;

    try {
        const res = await axios.get(`/api/transactions/${editId.value}`);
        const data = res.data;

        transactionType.value = data.type;
        date.value = data.date;
        memo.value = data.memo || '';
        amount.value = String(data.amount || '0');
        selectedCategoryId.value = data.categoryId;
    } catch (err) {
        console.error('거래 상세 불러오기 실패:', err);
        alert('수정할 거래 정보를 불러오지 못했습니다.');
    }
};
const state = reactive({
    categories: [],
    icons: [],
    colors: [],
});

// 서버 데이터 로드 함수
const fetchInitialData = async () => {
    try {
        const [resCat, resIcon, resColor] = await Promise.all([
            axios.get(`/api/category`),
            axios.get(`/api/icons`),
            axios.get(`/api/colors`),
        ]);

        if (
            resCat.status === 200 &&
            resIcon.status === 200 &&
            resColor.status === 200
        ) {
            state.categories = resCat.data;
            state.icons = resIcon.data;
            state.colors = resColor.data;
        }
    } catch (err) {
        console.error('데이터 로드 실패:', err);
    }
};

const filteredCategories = computed(() => {
    return state.categories.filter((cat) => cat.type === transactionType.value);
});

const formattedAmount = computed(() => {
    if (!amount.value || amount.value === '0') return '0';
    return Number(amount.value).toLocaleString();
});

// db.json의 icons 배열을 참조하여 부트스트랩 클래스로 변환
const getIcon = (iconId) => {
    const iconObj = state.icons.find((i) => i.iconId === String(iconId));
    return iconObj ? `bi-${iconObj.value}` : 'bi-question-circle';
};

// db.json의 colors 배열에서 색상값 찾기
const getColor = (colorId) => {
    return (
        state.colors.find((c) => c.colorId === String(colorId))?.value || '#ccc'
    );
};

const selectCategory = (categoryId) => {
    selectedCategoryId.value = categoryId;
};

const handleKeyClick = (key) => {
    if (isMemoActive.value) return;
    if (key === 'BACK') {
        amount.value =
            amount.value.length > 1 ? amount.value.slice(0, -1) : '0';
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
    if (event.isComposing) return;

    if (/^[0-9]$/.test(event.key)) {
        handleKeyClick(event.key);
    } else if (event.key === 'Backspace') {
        handleKeyClick('BACK');
    } else if (event.key === 'Enter') {
        event.preventDefault();
        handleSave();
    }
};

const handleCancel = () => {
    if (confirm('작성을 취소하고 메인 화면으로 돌아가시겠습니까?')) {
        router.push('/');
    }
};

const handleSave = async () => {
    if (amount.value === '0') {
        alert('금액을 입력해주세요!');
        return;
    }

    const transactionData = {
        amount: String(amount.value),
        date: date.value,
        type: transactionType.value,
        categoryId: selectedCategoryId.value,
        memo: memo.value,
    };

    try {
        if (isEditMode.value && editId.value) {
            await axios.put(
                `/api/transactions/${editId.value}`,
                transactionData,
            );
            alert('수정완료!');
        } else {
            await axios.post('/api/transactions', transactionData);
            alert('저장완료!');
        }

        router.push('/'); // 메인으로 이동
    } catch (err) {
        alert('저장 실패!');
    }
};

onMounted(async () => {
    await fetchInitialData();
    await fetchTransactionDetail();
    window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.record-page {
    font-family: '맑은 고딕', sans-serif;
    display: flex;
    flex-direction: row;
    height: 100vh;
    max-height: 700px;
    max-width: 760px;
    margin: 4vh auto;
    background-color: #ffffff;
    border-radius: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    position: relative;
}

.left-panel {
    flex: 1.2;
    display: flex;
    flex-direction: column;
    background-color: white;
}

.input-form {
    flex: 1;
    padding: 32px 24px 20px 24px;
    overflow-y: auto;
}

.right-panel {
    flex: 1;
    background: #f2f4f6;
    display: flex;
    flex-direction: column; /* 버튼을 아래로 배치하기 위해 수정 */
    justify-content: center;
    padding: 24px;
}

.memo-box {
    display: flex;
    align-items: center;
}

.memo-box img {
    width: 32px; /* 고정 너비 */
    height: 32px; /* 고정 높이 */
    object-fit: contain; /* 이미지 찌그러짐 방지 */
    flex-shrink: 0; /* 공간이 좁아져도 이미지 크기 유지 */
    margin-right: 12px;
}

.memo-box input {
    background: none;
    border: none;
    outline: none;
    width: 100%;
    font-size: 16px;
    color: #333d4b;
}

.memo-box input::placeholder {
    color: #adb5bd;
}

.control-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
}

.toggle-group {
    display: flex;
    background-color: #f2f4f6;
    border-radius: 12px;
    padding: 4px;
}

.toggle-btn {
    padding: 8px 24px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #8b95a1;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}

.income-active {
    background-color: white;
    color: #3182f6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.expense-active {
    background-color: white;
    color: #f04452;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.date-selector {
    padding: 8px 12px;
    background: transparent;
    border: none;
    font-weight: 600;
    color: #333d4b;
    font-size: 15px;
    cursor: pointer;
}

.input-box {
    background: #f9fafb;
    border-radius: 16px;
    padding: 18px 20px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    border: 1px solid transparent;
    transition: border 0.2s;
}

.input-box:focus-within {
    border: 1px solid #d1d6db;
}

.amount-box {
    justify-content: space-between;
    padding: 24px 20px;
}

.currency {
    font-size: 24px;
    color: #8b95a1;
    font-weight: bold;
}

.amount-wrapper {
    display: flex;
    align-items: center;
    margin-left: auto;
    text-align: right;
}

.amount-text {
    font-size: 36px;
    font-weight: 700;
    color: #191f28;
    letter-spacing: -0.5px;
}

.cursor {
    font-size: 36px;
    color: black;
    animation: blink 1s step-end infinite;
    margin-left: 4px;
}

@keyframes blink {
    50% {
        opacity: 0;
    }
}

.category-box {
    padding: 10px 0;
}

.category-title {
    font-size: 13px;
    color: #8b95a1;
    font-weight: 600;
    display: block;
    margin-bottom: 16px;
}

.category-list {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}

.category-icon {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 2px solid transparent;
    background: #f2f4f6;
    font-size: 22px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.category-icon:active {
    transform: scale(0.92);
}

.category-icon.active {
    border-color: #191f28 !important;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    z-index: 2;
}

.custom-keypad {
    width: 100%;
}

.keypad-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.key-btn {
    padding: 20px 0;
    font-size: 26px;
    font-weight: 500;
    background: white;
    border: none;
    border-radius: 16px;
    cursor: pointer;
    color: #333d4b;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    transition: background 0.1s;
}

.key-btn:active {
    background: #e5e8eb;
}

.action-key {
    color: #8b95a1;
}

.button-group {
    display: flex;
    gap: 12px;
    margin-top: 24px; /* 키패드와 간격 띄우기 */
    width: 100%;
}

.delete-btn,
.save-btn {
    flex: 1;
    padding: 18px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 16px; /* 키패드 모서리와 둥글기 통일 */
    cursor: pointer;
    transition: all 0.2s;
}

.delete-btn {
    background-color: #e5e8eb; /* 회색 배경에 어울리는 약간 더 진한 회색 */
    color: #4e5968;
}

.delete-btn:active {
    background-color: #d1d6db;
}

.save-btn {
    background-color: #fff3c9;
    box-shadow: 0 4px 12px #e7dcb6;
}

.save-btn:active {
    background-color: #fbeaae;
}

.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(2px);
    z-index: 2000;
    display: flex;
    align-items: center; /* 화면 정중앙에 배치 */
    justify-content: center;
}

.popup-content {
    background: white;
    width: 90%;
    max-width: 380px;
    border-radius: 20px;
    padding: 24px;
    box-sizing: border-box;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* 통통 튀는 애니메이션 */
}

@keyframes popIn {
    0% {
        transform: scale(0.9);
        opacity: 0;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.badge {
    background: transparent;
    color: #191f28;
    font-size: 18px;
    font-weight: 700;
    padding: 0;
}

.close-x {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #8b95a1;
}

.category-selection-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px 10px;
    max-height: 240px;
    overflow-y: auto;
    padding-bottom: 10px;
}

.category-selection-grid::-webkit-scrollbar {
    width: 6px;
}
.category-selection-grid::-webkit-scrollbar-thumb {
    background-color: #d1d6db;
    border-radius: 4px;
}

.popup-cat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: none;
    border: none;
    gap: 10px;
    cursor: pointer;
}

.cat-circle {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

.cat-name {
    font-size: 13px;
    color: #4e5968;
    font-weight: 500;
}

@media (max-width: 680px) {
    .record-page.split-layout {
        flex-direction: column;
        height: 100dvh;
        max-height: none;
        max-width: 100%;
        margin: 0;
        border-radius: 0;
        overflow-y: auto;
    }

    .left-panel {
        flex: none;
    }

    .input-form {
        padding: 20px 16px 10px 16px;
    }

    .right-panel {
        flex: none;
        padding: 16px;
    }

    .amount-text {
        font-size: 30px;
    } /* 금액 글자 축소 */
    .currency {
        font-size: 20px;
    }

    .category-icon {
        width: 46px; /* 카테고리 아이콘 크기 축소 */
        height: 46px;
        font-size: 20px;
    }
    .keypad-grid {
        gap: 8px; /* 키패드 버튼 사이 간격 축소 */
        margin-bottom: 16px;
    }

    .key-btn {
        padding: 12px 0; /* 키패드 세로 길이 대폭 축소 (한눈에 들어오게) */
        font-size: 22px; /* 숫자 크기 축소 */
        border-radius: 12px;
    }

    .button-group {
        margin-top: 0;
        width: 100%;
    }

    .delete-btn,
    .save-btn {
        padding: 14px; /* 취소/저장 버튼 높이 축소 */
        font-size: 15px;
    }
}
</style>
