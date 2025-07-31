import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { hauxendaTheme, hauxendaDarkTheme } from '../theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    // Verificar preferência salva no localStorage
    const saved = localStorage.getItem('hauxenda-theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    
    // Verificar preferência do sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  const isDark = themeMode === 'dark';

  const toggleTheme = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    localStorage.setItem('hauxenda-theme', newMode);
  };

  // Escutar mudanças na preferência do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Só atualizar se não houver preferência salva
      if (!localStorage.getItem('hauxenda-theme')) {
        setThemeMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Aplicar classe no body para transições suaves
  useEffect(() => {
    document.body.className = isDark ? 'dark-theme' : 'light-theme';
  }, [isDark]);

  const currentTheme = isDark ? hauxendaDarkTheme : hauxendaTheme;

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme, isDark }}>
      <ConfigProvider
        theme={{
          ...currentTheme,
          algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
