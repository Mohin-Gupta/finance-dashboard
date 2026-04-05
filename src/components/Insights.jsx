import { useMemo } from "react"
import { useApp } from "../context/AppContext"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"
import { COLORS } from "../data/transactions"

function formatINR(n) {
  return "₹" + n.toLocaleString("en-IN")
}

export default function Insights() {
  const { transactions } = useApp()

  const expensesByCategory = useMemo(() => {
    const map = {}
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount
      })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [transactions])

  const monthlyData = useMemo(() => {
    const map = {}
    transactions.forEach((t) => {
      const month = new Date(t.date).toLocaleString("default", { month: "short" })
      if (!map[month]) map[month] = { month, income: 0, expenses: 0 }
      if (t.type === "income") map[month].income += t.amount
      else map[month].expenses += t.amount
    })
    return Object.values(map)
  }, [transactions])

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0)
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0)
  const totalSpend = expensesByCategory.reduce((s, [, v]) => s + v, 0)

  const savingsRate =
    totalIncome > 0
      ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
      : 0

  const topCategory = expensesByCategory[0]

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-1">Insights</h1>
      <p className="text-sm text-stone-500 mb-6">Spending patterns and analysis</p>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4">
          <p className="text-xs text-stone-400 mb-1">Top Category</p>
          <p className="text-lg font-semibold text-stone-800 dark:text-stone-100">
            {topCategory ? topCategory[0] : "—"}
          </p>
          <p className="text-xs text-stone-400 mt-0.5">
            {topCategory ? formatINR(topCategory[1]) + " total" : ""}
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4">
          <p className="text-xs text-stone-400 mb-1">Savings Rate</p>
          <p className={`text-lg font-semibold ${savingsRate >= 20 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
            {savingsRate}%
          </p>
          <p className="text-xs text-stone-400 mt-0.5">
            {savingsRate >= 20 ? "Above 20% target" : "Below 20% target"}
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4">
          <p className="text-xs text-stone-400 mb-1">Observation</p>
          <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
            {topCategory
              ? `${topCategory[0]} is ${Math.round((topCategory[1] / totalSpend) * 100)}% of your expenses`
              : "No data yet"}
          </p>
        </div>
      </div>

      {/* Monthly bar chart */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 mb-4">
        <p className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-4">
          Monthly Comparison
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData} barGap={4}>
            <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Legend />
            <Bar dataKey="income" name="Income" fill="#3a8f6f" radius={[4, 4, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="expenses" name="Expenses" fill="#c0444a" radius={[4, 4, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Expense breakdown */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4">
        <p className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-4">
          Expense Breakdown
        </p>
        <div className="flex flex-col gap-3">
          {expensesByCategory.map(([cat, val]) => (
            <div key={cat}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-500 dark:text-stone-400">{cat}</span>
                <span className="text-stone-700 dark:text-stone-300 font-medium">
                  {formatINR(val)}{" "}
                  <span className="text-stone-400 font-normal">
                    ({Math.round((val / totalSpend) * 100)}%)
                  </span>
                </span>
              </div>
              <div className="h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(val / totalSpend) * 100}%`, backgroundColor: COLORS[cat] }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}