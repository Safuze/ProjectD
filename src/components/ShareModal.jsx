import React, { useState } from 'react';

// Компоненты иконок остаются без изменений
export const IconVK = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 48 48">
      <path fill="#4A76A8" d="M24 44C35 44 44 35 44 24S35 4 24 4 4 13 4 24s9 20 20 20z"/>
      <path fill="#FFF" d="M35.8 18.1c.1-.2.1-.3.1-.4 0-.2-.2-.4-.8-.4h-2.6c-.7 0-1 .4-1.1.8 0 0-1.6 3.4-3.5 5.6-.6.6-.9.6-1.3.6-.4 0-.9-.2-.9-.8v-5.2c0-.7-.2-1-.7-1h-4.6c-.4 0-.6.3-.6.6 0 .7.9.8 1 2.7v3.6c0 .8-.2 1-.5 1-.9 0-2.6-3-3.8-6.9-.2-.7-.4-1-1.1-1h-2.6c-.7 0-.9.4-.9.8 0 .7.6 4.6 3.9 9.1C18.2 30.1 21.4 32 24.1 32c1.7 0 1.9-.4 1.9-1.1v-3c0-.6.2-.8.7-.8.4 0 1.2.3 2.7 2 1.7 2 2 3 3 3h2.6c.6 0 1-.3 1-.8 0-.1 0-.3-.1-.4-.2-.6-1.1-2-2.2-3.3-.6-.7-1.2-1.5-1.5-1.9-.1-.2-.2-.4-.1-.6.1-.2.3-.4.5-.6 2.2-2.8 5.6-7.6 5.9-9.2z"/>
    </svg>
  );
  
  export const IconTG = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 48 48">
        <path fill="#29b6f6" d="M24 4A20 20 0 1 0 24 44A20 20 0 1 0 24 4Z" />
        <path fill="#fff" d="M33.95 15l-3.746 19.126c0 0-0.161 0.874-1.245 0.874-0.576 0-0.873-0.274-0.873-0.274l-8.114-6.733-3.97-2.001-5.095-1.355c0 0-0.907-0.262-0.907-1.012 0-0.625 0.933-0.923 0.933-0.923l21.316-8.468c-0.001-0.001 0.651-0.235 1.126-0.234C33.667 14 34 14.125 34 14.5 34 14.75 33.95 15 33.95 15z" />
        <path fill="#b0bec5" d="M23 30.505l-3.426 3.374c0 0-0.149 0.115-0.348 0.12-0.069 0.002-0.143-0.009-0.219-0.043l0.964-5.965L23 30.505z" />
        <path fill="#cfd8dc" d="M29.897 18.196c-0.169-0.22-0.481-0.26-0.701-0.093L16 26c0 0 2.106 5.892 2.427 6.912 0.322 1.021 0.58 1.045 0.58 1.045l0.964-5.965 9.832-9.096C30.023 18.729 30.064 18.416 29.897 18.196z" />
      </svg>
    );
  };
  
  export const IconWA = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 48 48">
        <path fill="#cfd8dc" d="M24.014 5c5.079 0.002 9.845 1.979 13.43 5.566 3.584 3.588 5.558 8.356 5.556 13.428-0.004 10.465-8.522 18.98-18.986 18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868 43.303l2.694-9.835C5.9 30.59 5.026 27.324 5.027 23.979 5.032 13.514 13.548 5 24.014 5 M24.014 42.974C24.014 42.974 24.014 42.974 24.014 42.974 24.014 42.974 24.014 42.974 24.014 42.974 M24.014 42.974C24.014 42.974 24.014 42.974 24.014 42.974 24.014 42.974 24.014 42.974 24.014 42.974 M24.014 4C24.014 4 24.014 4 24.014 4 12.998 4 4.032 12.962 4.027 23.979c-0.001 3.367 0.849 6.685 2.461 9.622l-2.585 9.439c-0.094 0.345 0.002 0.713 0.254 0.967 0.19 0.192 0.447 0.297 0.711 0.297 0.085 0 0.17-0.011 0.254-0.033l9.687-2.54c2.828 1.468 5.998 2.243 9.197 2.244 11.024 0 19.99-8.963 19.995-19.98 0.002-5.339-2.075-10.359-5.848-14.135C34.378 6.083 29.357 4.002 24.014 4L24.014 4z" />
        <path 
          fill="#fff" 
          fillRule="evenodd" 
          d="M19.268 16.045c-0.355-0.79-0.729-0.806-1.068-0.82-0.277-0.012-0.593-0.011-0.909-0.011-0.316 0-0.83 0.119-1.265 0.594-0.435 0.475-1.661 1.622-1.661 3.956 0 2.334 1.7 4.59 1.937 4.906 0.237 0.316 3.282 5.259 8.104 7.161 4.007 1.58 4.823 1.266 5.693 1.187 0.87-0.079 2.807-1.147 3.202-2.255 0.395-1.108 0.395-2.057 0.277-2.255-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068 0.238-0.316 0.474-1.225 1.543-1.502 1.859-0.277 0.317-0.554 0.357-1.028 0.119-0.474-0.238-2.002-0.738-3.815-2.354-1.41-1.257-2.362-2.81-2.639-3.285-0.277-0.474-0.03-0.731 0.208-0.968 0.213-0.213 0.474-0.554 0.712-0.831 0.237-0.277 0.316-0.475 0.474-0.791 0.158-0.317 0.079-0.594-0.04-0.831C20.612 19.329 19.69 16.983 19.268 16.045z" 
          clipRule="evenodd" 
        />
      </svg>
    );
  };
const ShareModal = ({ url, onClose }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    // Создаем временный textarea для копирования
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed'; // Чтобы не было прокрутки страницы
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      // Пробуем скопировать через Clipboard API
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url)
          .then(() => showCopiedFeedback())
          .catch(() => copyWithExecCommand(textArea));
      } else {
        // Fallback для старых браузеров
        copyWithExecCommand(textArea);
      }
    } catch (err) {
      console.error('Ошибка копирования:', err);
    }
    
    // Удаляем временный элемент
    document.body.removeChild(textArea);
  };

  const copyWithExecCommand = (textarea) => {
    try {
      document.execCommand('copy');
      showCopiedFeedback();
    } catch (err) {
      console.error('Fallback метод не сработал:', err);
      alert('Не удалось скопировать ссылку');
    }
  };

  const showCopiedFeedback = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shareToSocial = (social) => {
    let shareUrl = '';
    switch(social) {
      case 'vk':
        shareUrl = `https://vk.com/share.php?url=${encodeURIComponent(url)}`;
        break;
      case 'tg':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}`;
        break;
      case 'wa':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(url)}`;
        break;
      default:
        break;
    }
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="share-modal__overlay">
      <div className="share-modal">
        <button 
          className="share-modal__close-btn" 
          onClick={onClose}
          aria-label="Закрыть"
        >
          &times;
        </button>
        
        <h3 className="share-modal__title">Поделиться</h3>
        
        <div className="share-modal__social-buttons">
          <button 
            className="share-modal__social-btn share-modal__social-btn--vk"
            onClick={() => shareToSocial('vk')}
            aria-label="Поделиться во ВКонтакте"
          >
            <IconVK />
          </button>
          
          <button 
            className="share-modal__social-btn share-modal__social-btn--tg"
            onClick={() => shareToSocial('tg')}
            aria-label="Поделиться в Telegram"
          >
            <IconTG />
          </button>
          
          <button 
            className="share-modal__social-btn share-modal__social-btn--wa"
            onClick={() => shareToSocial('wa')}
            aria-label="Поделиться в WhatsApp"
          >
            <IconWA />
          </button>
        </div>
        
        <div className="share-modal__copy-section">
          <input 
            type="text" 
            value={url} 
            readOnly 
            className="share-modal__url-input"
            aria-label="Ссылка для копирования"
          />
          <button 
            className={`share-modal__copy-btn ${isCopied ? 'share-modal__copy-btn--copied' : ''}`}
            onClick={copyToClipboard}
            disabled={isCopied}
          >
            {isCopied ? 'Скопировано!' : 'Копировать'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;