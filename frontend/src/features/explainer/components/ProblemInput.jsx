import { useState, useRef } from "react";
import "../styles/ProblemInput.scss";

const ProblemInput = ({ onSubmit, loading }) => {
  const [problem, setProblem] = useState("");
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    setProblem(e.target.value);

    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!problem || !problem.trim()) return;
    onSubmit(problem);
  };

  return (
    <form className="problem-input" onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        value={problem}
        onChange={handleChange}
        placeholder="Paste your DSA problem here..."
        rows={1}
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