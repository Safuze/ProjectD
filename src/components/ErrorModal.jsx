export default function ErrorModal({ message, onClose, children }) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal__content">
            <p>{message}</p>
            <button onClick={onClose} className="modal-button">
              {children}
            </button>
          </div>
        </div>
      </div>
    );
  }