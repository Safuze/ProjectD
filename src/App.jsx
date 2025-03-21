import Background from './components/Background.jsx'
import Navbar from './components/Navbar.jsx'
import Header from './components/header.jsx'
import Login from './components/Login.jsx'
function App() {
  return (
    <div>
      <Background />
      <div className="grid-container">
        <Navbar />
        <div className='grid-container__content'>
          <Header />
          <Login />
        </div>
      </div>
    </div>
  )
}

export default App
