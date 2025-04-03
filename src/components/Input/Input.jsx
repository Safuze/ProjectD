import React from 'react';

function Input({ id, type, placeholder, value, onChange, onBlur, name, style }) {
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text/plain');
    onChange({ target: { name, value: pastedText } });
  };
  return (
    <input
      id={id}
      type={type}
      className='input'
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      name={name}
      style={style}
      onPaste={handlePaste}

    />
  );
}

export default Input;