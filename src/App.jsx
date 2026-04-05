import { AppProvider, useApp } from "./context/AppContext"
import Sidebar from "./components/Sidebar"
import MobileNav from "./components/MobileNav"
import Dashboard from "./components/Dashboard"
import Transactions from "./components/Transactions"
import Insights from "./components/Insights"

function PageContent() {
  const { tab } = useApp()
  return (
    <main className="flex-1 overflow-auto pb-20 md:pb-0 bg-stone-50 dark:bg-stone-950">
      {tab === "dashboard" && <Dashboard />}
      {tab === "transactions" && <Transactions />}
      {tab === "insights" && <Insights />}
    </main>
  )
}

export default function App() {
  return (
    <AppProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <MobileNav />
        <PageContent />
      </div>
    </AppProvider>
  )
}