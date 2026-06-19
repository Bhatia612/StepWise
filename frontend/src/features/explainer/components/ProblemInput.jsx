import { useState } from "react";
import "../styles/ProblemInput.scss";

const ProblemInput = ({ onSubmit, loading }) => {
  const [problem, setProblem] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!problem || !problem.trim()) return;
    onSubmit(problem);
  };

  return (
    <form className="problem-input" onSubmit={handleSubmit}>
      <textarea
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
        placeholder="Paste your DSA problem here..."
        rows={6}
      />
      <div className="problem-input__footer">
        <button className="problem-input__button" type="submit" disabled={loading}>
          {loading ? "Thinking..." : "Explain"}
        </button>
      </div>
    </form>
  );
};

export default ProblemInput;