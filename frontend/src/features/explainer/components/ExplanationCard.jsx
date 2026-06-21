import "../styles/ExplanationCard.scss";

const difficultyColor = {
  easy: "#7FB348",
  medium: "#D9A441",
  hard: "#C75450",
};

const ExplanationCard = ({ explanation }) => {
  if (!explanation) return null;

  return (
    <div className="explanation-card">
      <div className="explanation-card__meta">
        <span className="explanation-card__chip explanation-card__chip--pattern">
          {explanation.pattern}
        </span>
        <span
          className="explanation-card__chip explanation-card__chip--difficulty"
          style={{ "--difficulty-color": difficultyColor[explanation.difficulty] }}
        >
          {explanation.difficulty}
        </span>
      </div>

      {explanation.sections.map((section, index) => (
        <div className="explanation-card__section" key={index}>
          <p className="explanation-card__section-label">{section.title}</p>
          <p className="explanation-card__section-text">{section.content}</p>
        </div>
      ))}

      {explanation.trace?.length > 0 && (
        <div className="explanation-card__trace">
          {explanation.trace.map((item, index) => (
            <div className="explanation-card__trace-row" key={index}>
              <span className="explanation-card__trace-step">{item.step}</span>
              <p className="explanation-card__trace-detail">{item.detail}</p>
            </div>
          ))}
          {explanation.traceNote && (
            <p className="explanation-card__trace-note">{explanation.traceNote}</p>
          )}
        </div>
      )}

      {explanation.pitfalls?.length > 0 && (
        <div className="explanation-card__pitfalls">
          <p className="explanation-card__pitfalls-title">Common pitfalls</p>
          <ul>
            {explanation.pitfalls.map((pitfall, index) => (
              <li key={index}>{pitfall}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="explanation-card__complexity">
        <div className="explanation-card__complexity-item">
          <span className="explanation-card__complexity-label">Time</span>
          <span className="explanation-card__complexity-value">{explanation.complexity.time}</span>
          <span className="explanation-card__complexity-reason">{explanation.complexity.timeReason}</span>
        </div>
        <div className="explanation-card__complexity-item">
          <span className="explanation-card__complexity-label">Space</span>
          <span className="explanation-card__complexity-value">{explanation.complexity.space}</span>
          <span className="explanation-card__complexity-reason">{explanation.complexity.spaceReason}</span>
        </div>
      </div>
    </div>
  );
};

export default ExplanationCard;