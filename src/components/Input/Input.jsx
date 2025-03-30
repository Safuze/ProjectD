import React from 'react';

function Input({ id, type, placeholder, value, onChange, onBlur, name, style }) {
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
    />
  );
}

export default Input;