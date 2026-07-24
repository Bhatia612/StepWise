import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import "../styles/Navbar.scss";

const Navbar = () => {
  const { user, logout, guestCredits } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <nav className="navbar">
        <span className="navbar__logo">StepWise</span>
        <div className="navbar__links">
          {user ? (
            <>
              {user.credits !== undefined && (
                <span className="navbar__credits">
                  ⚡ {user.credits} credits
                </span>
              )}
              <span className="navbar__username">{user.username}</span>
              <button className="navbar__link navbar__link--accent" onClick={logout}>
                Log out
              </button>
            </>
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
    </>
  );
};

export default Navbar;