import React, { useState } from 'react';
import Button from './Button/Button';
import Input from './Input/Input';
import Register from './Register';
import DocumentCreation from './DocumentCreation';

export default function Login() {
  const [authLogin, setAuthLogin] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCreatingDocument, setIsCreatingDocument] = useState(false);
  const [user, setUser] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'login') setAuthLogin(value);
    if (name === 'password') setAuthPassword(value);
  };

  const handleLoginSubmit = () => {
    if (user && authLogin === user.login && authPassword === user.password) {
      setAuthError('');
      setIsCreatingDocument(true);
    } else {
      setAuthError('Неправильный логин или пароль');
    }
  };

  const handleRegistrationClick = () => {
    setIsRegistering(true);
  };

  const handleBackClick = () => {
    setIsRegistering(false);
  };

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    setIsRegistering(false);
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
            <h2 style={{ marginBottom: 0 }}>
              {isRegistering ? 'Регистрация'.toUpperCase() : 'Добро'.toUpperCase()}
              <br />
              {isRegistering ? '' : 'пожаловать'.toUpperCase()}
            </h2>
          </div>
        </>
      )}
      {isCreatingDocument ? (
        <DocumentCreation />
      ) : isRegistering ? (
        <Register
          onBackClick={handleBackClick}
          onRegisterSuccess={handleRegisterSuccess}
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
            <Button onClick={handleLoginSubmit}>Вход</Button>
            <div className="form__down">
              <button className="forget_password">Забыли пароль?</button>
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