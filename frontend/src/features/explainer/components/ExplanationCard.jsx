import "../styles/ExplanationCard.scss";

const ExplanationCard = ({ explanation }) => {
    if (!explanation) return null;

    return (
        <div className="explanation-card">
            <div className="explanation-card__section">
                <p className="explanation-card__label">Approach</p>
                <p className="explanation-card__text">{explanation.approach}</p>
            </div>

            <div className="explanation-card__section">
                <p className="explanation-card__label">Explanation</p>
                <p className="explanation-card__text">{explanation.explanation}</p>
            </div>

            <div className="explanation-card__section">
                <p className="explanation-card__label">Complexity</p>
                <div className="explanation-card__complexity">
                    <div className="explanation-card__complexity-item">
                        <span className="explanation-card__complexity-label">Time</span>
                        <span className="explanation-card__complexity-value">{explanation.complexity.time}</span>
                    </div>
                    <div className="explanation-card__complexity-item">
                        <span className="explanation-card__complexity-label">Space</span>
                        <span className="explanation-card__complexity-value">{explanation.complexity.space}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExplanationCard;