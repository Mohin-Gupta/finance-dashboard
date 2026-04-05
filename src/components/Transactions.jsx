import { useState, useMemo } from "react"
import { useApp } from "../context/AppContext"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { CATEGORIES, COLORS } from "../data/transactions"

const empty = { date: "", description: "", amount: "", category: "Food", type: "expense" }

const sel = "border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-1.5 text-xs bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-400"

export default function Transactions() {
  const { transactions, role, addTransaction, editTransaction, deleteTransaction } = useApp()

  const [search,     setSearch]     = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterCat,  setFilterCat]  = useState("all")
  const [sortBy,     setSortBy]     = useState("date-desc")
  const [showForm,   setShowForm]   = useState(false)
  const [form,       setForm]       = useState(empty)
  const [editId,     setEditId]     = useState(null)

  const filtered = useMemo(() => {
    let list = [...transactions]
    if (search)               list = list.filter(t => t.description.toLowerCase().includes(search.toLowerCase()))
    if (filterType !== "all") list = list.filter(t => t.type === filterType)
    if (filterCat  !== "all") list = list.filter(t => t.category === filterCat)
    const [key, dir] = sortBy.split("-")
    list.sort((a, b) => {
      const av = key === "amount" ? a.amount : new Date(a.date)
      const bv = key === "amount" ? b.amount : new Date(b.date)
      return dir === "desc" ? (bv > av ? 1 : -1) : (av > bv ? 1 : -1)
    })
    return list
  }, [transactions, search, filterType, filterCat, sortBy])

  function handleSubmit() {
    if (!form.date || !form.description || !form.amount) return
    const tx = { ...form, amount: Number(form.amount) }
    if (editId) { editTransaction(editId, tx); setEditId(null) }
    else addTransaction(tx)
    setForm(empty)
    setShowForm(false)
  }

  function startEdit(tx) {
    setForm({ date: tx.date, description: tx.description, amount: tx.amount, category: tx.category, type: tx.type })
    setEditId(tx.id)
    setShowForm(true)
  }

  function exportCSV() {
    const csv = ["Date,Description,Category,Type,Amount",
      ...filtered.map(t => `${t.date},${t.description},${t.category},${t.type},${t.amount}`)
    ].join("\n")
    const a = document.createElement("a")
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
    a.download = "transactions.csv"
    a.click()
  }

  return (
    <div className="p-4 md:p-8">

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-semibold text-stone-800 dark:text-stone-100">Transactions</h1>
          <p className="text-xs text-stone-400 mt-0.5">{filtered.length} records</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="hidden sm:block text-xs px-3 py-1.5 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            Export CSV
          </button>
          {role === "admin" && (
            <button
              onClick={() => { setShowForm(!showForm); setEditId(null); setForm(empty) }}
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
            >
              <Plus size={13} /> Add
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className={sel + " pl-7 w-36"}
          />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className={sel}>
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className={sel}>
          <option value="all">All categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={sel}>
          <option value="date-desc">Latest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="amount-desc">Highest first</option>
          <option value="amount-asc">Lowest first</option>
        </select>
      </div>

      {showForm && role === "admin" && (
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-xl p-3 mb-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-2">
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className={sel + " w-full"}
            />
            <input
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className={sel + " w-full"}
            />
            <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              className={sel + " w-full"}
            />
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={sel + " w-full"}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className={sel + " w-full"}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="text-xs px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors">
              {editId ? "Update" : "Save"}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null) }} className="text-xs px-3 py-1.5 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-center py-12 text-sm text-stone-400">No transactions found</p>
        ) : (
          <>
            <table className="w-full text-xs hidden md:table">
              <thead className="border-b border-stone-100 dark:border-stone-800">
                <tr>
                  {["Date", "Description", "Category", "Type", "Amount", ...(role === "admin" ? [""] : [])].map((h, i) => (
                    <th key={i} className="text-left text-stone-400 font-medium px-4 py-2.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(tx => (
                  <tr key={tx.id} className="border-b border-stone-50 dark:border-stone-800/40 last:border-0">
                    <td className="px-4 py-2.5 text-stone-400 whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-2.5 text-stone-700 dark:text-stone-300">{tx.description}</td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[tx.category] + "20", color: COLORS[tx.category] }}>
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${tx.type === "income" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"}`}>
                        {tx.type === "income" ? "Income" : "Expense"}
                      </span>
                    </td>
                    <td className={`px-4 py-2.5 font-medium ${tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-stone-700 dark:text-stone-300"}`}>
                      {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                    </td>
                    {role === "admin" && (
                      <td className="px-4 py-2.5">
                        <div className="flex gap-1">
                          <button onClick={() => startEdit(tx)} className="p-1 text-stone-300 hover:text-amber-500 rounded transition-colors"><Pencil size={12} /></button>
                          <button onClick={() => deleteTransaction(tx.id)} className="p-1 text-stone-300 hover:text-red-500 rounded transition-colors"><Trash2 size={12} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="md:hidden divide-y divide-stone-100 dark:divide-stone-800">
              {filtered.map(tx => (
                <div key={tx.id} className="flex items-center justify-between px-4 py-2.5">
                  <div>
                    <p className="text-sm text-stone-700 dark:text-stone-300">{tx.description}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs text-stone-400">
                        {new Date(tx.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: COLORS[tx.category] + "20", color: COLORS[tx.category] }}>
                        {tx.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-stone-700 dark:text-stone-300"}`}>
                      {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                    </span>
                    {role === "admin" && (
                      <button onClick={() => deleteTransaction(tx.id)} className="p-1 text-stone-300 hover:text-red-500 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}