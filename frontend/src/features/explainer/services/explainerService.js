import api from "../../shared/services/api"

export const explainProblem = async (problem) => {
    const response = await api.post("/explain", { problem });
    return response.data
}

export const getAllExplanations = async () => {
    const response = await api.get("/explanations");
    return response.data
}

export const getExplanationById = async (id) => {
    const response = await api.get(`/explanations/${id}`);
    return response.data
}