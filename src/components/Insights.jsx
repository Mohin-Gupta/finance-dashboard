import { useApp } from "../context/AppContext";
import { useMemo } from "react";
import { TrendingUp, TrendingDown, AlertCircle, Award } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CATEGORY_COLORS } from "../data/transactions";

export default function Insights() {
  const { transactions } = useApp();

  const { topCategory, monthlyComparison, categoryBreakdown, savingsRate } = useMemo(() => {
    const expensesByCategory = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
    });

    const topCategory = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0];

    const monthlyMap = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleString("default", { month: "short", year: "2-digit" });
      if (!monthlyMap[month]) monthlyMap[month] = { month, income: 0, expenses: 0 };
      if (t.type === "income") monthlyMap[month].income += t.amount;
      else monthlyMap[month].expenses += t.amount;
    });
    const monthlyComparison = Object.values(monthlyMap);

    const categoryBreakdown = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]);

    const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

    return { topCategory, monthlyComparison, categoryBreakdown, savingsRate };
  }, [transactions]);

  const fmt = n => `₹${n.toLocaleString("en-IN")}`;
  const total = categoryBreakdown.reduce((s, [, v]) => s + v, 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Insights</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Understand your spending patterns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {topCategory && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Award size={18} className="text-amber-500" />
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">Highest Spending</span>
            </div>
            <p className="text-xl font-bold text-slate-800 dark:text-white">{topCategory[0]}</p>
            <p className="text-amber-600 dark:text-amber-400 font-semibold">{fmt(topCategory[1])}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Your biggest expense category</p>
          </div>
        )}

        <div className={`border rounded-2xl p-5 ${savingsRate >= 20 ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800" : "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800"}`}>
          <div className="flex items-center gap-2 mb-3">
            {savingsRate >= 20
              ? <TrendingUp size={18} className="text-emerald-500" />
              : <TrendingDown size={18} className="text-rose-500" />}
            <span className={`text-sm font-semibold ${savingsRate >= 20 ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}>
              Savings Rate
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">{savingsRate}%</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {savingsRate >= 20 ? "Great! You're saving well above 20%" : "Consider cutting expenses to save more"}
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={18} className="text-blue-500" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Observation</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
            {categoryBreakdown.length > 0
              ? `You spend ${Math.round((categoryBreakdown[0][1] / total) * 100)}% of expenses on ${categoryBreakdown[0][0]}`
              : "No expense data yet"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Based on all recorded transactions</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm mb-6">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-6">Monthly Income vs Expenses</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyComparison} barGap={4}>
            <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={v => fmt(v)} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }} />
            <Legend />
            <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-5">Expense Category Breakdown</h2>
        <div className="flex flex-col gap-3">
          {categoryBreakdown.map(([cat, val]) => (
            <div key={cat}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-slate-600 dark:text-slate-400">{cat}</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {fmt(val)}{" "}
                  <span className="text-xs text-slate-400 font-normal">
                    ({Math.round((val / total) * 100)}%)
                  </span>
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(val / total) * 100}%`,
                    backgroundColor: CATEGORY_COLORS[cat] || "#94a3b8"
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}