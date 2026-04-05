import { createContext, useContext, useState, useEffect } from "react"
import { transactions as defaultData } from "../data/transactions"

const AppContext = createContext()

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem("financeiq_transactions")
      return saved ? JSON.parse(saved) : defaultData
    } catch {
      return defaultData
    }
  })

  const [role, setRole] = useState(localStorage.getItem("financeiq_role") || "viewer")
  const [darkMode, setDarkMode] = useState(localStorage.getItem("financeiq_dark") === "true")
  const [tab, setTab] = useState("dashboard")

  useEffect(() => {
    localStorage.setItem("financeiq_transactions", JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem("financeiq_role", role)
  }, [role])

  useEffect(() => {
    localStorage.setItem("financeiq_dark", darkMode)
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  function addTransaction(tx) {
    const newTx = { ...tx, id: Date.now() }
    setTransactions(prev => [newTx, ...prev])
  }

  function editTransaction(id, updated) {
    setTransactions(prev =>
      prev.map(tx => (tx.id === id ? { ...tx, ...updated } : tx))
    )
  }

  function deleteTransaction(id) {
    if (!window.confirm("Delete this transaction?")) return
    setTransactions(prev => prev.filter(tx => tx.id !== id))
  }

  return (
    <AppContext.Provider
      value={{
        transactions,
        role, setRole,
        darkMode, setDarkMode,
        tab, setTab,
        addTransaction,
        editTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)