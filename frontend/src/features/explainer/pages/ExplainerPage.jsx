import { useState } from "react";
import useExplain from "../hooks/useExplain";
import useHistory from "../hooks/useHistory";
import ProblemInput from "../components/ProblemInput";
import ExplanationCard from "../components/ExplanationCard";
import HistoryToggle from "../components/HistoryToggle";
import HistoryList from "../components/HistoryList";
import "../styles/ExplainerPage.scss";

const ExplainerPage = () => {
  const { data, loading, error, explain } = useExplain();
  const { history, loading: historyLoading, error: historyError, fetchHistory } = useHistory();
  const [showingHistory, setShowingHistory] = useState(false);
  const [selected, setSelected] = useState(null);

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

  return (
    <div className="explainer-page">
      <div className="explainer-page__hero">
        <h1 className="explainer-page__title">StepWise</h1>
        <p className="explainer-page__tagline">Understand the problem before you write the code.</p>
      </div>

      <ProblemInput onSubmit={explain} loading={loading} />

      <div className="explainer-page__toggle-row">
        <HistoryToggle showingHistory={showingHistory} onToggle={handleToggle} />
      </div>

      {error && <p className="explainer-page__error">{error}</p>}

      {selected && (
        <button className="explainer-page__back" onClick={handleBack}>
          ‹ Back to history
        </button>
      )}

      {showingHistory ? (
        <HistoryList
          history={history}
          loading={historyLoading}
          error={historyError}
          onSelect={handleSelect}
        />
      ) : (
        <ExplanationCard explanation={displayedExplanation} />
      )}
    </div>
  );
};

export default ExplainerPage;