import { useApp } from "../context/AppContext";
import { useMemo } from "react";
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { CATEGORY_COLORS } from "../data/transactions";

export default function Dashboard() {
  const { transactions } = useApp();

  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleString("default", { month: "short", year: "2-digit" });
      if (!map[month]) map[month] = { month, income: 0, expenses: 0 };
      if (t.type === "income") map[month].income += t.amount;
      else map[month].expenses += t.amount;
    });
    return Object.values(map).map(m => ({ ...m, balance: m.income - m.expenses }));
  }, [transactions]);

  const categoryData = useMemo(() => {
    const map = {};
    transactions
      .filter(t => t.type === "expense")
      .forEach(t => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Your financial overview at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Balance", value: stats.balance, icon: Wallet, color: "emerald" },
          { label: "Total Income", value: stats.income, icon: TrendingUp, color: "blue" },
          { label: "Total Expenses", value: stats.expenses, icon: TrendingDown, color: "rose" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                ${color === "emerald" ? "bg-emerald-100 dark:bg-emerald-900/40" :
                  color === "blue" ? "bg-blue-100 dark:bg-blue-900/40" :
                  "bg-rose-100 dark:bg-rose-900/40"}`}>
                <Icon size={18} className={
                  color === "emerald" ? "text-emerald-600 dark:text-emerald-400" :
                  color === "blue" ? "text-blue-600 dark:text-blue-400" :
                  "text-rose-600 dark:text-rose-400"} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{fmt(value)}</p>
            <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
              <ArrowUpRight size={12} /> +8.2% vs last month
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-6">Monthly Balance Trend</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={v => fmt(v)} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }} />
              <Area type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2.5} fill="url(#balGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Spending by Category</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((entry) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#94a3b8"} />
                ))}
              </Pie>
              <Tooltip formatter={v => fmt(v)} contentStyle={{ borderRadius: 12, border: "none" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 mt-2">
            {categoryData.slice(0, 4).map(({ name, value }) => (
              <div key={name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[name] }} />
                  <span className="text-slate-500 dark:text-slate-400">{name}</span>
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">{fmt(value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}