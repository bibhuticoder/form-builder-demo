import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SidebarLayout from './SidebarLayout'
import Home from './pages/Home'
import Forms from './pages/Forms'
import Automations from './pages/Automations'
import FormBuilder from './pages/FormBuilder'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SidebarLayout />}>
          <Route index element={<Home />} />
          <Route path="forms" element={<Forms />} />
          <Route path="automations" element={<Automations />} />
          <Route path="forms/:id" element={<FormBuilder />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
