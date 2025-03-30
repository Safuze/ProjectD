// components/CustomPrompt.jsx
import React, { useState } from 'react';

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
            <input
              type="text"
              placeholder={field.placeholder}
              value={formData[field.valueKey]}
              onChange={(e) => handleChange(field.valueKey, e.target.value)}
              className="prompt-input"
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