import React from 'react';
import Button from './Button/Button';
import Input from './Input/Input'; // Импортируем Input обратно
import DropdownMenu from './DropdownMenu';
import ErrorModal from './ErrorModal';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFileStore from './useFileStore';

export default function DocumentCreation() {
  const [isFormValid1, setIsFormValid1] = useState(true);
  const [isFormValid2, setIsFormValid2] = useState(false);
  const [fio, setFio] = useState('');
  const [selectedFirm, setSelectedFirm] = useState('');
  const [customFirm, setCustomFirm] = useState(''); 
  const [selectedFormat, setSelectedFormat] = useState('');
  const [isCreatesDocument, setIsCreatesDocument] = useState(false);
  const [error, setError] = useState(null);
  const [showCustomInput, setShowCustomInput] = useState(false); // Показывать ли Input
  const navigate = useNavigate();
  const setFile = useFileStore.getState().setFile;
  const [templates, setTemplates] = useState([]);

  // Получаем список фирм для выбранного формата 
  const getFirmsByFormat = (formatValue) => {
    const formatMap = {
      '1': 'Акт',
      '2': 'Заказ',
      '3': 'Отчет'
    };
  
    const selectedFormatName = formatMap[formatValue];
  
    // Убираем дубликаты фирм
    const uniqueFirms = new Set();
    return templates
      .filter(tpl => tpl.format === selectedFormatName)
      .filter(tpl => {
        if (uniqueFirms.has(tpl.firm)) return false;
        uniqueFirms.add(tpl.firm);
        return true;
      })
      .map((tpl, index) => ({
        value: tpl.firm,
        label: `Шаблон ${index + 1} (${tpl.firm})`
      }));
  };

  useEffect(() => {
    if (!selectedFormat) return; // Не загружаем, если формат не выбран
  
    const formatMap = {
      '1': 'Акт',
      '2': 'Заказ',
      '3': 'Отчет'
    };
  
    const formatName = formatMap[selectedFormat];
  
    fetch(`/api/templates?format=${formatName}`)
      .then(res => res.json())
      .then(data => {
        console.log('Полученные шаблоны:', data);
        setTemplates(data);
      })
      .catch(err => console.error('Ошибка загрузки шаблонов:', err));
  }, [selectedFormat]);
  

  useEffect(() => {
    setIsFormValid2(
      selectedFormat &&
      (showCustomInput ? customFirm.trim() !== '' : selectedFirm !== '')
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
    setShowCustomInput(true);

    if (value) {
      setCustomFirm(value); // Заполняем значением фирмы (без "Шаблон №")
    } 
    // Если ничего не выбрано, скрываем Input
    else {
      setShowCustomInput(false);
      setCustomFirm("");
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
    console.log(customFirm)
    const firmToCheck = showCustomInput ? customFirm : selectedFirm;
    console.log(firmToCheck)
    if (!firmToCheck || (showCustomInput && !customFirm.trim())) {
      setError(showCustomInput ? 'Введите название фирмы!' : 'Выберите фирму!'); 
      return;
    }
    
  
    setIsFormValid2(false);
    console.log(selectedFirm);
    if (selectedFirm) {
      navigate('/documentData', { 
        state: { 
          selectedFormat,
          selectedFirm: firmToCheck,
          customerFirm:  customFirm
        } 
      });
    }
  };

  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
  
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    try {
      const response = await fetch('/api/preview-template', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Ошибка загрузки и конвертации файла');
      }
  
      const data = await response.json();
      const { pdfUrl, docxFilename } = data;
  
      // ✅ Сохраняем файл в Zustand store
      const setFile = useFileStore.getState().setFile;
      setFile(selectedFile);
  
      navigate('/document', {
        state: {
          pdfUrl,
          docxFilename,
          originalFile: selectedFile,
        },
      });
  
    } catch (error) {
      console.error('Ошибка при отправке файла:', error);
      alert('Не удалось загрузить и конвертировать шаблон.');
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
                        placeholder='Выберите подходящий шаблон'
                        onChange={handleFirmChange}
                        value={selectedFirm}
                        options={getFirmsByFormat(selectedFormat)}
                      />
                    </div>
                    
                    {showCustomInput && (
                      <>
                        <Input
                          name="customerFirm"
                          type="text"
                          placeholder="Фирма Заказчика"
                          value={customFirm}
                          onChange={handleCustomFirmChange}
                        />
                      </>
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
               <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" className="icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                Создать документ
            </Button>
            <input
              type="file"
              id="existing-file-input"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              ref={fileInputRef}
              accept=".doc,.docx"
            />
 
            <Button 
              onClick={() => fileInputRef.current.click()}
              className={isFormValid1 ? "form-valid" : undefined}
            >
              <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" className="icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>

              Загрузить шаблон
            </Button>
          </div>
          <div className="form__decorative-image"></div>
        </>
      )}
    </div>
  );
}