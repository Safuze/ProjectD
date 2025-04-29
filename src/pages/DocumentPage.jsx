import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from "../components/Button/Button";
import Background from "../components/Background";
import ShareModal from '../components/ShareModal';
import useFileStore from '../components/useFileStore';
import mammoth from 'mammoth';

const DocumentPage = ({ setIsCreatingDocument, documentReady, setDocumentReady }) => {
    const [showShareModal, setShowShareModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const currentUrl = window.location.href;
    const [htmlContent, setHtmlContent] = useState('');
    const [showSaveModal, setShowSaveModal] = useState(false);

    const file = useFileStore(state => state.file);

    useEffect(() => {
        if (file) {
          const reader = new FileReader();
          reader.onload = async () => {
            const result = await mammoth.convertToHtml({ arrayBuffer: reader.result });
            setHtmlContent(result.value);
          };
          reader.readAsArrayBuffer(file);
        }
      }, [file]);

    useEffect(() => {
        if (location.state?.documentData) {
            setDocumentReady(true);
        }
    }, [location, setDocumentReady]);
  
    const handleSaveTemplate = async ({ firm, format }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('firm', firm);
        formData.append('format', format);
      
        await fetch('/api/templates', {
          method: 'POST',
          body: formData
        });
      
        setShowSaveModal(false);
        alert('Шаблон сохранен!');
      };

    const handleBackClick = () => {
        setIsCreatingDocument(true);
        navigate('/');
        setDocumentReady(false);
    };

    if (!documentReady) {
        return (
            <div>
                <Background />
                <div className="documentPage">
                    <div className='documentPage__doc-content'>
                        <button onClick={handleBackClick} className="back-btn">Назад</button>
                        <div className="a4-container">
                            <div className="a4-page" dangerouslySetInnerHTML={{ __html: htmlContent }} />
                        </div>
                        <Button onClick={() => setShowSaveModal(true)}>Сохранить шаблон</Button>
                        {showSaveModal && (
                        <SaveTemplateModal 
                            onClose={() => setShowSaveModal(false)} 
                            onSave={handleSaveTemplate}
                        />
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Background />
            <div className="documentPage">
                <div className='documentPage__doc-content'>
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
                        <Button 
                            onClick={generateDocument}
                            disabled={isGenerating}
                        >
                            {isGenerating ? 'Генерация...' : 'Скачать'}
                        </Button>
                        <Button onClick={() => window.print()}>Печать</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentPage;