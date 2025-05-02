import React, { useState, useEffect  } from 'react';
import Button from './Button/Button';
import Input from './Input/Input';
import Register from './Register';
import DocumentCreation from './DocumentCreation';
import ForgetPassword from './ForgetPassword';

// Получаем URL API из переменных окружения Vite
// Важно: VITE_API_URL должен быть определен в файле .env в корне фронтенда
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'; // Резервный URL
export default function Login({ onEmail, onLogin, isCreatingDocument, setIsCreatingDocument }) {
  
  const [authLogin, setAuthLogin] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgetPassword, setIsForgetPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsFormValid(authLogin.trim() !== '' && authPassword.trim() !== '');
  }, [authLogin, authPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'login') setAuthLogin(value);
    if (name === 'password') setAuthPassword(value);
    // Сбрасываем ошибку при изменении любого поля
    if (authError) setAuthError('');

  };

  // Обработчик отправки формы авторизации
  const handleLoginSubmit = async () => {
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    setAuthError('');

    try {
      // ИСПОЛЬЗУЕМ API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: authLogin,
          password: authPassword
        }),
        credentials: 'include'
      });

      const data = await response.json(); // Читаем ответ в любом случае

      if (!response.ok) {
        throw new Error(data.message || `Ошибка входа (${response.status})`);
      }

      // Успешный вход
      onLogin(data.user.login); // Передаем логин
      if(onEmail) onEmail(data.user.email); // Передаем email, если колбэк есть
      setIsCreatingDocument(true); // Переходим к созданию документа

    } catch (error) {
      console.error('Login error:', error);
      setAuthError(error.message || 'Не удалось подключиться к серверу. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgetPasswordClick = () => {
    setIsForgetPassword(true);
    setIsRegistering(false); // Убедимся, что регистрация закрыта
    setAuthError(''); // Сброс ошибки при переключении
  }

  const handleRegistrationClick = () => {
    setIsRegistering(true);
  };

  // Возврат из регистрации или восстановления пароля к логину
  const handleBackToLogin = () => {
    setIsRegistering(false);
    setIsForgetPassword(false);
    setAuthError(''); // Сброс ошибки
  };

  const handleRegisterSuccess = (userData) => {
    setIsRegistering(false);
    setIsForgetPassword(false);
    // Автоматически заполняем поля входа после регистрации
    setAuthLogin(userData.login);
    setAuthPassword('');
    setAuthError('');
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
          onBackClick={handleBackToLogin}
          onRegisterSuccess={handleRegisterSuccess}
        />
      ) : isForgetPassword ? (
        <ForgetPassword 
          onBackClick={handleBackToLogin}
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