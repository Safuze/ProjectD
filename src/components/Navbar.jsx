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
                <button className='navbar__login-icon'></button>
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
