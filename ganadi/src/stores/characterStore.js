import { defineStore } from 'pinia';

export const useCharacterStore = defineStore('character', {
    state: () => ({
        level: 1,
        lastEvaluatedMonth: '',
    }),

    actions: {
        setCharacter(data) {
            this.level = Number(data.level);
            this.lastEvaluatedMonth = data.lastEvaluatedMonth;
        },
    },
});
