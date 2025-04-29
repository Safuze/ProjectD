import React, { useState } from 'react';
import Input from '../components/Input/Input';
import DropdownMenu from '../components/DropdownMenu';
import Button from '../components/Button/Button';

const SaveTemplateModal = ({ onClose, onSave }) => {
  const [firmName, setFirmName] = useState('');
  const [format, setFormat] = useState('');

  const handleSaveClick = () => {
    if (firmName && format) {
      onSave({ firm: firmName, format });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Сохранить шаблон</h2>
        <Input
          placeholder="Название фирмы шаблона"
          value={firmName}
          onChange={(e) => setFirmName(e.target.value)}
        />
        <DropdownMenu
          placeholder="Выберите формат"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          options={[
            { value: '1', label: 'Акт' },
            { value: '2', label: 'Заказ' },
            { value: '3', label: 'Отчет' },
          ]}
        />
        <div className="modal-buttons">
          <Button onClick={handleSaveClick}>Сохранить</Button>
          <Button onClick={onClose}>Отмена</Button>
        </div>
      </div>
    </div>
  );
};

export default SaveTemplateModal;
