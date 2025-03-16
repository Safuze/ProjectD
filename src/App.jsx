import Background from './components/Background.jsx'
import Navbar from './components/Navbar.jsx'
import Header from './components/header.jsx'
import Login from './components/Login.jsx'
function App() {
  return (
    <div>
      <Background />
      <div className="grid-container">
        <Navbar className="grid-container__item"/>
        <Header className="grid-container__item"/>
        <Login className="grid-container__item"/>
      </div>
    </div>
  )
}

export default App
