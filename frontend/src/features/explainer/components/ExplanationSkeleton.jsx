import "../styles/ExplanationSkeleton.scss";

const ExplanationSkeleton = () => {
  return (
    <div className="explanation-skeleton">
      <div className="explanation-skeleton__meta">
        <div className="explanation-skeleton__chip" />
        <div className="explanation-skeleton__chip explanation-skeleton__chip--sm" />
      </div>

      <div className="explanation-skeleton__section" />
      <div className="explanation-skeleton__section explanation-skeleton__section--tall" />
      <div className="explanation-skeleton__section" />

      <div className="explanation-skeleton__complexity">
        <div className="explanation-skeleton__complexity-item" />
        <div className="explanation-skeleton__complexity-item" />
      </div>
    </div>
  );
};

export default ExplanationSkeleton;