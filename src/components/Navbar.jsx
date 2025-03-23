import React from 'react';

export default function Navbar() {
  const userLogin = "User123"; // Замените на реальный логин пользователя

  return (
    <nav className="navbar">
      <button className="navbar__login-button">
          {userLogin} {/* Отображаем логин пользователя */}
      </button>
    </nav>
  );
}