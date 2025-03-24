import React from 'react';

export default function Navbar() {
  const userLogin = "User123"; 

  return (
    <nav className="navbar">
      <button className='navbar__login-icon'></button>
      <div className="select-wrapper">
        <select className="navbar__login-button " name="format" id="shablon">
            <option value="" hidden>{userLogin}</option>
            <option value="1">Личный кабинет</option>
            <option value="2">Выйти</option>
        </select>
      </div>
    </nav>
  );
}