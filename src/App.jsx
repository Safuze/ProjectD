import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import UserProfilePage from './pages/UserProfilePage';
import DocumentPage from './pages/DocumentPage';
import SavedDocuments from './pages/SavedDocuments';
function App() {
    const [userLogin, setUserLogin] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userData, setUserData] = useState(null); // Новое состояние для всех данных пользователя
    const [isCreatingDocument, setIsCreatingDocument] = useState(false);

    // Обработчик для обновления данных пользователя
    const handleUserDataUpdate = (newData) => {
        if (newData.login) setUserLogin(newData.login);
        if (newData.fio) setUserData(newData); // Сохраняем все данные
        // Можно добавить другие поля по необходимости
    };

    const handleLogin = (login) => {
        setUserLogin(login);
        setIsCreatingDocument(false); // Сбрасываем при логине
    };
    const handleEmail = (email) => {
        setUserEmail(email);
    };

    const handleLogout = () => {
        setUserLogin(null);
        setUserEmail(null);
        setIsCreatingDocument(false); // Добавляем сброс состояния документа
    };

    return (
        <Router>
            <Routes>
                <Route 
                    path="/" 
                    element={
                        <MainPage 
                            newUserData={userData}
                            onEmail={handleEmail}
                            userLogin={userLogin} 
                            onLogin={handleLogin}
                            isCreatingDocument={isCreatingDocument}
                            setIsCreatingDocument={setIsCreatingDocument}
                        />
                    } 
                />
                <Route 
                    path="/profile" 
                    element={
                        userLogin ? (
                            <UserProfilePage 
                                email={userEmail}
                                login={userLogin} 
                                onLogout={handleLogout}
                                setIsCreatingDocument={setIsCreatingDocument}
                                onUserDataUpdate={handleUserDataUpdate}
                            />
                        ) : (
                            <Navigate to="/" />
                        )
                    } 
                />
                <Route 
                    path="/document" 
                    element={<DocumentPage setIsCreatingDocument={setIsCreatingDocument}/>} 
                />
                <Route 
                    path="/documents" 
                    element={
                        userLogin ? (
                            <SavedDocuments 
                            userLogin={userLogin} 
                            onLogin={handleLogin}
                            />
                        ) : (
                            <Navigate to="/" />
                        )
                    } 
                />
            </Routes>
        </Router>
    );
}

export default App;