import React, { useState, ReactNode, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Transaction, TransactionInput, GlobalContextType } from "./types";

const BASE_URL = "http://localhost:5000/api/v1/";

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalContext = React.createContext<GlobalContextType | undefined>(
  undefined
);

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ---------- Expense ----------
  const addExpense = async (expense: TransactionInput) => {
    try {
      await axios.post(`${BASE_URL}expenses`, expense);
      await getExpenses();
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "Error adding expense");
    }
  };

  const getExpenses = async () => {
    try {
      const response = await axios.get<Transaction[]>(`${BASE_URL}expenses`);
      setExpenses(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}expenses/${id}`);
      await getExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const totalExpenses = () =>
    expenses.reduce((acc, curr) => acc + curr.amount, 0);

  useEffect(() => {
    getExpenses();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        expenses,
        error,
        setError,
        addExpense,
        getExpenses,
        deleteExpense,
        totalExpenses,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
