import { useState } from "react";
function Input({ 
  id, 
  name,
  onChange, 
  onBlur, 
  className = '', // Добавляем пропс className с дефолтным значением
  suggestions = [], // Новый пропс для подсказок
  validation = {}, // Новый пропс для правил валидации
  ...props
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
    
    // Проверка минимального количества слов (учитывает двойные фамилии)
    if (isValid && validation.minWords && value) {
      // Разделяем по пробелам, но учитываем, что дефис не разделяет слова
      const words = value.trim().split(/\s+/).filter(word => word.replace(/-/g, '').length > 0);
      if (words.length < validation.minWords) {
        isValid = false;
        errorMessage = `Введите минимум ${validation.minWords} слова (например, "Иванов Иван")`;
      }
    }

    setError(errorMessage);
    return isValid;
  };

  const handleChange = (e) => {
    let newValue = e.target.value;
  
    if (validation?.numeric) {
      if (newValue && !/^\d+$/.test(newValue)) { // обязательно одно число, без пустых строк и без пробелов
        return;
      }
    }    

    if (validation?.numeric) {
      // запрещаем все, кроме цифр
      if (!/^\d*$/.test(newValue)) {
        return;
      }
    }
    if (validation?.alpha) {
      // разрешаем только буквы, дефисы, пробелы
      if (!/^[а-яА-ЯёЁa-zA-Z\s\-]*$/.test(newValue)) {
        return;
      }
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
        {...props}
        name={name}
        className={inputClasses}
        onChange={handleChange}
        onBlur={handleBlur}
        onPaste={handlePaste}
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