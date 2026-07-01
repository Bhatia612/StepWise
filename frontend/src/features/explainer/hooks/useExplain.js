import { useState } from "react";
import { explainProblem } from "../services/explainerService";

const useExplain = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const explain = async (problem) => {
        setLoading(true);
        setError(null);

        try {
            const result = await explainProblem(problem);
            setData(result.data);
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Please sign in to explain a problem.");
            } else {
                setError(err.response?.data?.message || "Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setData(null);
        setError(null);
    };

    return { data, loading, error, explain, reset };
};

export default useExplain;