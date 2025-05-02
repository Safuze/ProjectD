import { useEffect, useState } from 'react';
import Background from "../components/Background";
import Navbar from "../components/Navbar";
import Button from "../components/Button/Button"
import CustomPrompt from '../components/CustomPrompt';
import DocumentWithModal from '../components/DocumentWithModal';
import { useNavigate } from 'react-router-dom';



export default function UserProfilePage({ login, onLogout, email, setIsCreatingDocument}) {
    const [showPrompt, setShowPrompt] = useState(false);
    const [activeTab, setActiveTab] = useState('data'); // Без типа
    const [isFIO, setIsFIO] = useState('');
    const [isPosition, setIsPosition] = useState('');
    const [isFirm, setIsFirm] = useState('');
    const navigate = useNavigate(); 

    // Функция для перехода на страницу всех документов
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const response = await fetch(`http://localhost:3001/get-user-profile?login=${login}`);
            const data = await response.json();
            
            if (response.ok && data.user) {
              setIsFIO(data.user.full_name || '');
              setIsPosition(data.user.position || '');
              setIsFirm(data.user.firm || '');
            }
          } catch (error) {
            console.error('Ошибка при загрузке данных пользователя:', error);
          }
        };
      
        if (login) {
          fetchUserData();
        }
      }, [login]);

    const handleShowMore = () => {
        navigate('/documents');
    };

    const handleSave = async(data) => {
        console.log('Отправляемые данные:', { 
            login: login, 
            fullName: data.fio, 
            firm: data.firm,
            position: data.position 
          });
        try {
            const response = await fetch('http://localhost:3001/update-user-profile', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                login: login,
                fullName: data.fio,
                firm: data.firm,
                position: data.position
              }),
            });
        
            const result = await response.json();
            console.log('Ответ сервера:', result);
            
            if (response.ok) {
              setIsFIO(data.fio);
              setIsPosition(data.position);
              setIsFirm(data.firm);
              setShowPrompt(false);
              console.log('Данные успешно сохранены');
            } else {
              console.error('Ошибка при сохранении:', result);
              alert(`Не удалось сохранить данные: ${result.message || 'Неизвестная ошибка'}\nДетали: ${result.errorDetails || 'нет'}`);
            }
          } catch (error) {
            console.error('Ошибка сети:', error);
            alert(`Ошибка сети: ${error.message}`);
          }
    };

    const handleDocumentCreation = () => {
        setIsCreatingDocument(true);
        navigate('/');
    };

    return (
        <div>
            <Background />
            <div className="grid-container">
                <Navbar userLogin={login} onLogout={onLogout}>
                    <button 
                        onClick={handleDocumentCreation} 
                        className='navbar__make-doc'
                    >
                        Создать документ
                    </button>
                </Navbar>
                <div id="profile" className='grid-container__content'>
                    <div className="avatar-block">
                        <div className="avatar-block__icon"></div>
                        <span>Личный кабинет</span>
                    </div>
                    <div className="main-content">
                        <div className="tabs">
                            <button
                                className={`tabs__button ${activeTab === 'data' ? 'active' : ''}`}
                                onClick={() => setActiveTab('data')}
                            >
                                Мои данные
                                <div 
                                className={`line ${activeTab === 'data' ? 'active' : ''}`}
                                >
                                </div>
                            </button>
                            <button
                                className={`tabs__button ${activeTab === 'documents' ? 'active' : ''}`}
                                onClick={() => setActiveTab('documents')}
                            >
                                Сохраненные документы
                                <div 
                                className={`line ${activeTab === 'documents' ? 'active' : ''}`}
                                >
                                </div>
                            </button>
                        </div>

                        <div className="tab-content">
                            {activeTab === 'data' && (
                                <>
                                    <div className="data-tab">
                                        <div className="data-tab__item">
                                            <span className="data-tab__login">Логин:</span>
                                            <span className="data-tab__login">
                                                {login}
                                            </span>
                                        </div>
                                        <div className="data-tab__item">
                                            <span className="data-tab__email">Почта:</span>
                                            <span className="data-tab__email">{email}</span>
                                        </div>
                                        <div className="data-tab__item">
                                            <span className="data-tab__fio">ФИО:  </span>
                                            <span className="data-tab__fio"> 
                                                {(isFIO ? isFIO : "  Не указано")}
                                            </span>
                                        </div>
                                        <div className="data-tab__item">
                                            <span className="data-tab__firm">Компания:</span>
                                            <span className="data-tab__firm"> 
                                                {(isFirm ? isFirm : "  Не указано")}
                                            </span>
                                        </div>
                                        <div className="data-tab__item">
                                            <span className="data-tab__position">Должность:</span>
                                            <span className="data-tab__position"> 
                                                {(isPosition ? isPosition : "  Не указано")}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='tab-content__down'>
                                        <div id="data-img"className='form__img-notebook'></div>
                                        <Button id="edit" children="Исполнительное лицо" onClick={() => setShowPrompt(true)}/>
                                        {showPrompt && (
                                            <CustomPrompt
                                            title="Исполнительное лицо"
                                            fields={[
                                                {
                                                placeholder: "ФИО",
                                                valueKey: "fio"
                                                },
                                                {
                                                placeholder: "Компания",
                                                valueKey: "firm"
                                                },
                                                {
                                                placeholder: "Должность",
                                                valueKey: "position"
                                                }
                                                
                                            ]}
                                            onConfirm={handleSave} 
                                            onCancel={() => setShowPrompt(false)}
                                            />
                                        )}
                                    </div>
                                </>
                            )}

                            {activeTab === 'documents' && (
                                <div className="documents-tab">
                                    <div className="documents-tab__docs">
                                        <DocumentWithModal />
                                        <DocumentWithModal />
                                        <DocumentWithModal />
                                        <DocumentWithModal />  
                                    </div>
                                    
                                        <div className='documents-tab__show-more'> 
                                            <button onClick={handleShowMore}>
                                            <img src="https://img.icons8.com/ios-filled/50/FFFFFF/chevron-down.png" alt="chevron-down"/>
                                                ПОКАЗАТЬ ЕЩЁ</button>
                                        </div>
                            
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}