import { useApp } from "../context/AppContext"
import { Sun, Moon, ShieldCheck, Eye } from "lucide-react"
import { NAV_TABS } from "../constants"

export default function Sidebar() {
  const { tab, setTab, darkMode, setDarkMode, role, setRole } = useApp()

  return (
    <aside className="hidden md:flex flex-col w-52 shrink-0 min-h-screen p-4 border-r border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900">
      <div className="mb-6 px-1">
        <p className="font-semibold tracking-tight text-stone-800 dark:text-stone-100">
          FinanceIQ
        </p>
        <p className="mt-0.5 text-xs text-stone-400">Personal tracker</p>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5">
        {NAV_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={
              "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors " +
              (tab === id
                ? "bg-amber-100 font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                : "text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800")
            }
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-6 flex flex-col gap-3">
        <div>
          <p className="mb-1.5 px-1 text-xs text-stone-400">Role</p>
          <div className="flex overflow-hidden rounded-lg border border-stone-200 dark:border-stone-700">
            {["viewer", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={
                  "flex flex-1 items-center justify-center gap-1 py-1.5 text-xs font-medium transition-colors " +
                  (role === r
                    ? "bg-amber-500 text-white"
                    : "text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800")
                }
              >
                {r === "admin" ? <ShieldCheck size={11} /> : <Eye size={11} />}
                {r === "admin" ? "Admin" : "Viewer"}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 transition-colors"
        >
          {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          {darkMode ? "Light mode" : "Dark mode"}
        </button>
      </div>
    </aside>
  )
}