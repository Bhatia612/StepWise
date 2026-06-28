import groupByPattern from "../../../shared/utils/groupByPattern";
import formatRelativeTime from "../../../shared/utils/formatRelativeTime";
import "../styles/HistoryList.scss";

const difficultyColor = {
  easy: "#7FB348",
  medium: "#D9A441",
  hard: "#C75450",
};

const HistoryList = ({ history, loading, error, onSelect }) => {
  if (loading) return <p className="history-list__status">Loading history...</p>;
  if (error) return <p className="history-list__status">{error}</p>;
  if (history.length === 0) return <p className="history-list__status">No explanations yet.</p>;

  const grouped = groupByPattern(history);

  return (
    <div className="history-list">
      {grouped.map((group) => (
        <div className="history-list__group" key={group.pattern}>
          <div className="history-list__group-header">
            <span>{group.pattern}</span>
            <span className="history-list__group-count">{group.entries.length}</span>
          </div>

          {group.entries.map((item) => (
            <button
              className="history-list__item"
              key={item._id}
              onClick={() => onSelect(item)}
            >
              <span
                className="history-list__dot"
                style={{ background: difficultyColor[item.difficulty] }}
              />
              <span className="history-list__problem">{item.problem}</span>
              <span className="history-list__time">{formatRelativeTime(item.createdAt)}</span>
              <span className="history-list__chevron">›</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default HistoryList;