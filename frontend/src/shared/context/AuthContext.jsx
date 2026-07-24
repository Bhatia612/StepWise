import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guestCredits, setGuestCredits] = useState(null);

  const checkAuth = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setGuestCredits(null);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  const updateCredits = (newCount) => {
    setUser((prev) => ({ ...prev, credits: newCount }));
  };

  const updateGuestCredits = (count) => {
    setGuestCredits(count);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      updateCredits,
      guestCredits,
      updateGuestCredits,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);