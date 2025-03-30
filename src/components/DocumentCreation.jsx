import React from 'react';
import Button from './Button/Button';
import Input from './Input/Input';
import DropdownMenu from './DropdownMenu';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Импортируем хук для навигации

function ErrorModal({ message, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__content">
          <p>{message}</p>
          <button onClick={onClose} className="modal-button">
            Вернуться к созданию
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DocumentCreation() {
  const [firm, setFirm] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [isCreatesDocument, setIsCreatesDocument] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Создаем экземпляр navigate

  const shablon1 = { format: 'Акт', firm: 'Аниме' }; 
  const shablon2 = { format: 'Заказ', firm: 'Аниме' }; 
  const shablon3 = { format: 'Отчет', firm: 'ЖИРАФ' }; 
  const shablon4 = { format: 'Акт', firm: 'ЖИРАФ' }; 
  const shablon5 = { format: 'Заказ', firm: 'БАЙТ' }; 
  const shablon6 = { format: 'Отчет', firm: 'Море' }; 
  const acts = [shablon1, shablon4];
  const reports = [shablon2, shablon5];
  const orders = [shablon3, shablon6];

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleChange = (event) => {
    const { name, value} = event.target;
    if (name === 'firm') setFirm(value);
    console.log(value);
  }

  const handleCreateDocumentClick = () => {
    setIsCreatesDocument(true);
    setError(null); // NEW: Сбрасываем ошибку при новом создании

  }

  const handleBackClickFromError = () => {
    setError('Документ не найден');
  };

  const handleBackClick = () => {
    setIsCreatesDocument(false);
    setError(null);
  }

  const closeErrorModal = () => {
    setError(null);
    handleBackClick();
  };

  const handleContinueClick = () => {
    if (!firm.trim()) {
      setError('Введите фирму!'); 
      return;
    }
    const docExists = 
    selectedValue === '1' ? acts.some(item => item.firm?.toLowerCase() === firm.toLowerCase()) :
    selectedValue === '2' ? reports.some(item => item.firm?.toLowerCase() === firm.toLowerCase()) :
    orders.some(item => item.firm?.toLowerCase() === firm.toLowerCase());

    docExists ? navigate('/document') : handleBackClickFromError();
  }

  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      console.log("Выбран файл:", selectedFile);
      // Здесь можно:
      // 1. Отправить файл на сервер
      // 2. Сохранить в состоянии для дальнейшей обработки
      // 3. Показать информацию о файле пользователю
    }
  };

  


  return (
    <div id="createDoc" className="form__main">
      {error && isCreatesDocument && (
        <ErrorModal 
          message={error} 
          onClose={closeErrorModal}
        />
      )}

      {/* NEW: Текстовая ошибка (если не в режиме создания) */}
      {error && !isCreatesDocument && (
        <div className="error-message">{error}</div>
      )}
      {isCreatesDocument ? (
        <>
          <div className='form__createDoc'>
            <h2>{"Создание документа".toUpperCase()}</h2>
              <div className='form__doc-data'>
                <div className="select-wrapper">
                  <DropdownMenu
                    name="format"
                    id="shablon"
                    placeholder='Выберете формат'
                    onChange={handleSelectChange} // Передаем обработчик
                    value={selectedValue} // Контролируемое значение
                    options={[
                      { value: "1", label: "Акт" },
                      { value: "2", label: "Заказ" },
                      { value: "3", label: "Отчет" },
                    ]}
                  />
                </div>               
                <Input
                  name="firm"
                  type="text"
                  placeholder="Введите фирму"
                  value={firm}
                  onChange={handleChange}
                />
                <Input
                  name="FIO"
                  type="text"
                  placeholder="Введите ФИО юр.лица"
                />
              </div>
              <div id="back_and_cont" className="form__buttons" style={{flexDirection: 'row'}}>
                <Button onClick={handleBackClick}>Назад</Button>
                <Button onClick={handleContinueClick}>Продолжить</Button>
              </div>
  
          </div>
          
        </>
      ) : (
        <>
          <div className="form__img-notebook"></div>
          <div className="form__buttons">
            <Button onClick={handleCreateDocumentClick}>
                Создать документ
            </Button>
            <input
              type="file"
              id="existing-file-input"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              ref={fileInputRef}
              accept=".doc,.docx,.pdf,.txt" // Укажите нужные форматы
            />
            <Button onClick={() => fileInputRef.current.click()}>
                Выбрать имеющийся
            </Button>
          </div>
          <div className="form__decorative-image"></div>
        </>
      )}
    </div>
  );
}
