import React, { useState } from 'react';
import Button from './Button/Button';
import Input from './Input/Input';
import Register from './Register';
import DocumentCreation from './DocumentCreation';
import ForgetPassword from './ForgetPassword';

export default function Login({ onEmail, onLogin, isCreatingDocument, setIsCreatingDocument }) {
  const [authLogin, setAuthLogin] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgetPassword, setIsForgetPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'login') setAuthLogin(value);
    if (name === 'password') setAuthPassword(value);
  
    setIsFormValid(
      (name === 'login' ? value : authLogin).trim() !== '' && 
      (name === 'password' ? value : authPassword).trim() !== ''
    );
  };

  const handleLoginSubmit = async () => {
    if (!isFormValid) return;
    
    setIsLoading(true);
    setAuthError('');

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: authLogin,
          password: authPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка авторизации');
      }

      // Успешная авторизация
      onLogin(authLogin);
      onEmail(data.user.email);
      setIsCreatingDocument(true);
      
    } catch (error) {
      console.error('Login error:', error);
      setAuthError(error.message || 'Неправильный логин или пароль');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgetPasswordClick = () => {
    setIsForgetPassword(true);
  }

  const handleRegistrationClick = () => {
    setIsRegistering(true);
  };

  const handleBackClickReg = () => {
    setIsRegistering(false);
  };

  const handleBackClickPassw = () => {
    setIsForgetPassword(false);
  }

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    setIsRegistering(false);
    // Автоматически заполняем поля входа после регистрации
    setAuthLogin(userData.login);
    setAuthPassword(userData.password);
    setIsFormValid(true);
  };

  return (
    <div className="form">
      {!isCreatingDocument && (
        <>
          <div className="form__top">
            <div className="form__img-line"></div>
            <div className="form__img-notebook"></div>
          </div>
          <div className="form__text">
            {isForgetPassword ? (
              <h3>ВОССТАНОВЛЕНИЕ АККАУНТА</h3>
            ) : (
            <h2 style={{ marginBottom: 0 }}>
              {isRegistering ? 'Регистрация'.toUpperCase() : 'Добро'.toUpperCase()}
              <br />
              {isRegistering ? '' : 'пожаловать'.toUpperCase()}
            </h2>
            )}
          </div>
        </>
      )}
      {isCreatingDocument ? (
        <DocumentCreation />
      ) : isRegistering ? (
        <Register
          onBackClick={handleBackClickReg}
          onRegisterSuccess={handleRegisterSuccess}
        />
      ) : isForgetPassword ? (
        <ForgetPassword 
          onBackClick={handleBackClickPassw}
        />
      ) : (
        <>
          <div className="form__main">
            <Input
              name="login"
              type="text"
              placeholder="Логин"
              value={authLogin}
              onChange={handleChange}
            />
            <Input
              name="password"
              type="password"
              placeholder="Пароль"
              value={authPassword}
              onChange={handleChange}
            />
            {authError && <div className="error">{authError}</div>}
            <Button 
              onClick={handleLoginSubmit}   
              className={isFormValid ? "form-valid" : undefined}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? 'Вход...' : 'Вход'}
            </Button>
            <div className="form__down">
              <button className="forget_password" onClick={handleForgetPasswordClick}>Забыли пароль?</button>
              <button id="registration" onClick={handleRegistrationClick}>
                Регистрация
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}