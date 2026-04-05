import { useApp } from "../context/AppContext"
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { COLORS } from "../data/transactions"

const PER_PAGE = 12

function formatDate(dateStr, opts) {
  return new Date(dateStr).toLocaleDateString("en-IN", opts)
}

function CategoryBadge({ category }) {
  return (
    <span
      className="px-2 py-0.5 rounded text-xs font-medium"
      style={{ backgroundColor: COLORS[category] + "20", color: COLORS[category] }}
    >
      {category}
    </span>
  )
}

function TypeBadge({ type }) {
  const isIncome = type === "income"
  return (
    <span
      className={
        "text-xs px-2 py-0.5 rounded font-medium " +
        (isIncome
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
          : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400")
      }
    >
      {isIncome ? "Income" : "Expense"}
    </span>
  )
}

export default function TransactionTable({ rows, page, setPage, total, onEdit }) {
  const { role, deleteTransaction } = useApp()

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
      {rows.length === 0 ? (
        <p className="text-center py-12 text-sm text-stone-400">No transactions found</p>
      ) : (
        <>
          {/* Desktop table */}
          <table className="w-full text-xs hidden md:table">
            <thead className="border-b border-stone-100 dark:border-stone-800">
              <tr>
                {["Date", "Description", "Category", "Type", "Amount", ...(role === "admin" ? [""] : [])].map((h, i) => (
                  <th key={i} className="text-left text-stone-400 font-medium px-4 py-2.5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-stone-50 dark:border-stone-800/40 last:border-0"
                >
                  <td className="px-4 py-2.5 text-stone-400 whitespace-nowrap">
                    {formatDate(tx.date, { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-2.5 text-stone-700 dark:text-stone-300">
                    {tx.description}
                  </td>
                  <td className="px-4 py-2.5">
                    <CategoryBadge category={tx.category} />
                  </td>
                  <td className="px-4 py-2.5">
                    <TypeBadge type={tx.type} />
                  </td>
                  <td
                    className={
                      "px-4 py-2.5 font-medium " +
                      (tx.type === "income"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-stone-700 dark:text-stone-300")
                    }
                  >
                    {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                  </td>
                  {role === "admin" && (
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1">
                        <button
                          onClick={() => onEdit(tx)}
                          className="p-1 text-stone-300 hover:text-amber-500 rounded transition-colors"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          className="p-1 text-stone-300 hover:text-red-500 rounded transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-stone-100 dark:divide-stone-800">
            {rows.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex-1 min-w-0 mr-3">
                  <p className="text-sm text-stone-700 dark:text-stone-300 truncate">
                    {tx.description}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-stone-400">
                      {formatDate(tx.date, { day: "2-digit", month: "short" })}
                    </span>
                    <CategoryBadge category={tx.category} />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={
                      "text-sm font-medium " +
                      (tx.type === "income"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-stone-700 dark:text-stone-300")
                    }
                  >
                    {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                  </span>
                  {role === "admin" && (
                    <div className="flex items-center">
                      <button
                        onClick={() => onEdit(tx)}
                        className="p-1.5 text-stone-300 hover:text-amber-500 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="p-1.5 text-stone-300 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-stone-100 dark:border-stone-800">
            <p className="text-xs text-stone-400">
              {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} of {total}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="p-1.5 rounded text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={15} />
              </button>
              <span className="text-xs text-stone-500 px-1">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                className="p-1.5 rounded text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}