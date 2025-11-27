export type TransactionInput = {
  title: string;
  amount: number;
  date?: string;
  category: string;
  description?: string;
};

export interface Transaction extends TransactionInput {
  _id?: string;
  type: "income" | "expense";
  createdAt?: string;
}

export interface GlobalContextType {
  incomes: Transaction[];
  expenses: Transaction[];
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  addIncome: (income: TransactionInput) => Promise<void>;
  getIncomes: () => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;
  totalIncome: () => number;
  addExpense: (expense: TransactionInput) => Promise<void>;
  getExpenses: () => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  totalExpenses: () => number;
  totalBalance: () => number;
  transactionHistory: () => Transaction[];
}
