
import React, { useState } from 'react';
import Input from './Input/Input';
import DropdownMenu from './DropdownMenu';
import Button from './Button/Button';

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
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="save-template-title">
      <h2 id="save-template-title">Сохранить шаблон</h2>
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
            { value: 'Акт', label: 'Акт' },
            { value: 'Заказ', label: 'Заказ' },
            { value: 'Отчет', label: 'Отчет' },
          ]}
        />
        <div className="modal-buttons">
        <Button onClick={handleSaveClick} disabled={!firmName || !format}>
          Сохранить
        </Button>
          <Button onClick={onClose}>Отмена</Button>
        </div>
      </div>
    </div>
  );
};

export default SaveTemplateModal;
