import type { ThemeConfig } from 'antd';

// Cores principais do projeto Hauxenda
const primaryColor = '#43cea2'; // Verde principal
const secondaryColor = '#185a9d'; // Azul secundário

// Configuração do tema customizado
export const themeConfig: ThemeConfig = {
  token: {
    // Cores principais
    colorPrimary: primaryColor,
    colorSuccess: primaryColor,
    colorInfo: secondaryColor,
    
    // Cores derivadas da primária
    colorPrimaryBg: '#f0faf7',
    colorPrimaryBgHover: '#e6f7f1',
    colorPrimaryBorder: '#b3e5d1',
    colorPrimaryBorderHover: '#87d4b8',
    colorPrimaryHover: '#5dd4b0',
    colorPrimaryActive: '#3bb896',
    
    // Cores derivadas da secundária (info)
    colorInfoBg: '#f0f5fb',
    colorInfoBgHover: '#e6f0f8',
    colorInfoBorder: '#b3d1eb',
    colorInfoBorderHover: '#87b8dd',
    colorInfoHover: '#2d6bb0',
    colorInfoActive: '#14528a',
    
    // Configurações de layout
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    
    // Tipografia
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXL: 20,
    
    // Espaçamentos
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    
    // Cores neutras customizadas
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f5f5f5',
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',
    
    // Sombras
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    boxShadowSecondary: '0 1px 4px rgba(0, 0, 0, 0.08)',
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      controlHeightSM: 32,
      controlHeightLG: 48,
      fontWeight: 500,
    },
    Card: {
      borderRadius: 12,
      paddingLG: 24,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
      controlHeightSM: 32,
      controlHeightLG: 48,
    },
    Select: {
      borderRadius: 8,
      controlHeight: 40,
      controlHeightSM: 32,
      controlHeightLG: 48,
    },
    Modal: {
      borderRadius: 12,
    },
    Drawer: {
      borderRadius: 12,
    },
    Menu: {
      borderRadius: 8,
      itemBorderRadius: 6,
    },
    Tabs: {
      borderRadius: 8,
    },
    Table: {
      borderRadius: 8,
    },
    Form: {
      itemMarginBottom: 20,
    },
  },
  algorithm: undefined, // Usar algoritmo padrão (light theme)
};

// Configuração para tema escuro (opcional)
export const darkThemeConfig: ThemeConfig = {
  ...themeConfig,
  token: {
    ...themeConfig.token,
    colorBgContainer: '#1f1f1f',
    colorBgElevated: '#262626',
    colorBgLayout: '#141414',
    colorBorder: '#434343',
    colorBorderSecondary: '#303030',
    colorText: '#ffffff',
    colorTextSecondary: '#a6a6a6',
    colorTextTertiary: '#737373',
  },
};
