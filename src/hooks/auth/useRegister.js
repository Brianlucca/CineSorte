import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export const useRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
  });

  const { register } = useAuth();

  useEffect(() => {
    setPasswordChecks({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /\d/.test(password),
    });
  }, [password]);

  const allChecksPassed = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('As senhas não coincidem.');
    }
    
    if (!allChecksPassed) {
      return setError('Por favor, cumpra todos os requisitos da senha.');
    }

    setLoading(true);
    try {
      await register(email, password, name);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Este email já está cadastrado.');
      } else {
        setError('Falha ao criar conta. Verifique os dados e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    name, setName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    error,
    loading,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    passwordChecks,
    allChecksPassed,
    handleSubmit,
  };
};
