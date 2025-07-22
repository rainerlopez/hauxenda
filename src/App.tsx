import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import { SupabaseExample } from './components/SupabaseExample';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/testebg" element={<HomePage />} />
      <Route path="/supabase" element={<SupabaseExample />} />
    </Routes>
  );
}

export default App;
