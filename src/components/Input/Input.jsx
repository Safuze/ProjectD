import { useState } from "react";
function Input({ 
  id, 
  type, 
  placeholder, 
  value, 
  onChange, 
  onBlur, 
  name, 
  style, 
  title,
  className = '', // Добавляем пропс className с дефолтным значением
  suggestions = [], // Новый пропс для подсказок
  validation = {} // Новый пропс для правил валидации
}) {

  const [error, setError] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  const validate = (value) => {
    if (!validation) return true;
    
    let isValid = true;
    let errorMessage = '';
    
    // Проверка на обязательность
    if (validation.required && !value) {
      isValid = false;
      errorMessage = 'Это поле обязательно для заполнения';
    }
    
    // Проверка числовых значений
    if (isValid && validation.numeric && value && !/^\d+$/.test(value)) {
      isValid = false;
      errorMessage = 'Допустимы только числовые значения';
    }
    
    // Проверка буквенных значений
    if (isValid && validation.alpha && value && !/^[а-яА-ЯёЁa-zA-Z\s\-]+$/.test(value)) {
      isValid = false;
      errorMessage = 'Допустимы только буквенные значения';
    }
    
    // Проверка email
    if (isValid && validation.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      isValid = false;
      errorMessage = 'Введите корректный email';
    }
    
    // Проверка даты
    if (isValid && validation.date && value) {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        isValid = false;
        errorMessage = 'Введите корректную дату';
      }
    }
    
    // Проверка по регулярному выражению
    if (isValid && validation.pattern && value && !validation.pattern.test(value)) {
      isValid = false;
      errorMessage = validation.message || 'Некорректный формат';
    }
    
    // Проверка минимальной длины
    if (isValid && validation.minLength && value && value.length < validation.minLength) {
      isValid = false;
      errorMessage = `Минимальная длина: ${validation.minLength} символов`;
    }
    
    // Проверка максимальной длины
    if (isValid && validation.maxLength && value && value.length > validation.maxLength) {
      isValid = false;
      errorMessage = `Максимальная длина: ${validation.maxLength} символов`;
    }
    
    setError(errorMessage);
    return isValid;
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (validation && validation.numeric && newValue && !/^\d*$/.test(newValue)) {
      return; // Блокируем ввод нечисловых символов
    }
    if (validation && validation.alpha && newValue && !/^[а-яА-ЯёЁa-zA-Z\s\-]*$/.test(newValue)) {
      return; // Блокируем ввод небуквенных символов
    }
    onChange(e);
    if (isTouched) {
      validate(newValue);
    }
  };

  const handleBlur = (e) => {
    setIsTouched(true);
    validate(e.target.value);
    if (onBlur) onBlur(e);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text/plain');
    if (validation && validation.numeric && !/^\d*$/.test(pastedText)) {
      return; // Блокируем вставку нечисловых символов
    }
    if (validation && validation.alpha && !/^[а-яА-ЯёЁa-zA-Z\s\-]*$/.test(pastedText)) {
      return; // Блокируем вставку небуквенных символов
    }
    onChange({ target: { name, value: pastedText } });
    if (isTouched) {
      validate(pastedText);
    }
  };

  

  // Генерируем уникальный ID для datalist
  const datalistId = `${id || name || 'input'}-datalist`;
  // Объединяем классы
  const inputClasses = `input${className} ${error ? 'input-error' : ''}`.trim();

  return (
    <div className="input-container">
      <input
        id={id}
        type={type}
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        name={name}
        style={style}
        onPaste={handlePaste}
        title={title}
        list={datalistId}
      />
      {suggestions.length > 0 && (
        <datalist id={datalistId}>
          {suggestions.map((suggestion, index) => (
            <option key={index} value={suggestion} />
          ))}
        </datalist>
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default Input;