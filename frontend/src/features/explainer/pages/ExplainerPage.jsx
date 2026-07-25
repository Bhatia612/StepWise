import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../shared/context/AuthContext";
import useExplain from "../hooks/useExplain";
import ProblemInput from "../components/ProblemInput";
import ExplanationCard from "../components/ExplanationCard";
import ExplanationSkeleton from "../components/ExplanationSkeleton";
import EmptyState from "../components/EmptyState";
import GuestNudgeModal from "../../../shared/components/GuestNudgeModal";
import AuthModal from "../../../shared/components/AuthModal";
import PricingModal from "../../../shared/components/PricingModal";
import "../styles/ExplainerPage.scss";

const GUEST_EXPLAIN_KEY = "sw_guest_explains";

const WELCOME_LINES = [
  "Hey! I'm StepWise, a DSA thinking coach.",
  "Paste any LeetCode-style problem below and I'll break down the pattern, the intuition, a step-by-step trace, common pitfalls, and complexity reasoning.",
  "I won't give you the solution. That's the point.",
];

const WelcomeMessage = () => {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < WELCOME_LINES.length) {
        setLines((prev) => [...prev, WELCOME_LINES[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="chat__welcome">
      {lines.map((line, index) => (
        <p key={index} className="chat__welcome-line">{line}</p>
      ))}
    </div>
  );
};

const ExplainerPage = ({ selectedHistory, onExplainComplete, onClearSelected }) => {
  const { user, updateGuestCredits } = useAuth();
  const { data, streamData, loading, error, explain, reset } = useExplain();
  const [problem, setProblem] = useState("");
  const [submittedProblem, setSubmittedProblem] = useState(null);
  const [showNudge, setShowNudge] = useState(false);
  const [hardBlock, setHardBlock] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (error === "NO_CREDITS") {
      setShowPaywall(true);
      reset();
    }
  }, [error]);

  useEffect(() => {
    if (!user) {
      const count = parseInt(localStorage.getItem(GUEST_EXPLAIN_KEY) || "0");
      updateGuestCredits(Math.max(0, 3 - count));
    }
  }, [user]);

  useEffect(() => {
    if (!user && data) {
      const count = parseInt(localStorage.getItem(GUEST_EXPLAIN_KEY) || "0") + 1;
      localStorage.setItem(GUEST_EXPLAIN_KEY, count);
      updateGuestCredits(Math.max(0, 3 - count));
      if (count === 1) setShowNudge(true);
    }
    if (data && onExplainComplete) {
      onExplainComplete();
    }
  }, [data]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data, streamData, loading]);

  const submitProblem = (problemText) => {
    const count = parseInt(localStorage.getItem(GUEST_EXPLAIN_KEY) || "0");
    if (!user && count >= 3) {
      setHardBlock(true);
      setShowNudge(true);
      return;
    }
    setSubmittedProblem(problemText);
    setProblem("");
    if (onClearSelected) onClearSelected();
    explain(problemText);
  };

  const handleExampleClick = (problemText) => {
    const count = parseInt(localStorage.getItem(GUEST_EXPLAIN_KEY) || "0");
    if (!user && count >= 3) {
      setHardBlock(true);
      setShowNudge(true);
      return;
    }
    setProblem(problemText);
    setSubmittedProblem(problemText);
    if (onClearSelected) onClearSelected();
    explain(problemText);
  };

  const displayedExplanation = selectedHistory || data;
  const displayedProblem = selectedHistory?.problem || submittedProblem;
  const showEmptyState = !displayedExplanation && !loading && !submittedProblem;

  return (
    <div className="explainer-page">
      <div className="chat">
        <WelcomeMessage />

        {showEmptyState && (
          <EmptyState onSelect={handleExampleClick} />
        )}

        {displayedProblem && (
          <div className="chat__user-bubble">
            <p>{displayedProblem}</p>
          </div>
        )}

        {loading && (
          <div className="chat__response">
            <ExplanationCard explanation={streamData} streaming={true} />
          </div>
        )}

        {!loading && displayedExplanation && (
          <div className="chat__response">
            <ExplanationCard explanation={displayedExplanation} />
          </div>
        )}

        {error && error !== "NO_CREDITS" && (
          <p className="chat__error">{error}</p>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="explainer-page__input-bar">
        <ProblemInput
          onSubmit={submitProblem}
          loading={loading}
          value={problem}
          onChange={setProblem}
        />
      </div>

      {showNudge && (
        <GuestNudgeModal
          onClose={() => { setShowNudge(false); setHardBlock(false); }}
          onSignUp={() => { setShowNudge(false); setHardBlock(false); setShowAuthModal(true); }}
          hardBlock={hardBlock}
        />
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showPaywall && <PricingModal onClose={() => setShowPaywall(false)} outOfCredits={true} />}
    </div>
  );
};

export default ExplainerPage;