const MIN_LEVEL = 1;
const MAX_LEVEL = 4;

const clampLevel = (level) => {
    if (level < MIN_LEVEL) return MIN_LEVEL;
    if (level > MAX_LEVEL) return MAX_LEVEL;
    return level;
};

export const getMonthString = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

export const getCurrentMonthString = (date = new Date()) => {
    return getMonthString(date);
};

export const getPreviousMonthString = (date = new Date()) => {
    const previousDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    return getMonthString(previousDate);
};

export const getPreviousMonthTotalExpense = (transactions, previousMonth) => {
    return transactions
        .filter((item) => {
            return (
                item.type === 'expense' && item.date.startsWith(previousMonth)
            );
        })
        .reduce((sum, item) => sum + Number(item.amount), 0);
};

export const getPreviousMonthBudget = (budgets, previousMonth) => {
    const targetBudget = budgets.find(
        (item) => item.targetMonth === previousMonth,
    );

    return targetBudget ? Number(targetBudget.amount) : 0;
};

export const getNextLevel = ({ currentLevel, totalExpense, targetBudget }) => {
    if (!targetBudget) {
        return clampLevel(currentLevel);
    }

    if (totalExpense <= targetBudget) {
        return clampLevel(currentLevel + 1);
    }

    return clampLevel(currentLevel - 1);
};
