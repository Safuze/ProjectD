import Button from '../components/Button/Button';
import Input from '../components/Input/Input';

export default function Login() {
    return (
        <div className="form">
                <div className="form__top">
                    <div className="form__img-line"></div>
                    <div className="form__img-notebook"></div>
                </div>
                <div className="form__welcome">
                    <h2>{'Добро'.toUpperCase()}<br/>{'пожаловать'.toUpperCase()}!</h2>
                </div>
                <div className="form__main">
                    <Input type="text" placeholder="Логин" />
                    <Input type="password" placeholder="Пароль" />
                    <Button text="Вход" />
                    <div className="form__down">
                        <button id="forget_password">Забыли пароль?</button>
                        <button id="registration">Регистрация</button>
                    </div>
                </div>
            </div>    
    )
}


