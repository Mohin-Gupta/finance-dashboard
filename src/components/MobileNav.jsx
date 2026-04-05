import { useState } from "react"
import { useApp } from "../context/AppContext"
import { Sun, Moon, ShieldCheck, Eye, MoreHorizontal, X } from "lucide-react"
import { NAV_TABS } from "../constants"

export default function MobileNav() {
  const { tab, setTab, darkMode, setDarkMode, role, setRole } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-900">
        {NAV_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setTab(id); setMenuOpen(false) }}
            className={
              "flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors " +
              (tab === id ? "text-amber-600 dark:text-amber-400" : "text-stone-400")
            }
          >
            <Icon size={20} />
            {label}
          </button>
        ))}

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className={
            "flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors " +
            (menuOpen ? "text-amber-600 dark:text-amber-400" : "text-stone-400")
          }
        >
          {menuOpen ? <X size={20} /> : <MoreHorizontal size={20} />}
          More
        </button>
      </nav>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden dark:bg-black/50"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Slide-up panel */}
      {menuOpen && (
        <div className="fixed bottom-[57px] left-0 right-0 z-50 md:hidden rounded-t-2xl border-t shadow-xl border-stone-200 bg-white px-5 pb-6 pt-4 dark:border-stone-800 dark:bg-stone-900">
          <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-stone-200 dark:bg-stone-700" />

          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-400">
            Settings
          </p>

          {/* Role switcher */}
          <div className="mb-4">
            <p className="mb-2 text-xs text-stone-500 dark:text-stone-400">Switch Role</p>
            <div className="flex gap-2">
              {[
                { id: "viewer", label: "Viewer", Icon: Eye },
                { id: "admin", label: "Admin", Icon: ShieldCheck },
              ].map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setRole(id)}
                  className={
                    "flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all " +
                    (role === id
                      ? "bg-amber-500 text-white"
                      : "bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400")
                  }
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-stone-400">
              {role === "admin" ? "Can add, edit & delete transactions" : "Read-only access"}
            </p>
          </div>

          <div className="mb-4 h-px bg-stone-100 dark:bg-stone-800" />

          {/* Dark mode toggle */}
          <div>
            <p className="mb-2 text-xs text-stone-500 dark:text-stone-400">Appearance</p>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex w-full items-center justify-between rounded-xl bg-stone-100 px-4 py-3 dark:bg-stone-800"
            >
              <div className="flex items-center gap-2.5">
                {darkMode ? (
                  <Sun size={16} className="text-amber-500" />
                ) : (
                  <Moon size={16} className="text-stone-500" />
                )}
                <span className="text-sm text-stone-700 dark:text-stone-300">
                  {darkMode ? "Light mode" : "Dark mode"}
                </span>
              </div>
              <div className={`relative h-5 w-10 rounded-full transition-colors ${darkMode ? "bg-amber-500" : "bg-stone-300"}`}>
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${darkMode ? "left-5" : "left-0.5"}`} />
              </div>
            </button>
          </div>
        </div>
      )}
    </>
  )
}