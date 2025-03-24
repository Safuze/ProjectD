import React, { useState, useEffect } from 'react';
import Button from './Button/Button';
import Input from './Input/Input';

export default function Register({ onBackClick, onRegisterSuccess }) {
  const [user, setUser] = useState({
    login: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    login: '',
    password: '',
    confirmPassword: '',
  });

  const [touched, setTouched] = useState({
    login: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [marginBottom, setMarginBottom] = useState(58.631);
  const [marginTopForBackDown, setMarginTopForBackDown] = useState(25);

  useEffect(() => {
    const errorCount = Object.values(errors).filter((error) => error).length;
    setMarginBottom(58.631 - errorCount * 5);
    setMarginTopForBackDown(25 - errorCount * 5);
  }, [errors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    // Если поле уже "тронуто" (было в фокусе), запускаем валидацию
    if (touched[name]) {
      validateFields(name, value);
    }
  };

  const validateFields = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors.email = 'Неправильный email';
        } else {
          newErrors.email = '';
        }
        break;
      }
      case 'login': {
        const loginRegex = /^[A-Za-z][A-Za-z0-9]*$/;
        if (value.length < 4 || !loginRegex.test(value)) {
          newErrors.login = 'Некорректный логин';
        } else {
          newErrors.login = '';
        }
        break;
      }
      case 'password': {
        if (value.length < 4) {
          newErrors.password = 'Пароль должен быть не менее 4 символов';
        } else {
          newErrors.password = '';
        }
        break;
      }
      case 'confirmPassword': {
        if (value !== user.password) {
          newErrors.confirmPassword = 'Пароли не совпадают';
        } else {
          newErrors.confirmPassword = '';
        }
        break;
      }
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    // Помечаем поле как "тронутое" и валидируем
    setTouched({ ...touched, [name]: true });
    validateFields(name, value);
  };

  const handleRegisterSubmit = () => {
    if (isRegistrationValid()) {
      onRegisterSuccess(user); // Передаем данные зарегистрированного пользователя
    }
  };

  const isRegistrationValid = () => {
    return (
      !errors.email &&
      !errors.login &&
      !errors.password &&
      !errors.confirmPassword &&
      user.email &&
      user.login &&
      user.password &&
      user.confirmPassword &&
      user.password === user.confirmPassword
    );
  };

  const isFieldValid = (name) => {
    // Проверяем, было ли поле "тронуто" (получало фокус)
    if (!touched[name]) return false;
  
    switch (name) {
      case 'login':
        return (
          user.login.length >= 4 &&
          /^[A-Za-z]/.test(user.login) &&
          /^[A-Za-z0-9]+$/.test(user.login) &&
          !errors.login
        );
  
      case 'email':
        // Используем ТОТ ЖЕ regex, что и в validateFields
        return (
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email) &&
          !errors.email
        );
  
      case 'password':
        return (
          user.password.length >= 4 &&
          !errors.password
        );
  
      case 'confirmPassword':
        return (
          user.confirmPassword &&
          user.password &&
          user.confirmPassword === user.password &&
          !errors.confirmPassword
        );
  
      default:
        return false;
    }
  };

  return (
    <>
      <div className="form__main" style={{ marginBottom: marginBottom }}>
        <div className="error-container">
          {errors.login && <div className="error">{errors.login}</div>}
        </div>
        <Input
          className={isFieldValid('login') ? 'valid' : ''}
          name="login"
          type="text"
          placeholder="Логин"
          value={user.login}
          onChange={handleChange}
          onBlur={handleBlur}
          style={isFieldValid('login') ? { backgroundColor: 'rgba(124, 255, 131, 0.5)', color: 'white' } : {}}
        />
        <div className="error-container">
          {errors.email && <div className="error">{errors.email}</div>}
        </div>
        <Input
          className={isFieldValid('email') ? 'valid' : ''}
          name="email"
          type="text"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
          onBlur={handleBlur}
          style={isFieldValid('email') ? { backgroundColor: 'rgba(124, 255, 131, 0.5)', color: 'white' } : {}}
        />
        <div className="error-container">
          {errors.password && <div className="error">{errors.password}</div>}
        </div>
        <Input
          className={isFieldValid('password') ? 'valid' : ''}
          name="password"
          type="password"
          placeholder="Пароль"
          value={user.password}
          onChange={handleChange}
          onBlur={handleBlur}
          style={isFieldValid('password') ? { backgroundColor: 'rgba(124, 255, 131, 0.5)', color: 'white' } : {}}
        />
        <div className="error-container">
          {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
        </div>
        <Input
          className={isFieldValid('login') ? 'valid' : ''}
          name="confirmPassword"
          type="password"
          placeholder="Повторите пароль"
          value={user.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          style={isFieldValid('confirmPassword') ? { backgroundColor: 'rgba(124, 255, 131, 0.5)', color: 'white' } : {}}
        />
        {isRegistrationValid() && (
          <Button onClick={handleRegisterSubmit}>Зарегистрироваться</Button>
        )}
        <div className="form__down" style={{ marginBottom: 0, marginTop: marginTopForBackDown }}>
          <button id="backBtn" className="forget_password" onClick={onBackClick}>
            Назад
          </button>
        </div>
      </div>
    </>
  );
}