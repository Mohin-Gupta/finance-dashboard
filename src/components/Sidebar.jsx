import { useApp } from "../context/AppContext";
import { LayoutDashboard, ArrowLeftRight, Lightbulb, Moon, Sun, ShieldCheck, Eye } from "lucide-react";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { id: "insights", label: "Insights", icon: Lightbulb },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, darkMode, setDarkMode, role, setRole } = useApp();

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-6 gap-8 shrink-0">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">₹</span>
          </div>
          <span className="font-bold text-slate-800 dark:text-white text-lg tracking-tight">FinanceIQ</span>
        </div>
        <p className="text-xs text-slate-400 pl-9">Personal Finance Tracker</p>
      </div>

      <nav className="flex flex-col gap-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${activeTab === id
                ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
          <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">Role</p>
          <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            {["viewer", "admin"].map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium transition-all
                  ${role === r
                    ? "bg-emerald-500 text-white"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
              >
                {r === "admin" ? <ShieldCheck size={12} /> : <Eye size={12} />}
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            {role === "admin" ? "Can add & edit transactions" : "View only mode"}
          </p>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </aside>
  );
}