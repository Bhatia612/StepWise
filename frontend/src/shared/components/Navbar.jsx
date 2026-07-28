import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import AuthModal from "./AuthModal";
import PricingModal from "./PricingModal";
import "../styles/Navbar.scss";

const Navbar = ({ onToggleSidebar, sidebarOpen }) => {
  const { user, guestCredits } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar__left">
          <button
            className="navbar__menu-toggle"
            onClick={onToggleSidebar}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>
          {user && <span className="navbar__logo">StepWise</span>}
        </div>
        <div className="navbar__links">
          {user ? (
            <button
              className="navbar__credits"
              onClick={() => setShowPricing(true)}
            >
              ⚡ {user.credits} credits
            </button>
          ) : (
            <>
              {guestCredits !== null && (
                <span className="navbar__guest-credits">
                  ⚡ {guestCredits} free credits
                </span>
              )}
              <button
                className="navbar__link navbar__link--accent"
                onClick={() => setShowAuthModal(true)}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </nav>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
    </>
  );
};

export default Navbar;