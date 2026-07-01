import "../styles/EmptyState.scss";

const EXAMPLE_PROBLEMS = [
  "Given an array of integers, return indices of the two numbers that add up to a target.",
  "Given the root of a binary tree, return its maximum depth.",
  "Given a string s, find the length of the longest substring without repeating characters.",
  "Given a linked list, detect if it has a cycle.",
];

const EmptyState = ({ onSelect }) => {
  return (
    <div className="empty-state">
      <p className="empty-state__prompt">
        Paste any LeetCode-style problem above, or try one of these:
      </p>
      <div className="empty-state__examples">
        {EXAMPLE_PROBLEMS.map((problem, index) => (
          <button
            key={index}
            className="empty-state__example"
            onClick={() => onSelect(problem)}
          >
            {problem}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;