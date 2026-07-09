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
import "../styles/ExplainerPage.scss";
import StreamingDisplay from "../components/StreamingDisplay";

const ExplainerPage = () => {
  const { user } = useAuth();
  const { data, streamData, loading, error, explain, reset } = useExplain();
  const { history, loading: historyLoading, error: historyError, fetchHistory } = useHistory();
  const [showingHistory, setShowingHistory] = useState(false);
  const [selected, setSelected] = useState(null);
  const [problem, setProblem] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  const [fromExample, setFromExample] = useState(false);

  useEffect(() => {
    setTransitioning(true);

    const timer = setTimeout(() => {
      setShowingHistory(false);
      setSelected(null);
      setProblem("");
      setFromExample(false);
      reset();
      setTransitioning(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [user]);

  const submitProblem = (problemText) => {
    setShowingHistory(false);
    setSelected(null);
    setFromExample(false);
    explain(problemText);
  };

  const handleExampleClick = (problemText) => {
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
    </div>
  );
};

export default ExplainerPage;