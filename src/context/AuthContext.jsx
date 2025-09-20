import React, { createContext, useState, useEffect, useContext } from "react";
import { loginUser, registerUser, getMe, logoutUser } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((user) => {
        setCurrentUser(user);
      })
      .catch(() => {
        setCurrentUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    const user = await loginUser(email, password);
    setCurrentUser(user);
  };

  const register = async (email, password, name) => {
    await registerUser(name, email, password);
    const user = await loginUser(email, password);
    setCurrentUser(user);
  };

  const logout = async () => {
    await logoutUser();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
