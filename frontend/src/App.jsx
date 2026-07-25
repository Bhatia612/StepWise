import { useEffect, useState } from "react";
import Navbar from "./shared/components/Navbar";
import Sidebar from "./shared/components/Sidebar";
import ExplainerPage from "./features/explainer/pages/ExplainerPage";
import Toast from "./shared/components/Toast";
import { useAuth } from "./shared/context/AuthContext";
import { getAllExplanations } from "./features/explainer/services/explainerService";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const AppContent = () => {
  const { updateCredits } = useAuth();
  const [toast, setToast] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const result = await getAllExplanations();
      setHistory(result.data || []);
    } catch (err) {
      setHistoryError("Could not load history");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const credits = params.get("credits");

    if (path === "/payment/success") {
      fetch(`${API_BASE}/payments/credits`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) updateCredits(data.data.credits);
        });

      if (credits) setToast(`${credits} credits added to your account!`);
      window.history.replaceState({}, "", "/");
    }

    if (path === "/payment/cancel") {
      setToast("Payment cancelled - no charges made.");
      window.history.replaceState({}, "", "/");
    }
  }, []);

  return (
    <div className="app-layout">
      <Sidebar
        history={history}
        historyLoading={historyLoading}
        historyError={historyError}
        onSelectHistory={(item) => setSelectedHistory(item)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {sidebarOpen && (
        <div
          className="app-layout__overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="app-layout__main">
        <Navbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          sidebarOpen={sidebarOpen}
        />
        <ExplainerPage
          selectedHistory={selectedHistory}
          onExplainComplete={fetchHistory}
          onClearSelected={() => setSelectedHistory(null)}
        />
      </div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
};

function App() {
  return <AppContent />;
}

export default App;