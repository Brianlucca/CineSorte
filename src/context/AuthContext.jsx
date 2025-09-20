import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser, getMe } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe().then(user => {
      setCurrentUser(user);
    }).catch(() => {
      setCurrentUser(null);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const login = async (email, password) => {
    const userResponse = await loginUser(email, password);
    try {
      await getMe();
      setCurrentUser({ uid: userResponse.uid, email: userResponse.email, name: userResponse.name });
    } catch (verifyError) {
      throw new Error('COOKIE_BLOCKED');
    }
  };

  const register = async (email, password, name) => {
    await registerUser(name, email, password);
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
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