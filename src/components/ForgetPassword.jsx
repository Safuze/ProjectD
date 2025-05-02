import React, { useState, useEffect } from 'react';
import Input from './Input/Input'; // Убедитесь, что путь верный
import Button from './Button/Button'; // Убедитесь, что путь верный
import ErrorModal from './ErrorModal'; // Убедитесь, что этот компонент существует и работает

// Enum для стадий процесса
const STAGES = {
  EMAIL: 'email',       // Ввод Email
  CODE: 'code',         // Ввод кода подтверждения
  PASSWORD: 'password', // Ввод нового пароля
  SUCCESS: 'success',   // Успешное завершение
};

// Получаем URL API из переменных окружения Vite
// Важно: VITE_API_URL должен быть определен в файле .env в корне фронтенда
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'; // Резервный URL для локальной разработки

const ForgetPassword = ({ onBackClick }) => {
  const [stage, setStage] = useState(STAGES.EMAIL); // Текущая стадия
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState(''); // Код из email
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Состояния ошибок и загрузки
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState(''); // Общая ошибка API
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // Сообщение от сервера при успехе на шаге email

  // Состояния валидации полей
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [isPasswordFormValid, setIsPasswordFormValid] = useState(false);

  // --- Валидация ---

  // Валидация Email
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setIsEmailValid(isValid);
    if (email && !isValid) {
      setEmailError('Неправильный формат email');
    } else {
      setEmailError(''); // Очищаем ошибку, если формат верный или поле пустое
    }
  }, [email]);

  // Валидация поля кода (проверяем, что не пустое)
  useEffect(() => {
    const isValid = verificationCode.trim().length > 0;
    setIsCodeValid(isValid);
    if (isValid) {
        setCodeError(''); // Очищаем ошибку, если код введен
    }
  }, [verificationCode]);

  // Валидация формы нового пароля
  useEffect(() => {
    let currentPasswordError = '';
    let isValid = false;
    // Только если оба поля не пустые
    if (newPassword && confirmPassword) {
      if (newPassword.length < 4) {
        currentPasswordError = 'Пароль должен быть не менее 4 символов';
      } else if (newPassword !== confirmPassword) {
        currentPasswordError = 'Пароли не совпадают';
      } else {
         isValid = true; // Валидно, только если оба не пустые, длина > 4 и совпадают
      }
    } else if (newPassword || confirmPassword) {
        // Если одно поле заполнено, а другое нет - показываем ошибку совпадения,
        // но форма невалидна
        currentPasswordError = 'Пароли не совпадают';
    }

    setPasswordError(currentPasswordError);
    // Форма валидна только если оба поля заполнены и нет ошибок
    setIsPasswordFormValid(isValid);
  }, [newPassword, confirmPassword]);

  // --- Обработчики ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Сбрасываем общую ошибку API при любом вводе
    setApiError('');
    // Сбрасываем сообщение об успехе при изменении email
    if (name === 'email') setSuccessMessage('');

    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'code':
         setVerificationCode(value);
         // Очищаем ошибку кода при вводе
         if (codeError) setCodeError('');
        break;
      case 'password':
        setNewPassword(value);
        // Очищаем ошибку пароля при вводе
        if (passwordError) setPasswordError('');
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        // Очищаем ошибку пароля при вводе
        if (passwordError) setPasswordError('');
        break;
      default:
        break;
    }
  };

  // Отправка запроса на сброс пароля (этап EMAIL)
  const handleRequestReset = async () => {
    if (!isEmailValid || isLoading) return;

    setIsLoading(true);
    setApiError('');
    setEmailError(''); // Сброс локальной ошибки email
    setSuccessMessage(''); // Сброс сообщения об успехе

    try {
      // ИСПОЛЬЗУЕМ API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        // Используем сообщение из API, если оно есть, иначе общее
        throw new Error(data.message || `Ошибка ${response.status}`);
      }

      // Успех (даже если email не найден, сервер вернет 200 OK с сообщением)
      console.log('Reset request response:', data.message);
      setSuccessMessage(data.message); // Показываем сообщение от сервера
      setStage(STAGES.CODE); // Переходим к вводу кода

    } catch (error) {
      console.error('Forgot password error:', error);
      const message = error.message || 'Не удалось отправить запрос. Попробуйте позже.';
      setApiError(message);
      // Можно также показать ошибку у поля email
      setEmailError('Ошибка при отправке. Проверьте email или попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  // Отправка кода и нового пароля (этап PASSWORD)
  const handleResetPassword = async () => {
    // Проверяем валидность кода и формы пароля
     if (!verificationCode.trim()) {
        setCodeError('Код подтверждения не может быть пустым.');
        return;
     }
    if (!isPasswordFormValid || isLoading) return;

    setIsLoading(true);
    setApiError('');
    setCodeError(''); // Сброс ошибки кода перед отправкой
    setPasswordError(''); // Сброс ошибки пароля

    try {
      // ИСПОЛЬЗУЕМ API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: verificationCode,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
         // Используем сообщение из API
         const errorMessage = data.message || `Ошибка ${response.status}`;
         // Проверяем, связано ли сообщение с кодом или паролем
        if (errorMessage.toLowerCase().includes('код') || errorMessage.toLowerCase().includes('токен')) {
            setCodeError(errorMessage);
        } else if (errorMessage.toLowerCase().includes('парол')) {
            setPasswordError(errorMessage);
        } else {
            // Общая ошибка API
            setApiError(errorMessage);
        }
        // Не переходим на SUCCESS
      } else {
        // Успех!
        console.log('Password reset successful:', data.message);
        setStage(STAGES.SUCCESS); // Переходим к финальному экрану
      }

    } catch (error) {
      console.error('Reset password error:', error);
      setApiError(error.message || 'Не удалось сменить пароль. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Рендеринг ---

  return (
    <div id='forget_password_form' className='form__main'>
      {/* Отображение общей ошибки API */}
      {apiError && stage !== STAGES.SUCCESS && (
        <div className="error api-error" style={{ color: 'red', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>
          {apiError}
        </div>
      )}
       {/* Отображение сообщения об успехе от сервера */}
       {successMessage && stage === STAGES.CODE && (
         <div className="success-message" style={{ color: 'green', marginBottom: '15px', textAlign: 'center' }}>
           {successMessage}
         </div>
       )}


      {/* Этап 1: Ввод Email */}
      {stage === STAGES.EMAIL && (
        <>
          <span>Введите ваш email для восстановления пароля.</span>
          {/* Показываем ошибку валидации или API ошибку, связанную с email */}
          {(emailError || (apiError && apiError.toLowerCase().includes('email'))) && (
             <div className="error" style={{ color: 'red', marginRight: "auto", marginTop: "10px" }}>
               {emailError || apiError}
             </div>
           )}
          <div className={`input-container ${email ? (isEmailValid ? 'valid' : 'invalid') : ''}`}>
            <Input
              name="email"
              id="enter_email"
              type="email"
              placeholder="Введите Email"
              value={email}
              onChange={handleInputChange}
              disabled={isLoading}
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "email-error-desc" : undefined}
              style={{marginBottom: '5vh'}}
            />
          </div>
          {emailError && <span id="email-error-desc" style={{ display: 'none' }}>{emailError}</span>}

          <div className='form__forget_password_btn'>
            <Button onClick={onBackClick} className="form-secondary" disabled={isLoading}> {/* Используем другой стиль для "Назад" */}
              Назад
            </Button>
            <Button
              id='request_reset_btn'
              onClick={handleRequestReset}
              className={isEmailValid && !isLoading ? "form-valid" : ""}
              disabled={!isEmailValid || isLoading}
            >
              {isLoading ? 'Отправка...' : 'Отправить код'}
            </Button>
          </div>
        </>
      )}

      {/* Этап 2: Ввод Кода */}
      {stage === STAGES.CODE && (
         <>
          {/* Показываем ошибку валидации или API ошибку, связанную с кодом */}
          {(codeError || (apiError && (apiError.toLowerCase().includes('код') || apiError.toLowerCase().includes('токен')))) && (
            <div className="error" style={{ color: 'red', marginRight: "auto", marginTop: "10px" }}>
                {codeError || apiError}
            </div>
          )}
          <div className={`input-container ${verificationCode ? (isCodeValid ? 'valid' : 'invalid') : ''}`}>
              <Input
                name="code"
                id="enter_code"
                type="text" // Или "number" если код всегда числовой, но токен может быть hex
                placeholder="Введите код из email"
                value={verificationCode}
                onChange={handleInputChange}
                disabled={isLoading}
                // Можно добавить maxLength, если длина кода известна
                // maxLength={6} // Пример для 6-значного кода
                aria-invalid={!!codeError}
                aria-describedby={codeError ? "code-error-desc" : undefined}
                style={{marginBottom: '5vh'}}
              />
          </div>
          {codeError && <span id="code-error-desc" style={{ display: 'none' }}>{codeError}</span>}

           {/* Переход к вводу пароля после ввода кода */}
           <div className='form__forget_password_btn'>
             <Button onClick={() => { setStage(STAGES.EMAIL); setApiError(''); setSuccessMessage(''); }} className="form-secondary" disabled={isLoading}>
               Назад (к Email)
             </Button>
             <Button
               id='submit_code_btn'
               onClick={() => {
                 // Простая проверка перед переходом (опционально, т.к. основная проверка на сервере)
                 if (!isCodeValid) {
                   setCodeError('Введите код подтверждения');
                 } else {
                   setStage(STAGES.PASSWORD);
                   setApiError(''); // Очистить общую ошибку при переходе
                 }
               }}
               className={isCodeValid && !isLoading ? "form-valid" : ""}
               disabled={!isCodeValid || isLoading} // Кнопка активна, если код введен (не пустой)
             >
                Продолжить
             </Button>
           </div>
        </>
      )}

      {/* Этап 3: Ввод Нового Пароля */}
      {stage === STAGES.PASSWORD && (
        <>
          <span>Введите новый пароль. Код подтверждения: {verificationCode}</span>
          {/* Ошибка API может быть общей или связана с кодом/паролем */}
           {apiError && (
             <div className="error api-error" style={{ color: 'red', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>
               {apiError}
             </div>
           )}
          {/* Показываем ошибку валидации или API ошибку, связанную с кодом */}
          {codeError && <div className="error" style={{ color: 'red', marginRight:"auto", marginTop:"10px"}}>{codeError}</div>}
          {/* Показываем ошибку валидации или API ошибку, связанную с паролем */}
          {passwordError && <div className="error" style={{ color: 'red', marginRight:"auto", marginTop:"10px"}}>{passwordError}</div>}

          <div className={`input-container ${newPassword ? (newPassword.length >= 4 ? 'valid' : 'invalid') : ''}`}>
              <Input
                name="password"
                id="enter_password"
                type="password"
                placeholder="Введите новый пароль"
                value={newPassword}
                onChange={handleInputChange}
                disabled={isLoading}
                aria-invalid={!!passwordError && passwordError !== 'Пароли не совпадают'}
              />
          </div>
          <div className={`input-container ${confirmPassword ? (newPassword === confirmPassword && newPassword.length >= 4 ? 'valid' : 'invalid') : ''}`}>
              <Input
                name="confirmPassword"
                id="enter_confirmPassword"
                type="password"
                placeholder="Повторите новый пароль"
                value={confirmPassword}
                onChange={handleInputChange}
                disabled={isLoading}
                aria-invalid={!!passwordError}
                style={{marginBottom: '5vh'}}
              />
          </div>

          <div className='form__forget_password_btn'>
            <Button onClick={() => setStage(STAGES.CODE)} className="form-secondary" disabled={isLoading}>
              Назад (к коду)
            </Button>
            <Button
              id='reset_password_btn'
              onClick={handleResetPassword}
              className={isPasswordFormValid && !isLoading ? "form-valid" : ""}
              disabled={!isPasswordFormValid || isLoading}
            >
              {isLoading ? 'Смена...' : 'Сменить пароль'}
            </Button>
          </div>
        </>
      )}

      {/* Этап 4: Успех */}
      {stage === STAGES.SUCCESS && (
        // Используем ваш ErrorModal (или любой другой компонент для успеха)
        <ErrorModal
          message='Пароль успешно изменен!'
          onClose={onBackClick} // Передаем onBackClick как обработчик закрытия/перехода
          isSuccess={true} // Добавим флаг для стилизации успеха, если ErrorModal это поддерживает
        >
          Войти {/* Текст на кнопке модального окна */}
        </ErrorModal>
      )}
    </div>
  );
};

export default ForgetPassword;