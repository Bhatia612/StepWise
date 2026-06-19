import { useState } from "react";
import { explainProblem } from "../services/explainerService";

const useExplain = () => {
    const [date, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const explain = async (problem) => {
        setLoading(true);
        setError(null);

        try {
            const response = await explainProblem(problem)
            setData(response.data)
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong . . .")
        } finally {
            setLoading(false)
        }

    }


    return { data, loading, error, explain }
}

export default useExplain