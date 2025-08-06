import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import { SupabaseExample } from './components/SupabaseExample';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CreateEventPage from './pages/CreateEventPage';
import EventRegistrationPage from './pages/EventRegistrationPage';
import AttendeeRegistrationPage from './pages/AttendeeRegistrationPage';
import EventListPage from './pages/EventListPage';
import EditEventPage from './pages/EditEventPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/testebg" element={<HomePage />} />
      <Route path="/supabase" element={<SupabaseExample />} />
      <Route path="/condutor" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/create-event" element={<CreateEventPage />} />
      <Route path="/edit-event/:id" element={<EditEventPage />} />
      <Route path="/events" element={<EventListPage />} />
      <Route path="/events/:id" element={<EventRegistrationPage />} />
      <Route path="/events/:id/register" element={<AttendeeRegistrationPage />} />
    </Routes>
  );
}

export default App;
