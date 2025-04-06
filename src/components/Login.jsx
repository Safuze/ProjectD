import React, { useState } from 'react';
import Button from './Button/Button';
import Input from './Input/Input';
import Register from './Register';
import DocumentCreation from './DocumentCreation';
import ForgetPassword from './ForgetPassword';
export default function Login({ onEmail, onLogin,  isCreatingDocument, setIsCreatingDocument }) {
  const [authLogin, setAuthLogin] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgetPassword, setIsForgetPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);


  // Обновляем состояние при изменении полей
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'login') setAuthLogin(value);
    if (name === 'password') setAuthPassword(value);
  
    // Проверяем, что оба поля не пустые
    setIsFormValid(
      (name === 'login' ? value : authLogin).trim() !== '' && 
      (name === 'password' ? value : authPassword).trim() !== ''
    );
  };

  const handleLoginSubmit = () => {
    if (user && authLogin === user.login && authPassword === user.password) {
      onLogin(authLogin); // Передаем логин в App
      onEmail(user.email);
      setAuthError('');
      setIsCreatingDocument(true);
    } else {
      setAuthError('Неправильный логин или пароль');
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
              className={isFormValid ? "form-valid" : undefined} // undefined не добавит класс
              disabled={!isFormValid}
            >
              Вход
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