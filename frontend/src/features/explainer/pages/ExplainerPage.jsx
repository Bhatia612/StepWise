import { useState, useEffect } from "react";
import { useAuth } from "../../../shared/context/AuthContext";
import useExplain from "../hooks/useExplain";
import useHistory from "../hooks/useHistory";
import ProblemInput from "../components/ProblemInput";
import ExplanationCard from "../components/ExplanationCard";
import HistoryToggle from "../components/HistoryToggle";
import HistoryList from "../components/HistoryList";
import EmptyState from "../components/EmptyState";
import ExplanationSkeleton from "../components/ExplanationSkeleton";
import "../styles/ExplainerPage.scss";

const ExplainerPage = () => {
  const { user } = useAuth();
  const { data, loading, error, explain, reset } = useExplain();
  const { history, loading: historyLoading, error: historyError, fetchHistory } = useHistory();
  const [showingHistory, setShowingHistory] = useState(false);
  const [selected, setSelected] = useState(null);
  const [problem, setProblem] = useState("");
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    setTransitioning(true);

    const timer = setTimeout(() => {
      setShowingHistory(false);
      setSelected(null);
      setProblem("");
      reset();
      setTransitioning(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [user]);


  const submitProblem = (problemText) => {
    setShowingHistory(false);
    setSelected(null);
    explain(problemText);
  };

  const handleExampleClick = (problemText) => {
    setProblem(problemText);
    submitProblem(problemText);
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
        <ExplanationSkeleton />
      ) : showEmptyState ? (
        <EmptyState onSelect={handleExampleClick} />
      ) : (
        <ExplanationCard explanation={displayedExplanation} />
      )}
    </div>
  );
};

export default ExplainerPage;