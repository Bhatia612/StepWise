import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import PricingModal from "./PricingModal";
import "../styles/Navbar.scss";

const Navbar = ({ onToggleSidebar }) => {
  const { user, guestCredits } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar__left">
          {user && (
            <span className="navbar__logo">StepWise</span>
          )}
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
                  ⚡ {guestCredits} free left
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