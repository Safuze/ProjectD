import Background from './components/Background.jsx'
import Navbar from './components/Navbar.jsx'
import Header from './components/header.jsx'
import Login from './components/Login.jsx'
function App() {
  return (
    <div>
      <Background />
      <div class="grid-container">
        <Navbar class="grid-container__item"/>
        <Header class="grid-container__item"/>
        <Login class="grid-container__item"/>
      </div>
    </div>
  )
}

export default App
