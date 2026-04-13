import axios from 'axios';

export const getGraphRawData = async () => {
  const [transactionsRes, categoryRes, inconsRes, colorsRes, budgetRes] =
    await Promise.all([
      axios.get('https://railway-production-eae7.up.railway.app/transactions'),
      axios.get('https://railway-production-eae7.up.railway.app/category'),
      axios.get('https://railway-production-eae7.up.railway.app/icons'),
      axios.get('https://railway-production-eae7.up.railway.app/colors'),
      axios.get('https://railway-production-eae7.up.railway.app/budget'),
    ]);

  return {
    transactions: transactionsRes.data,
    category: categoryRes.data,
    icons: inconsRes.data,
    colors: colorsRes.data,
    budget: budgetRes.data,
  };
};
