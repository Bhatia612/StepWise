import { useState, useEffect } from "react";
import { useAuth } from "../../../shared/context/AuthContext";
import useExplain from "../hooks/useExplain";
import useHistory from "../hooks/useHistory";
import ProblemInput from "../components/ProblemInput";
import ExplanationCard from "../components/ExplanationCard";
import ExplanationSkeleton from "../components/ExplanationSkeleton";
import HistoryToggle from "../components/HistoryToggle";
import HistoryList from "../components/HistoryList";
import EmptyState from "../components/EmptyState";
import GuestNudgeModal from "../../../shared/components/GuestNudgeModal";
import AuthModal from "../../../shared/components/AuthModal";
import "../styles/ExplainerPage.scss";

const GUEST_EXPLAIN_KEY = "sw_guest_explains";

const ExplainerPage = () => {
  const { user, updateGuestCredits } = useAuth();
  const { data, streamData, loading, error, explain, reset } = useExplain();
  const { history, loading: historyLoading, error: historyError, fetchHistory } = useHistory();
  const [showingHistory, setShowingHistory] = useState(false);
  const [selected, setSelected] = useState(null);
  const [problem, setProblem] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  const [fromExample, setFromExample] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [hardBlock, setHardBlock] = useState(false);

  useEffect(() => {
    setTransitioning(true);

    const timer = setTimeout(() => {
      setShowingHistory(false);
      setSelected(null);
      setProblem("");
      setFromExample(false);
      setShowNudge(false);
      reset();
      setTransitioning(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [user?.id]);

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
      const remaining = Math.max(0, 3 - count);
      updateGuestCredits(remaining);

      if (count === 1) {
        setShowNudge(true);
      }
    }
  }, [data]);

  const submitProblem = (problemText) => {
    const count = parseInt(localStorage.getItem(GUEST_EXPLAIN_KEY) || "0");
    if (!user && count >= 3) {
      setHardBlock(true);
      setShowNudge(true);
      return;
    }
    setShowingHistory(false);
    setSelected(null);
    setFromExample(false);
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
    setFromExample(true);
    setShowingHistory(false);
    setSelected(null);
    explain(problemText);
  };

  const handleBackToExamples = () => {
    setFromExample(false);
    setProblem("");
    reset();
  };

  const handleToggle = () => {
    if (!showingHistory) fetchHistory();
    setShowingHistory(!showingHistory);
    setSelected(null);
  };

  const handleSelect = (item) => {
    setSelected(item);
    setShowingHistory(false);
  };

  const handleBack = () => {
    setSelected(null);
    setShowingHistory(true);
  };

  const displayedExplanation = selected || data;
  const showEmptyState = !displayedExplanation && !loading && !showingHistory;

  if (transitioning) {
    return (
      <div className="explainer-page">
        <div className="explainer-page__hero">
          <h1 className="explainer-page__title">StepWise</h1>
          <p className="explainer-page__tagline">Understand the problem before you write the code.</p>
        </div>
        <ExplanationSkeleton />
      </div>
    );
  }

  return (
    <div className="explainer-page">
      <div className="explainer-page__hero">
        <h1 className="explainer-page__title">StepWise</h1>
        <p className="explainer-page__tagline">Understand the problem before you write the code.</p>
      </div>

      <ProblemInput
        onSubmit={submitProblem}
        loading={loading}
        value={problem}
        onChange={setProblem}
      />

      {selected ? (
        <button className="explainer-page__back" onClick={handleBack}>
          ‹ Back to history
        </button>
      ) : fromExample && data ? (
        <button className="explainer-page__back" onClick={handleBackToExamples}>
          ‹ Back to examples
        </button>
      ) : (
        <div className="explainer-page__toggle-row">
          <HistoryToggle showingHistory={showingHistory} onToggle={handleToggle} />
        </div>
      )}

      {error && <p className="explainer-page__error">{error}</p>}

      {showingHistory ? (
        <HistoryList
          history={history}
          loading={historyLoading}
          error={historyError}
          onSelect={handleSelect}
        />
      ) : loading ? (
        <ExplanationCard explanation={streamData} streaming={true} />
      ) : showEmptyState ? (
        <EmptyState onSelect={handleExampleClick} />
      ) : (
        <ExplanationCard explanation={displayedExplanation} />
      )}

      {showNudge && (
        <GuestNudgeModal
          onClose={() => {
            setShowNudge(false);
            setHardBlock(false);
          }}
          onSignUp={() => {
            setShowNudge(false);
            setHardBlock(false);
            setShowAuthModal(true);
          }}
          hardBlock={hardBlock}
        />
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
};

export default ExplainerPage;