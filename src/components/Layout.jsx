import { useApp } from "../context/AppContext";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import Transactions from "./Transactions";
import Insights from "./Insights";

export default function Layout() {
  const { activeTab, darkMode } = useApp();

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen`}>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "transactions" && <Transactions />}
          {activeTab === "insights" && <Insights />}
        </main>
      </div>
    </div>
  );
}