import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme, App } from 'antd';
import { themeConfig, darkThemeConfig } from '../theme';
import ptBR from 'antd/locale/pt_BR';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    // Verificar preferência salva no localStorage
    const savedTheme = localStorage.getItem('hauxenda-theme') as ThemeMode;
    if (savedTheme) {
      return savedTheme;
    }
    
    // Verificar preferência do sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  const toggleTheme = () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    localStorage.setItem('hauxenda-theme', newTheme);
  };

  // Escutar mudanças na preferência do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Só alterar se não houver preferência salva
      if (!localStorage.getItem('hauxenda-theme')) {
        setThemeMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Aplicar classe no body para temas CSS globais
  useEffect(() => {
    document.body.className = themeMode === 'dark' ? 'dark-theme' : 'light-theme';
  }, [themeMode]);

  const currentThemeConfig = themeMode === 'dark' ? darkThemeConfig : themeConfig;

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <ConfigProvider
        theme={{
          ...currentThemeConfig,
          algorithm: themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
        locale={ptBR}
      >
        <App>
          {children}
        </App>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
