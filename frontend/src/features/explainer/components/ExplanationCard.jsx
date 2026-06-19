function ExplanationCard({ explanation }) {
    if (!explanation) return null;
    return (
        <div className="explanation-card">
            <h3>Approach</h3>
            <p>{explanation.approach}</p>

            <h3>Explanation</h3>
            <p>{explanation.explanation}</p>

            <h3>Complexity</h3>
            <p>Time: {explanation.complexity.time}</p>
            <p>Space: {explanation.complexity.space}</p>
        </div>
    )
}

export default ExplanationCard