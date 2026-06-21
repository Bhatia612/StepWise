const HistoryToggle = ({ showingHistory, onToggle }) => {
  return (
    <button className="history-toggle" onClick={onToggle}>
      <span className="history-toggle__icon">🕒</span>
      {showingHistory ? "Back to explainer" : "History"}
    </button>
  );
};

export default HistoryToggle;