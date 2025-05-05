import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import UserProfilePage from './pages/UserProfilePage';
import DocumentData from './pages/DocumentData';
import SavedDocuments from './pages/SavedDocuments';
import DocumentPage from './pages/DocumentPage';
import TemplatesPage from './pages/TemplatesPage';
function App() {
    const [userLogin, setUserLogin] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [isCreatingDocument, setIsCreatingDocument] = useState(false);
    const [documentReady, setDocumentReady] = useState(false);
   
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
                            />
                        ) : (
                            <Navigate to="/" />
                        )
                    } 
                />
                <Route
                    path="/documentData"
                    element={<DocumentData 
                        setIsCreatingDocument={setIsCreatingDocument}
                        userLogin={userLogin} 
                        onLogin={handleLogin}
                        setDocumentReady={setDocumentReady}
                        />} 
                />
                <Route 
                    path="/document" 
                    element={
                        <DocumentPage
                            setIsCreatingDocument={setIsCreatingDocument}
                            documentReady={documentReady}
                            setDocumentReady={setDocumentReady}
                        />
                    } 
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
                <Route 
                    path="/templates" 
                    element={
                       <TemplatesPage
                        userLogin={userLogin} 
                        onLogin={handleLogin}
                        setIsCreatingDocument={setIsCreatingDocument}
                       />
                    } 
                />
            </Routes>
        </Router>
    );
}

export default App;