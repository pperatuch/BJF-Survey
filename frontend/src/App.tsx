import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SurveyResponsesPage from './pages/SurveyResponsesPage';
import SurveyPage from './pages/SurveyPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';

function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnauthorized = () => {
      useAuthStore.setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
      localStorage.removeItem('bjf_auth_token');
      navigate('/login', { replace: true });
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [navigate]);

  return (
    <Routes>
      {/* Public Employee Survey Route */}
      <Route path="/" element={<SurveyPage />} />
      <Route path="/survey" element={<SurveyPage />} />

      {/* Admin Authentication & Dashboard Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/responses"
        element={
          <ProtectedRoute>
            <SurveyResponsesPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/survey/bjf-survey">
      <AppContent />
    </BrowserRouter>
  );
}



