import api from "./api";

export const signup = async (username, email, password) => {
    const response = await api.post("/auth/signup", { username, email, password })
    return response.data
}


export const login = async (identifier, password) => {
    const response = await api.post("/auth/login", { identifier, password })
    return response.data

}

export const logout = async () => {
    const response = await api.post("/auth/logout")
    return response.data
}