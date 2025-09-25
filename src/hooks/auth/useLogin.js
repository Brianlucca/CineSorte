import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      if (err.message === 'COOKIE_BLOCKED') {
        setError('COOKIES_BLOQUEADOS');
      } else {
        setError('Email ou senha inválidos.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    showPassword,
    setShowPassword,
    handleSubmit,
  };
};
