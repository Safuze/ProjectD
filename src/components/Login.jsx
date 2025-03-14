export default function Login() {
    return (
        <div class="form">
            <div class="form__top">
                <div class="form__img"></div>
                <div class="form__img"></div>
            </div>
            <div class="form__welcome">
                <h2>Добро пожаловать!</h2>
            </div>
            <div class="form__main">
                <input type="text" class="form__login" placeholder="Логин"/>
                <input type="text" class="form__password" placeholder="Пароль"/>
                <button class="form__loginBtn"></button>
            </div>
            <div class="form__down">
                <button id="forget_password"></button>
                <button id="registration"></button>
            </div>
        </div>
    )
}