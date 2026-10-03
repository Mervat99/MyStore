import { createContext, useState, useContext } from "react";
import API from "../api/axios.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Read user data from localStorage when the app first loads (if already logged in)
  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem("userInfo");
    return saved ? JSON.parse(saved) : null;
  });

  // Log in
  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });
    localStorage.setItem("userInfo", JSON.stringify(data));
    setUserInfo(data);
    return data;
  };

  // Register a new account
  const register = async (name, email, password) => {
    const { data } = await API.post("/auth/register", { name, email, password });
    localStorage.setItem("userInfo", JSON.stringify(data));
    setUserInfo(data);
    return data;
  };

  // Log out
  const logout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Shortcut hook to use the context easily in any component
export const useAuth = () => useContext(AuthContext);