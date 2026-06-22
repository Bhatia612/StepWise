import { Clock, ArrowLeft } from "lucide-react";

const HistoryToggle = ({ showingHistory, onToggle }) => {
  return (
    <button className="history-toggle" onClick={onToggle}>
      {showingHistory ? (
        <>
          <ArrowLeft size={15} />
          Back to explainer
        </>
      ) : (
        <>
          <Clock size={15} />
          History
        </>
      )}
    </button>
  );
};

export default HistoryToggle;