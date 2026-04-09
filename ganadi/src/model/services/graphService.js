import axios from 'axios';

export const getGraphRawData = async () => {
    const [transactionsRes, categoryRes, inconsRes, colorsRes, budgetRes] =
        await Promise.all([
            axios.get('/api/transactions'),
            axios.get('/api/category'),
            axios.get('/api/icons'),
            axios.get('/api/colors'),
            axios.get('/api/budget'),
        ]);

    return {
        transactions: transactionsRes.data,
        category: categoryRes.data,
        icons: inconsRes.data,
        colors: colorsRes.data,
        budget: budgetRes.data,
    };
};
