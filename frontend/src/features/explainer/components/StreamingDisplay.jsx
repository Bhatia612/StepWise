import "../styles/StreamingDisplay.scss";

const StreamingDisplay = ({ text }) => {
  return (
    <div className="streaming-display">
      {text ? (
        <pre className="streaming-display__text">{text}</pre>
      ) : (
        <div className="streaming-display__skeleton">
          <div className="streaming-display__bar" />
          <div className="streaming-display__bar streaming-display__bar--md" />
          <div className="streaming-display__bar streaming-display__bar--sm" />
        </div>
      )}
    </div>
  );
};

export default StreamingDisplay;