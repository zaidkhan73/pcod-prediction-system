import './App.css'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import PCOSForm from './pages/PCOSForm'

function App() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/form' element={<PCOSForm/>}/>
    </Routes>
  )
}

export default App
