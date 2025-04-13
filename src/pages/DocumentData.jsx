import { useNavigate } from 'react-router-dom';
import Background from '../components/Background';
import Navbar from '../components/Navbar';
import Button from '../components/Button/Button';
const DocumentData = ( {setIsCreatingDocument, userLogin, onLogin, setDocumentReady} ) => {
    
    const navigate = useNavigate(); 
    const handleBackClick = () => {
        setIsCreatingDocument(true);
        setDocumentReady(false);
        navigate(-1);
      }

    const handleGenerateDoc = () => {
        setDocumentReady(true);
        navigate('/document');

    }

    return (
        <div>
            <Background />
            <div className="grid-container">
                <Navbar userLogin={userLogin} onLogout={onLogin} />
                <div class="main-content">
                    <div className="main-content__header">
                        <button onClick={handleBackClick} className="back-button"></button>
                        <h4>Заполните данные</h4>
                    </div>
                    <div>
                        Здесь должны быть дополнительные поля для данных
                    </div>
                    <div>
                        <Button onClick={handleGenerateDoc}>Сгенеровать документ</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DocumentData;