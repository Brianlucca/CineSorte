import React from 'react';
import { useRegister } from '../../hooks/auth/useRegister'
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const PasswordRequirement = ({ label, met }) => (
  <div className={`flex items-center text-xs transition-colors ${met ? 'text-green-400' : 'text-slate-500'}`}>
    {met ? <CheckCircleIcon className="w-4 h-4 mr-2" /> : <XCircleIcon className="w-4 h-4 mr-2" />}
    {label}
  </div>
);

const Register = ({ onSwitchToLogin }) => {
  const {
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
  } = useRegister();

  return (
    <div className="w-full max-w-md mx-auto text-center animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-2">Criar Nova Conta</h2>
      <p className="text-slate-400 mb-8">Salve as suas listas de filmes e séries para sempre.</p>
      
      <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-lg text-left">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Nome</label>
            <input id="name" type="text" placeholder="Seu nome completo" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-3 bg-slate-700 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500 outline-none" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 bg-slate-700 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500 outline-none" />
          </div>
          <div>
            <label htmlFor="password_field" className="block text-sm font-medium text-slate-300 mb-2">Senha</label>
            <div className="relative">
              <input id="password_field" type={showPassword ? 'text' : 'password'} placeholder="Crie uma senha forte" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 bg-slate-700 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500 outline-none pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-cyan-400">
                {showPassword ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
              <PasswordRequirement label="Mínimo 8 caracteres" met={passwordChecks.length} />
              <PasswordRequirement label="Uma letra maiúscula" met={passwordChecks.upper} />
              <PasswordRequirement label="Uma letra minúscula" met={passwordChecks.lower} />
              <PasswordRequirement label="Pelo menos um número" met={passwordChecks.number} />
            </div>
          </div>
          <div>
            <label htmlFor="confirm_password_field" className="block text-sm font-medium text-slate-300 mb-2">Confirmar Senha</label>
            <div className="relative">
              <input id="confirm_password_field" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirme sua senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full p-3 bg-slate-700 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500 outline-none pr-10" />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-cyan-400">
                {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && <p className="text-amber-500 text-xs mt-1">As senhas não coincidem.</p>}
            {confirmPassword && password === confirmPassword && <p className="text-green-400 text-xs mt-1">As senhas coincidem!</p>}
          </div>
          
          {error && <p className="text-amber-500 text-sm text-center">{error}</p>}
          
          <button type="submit" disabled={loading || !allChecksPassed} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-md transition-colors duration-300 disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2">Criando...</span>
              </div>
            ) : 'Criar Conta'}
          </button>
        </form>
        <p className="text-sm text-center text-slate-400 mt-6">
          Já tem uma conta?
          <button onClick={onSwitchToLogin} className="font-bold text-cyan-400 hover:underline ml-2">
            Faça Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
