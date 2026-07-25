import { useEffect, useState } from "react";
import Navbar from "./shared/components/Navbar";
import ExplainerPage from "./features/explainer/pages/ExplainerPage";
import Toast from "./shared/components/Toast";
import { useAuth } from "./shared/context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const AppContent = () => {
  const { updateCredits } = useAuth();
  const [toast, setToast] = useState(null);

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

      if (credits) {
        setToast(`${credits} credits added to your account!`);
      }

      window.history.replaceState({}, "", "/");
    }

    if (path === "/payment/cancel") {
      setToast("Payment cancelled — no charges made.");
      window.history.replaceState({}, "", "/");
    }
  }, []);

  return (
    <>
      <Navbar />
      <ExplainerPage />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
};

function App() {
  return <AppContent />;
}

export default App;