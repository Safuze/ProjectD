import Button from "../components/Button/Button";
import Background from "../components/Background"; // Импортируете Background, если нужно
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import ShareModal from '../components/ShareModal';
const DocumentPage = ( {setIsCreatingDocument, documentReady, setDocumentReady} ) => {
    const [showShareModal, setShowShareModal] = useState(false);
    const currentUrl = window.location.href; // или ваша кастомная ссылка
    const navigate = useNavigate(); 

    const handleBackClick = () => {
        setIsCreatingDocument(true);
        setDocumentReady(false);
        navigate('/');
      }

    return (
        <div>
            <Background/>
            <div className="documentPage">
                <div className='documentPage__doc-content'>
                { documentReady ? (
                    <>
                        <div className='documentPage__doc'>
                            <div className="icon-btn">
                                <button onClick={handleBackClick} className="back-btn"></button>
                                <button 
                                    className="share-btn" 
                                    onClick={() => setShowShareModal(true)}
                                    aria-label="Поделиться"
                                >
                                    <svg viewBox="0 0 24 24" width="24" height="24">
                                        <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                                    </svg>
                                </button>  
                                {showShareModal && (
                                    <ShareModal 
                                        url={currentUrl} 
                                        onClose={() => setShowShareModal(false)} 
                                    />
                                )}                      
                            </div> 
                        </div>
                        <div className="download_and_print">
                            <Button children="Скачать" />
                            <Button children="Печать" />
                        </div>
                        </>
                    ) : (
                        <button onClick={handleBackClick} className="back-btn">Страница редактирования документа</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DocumentPage;