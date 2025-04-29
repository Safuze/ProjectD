import React, { useState, useEffect } from 'react';
import Button from './Button/Button';
import Input from './Input/Input';

export default function Register({ onBackClick, onRegisterSuccess }) {
  const [isFormValid, setIsFormValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  
  const [user, setUser] = useState({
    login: '',
    email: '',
    password: '',
    confirmPassword: '',
    fio: ''
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
    setMarginBottom(58.631 - errorCount * 8);
    setMarginTopForBackDown(25 - errorCount * 8);
    setIsFormValid(isRegistrationValid());
  }, [errors, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
    validateFields(name, value);
  };

  const validateFields = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = '';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Неправильный email';
        } else {
          newErrors.email = '';
        }
        break;
      }
      case 'login': {
        const loginRegex = /^[A-Za-z][A-Za-z0-9]*$/;
        if (!value) {
          newErrors.login = '';
        } else if (value.length < 4 || !loginRegex.test(value)) {
          newErrors.login = 'Некорректный логин';
        } else {
          newErrors.login = '';
        }
        break;
      }
      case 'password': {
        if (!value) {
          newErrors.password = '';
        } else if (value.length < 4) {
          newErrors.password = 'Пароль должен быть не менее 4 символов';
        } else {
          newErrors.password = '';
        }
        break;
      }
      case 'confirmPassword': {
        if (!value) {
          newErrors.confirmPassword = '';
        } else if (value !== user.password) {
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
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
      validateFields(name, value);
    }
  };

  const handleRegisterSubmit = async () => {
    if (!isRegistrationValid()) return;
    
    setIsLoading(true);
    setServerError('');

    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: user.login,
          email: user.email,
          password: user.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка регистрации');
      }

      // Успешная регистрация
      onRegisterSuccess({
        login: user.login,
        email: user.email,
        password: user.password // В реальном приложении не передавайте пароль!
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      setServerError(error.message || 'Произошла ошибка при регистрации');
    } finally {
      setIsLoading(false);
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
    if (!touched[name]) return false;
    return !errors[name] && user[name];
  };

  return (
    <>
      <div className="form__main" style={{ marginBottom: marginBottom }}>
        {serverError && <div className="error server-error">{serverError}</div>}
        
        <div className="error-container">
          {errors.login && <div className="error">{errors.login}</div>}
        </div>
        <div className={`input-container ${isFieldValid('login') ? 'valid' : ''}`}>
          <Input
            name="login"
            type="text"
            placeholder="Логин"
            value={user.login}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        
        <div className="error-container">
          {errors.email && <div className="error">{errors.email}</div>}
        </div>
        <div className={`input-container ${isFieldValid('email') ? 'valid' : ''}`}>
          <Input
            name="email"
            type="text"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        
        <div className="error-container">
          {errors.password && <div className="error">{errors.password}</div>}
        </div>
        <div className={`input-container ${isFieldValid('password') ? 'valid' : ''}`}>
          <Input
            name="password"
            type="password"
            placeholder="Пароль"
            value={user.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        
        <div className="error-container">
          {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
        </div>
        <div className={`input-container ${isFieldValid('confirmPassword') ? 'valid' : ''}`}>
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Повторите пароль"
            value={user.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        
        <div className="form__down" style={{ marginBottom: 0, marginTop: marginTopForBackDown }}>
          <button id="backBtn" className="forget_password" onClick={onBackClick}>
            Назад
          </button>
          <Button 
            onClick={handleRegisterSubmit} 
            disabled={!isFormValid || isLoading}
            className={isFormValid ? "form-valid" : ""}
            id="register-btn"
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </div>
      </div>
    </>
  );
}