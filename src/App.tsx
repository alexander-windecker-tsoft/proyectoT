import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AfiliadosList from './components/AfiliadosList';
import AfiliadosForm from './components/AfiliadosForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/afiliados" element={<AfiliadosList />} />
          <Route path="/afiliados/nuevo" element={<AfiliadosForm />} />
          <Route path="/afiliados/editar/:id" element={<AfiliadosForm />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
