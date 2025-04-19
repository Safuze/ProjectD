import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Background from '../components/Background';
import Navbar from '../components/Navbar';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import RangeDatePicker from '../components/RangeDatePicker';

// Инициализация хранилища шаблонов
const initializeTemplates = () => {
  return Array(10).fill(null).map(() => []);
};

const DocumentData = ({ setIsCreatingDocument, userLogin, onLogin, setDocumentReady }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [templates, setTemplates] = useState(initializeTemplates());
    const [currentDocument, setCurrentDocument] = useState(null);
    const [template, setTemplate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // В useEffect при получении location.state:
    useEffect(() => {
        if (location.state) {
            const { selectedFormat, selectedFirm, customerFirm } = location.state;
            const firmToUse = selectedFirm;
            const templateIndex = getTemplateIndex(selectedFormat, firmToUse);
            
            setTemplate({ 
                format: selectedFormat, 
                firm: firmToUse,
                index: templateIndex
            });
            
            const newDocument = initializeDocument(
                selectedFormat, 
                firmToUse, 
                templateIndex,
                customerFirm    // Передаем фирму заказчика
            );
            
            setCurrentDocument(newDocument);
        } else {
            navigate('/document');
        }
        setIsLoading(false);
    }, [location.state, navigate]);

    // Функция для определения индекса шаблона
    const getTemplateIndex = (format, firm) => {
        // Ваша логика сопоставления формата и фирмы с индексом
        // Например:
        if (format === '1' && firm === 'Аниме') return 0;
        if (format === '1' && firm === 'Байт') return 1;
        if (format === '1' && firm === 'Жираф') return 2;
        if (format === '1' && firm === 'Мега') return 3;
        if (format === '1' && firm === 'Море') return 4; 
        if (format === '2' && firm === 'Аниме') return 5; 
        if (format === '2' && firm === 'Байт') return 6; 
        if (format === '2' && firm === 'Мега') return 7; 
        if (format === '3' && firm === 'Жираф') return 8; 
        if (format === '3' && firm === 'Море') return 9; 

        return 0; // fallback
    };

    const initializeDocument = (format, firm, templateIndex, customerFirm) => {
        // Создаем базовую структуру документа в зависимости от шаблона
        let newDocument = {};
        
        // Общие поля для всех шаблонов
        newDocument = {
            contractor: { // Исполнитель
                firmName: '',
                position: '',
                personName: ''
            },
            customer: { // Заказчик
                firmName: customerFirm || '',
                position: '',
                personName: ''
            },
            periodStartDate: '',
            periodEndDate: ''
            // ... другие общие поля
        };

        // Специфичные поля для каждого шаблона
        switch(templateIndex) {
            case 0: // Акт Аниме
                newDocument = {
                    ...newDocument,
                    city: customerFirm === "Аниме".toLowerCase() ? 'Москва' : '',
                    contractNumber: '',
                    contractDate: customerFirm === "Аниме".toLowerCase() ? '01.07.24' : '',
                    orderNumber: '',
                    nds: customerFirm === "Аниме".toLowerCase() ? '5' : '',
                    specialists: [] // Массив специалистов
                };
                break;
            case 1: // Акт Байт
                newDocument = {
                    ...newDocument,
                    city: '',
                    contractNumber: '',
                    contractDate: '',
                    applicationNumber: '',
                    works: [] // Массив работ
                };
                break;
            // ... аналогично для остальных шаблонов
            case 2: // Акт Жираф
                newDocument = {
                    ...newDocument,
                    contractNumber: '',
                    contractDate: '',
                    actNumber: '',
                    completedWorks: '',
                    workCost: '',
                    transferAmount: '',
                    links: [],
                    report: {
                        reportNumber: '',
                        contractNumber: '',
                        contractDate: ''
                    }
                };
                break;
            case 3:
                newDocument = {
                    ...newDocument,
                    city: '',
                    contractNumber: '',
                    contractDate: '',
                    orderNumber: '',
                    nds: '',
                    specialists: [] // Массив специалистов
                }
                break;
            case 4:
                newDocument = {
                    ...newDocument,
                    city: '',
                    contractNumber: '',
                    contractDate: '',
                    actNumber: '',
                    nds: '',
                    percentAward: '',
                    services: [] // Массив специалистов
                }
                break;
            case 5:
                newDocument = {
                    ...newDocument,
                    city: '',
                    contractNumber: '',
                    contractDate: '',
                    orderNumber: '',
                    nds: '',
                    works: [] // Массив работ
                }
                break;
            case 6:
                newDocument = {
                    ...newDocument,
                    contractNumber: '',
                    contractDate: '',
                    applicationNumber: '',
                    works: [],
                    contractorsList: []
                }
                break;
            case 7:
                newDocument = {
                    ...newDocument,
                    city: '',
                    contractNumber: '',
                    contractDate: '',
                    orderNumber: '',
                    nds: '',
                    works: []                
                }
                break;
            case 8:
                newDocument = {
                    ...newDocument,
                    city: '',
                    applicationNumber: '',
                    nds: '',
                    contractorsWork: []
                }
                break;
            case 9:
                newDocument = {
                    ...newDocument,
                    city: '',
                    contractNumber: '',
                    contractDate: '',
                    specialists: []    
                }
                break;   
        }

        return newDocument;
    };

    const handleBackClick = () => {
        setIsCreatingDocument(true);
        setDocumentReady(false);
        navigate(-1);
    };

    const handleGenerateDoc = () => {
        if (!isFormValid) {
            alert('Заполните все обязательные поля перед генерацией документа');
            return;
        }

        // Добавляем документ в соответствующий шаблон
        const updatedTemplates = [...templates];
        updatedTemplates[template.index].push(currentDocument);
        setTemplates(updatedTemplates);

        // Сохраняем все шаблоны в localStorage или отправляем на сервер
        localStorage.setItem('documentTemplates', JSON.stringify(updatedTemplates));

        setDocumentReady(true);
        navigate('/document');
    };

    // Функция для получения обязательных полей для шаблона
    const getRequiredFieldsForTemplate = (templateIndex) => {
        switch(templateIndex) {
            case 0: return ['contractor.firmName', 'contractor.position', 'contractor.personName', 'customer.position','customer.personName', 'periodStartDate', 'periodEndDate'];
            case 1: return ['contractor.firmName', 'contractor.position', 'contractor.personName', 'customer.firmName', 'customer.position','customer.personName', 'periodStartDate', 'periodEndDate'];
            case 2: return ['contractor.firmName', 'contractor.position', 'contractor.personName', 'customer.firmName', 'customer.position','customer.personName', 'periodStartDate', 'periodEndDate'];
            case 3: return ['contractor.firmName', 'contractor.position', 'contractor.personName', 'customer.firmName', 'customer.position','customer.personName', 'periodStartDate', 'periodEndDate'];
            case 4: return ['contractor.firmName', 'contractor.position', 'contractor.personName', 'customer.firmName', 'customer.position','customer.personName', 'periodStartDate', 'periodEndDate'];
            case 5: return ['contractor.firmName', 'contractor.position', 'contractor.personName', 'customer.firmName', 'customer.position','customer.personName', 'periodStartDate', 'periodEndDate'];
            case 6: return ['contractor.firmName', 'contractor.position', 'contractor.personName', 'customer.firmName', 'customer.position','customer.personName', 'periodStartDate', 'periodEndDate'];
            case 7: return ['contractor.firmName', 'contractor.position', 'contractor.personName', 'customer.firmName', 'customer.position','customer.personName', 'periodStartDate', 'periodEndDate'];
            case 8: return ['contractor.firmName', 'contractor.position', 'contractor.personName', 'customer.firmName', 'customer.position','customer.personName', 'periodStartDate', 'periodEndDate'];
            case 9: return ['contractor.firmName', 'contractor.position', 'contractor.personName', 'customer.firmName', 'customer.position','customer.personName', 'periodStartDate', 'periodEndDate'];

            default: return [];
        }
    };

    // Функция для получения значения из вложенного объекта
    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((o, p) => o?.[p], obj);
    };


    // Проверка валидности формы
    const isFormValid = useMemo(() => {
        if (!currentDocument) return false;
        
        // Проверяем обязательные поля
        const requiredFields = getRequiredFieldsForTemplate(template.index);
        return requiredFields.every(field => {
            const value = getNestedValue(currentDocument, field);
            return value !== '' && value !== null && value !== undefined;
        });
    }, [currentDocument, template]);

    
    // Обработчик изменения полей
    const handleFieldChange = (path, value) => {
        setCurrentDocument(prev => {
            const keys = path.split('.');
            const newDoc = {...prev};
            let current = newDoc;
            
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]] = {...current[keys[i]]};
            }
            
            current[keys[keys.length - 1]] = value;
            return newDoc;
        });
    };

    // Добавление элемента в массив (специалисты, работы и т.д.)
    const addArrayItem = (arrayName, itemStructure) => {
        setCurrentDocument(prev => ({
            ...prev,
            [arrayName]: [...prev[arrayName], {...itemStructure}]
        }));
    };

    // Удаление элемента из массива
    const removeArrayItem = (arrayName, index) => {
        setCurrentDocument(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].filter((_, i) => i !== index)
        }));
    };

    // Изменение элемента в массиве
    const handleArrayItemChange = (arrayName, index, field, value) => {
        setCurrentDocument(prev => {
            const updatedArray = [...prev[arrayName]];
            updatedArray[index] = {...updatedArray[index], [field]: value};
            return {...prev, [arrayName]: updatedArray};
        });
    };

    const renderContractorCustomerFields = () => (
        <>
            <div className="form-section">
                <h4>Исполнитель</h4>
                <div className="firm-info">
                    <Input
                        value={currentDocument.contractor.firmName}
                        onChange={(e) => handleFieldChange('contractor.firmName', e.target.value)}
                        placeholder="Название фирмы"
                    />
                    <Input
                        value={currentDocument.contractor.position}
                        onChange={(e) => handleFieldChange('contractor.position', e.target.value)}
                        placeholder="Должностное лицо"
                    />
                    <Input
                        value={currentDocument.contractor.personName}
                        onChange={(e) => handleFieldChange('contractor.personName', e.target.value)}
                        placeholder="ФИО Должностного лица"
                    />
                </div>
            </div>
    
            <div className="form-section">
                <h4>Заказчик: ООО "{currentDocument.customer.firmName}"</h4>
                <div className="firm-info">
                    <Input
                        value={currentDocument.customer.position}
                        onChange={(e) => handleFieldChange('customer.position', e.target.value)}
                        placeholder="Должностное лицо"
                    />
                    <Input
                        value={currentDocument.customer.personName}
                        onChange={(e) => handleFieldChange('customer.personName', e.target.value)}
                        placeholder="ФИО Должностного лица"
                    />
                </div>
            </div>
        </>
    );

    // Рендер полей в зависимости от шаблона
    const renderTemplateFields = () => {
        if (!template || !currentDocument) return null;

        switch(template.index) {
            case 0: // Акт Аниме
                return (
                    <div className="template-fields">
                        {renderContractorCustomerFields()}
                        <div className="form-section">
                            <h4>Данные Документа</h4>
                            <div className='section-data'>
                                <div className='section-data__input'>
                                    <div className='date-input'>
                                        <span>Договор создан:</span>       
                                        <Input
                                            value={currentDocument.contractDate}
                                            type='date'
                                            onChange={(e) => handleFieldChange('contractDate', e.target.value)}
                                            placeholder="Дата Заключения Договора"
                                            style={{color: currentDocument.contractDate === '' ? 'grey' : 'black'}}
                                        />
                                    </div>
                                    <Input
                                            value={currentDocument.contractNumber}
                                            onChange={(e) => handleFieldChange('contractNumber', e.target.value)}
                                            placeholder="Номер Договора"
                                        />
                                    <Input
                                        value={currentDocument.orderNumber}
                                        onChange={(e) => handleFieldChange('orderNumber', e.target.value)}
                                        placeholder="Номер Заказа"
                                    />
                                    <Input
                                        value={currentDocument.city}
                                        onChange={(e) => handleFieldChange('city', e.target.value)}
                                        placeholder="Город"
                                    />
                                    <Input
                                        value={currentDocument.nds}
                                        onChange={(e) => handleFieldChange('nds', e.target.value)}
                                        placeholder="НДС, %"
                                    />      
                                </div>
                                <div className='section-data__calendar'>
                                    <h4>Выберите отчетный период:</h4>
                                    <RangeDatePicker 
                                        onDateRangeSelect={(range) => {
                                            handleFieldChange('periodStartDate', range.startDate);
                                            handleFieldChange('periodEndDate', range.endDate);
                                        }}
                                    />
                                </div>
                            </div>                  
                        </div>
                        <div className="form-section">
                            <h4>Специалисты</h4>
                            {currentDocument.specialists.map((specialist, index) => (
                                <div key={index} className="array-item">
                                    <Input
                                        value={specialist.category}
                                        onChange={(e) => handleArrayItemChange('specialists', index, 'category', e.target.value)}
                                        placeholder="Категория специалиста"
                                        style={{width:'35%'}}

                                    />
                                    <Input
                                        value={specialist.costRate}
                                        onChange={(e) => handleArrayItemChange('specialists', index, 'costRate', e.target.value)}
                                        placeholder="Стоимость ставки нормо-часа специалиста, в т.ч. НДС 5%"
                                        style={{width:'60%'}}
                                    />
                                    <Input
                                        value={specialist.resourcesSpent}
                                        onChange={(e) => handleArrayItemChange('specialists', index, 'resourcesSpent', e.target.value)}
                                        placeholder="Объем затраченных ресурсов специалиста за Отчетный период, чел./час"
                                        style={{width:'80%'}}

                                    />
                                   
                                    <button onClick={() => removeArrayItem('specialists', index)}>×</button>
                                </div>
                            ))}
                            <Button id='add-spec'onClick={() => addArrayItem('specialists', { category: '', rate: '', hours: '' })}>
                                Добавить специалиста
                            </Button>
                        </div>
                    </div>
                );
            case 1: // Акт Байт
                return null
            case 2: // Акт Жираф
                return null;
            case 3: // Акт Мега 
                return null;

            case 4: // Акт Море
                return null;
            case 5: // Заказ Аниме
                return null;
            case 6: // Заказ Байт
                return null;
            case 7: // Заказ Мега
                return null;
            case 8: // Отчет Жираф
            return null;
            case 9: // Отчет море 
                default:
                return null;
        }
    };

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (!template) {
        return (
            <div>
                <Background />
                <div className="grid-container">
                    <Navbar userLogin={userLogin} onLogout={onLogin} />
                    <div className="main-content">
                        <div className="error-message">
                            Не удалось загрузить данные шаблона
                        </div>
                        <Button onClick={() => navigate('/document')}>Назад</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Background />
            <div className="grid-container">
                <Navbar userLogin={userLogin} onLogout={onLogin} />
                <div id="dataForm" className="main-content">
                    <div className="main-content__header">
                        <button onClick={handleBackClick} className="back-button"></button>
                        <h4>Заполните данные документа</h4>
                    </div>
                    
                    <div className="document-data-form">
                        {renderTemplateFields()}
                    </div>
                    
                    <div className="form-actions">
                        <Button 
                            onClick={handleGenerateDoc}
                            disabled={!isFormValid}
                        >
                            Сгенерировать документ
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentData;