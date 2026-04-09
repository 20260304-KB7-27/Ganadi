const getTargetMonthString = (year, month) => {
    return `${year}-${String(month).padStart(2, '0')}`;
};

const getTargetMonthPaymentTransactions = (transactions, targetMonth) => {
    return transactions.filter((item) => {
        return item.type === 'payment' && item.date.startsWith(targetMonth);
    });
};

const getTargetMonthBudget = (budgetList, targetMonth) => {
    return budgetList.find((item) => item.targetMonth === targetMonth) || null;
};

export const adaptGraphData = (
    { transactions, category, icons, colors, budget },
    { year, month },
) => {
    const targetMonth = getTargetMonthString(year, month);

    const targetMonthTransactions = getTargetMonthPaymentTransactions(
        transactions,
        targetMonth,
    );

    const totalExpense = targetMonthTransactions.reduce((sum, item) => {
        return sum + Number(item.amount);
    }, 0);

    const currentBudget = getTargetMonthBudget(budget, targetMonth);
    const monthlyGoal = currentBudget ? Number(currentBudget.amount) : 0;

    const goalRate =
        monthlyGoal === 0 ? 0 : Math.round((totalExpense / monthlyGoal) * 100);

    const groupedByCategory = {};

    targetMonthTransactions.forEach((item) => {
        const key = item.categoryId;

        if (!groupedByCategory[key]) {
            groupedByCategory[key] = 0;
        }

        groupedByCategory[key] += Number(item.amount);
    });

    const categorySummary = Object.entries(groupedByCategory)
        .map(([categoryId, amount]) => {
            const categoryInfo = category.find(
                (item) => String(item.categoryId) === String(categoryId),
            );

            const iconInfo = icons.find(
                (item) => String(item.iconId) === String(categoryInfo?.iconId),
            );

            const colorInfo = colors.find(
                (item) => item.colorId === categoryInfo?.colorId,
            );

            console.log(categoryInfo);
            console.log(iconInfo);

            return {
                categoryId,
                name: categoryInfo?.name || '기타',
                iconType: iconInfo?.value || 'coin',
                color: colorInfo?.value || '#d9d9d9',
                amount,
                percent:
                    totalExpense === 0
                        ? 0
                        : Math.round((amount / totalExpense) * 100),
            };
        })
        .sort((a, b) => b.amount - a.amount);

    return {
        totalExpense,
        monthlyGoal,
        goalRate,
        characterLevel: 2,
        categorySummary,
    };
};
