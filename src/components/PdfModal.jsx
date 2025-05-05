import React, { useState } from 'react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Document, Page, pdfjs } from 'react-pdf';

import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'; // ✅ Vite-style

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export default function PdfModal({ pdfUrl, onClose }) {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="pdf-modal-backdrop" onClick={onClose}>
      <div className="pdf-modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}>×</button>

        <div>
          <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} loading="Загрузка PDF...">
            {Array.from(new Array(numPages), (_, i) => (
              <Page key={`page_${i + 1}`} pageNumber={i + 1} width={600} />
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
}
