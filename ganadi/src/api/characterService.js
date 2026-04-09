import axios from 'axios';
import {
    getCurrentMonthString,
    getPreviousMonthString,
    getPreviousMonthTotalExpense,
    getPreviousMonthBudget,
    getNextLevel,
} from '@/utils/levelCalculator';

export const getCharacterData = async () => {
    const response = await axios.get('/api/character/1');
    return response.data;
};

export const updateCharacterData = async (characterId, payload) => {
    const response = await axios.patch(
        `/api/character/${characterId}`,
        payload,
    );
    return response.data;
};

export const evaluateCharacterLevelIfNeeded = async ({
    transactions,
    budgets,
}) => {
    const character = await getCharacterData();

    const currentMonth = getCurrentMonthString(new Date());

    if (character.lastEvaluatedMonth === currentMonth) {
        return character;
    }

    const previousMonth = getPreviousMonthString(new Date());

    const previousExpense = getPreviousMonthTotalExpense(
        transactions,
        previousMonth,
    );

    const previousBudget = getPreviousMonthBudget(budgets, previousMonth);

    const nextLevel = getNextLevel({
        currentLevel: Number(character.level),
        totalExpense: previousExpense,
        targetBudget: previousBudget,
    });

    const updatedCharacter = await updateCharacterData(character.characterId, {
        level: String(nextLevel),
        lastEvaluatedMonth: currentMonth,
    });

    return updatedCharacter;
};
