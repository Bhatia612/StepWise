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

  useEffect(() => {
    setShowingHistory(false);
    setSelected(null);
    reset();
  }, [user]);

  const handleExplainSubmit = (problem) => {
    setShowingHistory(false);
    setSelected(null);
    explain(problem);
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

  return (
    <div className="explainer-page">
      <div className="explainer-page__hero">
        <h1 className="explainer-page__title">StepWise</h1>
        <p className="explainer-page__tagline">Understand the problem before you write the code.</p>
      </div>

      <ProblemInput onSubmit={handleExplainSubmit} loading={loading} />

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
        <EmptyState onSelect={handleExplainSubmit} />
      ) : (
        <ExplanationCard explanation={displayedExplanation} />
      )}
    </div>
  );
};

export default ExplainerPage;