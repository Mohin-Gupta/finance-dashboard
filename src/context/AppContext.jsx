import { createContext, useContext, useState, useEffect } from "react"
import { transactions as defaultData } from "../data/transactions"

const AppContext = createContext()

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions")
    return saved ? JSON.parse(saved) : defaultData
  })

  const [role, setRole] = useState(() => localStorage.getItem("role") || "viewer")
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("dark") === "true")
  const [tab, setTab] = useState("dashboard")

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem("role", role)
  }, [role])

  useEffect(() => {
    localStorage.setItem("dark", darkMode)
    if (darkMode) document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  }, [darkMode])

  function addTransaction(tx) {
    setTransactions(prev => [...prev, { ...tx, id: Date.now() }])
  }

  function editTransaction(id, updated) {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, ...updated } : tx))
  }

  function deleteTransaction(id) {
    setTransactions(prev => prev.filter(tx => tx.id !== id))
  }

  return (
    <AppContext.Provider value={{
      transactions, role, setRole,
      darkMode, setDarkMode,
      tab, setTab,
      addTransaction, editTransaction, deleteTransaction
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)