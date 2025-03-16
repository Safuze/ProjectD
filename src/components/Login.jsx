export default function Login() {
    return (
        <div className="login-container">
            <div className="form">
                <div className="form__top">
                    <div className="form__img-line"></div>
                    <div className="form__img-notebook"></div>
                </div>
                <div className="form__welcome">
                    <h2>{'Добро'.toUpperCase()}<br/>{'пожаловать'.toUpperCase()}!</h2>
                </div>
                <div className="form__main">
                    <input type="text" className="form__login input" placeholder="Логин"/>
                    <input type="password" className="form__password input" placeholder="Пароль"/>
                    <button class="form__loginBtn btn">Вход</button>
                    <div className="form__down">
                        <button id="forget_password">Забыли пароль?</button>
                        <button id="registration">Регистрация</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


