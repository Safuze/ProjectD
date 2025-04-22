import { useState } from 'react';

function DropdownMenu({
  name,
  id,
  onChange,
  options,
  placeholder,
  className = '',
  value = "",
  validation = {}, // Добавляем пропс для валидации
  onBlur, // Добавляем пропс onBlur
  style, // Добавляем пропс style для совместимости
  title
}) {
  const [error, setError] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  const validate = (value) => {
    if (!validation) return true;
    
    let isValid = true;
    let errorMessage = '';
    
    if (validation.required && !value) {
      isValid = false;
      errorMessage = 'Это поле обязательно для заполнения';
    }
    
    setError(errorMessage);
    return isValid;
  };

  const handleChange = (e) => {
    if (onChange) onChange(e);
    if (isTouched) {
      validate(e.target.value);
    }
  };

  const handleBlur = (e) => {
    setIsTouched(true);
    validate(e.target.value);
    if (onBlur) onBlur(e);
  };

  const selectClasses = `dropdown-menu ${className} ${error ? 'dropdown-error' : ''}`.trim();

  return (
    <div className="dropdown-container">
      <select 
        className={selectClasses}
        name={name}
        id={id}
        onChange={handleChange}
        onBlur={handleBlur}
        value={value}
        style={style}
        title={title}
      >
        <option value="" hidden>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="dropdown-error-message">{error}</div>}
    </div>
  );
}

export default DropdownMenu;