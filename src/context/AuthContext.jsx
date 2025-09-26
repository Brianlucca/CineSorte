import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser, getMe, logoutUser } from '../services/api';
import LoadingScreen from '../components/layouts/LoadingScreen';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const maxRetries = 5;
    let attempt = 1;

    const verifyUser = async () => {
      try {
        const user = await getMe();
        setCurrentUser(user);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setCurrentUser(null);
          setLoading(false);
        } else if (attempt < maxRetries) {
          attempt++;
          setTimeout(verifyUser, 3000);
        } else {
          setCurrentUser(null);
          setLoading(false);
        }
      }
    };

    verifyUser();
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

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

