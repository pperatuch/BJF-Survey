import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SurveyPage from './pages/SurveyPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SurveyPage />} />
        <Route path="/survey" element={<SurveyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
