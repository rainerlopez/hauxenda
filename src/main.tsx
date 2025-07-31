import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SupabaseProvider } from "./contexts/SupabaseContext";
import { ThemeProvider } from './components/ThemeProvider';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <SupabaseProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </SupabaseProvider>
    </BrowserRouter>
  </StrictMode>
);
