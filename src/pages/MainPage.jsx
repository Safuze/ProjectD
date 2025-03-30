import React from 'react';
import Background from '../components/Background';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import Login from '../components/Login';

const MainPage = ({ userLogin, onLogin, isCreatingDocument, setIsCreatingDocument }) => {
    return (
        <div>
            <Background />
            <div className="grid-container">
                <Navbar userLogin={userLogin} onLogout={onLogin} />
                <div className='grid-container__content'>
                    <Header />
                    <Login 
                        onLogin={onLogin}
                        isCreatingDocument={isCreatingDocument}
                        setIsCreatingDocument={setIsCreatingDocument}
                    /> {/* Передаем функцию в Login */}
                </div>
            </div>
        </div>
    );
};

export default MainPage;
