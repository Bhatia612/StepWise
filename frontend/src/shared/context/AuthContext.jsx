import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api"

const AuthContext = craeteContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const checkAuth = async () => {
        try {
            const response = await api.get("/auth/me");
            setUser(response.data.data)

        } catch (error) {
            setUser(null)

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    const login = (userData) => {
        setUser(userData)
    }

    const logout = async () => {
        await api.post("/auth/logout");
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = useContext(AuthContext)