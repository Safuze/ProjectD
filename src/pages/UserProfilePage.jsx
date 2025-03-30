import { useState } from 'react';
import Background from "../components/Background";
import Navbar from "../components/Navbar";
import Button from "../components/Button/Button"
import CustomPrompt from '../components/CustomPrompt';
import { useNavigate } from 'react-router-dom';

export default function UserProfilePage({ login, onLogout, email, setIsCreatingDocument}) {
    const [showPrompt, setShowPrompt] = useState(false);
    const [activeTab, setActiveTab] = useState('data'); // Без типа
    const [isFIO, setIsFIO] = useState('');
    const [newLogin, setNewLogin] = useState('');
    const navigate = useNavigate(); // Хук для навигации
    

    const handleSave = (data) => {
        setIsFIO(data.fio);
        setNewLogin(data.login);
        setShowPrompt(false);
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
                                                {newLogin ? newLogin : login}
                                            </span>
                                        </div>
                                        <div className="data-tab__item">
                                            <span className="data-tab__email">Почта:</span>
                                            <span className="data-tab__email">{email}</span>
                                        </div>
                                        <div className="data-tab__item">
                                            <span className="data-tab__fio">ФИО:</span>
                                            <span className="data-tab__fio"> 
                                                {(isFIO ? isFIO : "Не указано")}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='tab-content__down'>
                                        <div id="data-img"className='form__img-notebook'></div>
                                        <Button id="edit" children="Редактировать" onClick={() => setShowPrompt(true)}/>
                                        {showPrompt && (
                                            <CustomPrompt
                                            title="Редактирование профиля"
                                            fields={[
                                                {
                                                placeholder: "ФИО",
                                                valueKey: "fio"
                                                },
                                                {
                                                placeholder: "Логин",
                                                valueKey: "login"
                                                }
                                            ]}
                                            onConfirm={handleSave} // Исправлено: передаем саму функцию, а не объект
                                            onCancel={() => setShowPrompt(false)}
                                            />
                                        )}
                                    </div>
                                </>
                            )}

                            {activeTab === 'documents' && (
                                <div className="documents-tab">
                                    <h2>Сохраненные документы</h2>
                                    <p>Здесь будут отображаться ваши документы...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}