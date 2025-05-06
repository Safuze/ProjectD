import React from 'react';

export default function TemplateCard({ template, onClick }) {
  
  return (
    <div className="templates-page__card" onClick={onClick}>
      <div className="templates-page__card-preview">
          <div className="templates-page__card-page-content">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/.docx_icon.svg/250px-.docx_icon.svg.png" alt="docx-icon" />
            <span>{template.firm}</span>
          </div>
      </div>
    </div>
  );
}
