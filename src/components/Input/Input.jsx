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
  className = '' // Добавляем пропс className с дефолтным значением
}) {
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text/plain');
    onChange({ target: { name, value: pastedText } });
  };

  // Объединяем классы
  const inputClasses = `input ${className}`.trim();

  return (
    <input
      id={id}
      type={type}
      className={inputClasses} // Используем объединенные классы
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      name={name}
      style={style}
      onPaste={handlePaste}
      title={title}
    />
  );
}

export default Input;