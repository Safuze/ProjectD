import React from 'react';
import { useNavigate } from 'react-router-dom';
import DocumentWithModal from '../components/DocumentWithModal';
import Background from '../components/Background';
import Navbar from '../components/Navbar';

export default function SavedDocuments( {userLogin, onLogin} ) {
    const navigate = useNavigate();

    return (
        <div>
            <Background />
                <div className="grid-container">
                    <Navbar userLogin={userLogin} onLogout={onLogin} />
                    <div id="savedDocs" className="main-content">
                        <div className="main-content__header">
                            <button onClick={() => navigate(-1)} className="back-button" ></button>
                            <h4>СОХРАНЕННЫЕ ДОКУМЕНТЫ</h4>
                        </div>
                        
                        <div className="documents-tab">
                            <div className="documents-tab__docs">
                                <DocumentWithModal />
                                <DocumentWithModal />
                                <DocumentWithModal />
                                <DocumentWithModal />
                                <DocumentWithModal />
                                <DocumentWithModal />
                                <DocumentWithModal />
                            </div>
                            
                            <div className="documents-page__scroll-bar">
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
}