import { useApp } from "../context/AppContext"
import { CATEGORIES } from "../data/transactions"

const inputCls =
  "border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-1.5 text-xs " +
  "bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 " +
  "focus:outline-none focus:ring-1 focus:ring-amber-400"

export default function TransactionForm({ form, setForm, editId, onSubmit, onCancel }) {
  const { role } = useApp()

  if (!role === "admin") return null

  return (
    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 rounded-xl p-3 mb-3">
      <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-2">
        {editId ? "Edit transaction" : "New transaction"}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-2">
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          className={inputCls + " w-full"}
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className={inputCls + " w-full"}
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          className={inputCls + " w-full"}
        />
        <select
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          className={inputCls + " w-full"}
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          value={form.type}
          onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          className={inputCls + " w-full"}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onSubmit}
          className="text-xs px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
        >
          {editId ? "Update" : "Save"}
        </button>
        <button
          onClick={onCancel}
          className="text-xs px-3 py-1.5 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}