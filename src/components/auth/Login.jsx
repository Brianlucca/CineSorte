import { useLogin } from '../../hooks/auth/useLogin';
import { EyeIcon, EyeSlashIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid';

const Login = ({ onSwitchToRegister }) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    showPassword,
    setShowPassword,
    handleSubmit,
  } = useLogin();

  return (
    <div className="w-full max-w-md mx-auto text-center animate-fade-in">
      {error === 'COOKIES_BLOQUEADOS' ? (
        <div className="bg-slate-800/50 border border-amber-600 p-6 rounded-lg text-left">
          <div className="flex items-center gap-4">
            <ShieldExclamationIcon className="w-12 h-12 text-amber-400 flex-shrink-0"/>
            <div>
              <h3 className="text-xl font-bold text-white">Cookies Necessários</h3>
              <p className="text-amber-200 mt-2 text-sm">
                Parece que o seu navegador está a bloquear os cookies de que precisamos para manter a sua sessão segura. 
                Por favor, ative os cookies nas definições do seu navegador para este site e atualize a página.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-white mb-2">Login</h2>
          <p className="text-slate-400 mb-8">Aceda à sua conta para ver as suas listas guardadas.</p>
          
          <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-lg text-left">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label htmlFor="email_login" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input id="email_login" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 bg-slate-700 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500 outline-none" />
              </div>
              <div>
                <label htmlFor="password_login" className="block text-sm font-medium text-slate-300 mb-2">Senha</label>
                <div className="relative">
                  <input id="password_login" type={showPassword ? 'text' : 'password'} placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 bg-slate-700 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500 outline-none pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-cyan-400">
                    {showPassword ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                  </button>
                </div>
              </div>
              
              {error && <p className="text-amber-500 text-sm text-center">{error}</p>}
              
              <button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-md transition-colors duration-300 disabled:bg-slate-700 disabled:cursor-not-allowed">
                {loading ? (
                  <div className="flex justify-center items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2">Entrando...</span>
                  </div>
                ) : 'Entrar'}
              </button>
            </form>
            <p className="text-sm text-center text-slate-400 mt-6">
              Não tem uma conta?
              <button onClick={onSwitchToRegister} className="font-bold text-cyan-400 hover:underline ml-2">
                Registe-se
              </button>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
