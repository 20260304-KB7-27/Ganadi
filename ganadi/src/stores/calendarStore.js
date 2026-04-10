import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCalendarStore = defineStore('calendar', () => {
    const currentDate = ref(new Date());

    const setDate = (date) => {
        currentDate.value = new Date(date);
    };

    return {
        currentDate,
        setDate,
    };
});
