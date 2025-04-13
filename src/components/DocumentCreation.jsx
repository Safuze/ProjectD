import React from 'react';
import Button from './Button/Button';
import Input from './Input/Input'; // Импортируем Input обратно
import DropdownMenu from './DropdownMenu';
import ErrorModal from './ErrorModal';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DocumentCreation() {
  const [isFormValid1, setIsFormValid1] = useState(true);
  const [isFormValid2, setIsFormValid2] = useState(false);
  const [fio, setFio] = useState('');
  const [selectedFirm, setSelectedFirm] = useState('');
  const [customFirm, setCustomFirm] = useState(''); // Для хранения своего варианта
  const [selectedFormat, setSelectedFormat] = useState('');
  const [isCreatesDocument, setIsCreatesDocument] = useState(false);
  const [error, setError] = useState(null);
  const [showCustomInput, setShowCustomInput] = useState(false); // Показывать ли Input
  const navigate = useNavigate();

  // Шаблоны документов
  const shablon1 = { format: 'Акт', firm: 'Аниме' }; 
  const shablon2 = { format: 'Акт', firm: 'Байт' }; 
  const shablon3 = { format: 'Акт', firm: 'Жираф' }; 
  const shablon4 = { format: 'Акт', firm: 'Мега' }; 
  const shablon5 = { format: 'Акт', firm: 'Море' }; 
  const shablon6 = { format: 'Заказ', firm: 'Аниме' }; 
  const shablon7 = { format: 'Заказ', firm: 'Байт' }; 
  const shablon8 = { format: 'Заказ', firm: 'Мега' }; 
  const shablon9 = { format: 'Отчет', firm: 'Жираф' }; 
  const shablon10 = { format: 'Отчет', firm: 'Море' }; 

  const acts = [shablon1, shablon2, shablon3, shablon4, shablon5];
  const orders = [shablon6, shablon7, shablon8];
  const reports = [shablon9, shablon10];

  // Получаем список фирм для выбранного формата + добавляем "Свой вариант"
  const getFirmsByFormat = (formatValue) => {
    let firms = [];
    switch(formatValue) {
      case '1': firms = acts; break;
      case '2': firms = orders; break;
      case '3': firms = reports; break;
      default: firms = [];
    }
    
    // Добавляем "Свой вариант" в конец списка
    return [...firms, { format: '', firm: '-----------Свой вариант-----------'}];
  };

  useEffect(() => {
    setIsFormValid2(
      selectedFormat && 
      (selectedFirm || (showCustomInput && customFirm.trim() !== ''))
    );
  }, [selectedFormat, selectedFirm, showCustomInput, customFirm]);

  const handleFormatChange = (event) => {
    const value = event.target.value;
    setSelectedFormat(value);
    setSelectedFirm(''); // Сбрасываем выбор фирмы
    setShowCustomInput(false); // Скрываем Input
    setCustomFirm(''); // Очищаем свое значение
  };

  const handleFirmChange = (event) => {
    const value = event.target.value;
    setSelectedFirm(value);
    
    // Если выбран "Свой вариант", показываем Input
    if (value === '-----------Свой вариант-----------') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      setCustomFirm('');
    }
  };

  const handleCustomFirmChange = (event) => {
    setCustomFirm(event.target.value);
  };

  const handleCreateDocumentClick = () => {
    setIsCreatesDocument(true);
    setError(null);
  };

  const handleBackClick = () => {
    setSelectedFirm('');
    setSelectedFormat('');
    setCustomFirm('');
    setFio('');
    setShowCustomInput(false);
    setIsCreatesDocument(false);
    setError(null);
  };


  const handleContinueClick = () => {
    const firmToCheck = showCustomInput ? customFirm : selectedFirm;
    
    if (!firmToCheck || (showCustomInput && !customFirm.trim())) {
      setError(showCustomInput ? 'Введите название фирмы!' : 'Выберите фирму!'); 
      return;
    }
    
    const firms = getFirmsByFormat(selectedFormat);
    const docExists = firms.some(item => 
      item.firm === firmToCheck || 
      (showCustomInput && item.firm?.toLowerCase() === customFirm.toLowerCase())
    );
    
    setIsFormValid2(false);
    docExists ? navigate('/documentData') : navigate('/document');
  };

  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      console.log("Выбран файл:", selectedFile);
    }
  };

  return (
    <div id="createDoc" className="form__main">

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
                    id="format"
                    placeholder='Выберите формат'
                    onChange={handleFormatChange}
                    value={selectedFormat}
                    options={[
                      { value: "1", label: "Акт" },
                      { value: "2", label: "Заказ" },
                      { value: "3", label: "Отчет" },
                    ]}
                  />
                </div>
                
                {selectedFormat && (
                  <>
                    <div className="select-wrapper">
                      <DropdownMenu
                        name="firm"
                        id="firm"
                        placeholder='Выберите фирму'
                        onChange={handleFirmChange}
                        value={selectedFirm}
                        options={getFirmsByFormat(selectedFormat).map(item => ({
                          value: item.firm,
                          label: item.firm
                        }))}
                      />
                    </div>
                    
                    {showCustomInput && (
                      <Input
                        name="customFirm"
                        type="text"
                        placeholder="Введите название фирмы"
                        value={customFirm}
                        onChange={handleCustomFirmChange}
                      />
                    )}
                  </>
                )}
              </div>
              <div id="back_and_cont" className="form__buttons" style={{flexDirection: 'row'}}>
                <Button 
                  onClick={handleBackClick}
                  className={isFormValid1 ? "form-valid" : undefined}
                >
                  Назад
                </Button>
                <Button 
                  onClick={handleContinueClick}
                  className={isFormValid2 ? "form-valid" : undefined}
                  disabled={!isFormValid2}
                >
                  Продолжить
                </Button>
              </div>
          </div>
        </>
      ) : (
        <>
          <div className="form__img-notebook"></div>
          <div className="form__buttons">
            <Button 
              onClick={handleCreateDocumentClick}
              className={isFormValid1 ? "form-valid" : undefined}
            >
                Создать документ
            </Button>
            <input
              type="file"
              id="existing-file-input"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              ref={fileInputRef}
              accept=".doc,.docx,.pdf,.txt"
            />
            <Button 
              onClick={() => fileInputRef.current.click()}
              className={isFormValid1 ? "form-valid" : undefined}
            >
              Выбрать имеющийся
            </Button>
          </div>
          <div className="form__decorative-image"></div>
        </>
      )}
    </div>
  );
}