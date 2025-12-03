export type TransactionInput = {
  amount: number;
  categoryId: string;
  description?: string;
  date: string;
};

export interface Transaction extends TransactionInput {
  _id?: string;
  createdAt?: string;
  category?: {
    _id: string;
    name: string;
  };
}

export interface GlobalContextType {
  expenses: Transaction[];
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;

  addExpense: (expense: TransactionInput) => Promise<void>;
  getExpenses: () => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  totalExpenses: () => number;
}
