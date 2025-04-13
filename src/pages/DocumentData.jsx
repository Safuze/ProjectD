import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Background from '../components/Background';
import Navbar from '../components/Navbar';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import DropdownMenu from '../components/DropdownMenu';

const DocumentData = ({ setIsCreatingDocument, userLogin, onLogin, setDocumentReady }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState([]);
    const [template, setTemplate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Получаем выбранный формат и фирму из location.state
    useEffect(() => {
        if (location.state) {
            const { selectedFormat, selectedFirm, customFirm } = location.state;
            const firmToUse = customFirm || selectedFirm;
            
            console.log('Received state:', location.state); // Для отладки
            
            setTemplate({ 
                format: selectedFormat, 
                firm: firmToUse 
            });
            
            initializeForm(selectedFormat, firmToUse);
        } else {
            console.error('No state received! Redirecting back...');
            navigate('/document'); // Перенаправляем обратно, если нет данных
        }
        setIsLoading(false);
    }, [location.state, navigate]);

    const initializeForm = (format, firm) => {
        // Определяем какие поля должны быть в зависимости от шаблона
        let initialFields = [];
        
        if (format === '1') { // Акт
            if (firm === 'Аниме') {
                initialFields = [{
                    category: '',
                    rate: '',
                    hours: ''
                }];
            } else if (firm === 'Байт') {
                initialFields = [{
                    taskName: '',
                    price: '',
                    quantity: ''
                }];
            } else if (firm === 'Жираф') {
                initialFields = [{
                    cost: ''
                }];
            } else if (firm === 'Мега') {
                initialFields = [{
                    category: '',
                    rate: '',
                    hours: ''
                }];
            } else if (firm === 'Море') {
                initialFields = [{
                    serviceName: '',
                    role: '',
                    rate: '',
                    hours: ''
                }];
            }
        } else if (format === '2') { // Заказ
            if (firm === 'Аниме') {
                initialFields = [{
                    taskName: '',
                    startDate: '',
                    endDate: '',
                    totalCost: ''
                }];
            } else if (firm === 'Байт') {
                initialFields = [{
                    taskName: '',
                    price: '',
                    quantity: ''
                }];
            } else if (firm === 'Мега') {
                initialFields = [{
                    taskName: '',
                    startDate: '',
                    endDate: '',
                    totalCost: ''
                }];
            }
        } else if (format === '3') { // Отчет
            if (firm === 'Жираф') {
                initialFields = [{
                    taskName: '',
                    hourlyRate: '',
                    hours: ''
                }];
            } else if (firm === 'Море') {
                initialFields = [{
                    specialistName: '',
                    dayType: '',
                    date: '',
                    comment: '',
                    absence: '-'
                }];
            }
        }
        
        setFormData(initialFields);
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
        }        console.log(formData);
        setDocumentReady(true);
        navigate('/document', { state: { formData, template } });
    };

    // Проверяем, все ли поля заполнены
    const isFormValid = useMemo(() => {
        return formData.every(row => {
            return Object.values(row).every(value => value !== '');
        });
    }, [formData]);

    const addRow = () => {
        if (!isFormValid) {
            alert('Заполните все поля текущей строки перед добавлением новой');
            return;
        }
        const newRow = {};
        // Определяем структуру новой строки в зависимости от шаблона
        if (template.format === '1') { // Акт
            if (template.firm === 'Аниме') {
                newRow.category = '';
                newRow.rate = '';
                newRow.hours = '';
            } else if (template.firm === 'Байт') {
                newRow.taskName = '';
                newRow.price = '';
                newRow.quantity = '';
            } else if (template.firm === 'Мега') {
                newRow.category = '';
                newRow.rate = '';
                newRow.hours = '';
            } else if (template.firm === 'Море') {
                newRow.serviceName = '';
                newRow.role = '';
                newRow.rate = '';
                newRow.hours = '';
            }
        } else if (template.format === '2') { // Заказ
            if (template.firm === 'Аниме') {
                newRow.taskName = '';
                newRow.startDate = '';
                newRow.endDate = '';
                newRow.totalCost = '';
            } else if (template.firm === 'Байт') {
                newRow.taskName = '';
                newRow.price = '';
                newRow.quantity = '';
            } else if (template.firm === 'Мега') {
                newRow.taskName = '';
                newRow.startDate = '';
                newRow.endDate = '';
                newRow.totalCost = '';
            }
        } else if (template.format === '3') { // Отчет
            if (template.firm === 'Жираф') {
                newRow.taskName = '';
                newRow.hourlyRate = '';
                newRow.hours = '';
            } else if (template.firm === 'Море') {
                newRow.specialistName = '';
                newRow.dayType = '';
                newRow.date = '';
                newRow.comment = '';
                newRow.absence = '-';
            }
        }
        console.log(formData);

        setFormData([...formData, newRow]);
        console.log(formData);

    };

    const handleInputChange = (index, field, value) => {
        const updatedFormData = [...formData];
        updatedFormData[index][field] = value;
        setFormData(updatedFormData);
    };

    const removeRow = (index) => {
        if (formData.length > 1) {
            const updatedFormData = formData.filter((_, i) => i !== index);
            setFormData(updatedFormData);
        }
    };

    const renderFormFields = () => {
        if (!template) return null;

        return formData.map((row, index) => (
            <div key={index} className="form-row">
                {template.format === '1' && template.firm === 'Аниме' && (
                    <>
                        <Input
                            name={`category-${index}`}
                            type="text"
                            placeholder="Категория специалиста"
                            value={row.category}
                            onChange={(e) => handleInputChange(index, 'category', e.target.value)}
                            title="Категория специалиста"
                        />
                        <Input
                            name={`rate-${index}`}
                            type="number"
                            placeholder="Стоимость ставки нормо-часа (НДС 5%)"
                            value={row.rate}
                            onChange={(e) => handleInputChange(index, 'rate', e.target.value)}
                            title="Стоимость ставки нормо-часа (НДС 5%)"

                        />
                        <Input
                            name={`hours-${index}`}
                            type="number"
                            placeholder="Объем затраченных ресурсов (чел./час)"
                            value={row.hours}
                            onChange={(e) => handleInputChange(index, 'hours', e.target.value)}
                            title="Объем затраченных ресурсов (чел./час)"

                        />
                    </>
                )}
                
                {template.format === '1' && template.firm === 'Байт' && (
                    <>
                        <Input
                            name={`taskName-${index}`}
                            type="text"
                            placeholder="Название задачи"
                            title="Название задачи"
                            value={row.taskName}
                            onChange={(e) => handleInputChange(index, 'taskName', e.target.value)}
                        />
                        <Input
                            name={`price-${index}`}
                            type="number"
                            placeholder="Цена, руб, без НДС"
                            title="Цена, руб, без НДС"
                            value={row.price}
                            onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                        />
                        <Input
                            name={`quantity-${index}`}
                            type="number"
                            placeholder="Количество"
                            title="Количество"
                            value={row.quantity}
                            onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                        />
                    </>
                )}
                
                {template.format === '1' && template.firm === 'Жираф' && (
                    <Input
                        name={`cost-${index}`}
                        type="text"
                        placeholder="Стоимость выполненных Работ (руб, коп.)"
                        title="Стоимость выполненных Работ (руб, коп.)"
                        value={row.cost}
                        onChange={(e) => handleInputChange(index, 'cost', e.target.value)}
                    />
                )}
                
                {template.format === '1' && template.firm === 'Мега' && (
                    <>
                        <Input
                            name={`category-${index}`}
                            type="text"
                            placeholder="Категория специалиста"
                            title="Категория специалиста"
                            value={row.category}
                            onChange={(e) => handleInputChange(index, 'category', e.target.value)}
                        />
                        <Input
                            name={`rate-${index}`}
                            type="number"
                            placeholder="Стоимость ставки нормо-часа (руб., с НДС)"
                            title="Стоимость ставки нормо-часа (руб., с НДС)"
                            value={row.rate}
                            onChange={(e) => handleInputChange(index, 'rate', e.target.value)}
                        />
                        <Input
                            name={`hours-${index}`}
                            type="number"
                            placeholder="Объем затраченных ресурсов (чел./час)"
                            title="Объем затраченных ресурсов (чел./час)"
                            value={row.hours}
                            onChange={(e) => handleInputChange(index, 'hours', e.target.value)}
                        />
                    </>
                )}
                
                {template.format === '1' && template.firm === 'Море' && (
                    <>
                        <Input
                            name={`serviceName-${index}`}
                            type="text"
                            placeholder="Название услуги"
                            title="Название услуги"
                            value={row.serviceName}
                            onChange={(e) => handleInputChange(index, 'serviceName', e.target.value)}
                        />
                        <Input
                            name={`role-${index}`}
                            type="text"
                            placeholder="Роль специалиста"
                            title="Роль специалиста"
                            value={row.role}
                            onChange={(e) => handleInputChange(index, 'role', e.target.value)}
                        />
                        <Input
                            name={`rate-${index}`}
                            type="number"
                            placeholder="Ставка (руб./час, в т.ч. НДС 5%)"
                            title="Ставка (руб./час, в т.ч. НДС 5%)"
                            value={row.rate}
                            onChange={(e) => handleInputChange(index, 'rate', e.target.value)}
                        />
                        <Input
                            name={`hours-${index}`}
                            type="number"
                            placeholder="Количество часов"
                            title="Количество часов"
                            value={row.hours}
                            onChange={(e) => handleInputChange(index, 'hours', e.target.value)}
                        />
                    </>
                )}
                
                {template.format === '2' && template.firm === 'Аниме' && (
                    <>
                        <Input
                            name={`taskName-${index}`}
                            type="text"
                            placeholder="Название задачи"
                            title="Название задачи"
                            value={row.taskName}
                            onChange={(e) => handleInputChange(index, 'taskName', e.target.value)}
                        />
                        <Input
                            name={`startDate-${index}`}
                            type="text"
                            placeholder="Начало выполнения (день, месяц)"
                            title="Начало выполнения (день, месяц)"
                            value={row.startDate}
                            onChange={(e) => handleInputChange(index, 'startDate', e.target.value)}
                        />
                        <Input
                            name={`endDate-${index}`}
                            type="text"
                            placeholder="Конец выполнения (день, месяц)"
                            title="Конец выполнения (день, месяц)"
                            value={row.endDate}
                            onChange={(e) => handleInputChange(index, 'endDate', e.target.value)}
                        />
                        <Input
                            name={`totalCost-${index}`}
                            type="text"
                            placeholder="Итого предельная стоимость"
                            title="Итого предельная стоимость"
                            value={row.totalCost}
                            onChange={(e) => handleInputChange(index, 'totalCost', e.target.value)}
                        />
                    </>
                )}
                
                {template.format === '2' && template.firm === 'Байт' && (
                    <>
                        <Input
                            name={`taskName-${index}`}
                            type="text"
                            placeholder="Название задачи"
                            title="Название задачи"
                            value={row.taskName}
                            onChange={(e) => handleInputChange(index, 'taskName', e.target.value)}
                        />
                        <Input
                            name={`price-${index}`}
                            type="number"
                            placeholder="Цена, руб, без НДС"
                            title="Цена, руб, без НДС"
                            value={row.price}
                            onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                        />
                        <Input
                            name={`quantity-${index}`}
                            type="number"
                            title="Количество"
                            placeholder="Количество"
                            value={row.quantity}
                            onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                        />
                    </>
                )}
                
                {template.format === '2' && template.firm === 'Мега' && (
                    <>
                        <Input
                            name={`taskName-${index}`}
                            type="text"
                            placeholder="Название задачи"
                            title="Название задачи"
                            value={row.taskName}
                            onChange={(e) => handleInputChange(index, 'taskName', e.target.value)}
                        />
                        <Input
                            name={`startDate-${index}`}
                            type="text"
                            placeholder="Начало выполнения (день, месяц)"
                            title="Начало выполнения (день, месяц)"
                            value={row.startDate}
                            onChange={(e) => handleInputChange(index, 'startDate', e.target.value)}
                        />
                        <Input
                            name={`endDate-${index}`}
                            type="text"
                            placeholder="Конец выполнения (день, месяц)"
                            title="Конец выполнения (день, месяц)"
                            value={row.endDate}
                            onChange={(e) => handleInputChange(index, 'endDate', e.target.value)}
                        />
                        <Input
                            name={`totalCost-${index}`}
                            type="text"
                            placeholder="Итого предельная стоимость (руб. и коп.)"
                            title="Итого предельная стоимость (руб. и коп.)"
                            value={row.totalCost}
                            onChange={(e) => handleInputChange(index, 'totalCost', e.target.value)}
                        />
                    </>
                )}
                
                {template.format === '3' && template.firm === 'Жираф' && (
                    <>
                        <Input
                            name={`taskName-${index}`}
                            type="text"
                            placeholder="Название задачи"
                            title="Название задачи"
                            value={row.taskName}
                            onChange={(e) => handleInputChange(index, 'taskName', e.target.value)}
                        />
                        <Input
                            name={`hourlyRate-${index}`}
                            type="number"
                            placeholder="Стоимость в час/руб."
                            title="Стоимость в час/руб."
                            value={row.hourlyRate}
                            onChange={(e) => handleInputChange(index, 'hourlyRate', e.target.value)}
                        />
                        <Input
                            name={`hours-${index}`}
                            type="number"
                            placeholder="Кол-во часов"
                            title="Кол-во часов"
                            value={row.hours}
                            onChange={(e) => handleInputChange(index, 'hours', e.target.value)}
                        />
                    </>
                )}
                
                {template.format === '3' && template.firm === 'Море' && (
                    <>
                        <Input
                            name={`specialistName-${index}`}
                            type="text"
                            placeholder="ФИО специалиста"
                            title="ФИО специалиста"
                            value={row.specialistName}
                            onChange={(e) => handleInputChange(index, 'specialistName', e.target.value)}
                        />
                        <Input
                            name={`dayType-${index}`}
                            type="text"
                            placeholder="Тип дня"
                            title="Тип дня"
                            value={row.dayType}
                            onChange={(e) => handleInputChange(index, 'dayType', e.target.value)}
                        />
                        <Input
                            name={`date-${index}`}
                            type="text"
                            placeholder="Дата (день.месяц.год)"
                            title="Дата (день.месяц.год)"
                            value={row.date}
                            onChange={(e) => handleInputChange(index, 'date', e.target.value)}
                        />
                        <Input
                            name={`comment-${index}`}
                            type="text"
                            placeholder="Комментарий"
                            title="Комментарий"
                            value={row.comment}
                            onChange={(e) => handleInputChange(index, 'comment', e.target.value)}
                        />
                        <DropdownMenu
                            name={`absence-${index}`}
                            options={[
                                { value: '-', label: '-' },
                                { value: '+', label: '+' }
                            ]}
                            value={row.absence}
                            onChange={(e) => handleInputChange(index, 'absence', e.target.value)}
                        />
                    </>
                )}
                
                {formData.length > 1 && (
                    <button 
                        type="button" 
                        className="remove-row-button"
                        onClick={() => removeRow(index)}
                    >
                        ×
                    </button>
                )}
            </div>
        ));
    };

    const shouldShowAddButton = () => {
        if (!template) return false;
        
        // Шаблоны, где не нужно добавлять кнопку "+"
        const noAddButtonTemplates = [
            { format: '1', firm: 'Жираф' }
        ];
        
        return !noAddButtonTemplates.some(t => 
            t.format === template.format && t.firm === template.firm
        );
    };

    if (isLoading) {
        return (
            <div>
                <Background />
                <div className="grid-container">
                    <Navbar userLogin={userLogin} onLogout={onLogin} />
                    <div className="main-content">
                        <div className="main-content__header">
                            <h4>Загрузка данных...</h4>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!template) {// Проверка на отсутствие template ПОСЛЕ проверки isLoading
        return (
            <div>
                <Background />
                <div className="grid-container">
                    <Navbar userLogin={userLogin} onLogout={onLogin} />
                    <div className="main-content">
                        <div className="main-content__header">
                            <button onClick={() => navigate('/document')} className="back-button"></button>
                            <h4>Ошибка загрузки</h4>
                        </div>
                        <div className="error-message">
                            Не удалось загрузить данные шаблона. Пожалуйста, начните с начала.
                        </div>
                        <Button onClick={() => navigate('/document')}>Вернуться к созданию</Button>
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
                <div id={template.format === '1' && template.firm === 'Жираф' ? "oneInput" : "data-block"} className="main-content">
                    <div className="main-content__header">
                        <button onClick={handleBackClick} className="back-button"></button>
                        <h4>Заполните данные</h4>
                    </div>
                    <div className="document-data-form">
                        {renderFormFields()}
                        
                        {shouldShowAddButton() && (
                            <Button
                                id={"addRow"} 
                                type="button" 
                                onClick={addRow}
                                className="add-row-button"
                                disabled={!isFormValid}

                            >
                                +
                            </Button>
                        )}
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