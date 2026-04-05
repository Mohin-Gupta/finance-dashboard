import { useMemo } from "react"
import { useApp } from "../context/AppContext"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { COLORS } from "../data/transactions"

function fmt(n) {
  return "₹" + n.toLocaleString("en-IN")
}

export default function Dashboard() {
  const { transactions } = useApp()

  const income   = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const expenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0)
  const balance  = income - expenses

  const monthlyData = useMemo(() => {
    const map = {}
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleString("default", { month: "short" })
      if (!map[month]) map[month] = { month, balance: 0 }
      if (t.type === "income") map[month].balance += t.amount
      else map[month].balance -= t.amount
    })
    return Object.values(map)
  }, [transactions])

  const categoryData = useMemo(() => {
    const map = {}
    transactions.filter(t => t.type === "expense").forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [transactions])

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-1">Dashboard</h1>
      <p className="text-sm text-stone-500 mb-6">Your financial overview</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total Balance", value: fmt(balance), color: "text-stone-800 dark:text-stone-100" },
          { label: "Total Income",  value: fmt(income),  color: "text-emerald-700 dark:text-emerald-400" },
          { label: "Total Expenses",value: fmt(expenses),color: "text-red-600 dark:text-red-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4">
            <p className="text-xs text-stone-400 mb-1">{label}</p>
            <p className={`text-2xl font-semibold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4">
          <p className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-4">Balance Trend</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#d97706" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Area type="monotone" dataKey="balance" stroke="#d97706" strokeWidth={2} fill="url(#fill)" dot={false} activeDot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4">
          <p className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-3">By Category</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="value">
                {categoryData.map(entry => (
                  <Cell key={entry.name} fill={COLORS[entry.name] || "#ccc"} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 mt-2">
            {categoryData.slice(0, 4).map(({ name, value }) => (
              <div key={name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[name] }} />
                  <span className="text-stone-500 dark:text-stone-400">{name}</span>
                </div>
                <span className="text-stone-700 dark:text-stone-300 font-medium">{fmt(value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}