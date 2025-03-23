import React from 'react';

function Input({ type, placeholder, value, onChange, onBlur, name }) {
  return (
    <input
      type={type}
      className='input'
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      name={name}
    />
  );
}

export default Input;