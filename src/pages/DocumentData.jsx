import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Background from '../components/Background';
import Navbar from '../components/Navbar';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import RangeDatePicker from '../components/RangeDatePicker';
import DropdownMenu from '../components/DropdownMenu';
import citiesData from '../russian-cities.json';
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
    const [shablon, setShablon] = useState('');
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const cities = citiesData.map(city => city.name);
    const [userProfileData, setUserProfileData] = useState({
        fullName: '',
        position: '',
        firm: ''
    });

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

    // Загрузка данных пользователя при монтировании
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`http://localhost:3001/get-user-profile?login=${userLogin}`);
                const data = await response.json();
                
                if (response.ok && data.user) {
                    setUserProfileData({
                        fullName: data.user.full_name || '',
                        position: data.user.position || '',
                        firm: data.user.firm || ''
                    });
                    
                    // Автозаполнение полей исполнителя, если документ уже создан
                    if (!currentDocument) {
                        setCurrentDocument(prev => ({
                            ...prev,
                            contractor: {
                                ...prev.contractor,
                                personName: data.user.full_name || prev.contractor.personName,
                                position: data.user.position || prev.contractor.position,
                                firmName: data.user.firm || prev.contractor.firmName
                            }
                        }));
                    }
                }
            } catch (error) {
                console.error('Ошибка при загрузке профиля:', error);
            }
        };

        if (userLogin) {
            fetchUserProfile();
        }
    }, [userLogin]);

    // Функция для фильтрации городов:
    const handleCityInputChange = (value) => {
        handleFieldChange('city', value);
        
        if (value.length >= 2) {
          const filteredCities = cities.filter(city => 
            city.toLowerCase().includes(value.toLowerCase())
          ).slice(0, 10); // Показываем только первые 10 результатов
          
          setCitySuggestions(filteredCities);
          setShowSuggestions(true);
        } else {
          setCitySuggestions([]);
          setShowSuggestions(false);
        }
      };

    // функция для выбора города из подсказок
    const handleCitySelect = (city) => {
        handleFieldChange('city', city);
        setShowSuggestions(false);
    };
    
    // Функция для определения индекса шаблона
    const getTemplateIndex = (format, firm) => {
        // Ваша логика сопоставления формата и фирмы с индексом
        // Например:
        format === '1' ? setShablon('АКТ') : format === '2' ? setShablon('ЗАКАЗ') : setShablon('ОТЧЕТ');

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
                firmName: userProfileData.firm || '',
                position:  userProfileData.position || '',
                personName: userProfileData.fullName || ''
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
                    city: '',
                    contractNumber: '',
                    contractDate: '',
                    orderNumber: '',
                    nds: '',
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
                    resultsWork: '',
                    workCost: '',
                    transferAmount: '',
                    links: [],
                    reportNumber: ''
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
        console.log(currentDocument);
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
        <div className='form-firm'>
            <div className="form-section">
                <h4>Исполнитель</h4>
                <div className="firm-info">
                    <Input
                        value={currentDocument.contractor.firmName}
                        onChange={(e) => handleFieldChange('contractor.firmName', e.target.value)}
                        placeholder="Название фирмы"
                        title='Название фирмы'
                        validation={{required: true}}
                    />
                    <Input
                        name="Должностное лицо"
                        value={currentDocument.contractor.position}
                        onChange={(e) => handleFieldChange('contractor.position', e.target.value)}
                        placeholder="Должностное лицо"
                        suggestions={["Генеральный директор", "Директор", "Менеджер", "Главный бухгалтер"]}
                        title='Должностное лицо'
                        validation={{
                            required: true,
                            pattern: /^[а-яА-ЯёЁ\s\-]+$/,
                            message: "Должность должна содержать только буквы и дефисы",
                            maxLength: 50
                        }}
                    />
                    <Input
                        value={currentDocument.contractor.personName}
                        onChange={(e) => handleFieldChange('contractor.personName', e.target.value)}
                        placeholder="ФИО Должностного лица"
                        validation={{ 
                            required: true,
                            alpha: true,
                            minLength: 5,
                            maxLength: 100,
                            pattern: /^[а-яА-ЯёЁ\s\-]+$/,
                            minWords: 2, 
                            message: 'Допустимы только русские буквы, пробелы и дефисы'
                          }}
                        title='ФИО Должностного лица'
                    />
                </div>
                <div className="profile-data-hint">
                    {userProfileData.fullName && 
                        `Данные взяты из вашего профиля. Чтобы изменить их постоянно, перейдите в Личный кабинет.`}
                </div>
            </div>
    
            <div className="form-section">
                <h4>Заказчик: ООО "{currentDocument.customer.firmName}"</h4>
                <div className="firm-info">
                    <Input
                        name="Должностное лицо"
                        value={currentDocument.customer.position}
                        onChange={(e) => handleFieldChange('customer.position', e.target.value)}
                        placeholder="Должностное лицо"
                        suggestions={["Генеральный директор", "Директор", "Менеджер", "Главный бухгалтер"]}
                        title='Должностное лицо'
                        validation={{
                            required: true,
                            pattern: /^[а-яА-ЯёЁ\s\-]+$/,
                            message: "Должность должна содержать только буквы и дефисы",
                            maxLength: 50
                        }}
                    />
                    <Input
                        value={currentDocument.customer.personName}
                        onChange={(e) => handleFieldChange('customer.personName', e.target.value)}
                        placeholder="ФИО Должностного лица"
                        validation={{ 
                            required: true,
                            alpha: true,
                            minLength: 5,
                            maxLength: 100,
                            pattern: /^[а-яА-ЯёЁ\s\-]+$/,
                            minWords: 2,
                            message: 'Допустимы только русские буквы, пробелы и дефисы'
                          }}
                        title='ФИО Должностного лица'

                    />
                </div>
            </div>
        </div>
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
                                            validation={{ required: true, date: true }}
                                            title='Дата Заключения Договора'
                                        />
                                    </div>
                                    <Input
                                            value={currentDocument.contractNumber}
                                            onChange={(e) => handleFieldChange('contractNumber', e.target.value)}
                                            placeholder="Номер Договора"
                                            validation={{ 
                                                required: true,
                                                pattern: /^[1-9]\d*$/,
                                                message: "Введите целое число больше нуля (без пробелов)",
                                                minLength: 1,
                                                maxLength: 20,
                                                validate: (value) => !/\s/.test(value)
                                              }}
                                            title='Номер Договора'

                                        />
                                    <Input
                                        value={currentDocument.orderNumber}
                                        onChange={(e) => handleFieldChange('orderNumber', e.target.value)}
                                        placeholder="Номер Заказа"
                                        validation={{ 
                                            required: true,
                                            pattern: /^[1-9]\d*$/,
                                            message: "Введите целое число больше нуля (без пробелов)",
                                            minLength: 1,
                                            maxLength: 20,
                                            validate: (value) => !/\s/.test(value)
                                          }}
                                        title='Номер Заказа'

                                    />
                                    <div className="city-input-container">
                                    <Input
                                        value={currentDocument.city}
                                        onChange={(e) => handleCityInputChange(e.target.value)}
                                        placeholder="Город"
                                        validation={{
                                        required: true,
                                        pattern: /^[а-яА-ЯёЁ\s\-]+$/,
                                        message: "Город должен содержать только буквы и дефисы",
                                        maxLength: 50
                                        }}
                                        title='Укажите город'
                                    />
                                    {showSuggestions && citySuggestions.length > 0 && (
                                        <ul className="city-suggestions">
                                        {citySuggestions.map((city, index) => (
                                            <li 
                                            key={index} 
                                            onClick={() => handleCitySelect(city)}
                                            >
                                            {city}
                                            </li>
                                        ))}
                                        </ul>
                                    )}
                                    </div>       
                                    <DropdownMenu
                                        className="data-select"
                                        placeholder="НДС (%)"
                                        name={`nds`}
                                        value={currentDocument.nds}
                                        onChange={(e) => handleFieldChange('nds', e.target.value)}
                                        options={[
                                            { value: '5', label: '5%' },
                                            { value: '7', label: '7%' },
                                            { value: '10', label: '10%' },
                                            { value: '20', label: '20%' },
                                            ]}
                                        validation={{ required: true }}
                                        title='% НДС'

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
                                    <div>
                                        <Input
                                            value={specialist.category}
                                            onChange={(e) => handleArrayItemChange('specialists', index, 'category', e.target.value)}
                                            placeholder="Категория специалиста"
                                            validation={{
                                                required: true,
                                                pattern: /^[а-яА-ЯёЁ\s\-]+$/,
                                                message: "Категория должна содержать только буквы и дефисы",
                                                maxLength: 50
                                            }}
                                            title='Роль специалиста'
                                        />
                                        <Input
                                            value={specialist.costRate}
                                            onChange={(e) => handleArrayItemChange('specialists', index, 'costRate', e.target.value)}
                                            placeholder="Стоимость ставки нормо-часа, в т.ч. НДС 5%"
                                            validation={{ 
                                                required: true,
                                                pattern: /^\d+(\.\d{1,2})?$/,
                                                message: 'Введите число (например: 1000 или 1000.50)',
                                                validate: (value) => !/\s/.test(value)
                                            }}
                                            title='Введите стоимость в рублях, копейки укажите через точку'

                                        />
                                        <Input
                                            value={specialist.resourcesSpent}
                                            onChange={(e) => handleArrayItemChange('specialists', index, 'resourcesSpent', e.target.value)}
                                            placeholder="Количество часов"
                                            validation={{ 
                                                required: true,
                                                pattern: /^[1-9]\d*$/,
                                                message: "Введите целое число больше нуля (без пробелов)",
                                                validate: (value) => !/\s/.test(value), // Дополнительная проверка на пробелы
                                                minLength: 1,
                                                maxLength: 4 
                                            }}
                                            title="Количество часов (целое число)"
                                            />
                                    </div>
                                    <button  onClick={() => removeArrayItem('specialists', index)}>×</button>

                                </div>
                            ))}
                            <Button id='add-spec'onClick={() => addArrayItem('specialists', { category: '', rate: '', hours: '' })}>
                                Добавить специалиста
                            </Button>
                        </div>
                    </div>
                );
            case 1: // Акт Байт
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
                                            validation={{ required: true, date: true }}
                                            title='Дата Заключения Договора'                                            
                                            style={{color: currentDocument.contractDate === '' ? 'grey' : 'black'}}
                                        />
                                    </div>
                                    <Input
                                            value={currentDocument.contractNumber}
                                            onChange={(e) => handleFieldChange('contractNumber', e.target.value)}
                                            placeholder="Номер Договора"
                                            validation={{ 
                                                required: true,
                                                pattern: /^[1-9]\d*$/,
                                                message: "Введите целое число больше нуля (без пробелов)",
                                                minLength: 1,
                                                maxLength: 20,
                                                validate: (value) => !/\s/.test(value)
                                              }}
                                            title='Номер Договора'
                                        />
                                    <Input
                                        placeholder="Номер Заявки"
                                        value={currentDocument.applicationNumber}
                                        onChange={(e) => handleFieldChange('applicationNumber', e.target.value)}
                                        validation={{ 
                                            required: true,
                                            pattern: /^[1-9]\d*$/,
                                            message: "Номер должен содержать только натуральные числа",
                                            minLength: 1,
                                            maxLength: 20
                                          }}
                                    />
                                    <div className="city-input-container">
                                        <Input
                                            value={currentDocument.city}
                                            onChange={(e) => handleCityInputChange(e.target.value)}
                                            placeholder="Город"
                                            validation={{
                                            required: true,
                                            pattern: /^[а-яА-ЯёЁ\s\-]+$/,
                                            message: "Город должен содержать только буквы и дефисы",
                                            maxLength: 50
                                            }}
                                            title='Укажите город'
                                        />
                                        {showSuggestions && citySuggestions.length > 0 && (
                                            <ul className="city-suggestions">
                                            {citySuggestions.map((city, index) => (
                                                <li 
                                                key={index} 
                                                onClick={() => handleCitySelect(city)}
                                                >
                                                {city}
                                                </li>
                                            ))}
                                            </ul>
                                        )}
                                    </div> 
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
                            <h4>Выполненные работы</h4>
                            {currentDocument.works.map((work, index) => (
                                <div key={index} className="array-item">
                                    <div>
                                        <Input
                                            value={work.name}
                                            onChange={(e) => handleArrayItemChange('works', index, 'name', e.target.value)}
                                            placeholder="Название задачи"
                                            validation={{required: true}}
                                            title="Название задачи"
                                            
                                        />
                                        <Input
                                            value={work.cost}
                                            onChange={(e) => handleArrayItemChange('works', index, 'cost', e.target.value)}
                                            placeholder="Цена, руб, без НДС"
                                            validation={{ 
                                                required: true,
                                                pattern: /^\d+(\.\d{1,2})?$/,
                                                message: 'Введите число (например: 1000 или 1000.50)'
                                            }}
                                            title='Введите цену в рублях, копейки укажите через точку'
                                        />
                                        <Input
                                            value={work.count}
                                            onChange={(e) => handleArrayItemChange('works', index, 'count', e.target.value)}
                                            placeholder="Количество"
                                            validation={{ 
                                                required: true,
                                                pattern: /^\d+(\.\d{1,2})?$/,
                                                message: 'Введите число'
                                            }}
                                            title="Количество"

                                        />
                                    </div>
                                    <button onClick={() => removeArrayItem('works', index)}>×</button>
                                </div>
                            ))}
                            <Button id='add-spec'onClick={() => addArrayItem('works', { name: '', cost: '', count: '' })}>
                                Добавить работу
                            </Button>
                        </div>
                    </div>
                );                
            case 2: // Акт Жираф
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
                                            validation={{ required: true, date: true }}
                                            title='Дата Заключения Договора'
                                            style={{color: currentDocument.contractDate === '' ? 'grey' : 'black'}}
                                        />
                                    </div>
                                    <Input
                                            value={currentDocument.contractNumber}
                                            onChange={(e) => handleFieldChange('contractNumber', e.target.value)}
                                            validation={{ 
                                                required: true,
                                                pattern: /^[1-9]\d*$/,
                                                message: "Введите целое число больше нуля (без пробелов)",
                                                minLength: 1,
                                                maxLength: 20,
                                                validate: (value) => !/\s/.test(value)
                                              }}
                                            placeholder="Номер Договора"
                                            title='Номер Договора'
                                        />
                                    <Input
                                        value={currentDocument.actNumber}
                                        onChange={(e) => handleFieldChange('actNumber', e.target.value)}
                                        placeholder="Номер Акта"
                                        validation={{ 
                                            required: true,
                                            pattern: /^[1-9]\d*$/,
                                            message: "Введите целое число больше нуля (без пробелов)",
                                            minLength: 1,
                                            maxLength: 20,
                                            validate: (value) => !/\s/.test(value)
                                          }}
                                        title='Номер Акта'
                                    />
                                    <Input
                                        value={currentDocument.workCost}
                                        onChange={(e) => handleFieldChange('workCost', e.target.value)}
                                        validation={{ 
                                            required: true,
                                            pattern: /^\d+(\.\d{1,2})?$/,
                                            message: 'Введите число (например: 1000 или 1000.50)'
                                        }}
                                        placeholder="Cтоимость выполненных Работ (руб, коп.)"
                                        title='Cтоимость выполненных Работ (руб, коп.)'
                                    />
                                    <Input
                                        value={currentDocument.transferAmount}
                                        onChange={(e) => handleFieldChange('transferAmount', e.target.value)}
                                        placeholder="Сумма к перечислению (руб, коп.)"
                                        validation={{ 
                                            required: true,
                                            pattern: /^\d+(\.\d{1,2})?$/,
                                            message: 'Введите число (например: 1000 или 1000.50)'
                                        }}
                                        title='Введите сумму к перечислению в рублях, копейки укажите через точку'
                                    />
                                    <Input
                                        value={currentDocument.links}
                                        onChange={(e) => handleFieldChange('links', e.target.value)}
                                        placeholder="Ссылки с результатами работ"
                                        validation={{
                                            validate: (value) => {
                                              if (!value) return true;
                                              const urls = value.split(/[\s,]+/);
                                              return urls.every(url => 
                                                /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(url.trim())
                                              );
                                            },
                                            message: "Одна или несколько ссылок имеют неверный формат"
                                          }}
                                        title='Ссылки с результатами работ'
                                        />
                                    <Input
                                        value={currentDocument.reportNumber}
                                        onChange={(e) => handleFieldChange('reportNumber', e.target.value)}
                                        placeholder="Номер отчета к приложению"
                                        validation={{ 
                                            required: true,
                                            pattern: /^[1-9]\d*$/,
                                            message: "Введите целое число больше нуля (без пробелов)",
                                            minLength: 1,
                                            maxLength: 20,
                                            validate: (value) => !/\s/.test(value)
                                          }}
                                        title='Номер отчета к приложению'

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
                            <div className='text-areas'>
                                <textarea 
                                        name="Выполненные работы"
                                        value={currentDocument.completedWorks}
                                        onChange={(e) => handleFieldChange('completedWorks', e.target.value)}
                                        validation={{required: true}}
                                        placeholder='Выполненные работы'
                                        title='Выполненные работы'

                                    ></textarea>
                                    <textarea 
                                        name="Выполненные работы"
                                        value={currentDocument.resultsWork}
                                        onChange={(e) => handleFieldChange('resultsWork', e.target.value)}
                                        validation={{required: true}}
                                        placeholder='Результаты работ, предаставляемые заказчику'
                                        title='Результаты работ, предаставляемые заказчику'
                                    ></textarea>
                            </div>              
                        </div>      
                    </div>
                );   
            case 3: // Акт Мега 
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
                                            validation={{ required: true, date: true }}
                                            title='Дата Заключения Договора'
                                            style={{color: currentDocument.contractDate === '' ? 'grey' : 'black'}}
                                        />
                                    </div>
                                    <Input
                                            value={currentDocument.contractNumber}
                                            onChange={(e) => handleFieldChange('contractNumber', e.target.value)}
                                            placeholder="Номер Договора"
                                            validation={{ 
                                                required: true,
                                                pattern: /^[1-9]\d*$/,
                                                message: "Введите целое число больше нуля (без пробелов)",
                                                minLength: 1,
                                                maxLength: 20,
                                                validate: (value) => !/\s/.test(value)
                                              }}
                                            title='Номер Договора'
                                        />
                                    <Input
                                        value={currentDocument.orderNumber}
                                        onChange={(e) => handleFieldChange('orderNumber', e.target.value)}
                                        placeholder="Номер Заказа"
                                        validation={{ 
                                            required: true,
                                            pattern: /^[1-9]\d*$/,
                                            message: "Введите целое число больше нуля (без пробелов)",
                                            minLength: 1,
                                            maxLength: 20,
                                            validate: (value) => !/\s/.test(value)
                                          }}
                                        title='Номер Заказа'
                                    />
                                    <div className="city-input-container">
                                        <Input
                                            value={currentDocument.city}
                                            onChange={(e) => handleCityInputChange(e.target.value)}
                                            placeholder="Город"
                                            validation={{
                                            required: true,
                                            pattern: /^[а-яА-ЯёЁ\s\-]+$/,
                                            message: "Город должен содержать только буквы и дефисы",
                                            maxLength: 50
                                            }}
                                            title='Укажите город'
                                        />
                                        {showSuggestions && citySuggestions.length > 0 && (
                                            <ul className="city-suggestions">
                                            {citySuggestions.map((city, index) => (
                                                <li 
                                                key={index} 
                                                onClick={() => handleCitySelect(city)}
                                                >
                                                {city}
                                                </li>
                                            ))}
                                            </ul>
                                        )}
                                    </div> 
                                    <DropdownMenu
                                        className="data-select"
                                        placeholder="НДС (%)"
                                        name={`nds`}
                                        value={currentDocument.nds}
                                        onChange={(e) => handleFieldChange('nds', e.target.value)}
                                        options={[
                                            { value: '5', label: '5%' },
                                            { value: '7', label: '7%' },
                                            { value: '10', label: '10%' },
                                            { value: '20', label: '20%' },
                                            ]}
                                        validation={{ required: true }}
                                        title='% НДС'

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
                                    <div>
                                        <Input
                                            value={specialist.category}
                                            onChange={(e) => handleArrayItemChange('specialists', index, 'category', e.target.value)}
                                            placeholder="Категория специалиста"
                                            validation={{
                                                required: true,
                                                pattern: /^[а-яА-ЯёЁ\s\-]+$/,
                                                message: "Категория должна содержать только буквы и дефисы",
                                                maxLength: 50
                                            }}
                                            title='Категория должна содержать только буквы и дефисы'
                                        />
                                        <Input
                                            value={specialist.costRate}
                                            onChange={(e) => handleArrayItemChange('specialists', index, 'costRate', e.target.value)}
                                            placeholder="Стоимость ставки нормо-часа, в т.ч. НДС 5%"
                                            validation={{ 
                                                required: true,
                                                pattern: /^\d+(\.\d{1,2})?$/,
                                                message: 'Введите число (например: 1000 или 1000.50)'
                                            }}
                                            title='Введите стоимость в рублях, копейки укажите через точку'

                                        />
                                        <Input
                                            value={specialist.resourcesSpent}
                                            onChange={(e) => handleArrayItemChange('specialists', index, 'resourcesSpent', e.target.value)}
                                            placeholder="Количество часов"
                                            validation={{ 
                                                required: true,
                                                pattern: /^[1-9]\d*$/,
                                                message: "Введите целое число больше нуля (без пробелов)",
                                                validate: (value) => !/\s/.test(value), // Дополнительная проверка на пробелы
                                                minLength: 1,
                                                maxLength: 4 
                                            }}
                                            title="Количество часов (целое число)"
                                        />
                                    </div>
                                    <button onClick={() => removeArrayItem('specialists', index)}>×</button>
                                </div>
                            ))}
                            <Button id='add-spec'onClick={() => addArrayItem('specialists', { category: '', rate: '', hours: '' })}>
                                Добавить специалиста
                            </Button>
                        </div>
                    </div>
                );
            case 4: // Акт Море
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
                                            validation={{ required: true, date: true }}
                                            title='Дата Заключения Договора'
                                            style={{color: currentDocument.contractDate === '' ? 'grey' : 'black'}}
                                        />
                                    </div>
                                    <Input
                                            value={currentDocument.contractNumber}
                                            onChange={(e) => handleFieldChange('contractNumber', e.target.value)}
                                            placeholder="Номер Договора"
                                            validation={{ 
                                                required: true,
                                                pattern: /^[1-9]\d*$/,
                                                message: "Введите целое число больше нуля (без пробелов)",
                                                minLength: 1,
                                                maxLength: 20,
                                                validate: (value) => !/\s/.test(value)
                                              }}
                                            title='Номер Договора'
                                        />
                                    <Input
                                        value={currentDocument.actNumber}
                                        onChange={(e) => handleFieldChange('actNumber', e.target.value)}
                                        placeholder="Номер Акта"
                                        validation={{ 
                                            required: true,
                                            pattern: /^[1-9]\d*$/,
                                            message: "Введите целое число больше нуля (без пробелов)",
                                            minLength: 1,
                                            maxLength: 20,
                                            validate: (value) => !/\s/.test(value)
                                          }}
                                        title='Номер Акта'
                                    />
                                    <div className="city-input-container">
                                        <Input
                                            value={currentDocument.city}
                                            onChange={(e) => handleCityInputChange(e.target.value)}
                                            placeholder="Город"
                                            validation={{
                                            required: true,
                                            pattern: /^[а-яА-ЯёЁ\s\-]+$/,
                                            message: "Город должен содержать только буквы и дефисы",
                                            maxLength: 50
                                            }}
                                            title='Укажите город'
                                        />
                                        {showSuggestions && citySuggestions.length > 0 && (
                                            <ul className="city-suggestions">
                                            {citySuggestions.map((city, index) => (
                                                <li 
                                                key={index} 
                                                onClick={() => handleCitySelect(city)}
                                                >
                                                {city}
                                                </li>
                                            ))}
                                            </ul>
                                        )}
                                    </div> 
                                    <DropdownMenu
                                        className="data-select"
                                        placeholder="НДС (%)"
                                        name={`nds`}
                                        value={currentDocument.nds}
                                        onChange={(e) => handleFieldChange('nds', e.target.value)}
                                        options={[
                                            { value: '5', label: '5%' },
                                            { value: '7', label: '7%' },
                                            { value: '10', label: '10%' },
                                            { value: '20', label: '20%' },
                                            ]}
                                        validation={{ required: true }}
                                        title='% НДС'

                                    />   
                                    <Input
                                        value={currentDocument.percentAward}
                                        onChange={(e) => handleFieldChange('percentAward', e.target.value)}
                                        validation={{
                                            required: true,
                                            numeric: true,
                                            min: 0,
                                            max: 100,
                                            message: "Введите число от 0 до 100"
                                          }}
                                        placeholder="% вознагражд. за искл. право на результ."
                                        title='% вознаграждения за исключительное право на результаты'

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
                            <h4>Оказанные услуги</h4>
                            {currentDocument.services.map((service, index) => (
                                <div key={index} className="array-ite">
                                    <div className='array-ite__item'>
                                        <div>
                                            <Input
                                                value={service.name}
                                                onChange={(e) => handleArrayItemChange('services', index, 'name', e.target.value)}
                                                placeholder="Название услуги"
                                                validation={{required: true}}
                                                title='Название услуги'
                                            />
                                            <Input
                                                value={service.rate}
                                                onChange={(e) => handleArrayItemChange('services', index, 'rate', e.target.value)}
                                                validation={{ 
                                                    required: true,
                                                    pattern: /^\d+(\.\d{1,2})?$/,
                                                    message: 'Введите число (например: 1000 или 1000.50)'
                                                }}
                                                placeholder="Ставка, руб./час, в т.ч. НДС 5%"
                                                title='Ставка, руб./час, в т.ч. НДС 5%'

                                            />
                                        </div>
                                        <div >
                                            <Input
                                                value={service.category}
                                                onChange={(e) => handleArrayItemChange('services', index, 'category', e.target.value)}
                                                placeholder="Категория специалиста"
                                                validation={{
                                                    required: true,
                                                    pattern: /^[а-яА-ЯёЁ\s\-]+$/,
                                                    message: "Категория должна содержать только буквы и дефисы",
                                                    maxLength: 50
                                                }}
                                                title='Роль специалиста'

                                            />
                                            
                                            <Input
                                                value={service.hours}
                                                onChange={(e) => handleArrayItemChange('services', index, 'hours', e.target.value)}
                                                placeholder="Количество часов"
                                                validation={{ 
                                                    required: true,
                                                    pattern: /^[1-9]\d*$/,
                                                    message: "Введите целое число больше нуля (без пробелов)",
                                                    validate: (value) => !/\s/.test(value), // Дополнительная проверка на пробелы
                                                    minLength: 1,
                                                    maxLength: 4 
                                                }}
                                                title="Количество часов (целое число)"
                                            />
                                        </div>
                                    </div>
                                    <button onClick={() => removeArrayItem('services', index)}>×</button>
                                </div>
                            ))}
                            <Button id='add-spec'onClick={() => addArrayItem('services', { name: '', category: '', rate: '', hours: '' })}>
                                Добавить услугу
                            </Button>
                        </div>
                    </div>
                );
            case 5: // Заказ Аниме
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
                                            validation={{ required: true, date: true }}
                                            title='Дата Заключения Договора'
                                            style={{color: currentDocument.contractDate === '' ? 'grey' : 'black'}}
                                        />
                                    </div>
                                    <Input
                                            value={currentDocument.contractNumber}
                                            onChange={(e) => handleFieldChange('contractNumber', e.target.value)}
                                            placeholder="Номер Договора"
                                            validation={{ 
                                                required: true,
                                                pattern: /^[1-9]\d*$/,
                                                message: "Введите целое число больше нуля (без пробелов)",
                                                minLength: 1,
                                                maxLength: 20,
                                                validate: (value) => !/\s/.test(value)
                                              }}
                                            title='Номер Договора'
                                        />
                                    <Input
                                        value={currentDocument.orderNumber}
                                        onChange={(e) => handleFieldChange('orderNumber', e.target.value)}
                                        placeholder="Номер Заказа"
                                        validation={{ 
                                            required: true,
                                            pattern: /^[1-9]\d*$/,
                                            message: "Введите целое число больше нуля (без пробелов)",
                                            minLength: 1,
                                            maxLength: 20,
                                            validate: (value) => !/\s/.test(value)
                                          }}
                                        title='Номер Заказа'
                                    />
                                    <div className="city-input-container">
                                        <Input
                                            value={currentDocument.city}
                                            onChange={(e) => handleCityInputChange(e.target.value)}
                                            placeholder="Город"
                                            validation={{
                                            required: true,
                                            pattern: /^[а-яА-ЯёЁ\s\-]+$/,
                                            message: "Город должен содержать только буквы и дефисы",
                                            maxLength: 50
                                            }}
                                            title='Укажите город'
                                        />
                                        {showSuggestions && citySuggestions.length > 0 && (
                                            <ul className="city-suggestions">
                                            {citySuggestions.map((city, index) => (
                                                <li 
                                                key={index} 
                                                onClick={() => handleCitySelect(city)}
                                                >
                                                {city}
                                                </li>
                                            ))}
                                            </ul>
                                        )}
                                    </div> 
                                    <DropdownMenu
                                        className="data-select"
                                        placeholder="НДС (%)"
                                        name={`nds`}
                                        value={currentDocument.nds}
                                        onChange={(e) => handleFieldChange('nds', e.target.value)}
                                        options={[
                                            { value: '5', label: '5%' },
                                            { value: '7', label: '7%' },
                                            { value: '10', label: '10%' },
                                            { value: '20', label: '20%' },
                                            ]}
                                        validation={{ required: true }}
                                        title='% НДС'

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
                            <h4>Выполненные работы</h4>
                            {currentDocument.works.map((work, index) => (
                                <div key={index} className="array-ite">
                                    <div className='array-ite__item'>
                                        <div>
                                            <Input
                                                value={work.name}
                                                onChange={(e) => handleArrayItemChange('works', index, 'name', e.target.value)}
                                                placeholder="Название задачи"
                                                validation={{required: true}}
                                                title="Название задачи"
                                            />
                                            <span>Начало работ:</span>
                                            <Input
                                                type="date"
                                                value={work.startDate || ''}
                                                onChange={(e) => handleArrayItemChange('works', index, 'startDate', e.target.value)}
                                                placeholder="Начало работ"
                                                validation={{ required: true, date: true }}
                                                title='Начало работ'
                                                style={{color: currentDocument.contractDate === '' ? 'grey' : 'black'}}
                                            />
                                        </div>
                                        <div>
                                            <Input
                                            value={work.cost}
                                            onChange={(e) => handleArrayItemChange('works', index, 'cost', e.target.value)}
                                            placeholder="Предельная стоимость по Заказу (руб., коп.)"
                                            validation={{ 
                                                required: true,
                                                pattern: /^\d+(\.\d{1,2})?$/,
                                                message: 'Введите число (например: 1000 или 1000.50)',
                                                validate: (value) => !/\s/.test(value)
                                            }}
                                            title='Введите стоимость по заказу в рублях, копейки укажите через точку'
                                            />
                                            <span> Конец работ:</span>
                                            <Input
                                                type="date"
                                                value={work.endDate || ''}
                                                onChange={(e) => handleArrayItemChange('works', index, 'endDate', e.target.value)}
                                                placeholder="Конец работ"
                                                validation={{ required: true, date: true }}
                                                title='Конец работ'
                                                style={{color: currentDocument.contractDate === '' ? 'grey' : 'black'}}
                                            />
                                        </div>
                                    </div>
                                    <button onClick={() => removeArrayItem('works', index)}>×</button>
                                </div>
                            ))}
                            <Button id='add-spec'onClick={() => addArrayItem('works', { name: '', startWork: '', endWork: '', cost: '' })}>
                                Добавить работу
                            </Button>
                        </div>
                    </div>
                );          
            case 6: // Заказ Байт
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
                                            validation={{ required: true, date: true }}
                                            title='Дата Заключения Договора'
                                            style={{color: currentDocument.contractDate === '' ? 'grey' : 'black'}}
                                        />
                                    </div>
                                    <Input
                                            value={currentDocument.contractNumber}
                                            onChange={(e) => handleFieldChange('contractNumber', e.target.value)}
                                            placeholder="Номер Договора"
                                            validation={{ 
                                                required: true,
                                                pattern: /^[1-9]\d*$/,
                                                message: "Введите целое число больше нуля (без пробелов)",
                                                minLength: 1,
                                                maxLength: 20,
                                                validate: (value) => !/\s/.test(value)
                                              }}
                                            title='Номер Договора'
                                        />
                                    <Input
                                        value={currentDocument.applicationNumber}
                                        onChange={(e) => handleFieldChange('applicationNumber', e.target.value)}
                                        placeholder="Номер Заявки"
                                        validation={{ 
                                            required: true,
                                            pattern: /^[1-9]\d*$/,
                                            message: "Введите целое число больше нуля (без пробелов)",
                                            minLength: 1,
                                            maxLength: 20,
                                            validate: (value) => !/\s/.test(value)
                                          }}
                                        title='Номер Заявки'
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
                        <div id="two-form-section" className="form-section">
                            <div>
                                <h4>Выполненные работы</h4>
                                {currentDocument.works.map((work, index) => (
                                    <div key={index} className="array-item">
                                        <div>
                                            <Input
                                                value={work.name}
                                                onChange={(e) => handleArrayItemChange('works', index, 'name', e.target.value)}
                                                placeholder="Название задачи"
                                                validation={{required: true}}
                                                title="Название задачи"
                                            />
                                            <Input
                                                value={work.cost}
                                                onChange={(e) => handleArrayItemChange('works', index, 'cost', e.target.value)}
                                                placeholder="Цена, руб. , без НДС"
                                                validation={{ 
                                                    required: true,
                                                    pattern: /^\d+(\.\d{1,2})?$/,
                                                    message: 'Введите число (например: 1000 или 1000.50)'
                                                }}
                                                title='Введите цену в рублях, копейки укажите через точку'
                                            />
                                            <Input
                                                value={work.count}
                                                onChange={(e) => handleArrayItemChange('works', index, 'count', e.target.value)}
                                                validation={{ 
                                                    required: true,
                                                    pattern: /^[1-9]\d*$/,
                                                    message: "Введите целое число больше нуля (без пробелов)",
                                                    validate: (value) => !/\s/.test(value), // Дополнительная проверка на пробелы
                                                    minLength: 1,
                                                    maxLength: 4 
                                                }}
                                                placeholder="Количество"
                                                title="Введите количество"
                                            />     
                                        </div>          
                                        <button onClick={() => removeArrayItem('works', index)}>×</button>
                                    </div>
                                ))}
                                <Button id='add-spec'onClick={() => addArrayItem('works', { name: '', cost: '', count: '' })}>
                                    Добавить работу
                                </Button>
                            </div>   
                            <div>
                                <h4>Список исполнителей</h4>
                                {currentDocument.contractorsList.map((contractor, index) => (
                                    <div key={index} className="array-item">
                                        <div>
                                            <Input
                                                value={contractor.fio}
                                                onChange={(e) => handleArrayItemChange('contractorsList', index, 'fio', e.target.value)}
                                                placeholder="ФИО"
                                                validation={{ 
                                                    required: true,
                                                    alpha: true,
                                                    minLength: 5,
                                                    maxLength: 100,
                                                    pattern: /^[а-яА-ЯёЁ\s\-]+$/,
                                                    minWords: 2,
                                                    message: 'Допустимы только русские буквы, пробелы и дефисы'
                                                }}
                                                title='ФИО исполнителя'
                                            />
                                            <Input
                                                value={contractor.inn}
                                                onChange={(e) => handleArrayItemChange('contractorsList', index, 'inn', e.target.value)}
                                                placeholder="ИНН"
                                                validation={{ 
                                                    required: true,
                                                    pattern: /^(?:\d{10}|\d{12})$/, // Только 10 ИЛИ 12 цифр
                                                    message: "Введите 10 или 12 цифр (без пробелов)",
                                                    validate: (value) => !/\s/.test(value) && (value.length === 10 || value.length === 12)
                                                }}
                                                title="ИНН исполнителя"
                                            />
                                        </div>
                                        <button onClick={() => removeArrayItem('contractorsList', index)}>×</button>
                                    </div>
                                ))}
                                <Button id='add-spec'onClick={() => addArrayItem('contractorsList', { fio: '', inn: '' })}>
                                    Добавить исполнителя
                                </Button>
                            </div>              
                        </div>

                                

                    </div>
                );   
            case 7: // Заказ Мега
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
                                            validation={{ required: true, date: true }}
                                            title='Дата Заключения Договора'
                                            style={{color: currentDocument.contractDate === '' ? 'grey' : 'black'}}
                                        />
                                    </div>
                                    <Input
                                            value={currentDocument.contractNumber}
                                            onChange={(e) => handleFieldChange('contractNumber', e.target.value)}
                                            placeholder="Номер Договора"
                                            validation={{ 
                                                required: true,
                                                pattern: /^[1-9]\d*$/,
                                                message: "Введите целое число больше нуля (без пробелов)",
                                                minLength: 1,
                                                maxLength: 20,
                                                validate: (value) => !/\s/.test(value)
                                              }}
                                            title='Номер Договора'
                                        />
                                    <Input
                                        value={currentDocument.orderNumber}
                                        onChange={(e) => handleFieldChange('orderNumber', e.target.value)}
                                        placeholder="Номер Заказа"
                                        validation={{ 
                                            required: true,
                                            pattern: /^[1-9]\d*$/,
                                            message: "Введите целое число больше нуля (без пробелов)",
                                            minLength: 1,
                                            maxLength: 20,
                                            validate: (value) => !/\s/.test(value)
                                          }}
                                        title='Номер Заказа'
                                    />
                                    <div className="city-input-container">
                                        <Input
                                            value={currentDocument.city}
                                            onChange={(e) => handleCityInputChange(e.target.value)}
                                            placeholder="Город"
                                            validation={{
                                            required: true,
                                            pattern: /^[а-яА-ЯёЁ\s\-]+$/,
                                            message: "Город должен содержать только буквы и дефисы",
                                            maxLength: 50
                                            }}
                                            title='Укажите город'
                                        />
                                        {showSuggestions && citySuggestions.length > 0 && (
                                            <ul className="city-suggestions">
                                            {citySuggestions.map((city, index) => (
                                                <li 
                                                key={index} 
                                                onClick={() => handleCitySelect(city)}
                                                >
                                                {city}
                                                </li>
                                            ))}
                                            </ul>
                                        )}
                                    </div> 
                                    <DropdownMenu
                                        className="data-select"
                                        placeholder="НДС (%)"
                                        name={`nds`}
                                        value={currentDocument.nds}
                                        onChange={(e) => handleFieldChange('nds', e.target.value)}
                                        options={[
                                            { value: '5', label: '5%' },
                                            { value: '7', label: '7%' },
                                            { value: '10', label: '10%' },
                                            { value: '20', label: '20%' },
                                            ]}
                                        validation={{ required: true }}
                                        title='% НДС'

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
                            <h4>Выполненные работы</h4>
                            {currentDocument.works.map((work, index) => (
                                <div key={index} className="array-ite">
                                    <div className='array-ite__item'>
                                        <div>
                                            <Input
                                                value={work.name}
                                                onChange={(e) => handleArrayItemChange('works', index, 'name', e.target.value)}
                                                placeholder="Название задачи"
                                                validation={{required: true}}
                                                title="Название задачи"
                                            />
                                            <span>Начало работ:</span>
                                            <Input
                                                type="date"
                                                value={work.startDate || ''}
                                                onChange={(e) => handleArrayItemChange('works', index, 'startDate', e.target.value)}
                                                placeholder="Начало работ"
                                                validation={{ required: true, date: true }}
                                                title="Дата начала работ"
                                                style={{color: currentDocument.contractDate === '' ? 'grey' : 'black'}}
                                            />
                                        </div>
                                        <div>
                                            <Input
                                                value={work.cost}
                                                onChange={(e) => handleArrayItemChange('works', index, 'cost', e.target.value)}
                                                placeholder="Cтоимость выполненной работы (руб. и коп.)"
                                                validation={{ 
                                                    required: true,
                                                    pattern: /^\d+(\.\d{1,2})?$/,
                                                    message: 'Введите число (например: 1000 или 1000.50)'
                                                }}
                                                title='Введите стоимость выполненной работы в рублях, копейки укажите через точку'

                                            />
                                            <span> Конец работ:</span>
                                            <Input
                                                type="date"
                                                value={work.endDate || ''}
                                                onChange={(e) => {
                                                    handleArrayItemChange('works', index, 'endDate', e.target.value);
                                                    const validation = validateEndDate(e.target.value, work.startDate, index);
                                                    setDateErrors(prev => ({
                                                    ...prev,
                                                    [`endDate-${index}`]: !validation.isValid ? validation.message : null
                                                    }));
                                                }}                                        
                                                placeholder="Конец работ"
                                                validation={{ required: true, date: true }}
                                                title="Дата окончания работ"
                                                style={{color: currentDocument.contractDate === '' ? 'grey' : 'black'}}
                                            />
                                        </div>
                                    </div>
                                    <button onClick={() => removeArrayItem('works', index)}>×</button>
                                </div>
                            ))}
                            <Button id='add-spec'onClick={() => addArrayItem('works', { name: '', startWork: '', endWork: '', cost: '' })}>
                                Добавить работу
                            </Button>
                        </div>
                    </div>
                );          
            case 8: // Отчет Жираф
                return (
                    <div className="template-fields">
                        {renderContractorCustomerFields()}
                        <div className="form-section">
                            <h4>Данные Документа</h4>
                            <div className='section-data'>
                                <div className='section-data__input'>
                                    <Input
                                        value={currentDocument.applicationNumber}
                                        onChange={(e) => handleFieldChange('applicationNumber', e.target.value)}
                                        placeholder="Номер Заявки"
                                        validation={{ 
                                            required: true,
                                            pattern: /^[1-9]\d*$/,
                                            message: "Введите целое число больше нуля (без пробелов)",
                                            minLength: 1,
                                            maxLength: 20,
                                            validate: (value) => !/\s/.test(value)
                                          }}
                                        title='Номер Заявки'
                                    />
                                    <div className="city-input-container">
                                        <Input
                                            value={currentDocument.city}
                                            onChange={(e) => handleCityInputChange(e.target.value)}
                                            placeholder="Город"
                                            validation={{
                                            required: true,
                                            pattern: /^[а-яА-ЯёЁ\s\-]+$/,
                                            message: "Город должен содержать только буквы и дефисы",
                                            maxLength: 50
                                            }}
                                            title='Укажите город'
                                        />
                                        {showSuggestions && citySuggestions.length > 0 && (
                                            <ul className="city-suggestions">
                                            {citySuggestions.map((city, index) => (
                                                <li 
                                                key={index} 
                                                onClick={() => handleCitySelect(city)}
                                                >
                                                {city}
                                                </li>
                                            ))}
                                            </ul>
                                        )}
                                    </div> 
                                    <DropdownMenu
                                        className="data-select"
                                        placeholder="НДС (%)"
                                        name={`nds`}
                                        value={currentDocument.nds}
                                        onChange={(e) => handleFieldChange('nds', e.target.value)}
                                        options={[
                                            { value: '5', label: '5%' },
                                            { value: '7', label: '7%' },
                                            { value: '10', label: '10%' },
                                            { value: '20', label: '20%' },
                                            ]}
                                        validation={{ required: true }}
                                        title='% НДС'

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
                            <h4>Работы исполнителя</h4>
                            {currentDocument.contractorsWork.map((contractorWork, index) => (
                                <div key={index} className="array-item">
                                    <div>
                                        <Input
                                            value={contractorWork.name}
                                            onChange={(e) => handleArrayItemChange('contractorsWork', index, 'name', e.target.value)}
                                            placeholder="Название задачи"
                                            validation={{required: true}}
                                            title="Название задачи"
                                        />
                                        <Input
                                            value={contractorWork.cost}
                                            onChange={(e) => handleArrayItemChange('contractorsWork', index, 'cost', e.target.value)}
                                            placeholder="Стоимость в час/руб"
                                            validation={{ 
                                                required: true,
                                                pattern: /^\d+(\.\d{1,2})?$/,
                                                message: 'Введите число (например: 1000 или 1000.50)',
                                                validate: (value) => !/\s/.test(value)
                                            }}
                                            title='Стоимость в час/руб'
                                        />
                                        <Input
                                            value={contractorWork.hours}
                                            onChange={(e) => handleArrayItemChange('contractorsWork', index, 'hours', e.target.value)}
                                            placeholder="Количество часов"
                                            validation={{ 
                                                required: true,
                                                pattern: /^[1-9]\d*$/,
                                                message: "Введите целое число больше нуля (без пробелов)",
                                                validate: (value) => !/\s/.test(value), // Дополнительная проверка на пробелы
                                                minLength: 1,
                                                maxLength: 4 
                                            }}
                                            title="Количество часов (целое число)"
                                        />       
                                    </div>   
                                    <button onClick={() => removeArrayItem('contractorsWork', index)}>×</button>
                                </div>
                            ))}
                            <Button id='add-spec'onClick={() => addArrayItem('contractorsWork', { name: '', cost: '', hours: '' })}>
                                Добавить работу
                            </Button>
                        </div>                
                    </div>
                );              
            case 9: // Отчет море
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
                                            validation={{ required: true, date: true }}
                                            title='Дата Заключения Договора'
                                            style={{color: currentDocument.contractDate === '' ? 'grey' : 'black'}}
                                        />
                                    </div>
                                    <Input
                                            value={currentDocument.contractNumber}
                                            onChange={(e) => handleFieldChange('contractNumber', e.target.value)}
                                            placeholder="Номер Договора"
                                            validation={{ 
                                                required: true,
                                                pattern: /^[1-9]\d*$/,
                                                message: "Введите целое число больше нуля (без пробелов)",
                                                minLength: 1,
                                                maxLength: 20,
                                                validate: (value) => !/\s/.test(value)
                                              }}
                                            title='Номер Договора'
                                        />
                                    <div className="city-input-container">
                                        <Input
                                            value={currentDocument.city}
                                            onChange={(e) => handleCityInputChange(e.target.value)}
                                            placeholder="Город"
                                            validation={{
                                            required: true,
                                            pattern: /^[а-яА-ЯёЁ\s\-]+$/,
                                            message: "Город должен содержать только буквы и дефисы",
                                            maxLength: 50
                                            }}
                                            title='Укажите город'
                                        />
                                        {showSuggestions && citySuggestions.length > 0 && (
                                            <ul className="city-suggestions">
                                            {citySuggestions.map((city, index) => (
                                                <li 
                                                key={index} 
                                                onClick={() => handleCitySelect(city)}
                                                >
                                                {city}
                                                </li>
                                            ))}
                                            </ul>
                                        )}
                                    </div> 
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
                                <div key={index} className="array-ite">
                                    <div className='array-ite__item'>
                                        <div>
                                            <Input
                                                value={specialist.fio}
                                                onChange={(e) => handleArrayItemChange('specialists', index, 'fio', e.target.value)}
                                                placeholder="ФИО"
                                                validation={{ 
                                                    required: true,
                                                    alpha: true,
                                                    minLength: 5,
                                                    maxLength: 100,
                                                    pattern: /^[а-яА-ЯёЁ\s\-]+$/,
                                                    minWords: 2,
                                                    message: 'Допустимы только русские буквы, пробелы и дефисы'
                                                }}
                                                title='ФИО Специалиста'
                                            />
                                            <Input
                                                value={specialist.calendar}
                                                onChange={(e) => handleArrayItemChange('specialists', index, 'calendar', e.target.value)}
                                                placeholder="Календарь (РФ)"
                                                validation={{ 
                                                    required: true,
                                                    alpha: true,
                                                    minLength: 1,
                                                    maxLength: 4,
                                                    pattern: /^[а-яА-ЯёЁ\s\-]+$/,
                                                    message: 'Допустимы только русские буквы, пробелы и дефисы'
                                                }}
                                                title='Календарь'
                                            />
                                            
                                            <Input
                                                value={specialist.wh}
                                                onChange={(e) => handleArrayItemChange('specialists', index, 'wh', e.target.value)}
                                                placeholder="Рабочие часы"
                                                validation={{ 
                                                    required: true,
                                                    pattern: /^[1-9]\d*$/,
                                                    message: "Введите целое число больше нуля (без пробелов)",
                                                    validate: (value) => !/\s/.test(value), // Дополнительная проверка на пробелы
                                                    minLength: 1,
                                                    maxLength: 4 
                                                }}
                                                title="Количество часов (целое число)"
                                            />
                                            <div className='array-ite__inside-item'>
                                                <span>Дата:</span>
                                                <Input
                                                    type="date"
                                                    value={specialist.date || ''}
                                                    onChange={(e) => handleArrayItemChange('specialists', index, 'date', e.target.value)}
                                                    placeholder="Дата"
                                                    style={{ color: currentDocument.contractDate === '' ? 'grey' : 'black'}}
                                                    validation={{ required: true, date: true }}
                                                    title='Дата'
                                                />
                                            </div>
                                        </div>                   
                                        <div>
                                            <div className='array-ite__inside-item'>
                                                <DropdownMenu
                                                    placeholder="Тип дня"
                                                    className="data-select"
                                                    name={`specialists-${index}-typeOfDay`}
                                                    value={specialist.typeOfDay}
                                                    onChange={(e) => handleArrayItemChange('specialists', index, 'typeOfDay', e.target.value)}
                                                    options={[
                                                        { value: 'раб', label: 'Рабочий' },
                                                        { value: 'не раб', label: 'Не рабочий' }
                                                    ]}
                                                    title='Тип дня'
                                                    validation={{ required: true }}
                                                />
                                                <DropdownMenu
                                                    placeholder="Отсутствие"
                                                    className="data-select"
                                                    name={`specialists-${index}-absence`}
                                                    value={specialist.absence}
                                                    onChange={(e) => handleArrayItemChange('specialists', index, 'absence', e.target.value)}
                                                    options={[
                                                        { value: '+', label: '+' },
                                                        { value: '-', label: '-' }
                                                    ]}
                                                    validation={{ required: true, date: true }}
                                                    title='Отсутствие'
                                                />
                                            </div>
                                            <textarea 
                                                name="Комментарий"
                                                value={specialist.comment}
                                                onChange={(e) => handleArrayItemChange('specialists', index, 'comment', e.target.value)}
                                                placeholder='Комментарий (задачи)'
                                                title='Комментарии'
                                            ></textarea>
                                        </div>
                                    </div>
                                    
                    
                                
                                    <button onClick={() => removeArrayItem('specialists', index)}>×</button>
                                </div>
                            ))}
                            <Button id='add-spec'onClick={() => addArrayItem('specialists', { fio: '', calendar: '', typeOfDay: '', date: '', absence: '', wh: '', comment: '' })}>
                                Добавить специалиста
                            </Button>
                        </div>
                    </div>
                );
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
                        <h4>Заполните данные документа "{shablon}"</h4>
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