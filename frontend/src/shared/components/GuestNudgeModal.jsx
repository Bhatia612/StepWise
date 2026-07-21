import { X } from "lucide-react";
import "../styles/GuestNudgeModal.scss";

const GuestNudgeModal = ({ onClose, onSignUp, hardBlock = false }) => {
  return (
    <div className="nudge-overlay" onClick={hardBlock ? undefined : onClose}>
      <div className="nudge-modal" onClick={(e) => e.stopPropagation()}>
        {!hardBlock && (
          <button className="nudge-modal__close" onClick={onClose}>
            <X size={18} />
          </button>
        )}

        <h2 className="nudge-modal__title">
          {hardBlock ? "You've used your free explains" : "Enjoying StepWise?"}
        </h2>
        <p className="nudge-modal__text">
          {hardBlock
            ? "Sign up to keep going. It's free — and your explanation history carries over automatically."
            : "Sign up to keep your explanation history permanently. Your progress carries over automatically when you create an account."}
        </p>

        <div className="nudge-modal__actions">
          <button className="nudge-modal__signup" onClick={onSignUp}>
            Sign up — it's free
          </button>
          <button
            className="nudge-modal__dismiss"
            onClick={onClose}
            disabled={hardBlock}
          >
            Continue as guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestNudgeModal;