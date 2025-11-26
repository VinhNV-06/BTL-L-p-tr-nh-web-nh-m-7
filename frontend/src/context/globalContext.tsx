import React, { useState, ReactNode } from "react";
import axios, { AxiosError } from "axios";
import { Transaction, TransactionInput, GlobalContextType } from "./types";

const BASE_URL = "http://localhost:5000/api/v1/";

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalContext = React.createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addIncome = async (income: TransactionInput) => {
    try {
      await axios.post(`${BASE_URL}add-income`, income);
      await getIncomes();
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "Error adding income");
    }
  };

  const getIncomes = async () => {
    const response = await axios.get<Transaction[]>(`${BASE_URL}get-incomes`);
    setIncomes(response.data);
  };

  const deleteIncome = async (id: string) => {
    await axios.delete(`${BASE_URL}delete-income/${id}`);
    await getIncomes();
  };

  const totalIncome = () => incomes.reduce((acc, curr) => acc + curr.amount, 0);

  const addExpense = async (expense: TransactionInput) => {
    try {
      await axios.post(`${BASE_URL}add-expense`, expense);
      await getExpenses();
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "Error adding expense");
    }
  };

  const getExpenses = async () => {
    const response = await axios.get<Transaction[]>(`${BASE_URL}get-expenses`);
    setExpenses(response.data);
  };

  const deleteExpense = async (id: string) => {
    await axios.delete(`${BASE_URL}delete-expense/${id}`);
    await getExpenses();
  };

  const totalExpenses = () => expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const totalBalance = () => totalIncome() - totalExpenses();

  const transactionHistory = () => {
    const history = [...incomes, ...expenses];
    history.sort(
      (a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
    );
    return history.slice(0, 3);
  };

  return (
    <GlobalContext.Provider
      value={{
        addIncome,
        getIncomes,
        incomes,
        deleteIncome,
        expenses,
        totalIncome,
        addExpense,
        getExpenses,
        deleteExpense,
        totalExpenses,
        totalBalance,
        transactionHistory,
        error,
        setError,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
