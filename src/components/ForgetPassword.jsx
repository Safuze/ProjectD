import React, { useState, useEffect } from 'react';
import Input from './Input/Input';
import Button from './Button/Button';
import ErrorModal from './ErrorModal';
const ForgetPassword = ({ onBackClick }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [codeSent, setCodeSent] = useState('');
  const [code, setCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [successfulСode, setSucccessfulСode] = useState(false);
  const [errorCode, setErrorCode] = useState(false);
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [end, setEnd] = useState(false);

  function GetRandomCode() { // Функция генерации радномного кода 
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += String(Math.floor(Math.random() * 10));
    }
    return code;
  }

  const handleChange = (e) => {
    
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'code') {
      // Разрешаем ввод/удаление, но не больше 4 символов
      if (value.length <= 4) {
        setCodeSent(value);
      }
    }
    if (name === 'password') setNewPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
    
    // Если поле уже "тронуто", валидируем при каждом изменении
    if (touched) {
      validateEmail(email);
    }
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setError('');
      setIsValid(false);
    } else if (!emailRegex.test(value)) {
      setError('Неправильный email');
      setIsValid(false);
    } else {
      setError('');
      setIsValid(true);
    }
  };

  useEffect(() => {
    setIsFormValid(isValid);
  }, [isValid]);

  const handleBlur = () => {
    setTouched(true);
    validateEmail(email);
  };

  useEffect(() => {
    if (newPassword && confirmPassword) {
      if (newPassword.length < 4) {
        setPasswordError('Пароль должен быть не менее 4 символов');
      } else if (newPassword !== confirmPassword) {
        setPasswordError('Пароли не совпадают');
      } else {
        setPasswordError('');
      }
    } else {
      setPasswordError('');
    }
  }, [newPassword, confirmPassword]);

  const handleSubmit = () => {
    if (isValid) {
      // Логика отправки кода
      setCode(true);
      console.log('Код отправлен на:', email);
    }
    const newCode = GetRandomCode();
    setGeneratedCode(newCode);
    console.log(newCode);
    // Реализовать отправку generatedCode на email 
  };    

  const handleСodeSubmission = () => {
    const isCodeValid = codeSent === generatedCode;
    setErrorCode(!isCodeValid);
    setSucccessfulСode(isCodeValid);
    
    // Если код верный, переходим к смене пароля
    if (isCodeValid) {
      setCode(false); // Скрываем поле для кода
    }
    if (successfulСode && !passwordError) {
      setEnd(true)

      // Запрос на сервер о смене пароля 
      // Меняем поля в базе данных пользователя 
      console.log(newPassword) // Заглушка
      console.log(confirmPassword) // Заглушка
    } else setEnd(false);
  }

  return (
    <div id='forget_password_form' className='form__main'>
      { code ? (
        <>
          {errorCode ? (
            <div className="error-container" style={{marginRight:"70%"}}>
              {<div className="error" >Неверный код</div>}
            </div>
            
          ) : (
            <span>Мы отправили код восстановления на ваш email</span>
          )}
          <Input 
            name="code"
            id="enter_code"
            type="text"
            placeholder="Введите код"
            value={codeSent}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </>
      ) : successfulСode ? 
      ( 
        <>
          {passwordError && (
                <div className="error" style={passwordError === "Пароль должен быть не менее 4 символов" ? {marginRight:"26%"} : passwordError === "Пароли не совпадают" ? {marginRight:"60%"} : {marginRight:"0"} }>
                  {passwordError}
                </div>
          )}
            <Input 
                name="password"
                id="enter_password"
                type="password"
                placeholder="Введите новый пароль"
                value={newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            <Input 
              name="confirmPassword"
              id="enter_confirmPassword"
              type="password"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
        </>
      ) : (
        
        <>
          <div className="error-container">
            {error && <div className="error">{error}</div>}
          </div>
          <div className={`input-container ${isValid ? 'valid' : ''}`}>
            <Input 
              name="email"
              id="enter_email"
              type="email"
              placeholder="Введите Email"
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </>
        )}
        <div className='form__forget_password_btn'>
          {code || successfulСode ? (
            <>
              <Button 
              onClick={onBackClick} 
              className="form-valid"
              >
                На главную
              </Button>
              <Button
                id='send_code' 
                onClick={handleСodeSubmission}
                className={isFormValid || !passwordError ? "form-valid" : ""} // Поменять валидацию для кода
                disabled={!isFormValid || !!passwordError} // Поменять валидацию для кода
              >
                Продолжить
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={onBackClick} 
                className="form-valid"
              >
                Назад
              </Button>
              <Button
                id='send_code' 
                onClick={handleSubmit}
                className={isFormValid ? "form-valid" : ""}
                disabled={!isFormValid}
              >
                Отправить код
              </Button>
            </>
          )}
        </div>
        {end && (
              <ErrorModal
                message='Пароль успешно изменен!'
                onClose={onBackClick}
                children='Войти'
              />
            )}
    </div>   
  );
};

export default ForgetPassword;