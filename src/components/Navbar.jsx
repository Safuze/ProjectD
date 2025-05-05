import React from 'react';
import { useNavigate } from 'react-router-dom';
import DropdownMenu from './DropdownMenu';

export default function Navbar({ userLogin, onLogout, children }) {
    const navigate = useNavigate(); // Хук для навигации

    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        if (selectedValue === "1") {
            // Перенаправление на личный кабинет
            navigate('/profile'); // Используем navigate для перехода
        } else if (selectedValue === "2") {
            // Логика выхода
            onLogout(); // Очищаем логин
            navigate('/'); // Возвращаем на главную страницу
        }
    };

    

    return (
        <nav className="navbar">
            {children}
            {userLogin && (
              <>
                <button 
                    className="templates-btn" 
                    onClick={() => navigate('/templates')}
                    >
                    Шаблоны
                </button>
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <div className="select-wrapper">
                    <DropdownMenu
                        className="navbar__login-button"
                        name="profile"
                        id="profile"
                        onChange={handleSelectChange}
                        placeholder={userLogin}
                        options={[
                            { value: "1", label: "Личный кабинет" },
                            { value: "2", label: "Выйти" },
                        ]}
                    />
                </div>
              </>
            )}
        </nav>
    );
}
