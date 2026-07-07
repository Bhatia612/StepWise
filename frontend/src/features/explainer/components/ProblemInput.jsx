import { useRef, useEffect } from "react";
import "../styles/ProblemInput.scss";

const ProblemInput = ({ onSubmit, loading, value, onChange }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleChange = (e) => {
    onChange(e.target.value);
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value || !value.trim()) return;
    onSubmit(value);
  };

  return (
    <form className="problem-input" onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        value={value}
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