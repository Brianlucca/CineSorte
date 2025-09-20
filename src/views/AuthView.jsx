import React, { useState } from 'react';
import LoginView from './LoginView';
import RegisterView from './RegisterView';

const AuthView = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  if (isLoginView) {
    return <LoginView onSwitchToRegister={() => setIsLoginView(false)} />;
  } else {
    return <RegisterView onSwitchToLogin={() => setIsLoginView(true)} />;
  }
};

export default AuthView;