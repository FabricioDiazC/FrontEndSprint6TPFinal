import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PokedexPage from './pages/PokedexPage';
import MyTeamsPage from './pages/MyTeamsPage';
import BattlePage from './pages/BattlePage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100 text-gray-900">
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage  />} /> 
            <Route element={<ProtectedRoute />}>
               <Route path="/pokedex" element={<PokedexPage />} />
               <Route path="/teams" element={<MyTeamsPage />} />
               <Route path="/battle" element={<BattlePage />} />
               <Route path="/profile" element={<ProfilePage />} />
               <Route path="/" element={<Navigate to="/pokedex" replace />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <ToastContainer position="bottom-right" theme="colored" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;