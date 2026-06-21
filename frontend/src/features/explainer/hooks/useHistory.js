import { useState } from "react";
import { getAllExplanations } from "../services/explainerService";

const useHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getAllExplanations();
      setHistory(result.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load history");
    } finally {
      setLoading(false);
    }
  };

  return { history, loading, error, fetchHistory };
};

export default useHistory;