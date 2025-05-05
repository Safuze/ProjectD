import React, { useEffect, useState } from 'react';
import PdfModal from '../components/PdfModal';
import TemplateCard from '../components/TemplateCard';
import Background from '../components/Background';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function TemplatesPage( {userLogin, onLogin, setIsCreatingDocument} ) {
  const [templates, setTemplates] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetch('/api/templates')
      .then(res => res.json())
      .then(setTemplates)
      .catch(err => {
        console.error("Ошибка загрузки шаблонов:", err);
        alert("Не удалось загрузить шаблоны.");
      });
  }, []);

  const handleDocumentCreation = () => {
    setIsCreatingDocument(true);
    navigate('/');
  };

  const grouped = templates.reduce((acc, tpl) => {
    if (!acc[tpl.format]) acc[tpl.format] = [];
    acc[tpl.format].push(tpl);
    return acc;
  }, {});

  return (
    <div>
      <Background />
      <div className="grid-container">
          <Navbar userLogin={userLogin} onLogout={onLogin}>
            <button 
              onClick={handleDocumentCreation} 
              className='navbar__make-doc'
              >
              Создать документ
            </button>
          </Navbar>
          <div className="templates-page">
            <div className='templates-page__nav'>
              <h3>Шаблоны документов</h3>
              <div>
                <a href="#acts" class="nav-link">Акты</a>
                <a href="#orders" class="nav-link">Заказы</a>
                <a href="#report" class="nav-link">Отчеты</a>
              </div>
              
            </div>
            
            <hr />
            {Object.entries(grouped).map(([format, group]) => (
              <>
              <div key={format} className="templates-page__group">
                <h3 id={format === "Акт" ? 'acts' : format === "Отчет" ? 'orders' : 'report'}>{`${format}ы`}</h3>
                <div className="templates-page__grid">
                  {group.map(tpl => (
                    <TemplateCard
                      key={tpl.id}
                      template={tpl}
                      onClick={() => setSelectedPdf(`/uploads/templates/${tpl.filename.replace('.docx', '.pdf')}`)}
                    />
                  ))}
                </div>
              </div>
              {format !== 'Отчет' && <hr></hr>}
              
              </>
            ))}
            {selectedPdf && (
              <PdfModal
                pdfUrl={selectedPdf}
                onClose={() => setSelectedPdf(null)}
              />
            )}
          </div>
      </div>
    </div>
  );
}
