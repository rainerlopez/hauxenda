import { Link, Route, Routes } from 'react-router-dom';
import './App.css';
import TestBg from './pages/TestBg';

const HomePage = () => (
  <div style={{ textAlign: 'center', paddingTop: '50px' }}>
    <h1>Home Page</h1>
    <p>Welcome to the Hauxenda project.</p>
    <Link to="/testebg">Go to Test Background Page</Link>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/testebg" element={<TestBg />} />
    </Routes>
  );
}

export default App;
