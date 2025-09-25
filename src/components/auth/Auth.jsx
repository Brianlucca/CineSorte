import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const Auth = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  if (isLoginView) {
    return <Login onSwitchToRegister={() => setIsLoginView(false)} />;
  } else {
    return <Register onSwitchToLogin={() => setIsLoginView(true)} />;
  }
};

export default Auth;