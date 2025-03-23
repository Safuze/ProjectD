import React from 'react';
import Button from './Button/Button';
import Input from './Input/Input';

export default function DocumentCreation() {
  return (
    <div id="createDoc" className="form__main">
      <div className="form__img-notebook"></div>
      <div className="form__buttons">
        <Button>
            <div id="addDoc"className='form__icons'></div>
            Создать документ
        </Button>
        <Button>
            <div id="selectDoc" className='form__icons'></div>
            Выбрать имеющийся
        </Button>
      </div>
      <div className="form__decorative-image"></div>
    </div>
  );
}