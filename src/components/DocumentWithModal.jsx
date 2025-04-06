// DocumentWithModal.jsx
import { useState, useRef, useEffect } from 'react';
import ShareModal from './ShareModal';
export default function DocumentWithModal({ children }) {

  const [showShareModal, setShowShareModal] = useState(false);
  const currentUrl = window.location.href; //  кастомная ссылка

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (action) => {
    alert(`${action} документ`);
    setIsMenuOpen(false);
    if (action === 'Удалить') setIsModalOpen(false);
  };

  const handleActionShare = () => {
    setShowShareModal(true);

    setIsMenuOpen(false);
  }

  return (
    <>
      {/* Обычный документ (кликабельный) */}
      <div 
        className="documents-tab__docs-item" 
        onClick={() => setIsModalOpen(true)}
      >
        {children}
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="document-modal">
          <div 
            className="document-modal__backdrop"
            onClick={() => setIsModalOpen(false)}
          />
          
          <div className="document-modal__content">
            <div className="document-modal__controls">
              <button 
                className="document-modal__kebab"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
              >
                ⋮
              </button>
              
              <button 
                className="document-modal__close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            
            {isMenuOpen && (
              <div 
                className="document-modal__menu"
                ref={menuRef}
              >
                <button onClick={() => handleAction('Скачать')}>Скачать</button>
                <button onClick={() => handleAction('Печать')}>Печать</button>
                <button onClick={() => handleActionShare()}>Поделиться</button>
                <button onClick={() => handleAction('Удалить')}>Удалить</button>
              </div>
            )}
            {showShareModal && (
                                <ShareModal 
                                    url={currentUrl} 
                                    onClose={() => setShowShareModal(false)} 
                                />
                            )} 
            <div className="document-modal__document">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}