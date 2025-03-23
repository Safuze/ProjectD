import React, { useState, useEffect } from 'react';
import Button from './Button/Button';
import Input from './Input/Input';

export default function Login() {
  const marginBottomForReg = 58.631;
  console.log(marginBottomForReg);
  const initialMarginTopForBackDown = 25;

  const [isRegistering, setIsRegistering] = useState(false);

  // Состояния для регистрации
  const [user, setUser] = useState({
    login: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Состояния для авторизации
  const [authLogin, setAuthLogin] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  // Состояния для ошибок
  const [errors, setErrors] = useState({
    email: '',
    login: '',
    password: '',
    confirmPassword: '',
  });

  // Динамический marginBottom
  const [marginBottom, setMarginBottom] = useState(marginBottomForReg);

  // Динамический marginTopForBackDown
  const [marginTopForBackDown, setMarginTopForBackDown] = useState(initialMarginTopForBackDown);

  useEffect(() => {
    const errorCount = Object.values(errors).filter((error) => error).length;
    
    // Обновляем marginBottom
    const newMarginBottom = marginBottomForReg - errorCount * 5;
    setMarginBottom(newMarginBottom);

    // Обновляем marginTopForBackDown
    const newMarginTopForBackDown = initialMarginTopForBackDown - errorCount * 5; // Уменьшаем на 5px за каждую ошибку
    setMarginTopForBackDown(newMarginTopForBackDown);

    console.log('Текущий marginBottom:', newMarginBottom);
    console.log('Текущий marginTopForBackDown:', newMarginTopForBackDown);
  }, [errors, marginBottomForReg, initialMarginTopForBackDown]);

  const handleRegistrationClick = () => {
    // Сбрасываем состояния при переходе к регистрации
    setUser({
      login: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setErrors({
      email: '',
      login: '',
      password: '',
      confirmPassword: '',
    });
    setIsRegistering(true);
  };

  const handleBackClick = () => {
    // Сбрасываем состояния при переходе к авторизации
    setAuthLogin('');
    setAuthPassword('');
    setIsRegistering(false);
  };

  // Обработчик изменения значений в инпутах
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isRegistering) {
      setUser({ ...user, [name]: value }); // Обновляем состояние для регистрации
    } else {
      if (name === 'login') setAuthLogin(value); // Обновляем логин для авторизации
      if (name === 'password') setAuthPassword(value); // Обновляем пароль для авторизации
    }
  };

  // Валидация полей
  const validateFields = (name, value) => {
    let newErrors = { ...errors }; // Копируем текущие ошибки

    switch (name) {
      case 'email': {
        // Проверяем email на валидность
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors.email = 'Неправильный email';
        } else {
          newErrors.email = ''; // Убираем ошибку, если все хорошо
        }
        break;
      }
      case 'login': {
        // Проверяем логин на валидность
        const loginRegex = /^[A-Za-z][A-Za-z0-9]*$/; // Логин с первой буквы
        if (value.length < 4 || !loginRegex.test(value)) {
          newErrors.login = 'Некорректный логин';
        } else {
          newErrors.login = ''; // Убираем ошибку, если все хорошо
        }
        break;
      }
      case 'password': {
        // Проверяем пароль на минимальную длину
        if (value.length < 4) {
          newErrors.password = 'Пароль должен быть не менее 4 символов';
        } else {
          newErrors.password = ''; // Убираем ошибку, если все хорошо
        }
        break;
      }
      case 'confirmPassword': {
        // Проверяем совпадение паролей
        if (value !== user.password) {
          newErrors.confirmPassword = 'Пароли не совпадают';
        } else {
          newErrors.confirmPassword = ''; // Убираем ошибку, если все хорошо
        }
        break;
      }
      default:
        break;
    }

    setErrors(newErrors); // Обновляем состояние ошибок
  };

  // Обработчик потери фокуса
  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateFields(name, value); // Проверка на ошибки при уходе из поля
  };

  // Обработчик регистрации
  const handleRegisterSubmit = () => {
    if (!isRegistrationValid()) {
      return; // Не выполняем регистрацию, если есть ошибки
    }

    // Логика для создания пользователя
    const userData = {
      login: user.login,
      email: user.email,
      password: user.password,
    };
    console.log('Пользователь зарегистрирован:', userData);
    setIsRegistering(false); // Переход к форме авторизации
  };

  // Проверка на возможность регистрации
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
      user.password === user.confirmPassword // Проверяем совпадение паролей
    );
  };

  return (
    <div className="form">
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
      {isRegistering ? (
        <>
          <div className="form__main" style={{ marginBottom: marginBottom }}>
            <div className="error-container">
              {errors.login && <div className="error">{errors.login}</div>}
            </div>
            <Input
              name="login"
              type="text"
              placeholder="Логин"
              value={user.login}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <div className="error-container">
              {errors.email && <div className="error">{errors.email}</div>}
            </div>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <div className="error-container">
              {errors.password && <div className="error">{errors.password}</div>}
            </div>
            <Input
              name="password"
              type="password"
              placeholder="Пароль"
              value={user.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <div className="error-container">
              {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
            </div>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Повторите пароль"
              value={user.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {isRegistrationValid() && (
              <Button onClick={handleRegisterSubmit}>Зарегистрироваться</Button>
            )}
            <div className="form__down" style={{ marginBottom: 0, marginTop: marginTopForBackDown }}>
              <button id="backBtn" className="forget_password" onClick={handleBackClick}>
                Назад
              </button>
            </div>
          </div>
        </>
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
            <Button>Вход</Button>
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