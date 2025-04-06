export default function Document({ enlarged }) {
    return (
      <div className={`documents-tab__docs-item ${enlarged ? 'enlarged' : ''}`}>
        {/* Ваш контент документа */}
        {enlarged ? (
          <div className="document-content">
            {/* Увеличенное содержимое документа */}
          </div>
        ) : (
          <div className="document-preview">
            {/* Уменьшенное превью документа */}
          </div>
        )}
      </div>
    );
  }