import { createContext, useContext, useState, useEffect } from "react";
import { initialTransactions } from "../data/transactions";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("fd_transactions");
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [role, setRole] = useState(() => localStorage.getItem("fd_role") || "viewer");

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("fd_dark") === "true");

  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    localStorage.setItem("fd_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("fd_role", role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem("fd_dark", darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const addTransaction = (tx) => {
    setTransactions(prev => [...prev, { ...tx, id: Date.now() }]);
  };

  const editTransaction = (id, updated) => {
    setTransactions(prev =>
      prev.map(tx => tx.id === id ? { ...tx, ...updated } : tx)
    );
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  return (
    <AppContext.Provider value={{
      transactions,
      role, setRole,
      darkMode, setDarkMode,
      activeTab, setActiveTab,
      addTransaction,
      editTransaction,
      deleteTransaction
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);