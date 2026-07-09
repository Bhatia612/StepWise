import { useState } from "react";
import { explainProblemStream } from "../services/explainerService";

const useExplain = () => {
  const [data, setData] = useState(null);
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const explain = (problem) => {
    setLoading(true);
    setError(null);
    setStreamData(null);
    setData(null);

    explainProblemStream(
      problem,
      (event, payload) => {
        setStreamData((prev) => {
          const current = prev || {};

          if (event === "meta") {
            return { ...current, pattern: payload.pattern, difficulty: payload.difficulty };
          }
          if (event === "section") {
            return {
              ...current,
              sections: [...(current.sections || []), { title: payload.title, content: payload.content }],
            };
          }
          if (event === "trace") {
            return { ...current, trace: payload.steps, traceNote: payload.note };
          }
          if (event === "pitfalls") {
            return { ...current, pitfalls: payload.items };
          }
          if (event === "complexity") {
            return { ...current, complexity: payload };
          }
          return current;
        });
      },
      (finalData) => {
        setData(finalData);
        setStreamData(null);
        setLoading(false);
      },
      (err) => {
        if (err?.status === 401) {
          setError("Please sign in to explain a problem.");
        } else {
          setError("Something went wrong. Please try again.");
        }
        setLoading(false);
      }
    );
  };

  const reset = () => {
    setData(null);
    setStreamData(null);
    setError(null);
  };

  return { data, streamData, loading, error, explain, reset };
};

export default useExplain;