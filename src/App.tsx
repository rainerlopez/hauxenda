import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import { SupabaseExample } from './components/SupabaseExample';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CreateEventPage from './pages/CreateEventPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/testebg" element={<HomePage />} />
      <Route path="/supabase" element={<SupabaseExample />} />
      <Route path="/condutor" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/create-event" element={<CreateEventPage />} />
    </Routes>
  );
}

export default App;
