// components/CustomPrompt.jsx
import React, { useState } from 'react';
import Input from '../components/Input/Input';
export const CustomPrompt = ({ 
  title,
  fields, // Массив объектов { label, placeholder, valueKey }
  onConfirm, 
  onCancel 
}) => {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.valueKey]: '' }), {})
  );

  const handleChange = (valueKey, value) => {
    setFormData(prev => ({ ...prev, [valueKey]: value }));
  };

  return (
    <div className="prompt-overlay">
      <div className="prompt-modal">
        <h3>{title}</h3>
        
        {fields.map((field) => (
          <div key={field.valueKey} className="prompt-field">
            <label>{field.label}</label>
            <Input
              type="text"
              placeholder={field.placeholder}
              value={formData[field.valueKey]}
              onChange={(e) => handleChange(field.valueKey, e.target.value)}
              className=" prompt-input"
              validation= { field.valueKey === 'fio' ? { 
                required: true,
                alpha: true,
                minLength: 5,
                maxLength: 100,
                pattern: /^[а-яА-ЯёЁ\s\-]+$/,
                minWords: 2, 
                message: 'Допустимы только русские буквы, пробелы и дефисы'
              } : field.valueKey === 'position' ? {
                required: true,
                pattern: /^[а-яА-ЯёЁ\s\-]+$/,
                message: "Должность должна содержать только буквы и дефисы",
                maxLength: 50
              } : {
                  required: true
              }}
              title={ field.valueKey === 'fio' ? 'ФИО Должностного лица' : field.valueKey === 'position' ? 'Должность' : 'Название фирмы'}
              {...(field.valueKey === 'position' && {
                suggestions: ["Генеральный директор", "Директор", "Менеджер", "Главный бухгалтер"]
              })}
            />
          </div>
        ))}

        <div className="prompt-buttons">
          <button 
            onClick={() => onConfirm(formData)}
            className="prompt-button confirm"
          >
            Сохранить
          </button>
          <button 
            onClick={onCancel}
            className="prompt-button cancel"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomPrompt;