import { useState } from "react";
import { X } from "lucide-react";
import "../styles/PricingModal.scss";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const PACKS = [
  {
    id: "starter",
    name: "Starter",
    credits: 10,
    price: "$1.00",
    description: "10 explanations",
    highlight: false,
  },
  {
    id: "standard",
    name: "Standard",
    credits: 30,
    price: "$2.50",
    description: "30 explanations",
    highlight: true,
  },
  {
    id: "pro",
    name: "Pro",
    credits: 75,
    price: "$5.00",
    description: "75 explanations",
    highlight: false,
  },
];

const PricingModal = ({ onClose, outOfCredits = false }) => {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const handlePurchase = async (packId) => {
    setLoading(packId);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/payments/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ packId }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Something went wrong.");
        setLoading(null);
        return;
      }

      window.location.href = data.data.url;
    } catch (err) {
      setError("Could not connect to payment service. Try again.");
      setLoading(null);
    }
  };

  return (
    <div className="pricing-modal-overlay" onClick={onClose}>
      <div className="pricing-modal" onClick={(e) => e.stopPropagation()}>
        <button className="pricing-modal__close" onClick={onClose}>
          <X size={18} />
        </button>

        {outOfCredits && (
          <div className="pricing-modal__banner">
            ⚡ You've used all your credits — top up to keep going
          </div>
        )}

        <h2 className="pricing-modal__title">Get more credits</h2>
        <p className="pricing-modal__subtitle">
          Each credit = one explanation. Credits never expire.
        </p>

        {error && <p className="pricing-modal__error">{error}</p>}

        <div className="pricing-modal__packs">
          {PACKS.map((pack) => (
            <div
              key={pack.id}
              className={`pricing-modal__pack ${pack.highlight ? "pricing-modal__pack--highlight" : ""}`}
            >
              {pack.highlight && (
                <span className="pricing-modal__badge">Recommended</span>
              )}
              <h3 className="pricing-modal__pack-name">{pack.name}</h3>
              <p className="pricing-modal__pack-credits">{pack.credits} credits</p>
              <p className="pricing-modal__pack-price">{pack.price}</p>
              <p className="pricing-modal__pack-desc">{pack.description}</p>
              <button
                className="pricing-modal__pack-btn"
                onClick={() => handlePurchase(pack.id)}
                disabled={loading === pack.id}
              >
                {loading === pack.id ? "Redirecting..." : "Buy now"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingModal;