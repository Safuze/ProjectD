import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import UserProfilePage from './pages/UserProfilePage';
import DocumentPage from './pages/DocumentPage';
function App() {
    const [userLogin, setUserLogin] = useState(null);
    const [isCreatingDocument, setIsCreatingDocument] = useState(false);

    const handleLogin = (login) => {
        setUserLogin(login);
        setIsCreatingDocument(false); // Сбрасываем при логине
    };

    const handleLogout = () => {
        setUserLogin(null);
        setIsCreatingDocument(false); // Добавляем сброс состояния документа
    };

    return (
        <Router>
            <Routes>
                <Route 
                    path="/" 
                    element={
                        <MainPage 
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
                                login={userLogin} 
                                onLogout={handleLogout}
                                setIsCreatingDocument={setIsCreatingDocument}
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
            </Routes>
        </Router>
    );
}

export default App;