import React from 'react';
import Button from './Button/Button';
import Input from './Input/Input';
import { useState } from 'react';

export default function DocumentCreation() {

  const [isCreatesDocument, setIsCreatesDocument] = useState(false);


  const handleCreateDocumentClick = () => {
    setIsCreatesDocument(true);
  }


  const handleBackClick = () => {
    setIsCreatesDocument(false);
  }

  return (
    <div id="createDoc" className="form__main">
      {isCreatesDocument ? (
        <>
          <div className='form__createDoc'>
            <h2>{"Создание документа".toUpperCase()}</h2>
              <div className='form__doc-data'>
                <div className="select-wrapper">
                  <select name="format" id="shablon">
                    <option value="">Выберите формат</option>
                    <option value="1">Акт</option>
                    <option value="2">Заказ</option>
                    <option value="2">Отчет</option>
                  </select>
                </div>               
                <Input
                  name="firm"
                  type="text"
                  placeholder="Введите фирму"
                />
                <Input
                  name="FIO"
                  type="text"
                  placeholder="Введите ФИО юр.лица"
                />
              </div>
              <div id="back_and_cont" className="form__buttons" style={{flexDirection: 'row'}}>
                <Button onClick={handleBackClick}>Назад</Button>
                <Button>Продолжить</Button>
              </div>
          </div>
        </>
      ) : (
        <>
          <div className="form__img-notebook"></div>
          <div className="form__buttons">
            <Button onClick={handleCreateDocumentClick}>
                Создать документ
            </Button>
            <Button>
                Выбрать имеющийся
            </Button>
          </div>
          <div className="form__decorative-image"></div>
        </>
      )}
    </div>
  );
}
