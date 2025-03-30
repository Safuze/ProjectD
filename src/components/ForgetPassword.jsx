import React, { useState } from 'react';
import Input from './Input/Input';
import Button from './Button/Button';

const ForgetPassword = ({ onBackClick }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    // Если поле уже "тронуто", валидируем при каждом изменении
    if (touched) {
      validateEmail(value);
    }
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setError('Неправильный email');
      setIsValid(false);
    } else {
      setError('');
      setIsValid(true);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    validateEmail(email);
  };

  const handleSubmit = () => {
    if (isValid) {
      // Логика отправки кода
      console.log('Код отправлен на:', email);
    }
  };    

  return (
    <div id='forget_passwor_form' className='form__main'>
      <div className="error-container">
        {error && <div className="error">{error}</div>}
      </div>
      <Input 
        id="enter_email"
        type="text"
        placeholder="Введите Email"
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        style={isValid ? { backgroundColor: 'rgba(124, 255, 131, 0.5)', color: 'white' } : {}}
      />
      <div className='form__forget_password_btn'>
        <Button onClick={onBackClick}>Назад</Button>
        <Button 
          id='send_code' 
          onClick={handleSubmit}
          disabled={!isValid}
        >
          Отправить код
        </Button>
      </div>
    </div>     
  );
};

export default ForgetPassword;