import { useState, useRef } from "react";
import { useAuth } from "../../../shared/context/AuthContext";
import { explainProblemStream } from "../services/explainerService";

const useExplain = () => {
  const { updateCredits } = useAuth();
  const [data, setData] = useState(null);
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const explain = (problem) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);
    setStreamData(null);
    setData(null);

    explainProblemStream(
      problem,
      abortControllerRef.current.signal,
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
      (finalData, creditsRemaining) => {
        setData(finalData);
        setStreamData(null);
        if (creditsRemaining !== undefined) {
          updateCredits(creditsRemaining);
        }
        setLoading(false);
      },
      (err) => {
        if (err?.name === "AbortError") return;
        if (err?.status === 401) {
          setError("Please sign in to explain a problem.");
        } else if (err?.code === "NO_CREDITS") {
          setError("NO_CREDITS");
        } else {
          setError("Something went wrong. Please try again.");
        }
        setLoading(false);
      }
    );
  };

  const reset = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setData(null);
    setStreamData(null);
    setError(null);
  };

  return { data, streamData, loading, error, explain, reset };
};

export default useExplain;