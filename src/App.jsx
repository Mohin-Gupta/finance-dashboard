import { AppProvider } from "./context/AppContext"
import { useApp } from "./context/AppContext"
import Dashboard from "./components/Dashboard"
import Transactions from "./components/Transactions"
import Insights from "./components/Insights"
import { LayoutDashboard, ArrowLeftRight, Lightbulb, Sun, Moon, ShieldCheck, Eye } from "lucide-react"

function Nav() {
  const { tab, setTab, darkMode, setDarkMode, role, setRole } = useApp()

  const tabs = [
    { id: "dashboard",    label: "Dashboard",    icon: LayoutDashboard },
    { id: "transactions", label: "Transactions", icon: ArrowLeftRight  },
    { id: "insights",     label: "Insights",     icon: Lightbulb       },
  ]

  return (
    <>
      <aside className="hidden md:flex flex-col w-52 shrink-0 border-r border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 min-h-screen p-4">
        <div className="mb-6 px-1">
          <p className="font-semibold text-stone-800 dark:text-stone-100 tracking-tight">FinanceIQ</p>
          <p className="text-xs text-stone-400 mt-0.5">Personal tracker</p>
        </div>

        <nav className="flex flex-col gap-0.5 flex-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full text-left transition-colors
                ${tab === id
                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 font-medium"
                  : "text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"}`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div className="flex flex-col gap-3 mt-6">
          <div>
            <p className="text-xs text-stone-400 mb-1.5 px-1">Role</p>
            <div className="flex border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden">
              {["viewer", "admin"].map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium transition-colors
                    ${role === r
                      ? "bg-amber-500 text-white"
                      : "text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"}`}
                >
                  {r === "admin" ? <ShieldCheck size={11} /> : <Eye size={11} />}
                  {r === "admin" ? "Admin" : "Viewer"}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            {darkMode ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors
              ${tab === id ? "text-amber-600 dark:text-amber-400" : "text-stone-400"}`}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
      </nav>
    </>
  )
}

function Main() {
  const { tab } = useApp()
  return (
    <main className="flex-1 overflow-auto pb-20 md:pb-0 bg-stone-50 dark:bg-stone-950">
      {tab === "dashboard"    && <Dashboard />}
      {tab === "transactions" && <Transactions />}
      {tab === "insights"     && <Insights />}
    </main>
  )
}

export default function App() {
  return (
    <AppProvider>
      <div className="flex min-h-screen">
        <Nav />
        <Main />
      </div>
    </AppProvider>
  )
}