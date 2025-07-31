import type { ThemeConfig } from 'antd';

// Paleta de cores inspirada na natureza e espiritualidade
const colors = {
  // Cores primárias - tons terrosos e sagrados
  primary: {
    50: '#f0f9f0',
    100: '#dcf2dc',
    200: '#bce5bc',
    300: '#8fd48f',
    400: '#5cb85c',
    500: '#3d8b3d', // Verde sagrado principal
    600: '#2d6b2d',
    700: '#245424',
    800: '#1e441e',
    900: '#1a3a1a',
  },
  
  // Cores secundárias - tons de terra e argila
  secondary: {
    50: '#faf7f0',
    100: '#f4ede0',
    200: '#e8d8c0',
    300: '#d9bf9a',
    400: '#c8a274',
    500: '#b8875a', // Terracota sagrado
    600: '#a66f47',
    700: '#8b5a3c',
    800: '#724a35',
    900: '#5e3e2e',
  },
  
  // Cores de apoio - tons místicos
  accent: {
    purple: '#6b46c1', // Violeta espiritual
    indigo: '#4338ca', // Índigo místico
    teal: '#0d9488',   // Verde água
    amber: '#d97706',  // Âmbar dourado
  },
  
  // Tons neutros inspirados em pedras e cristais
  neutral: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
  }
};

// Configuração do tema Ant Design
export const hauxendaTheme: ThemeConfig = {
  token: {
    // === CORES PRINCIPAIS ===
    colorPrimary: colors.primary[500],
    colorSuccess: colors.primary[600],
    colorWarning: colors.accent.amber,
    colorError: '#dc2626',
    colorInfo: colors.accent.indigo,
    
    // === CORES DE FUNDO ===
    colorBgBase: '#ffffff',
    colorBgContainer: '#fafaf9',
    colorBgElevated: '#ffffff',
    colorBgLayout: colors.neutral[50],
    colorBgSpotlight: colors.primary[50],
    
    // === TIPOGRAFIA ===
    fontFamily: '"Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXL: 20,
    
    // === ESPAÇAMENTOS ===
    padding: 16,
    paddingXS: 8,
    paddingSM: 12,
    paddingLG: 24,
    paddingXL: 32,
    
    margin: 16,
    marginXS: 8,
    marginSM: 12,
    marginLG: 24,
    marginXL: 32,
    
    // === BORDAS E RAIOS ===
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    borderRadiusXS: 4,
    
    // === SOMBRAS ===
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    boxShadowSecondary: '0 4px 16px rgba(0, 0, 0, 0.08)',
    
    // === LINHA DE ALTURA ===
    lineHeight: 1.5714,
    lineHeightHeading1: 1.2105,
    lineHeightHeading2: 1.2667,
    lineHeightHeading3: 1.3333,
    lineHeightHeading4: 1.4,
    lineHeightHeading5: 1.5,
    
    // === CORES DE TEXTO ===
    colorText: colors.neutral[800],
    colorTextSecondary: colors.neutral[600],
    colorTextTertiary: colors.neutral[500],
    colorTextQuaternary: colors.neutral[400],
    
    // === CORES DE BORDA ===
    colorBorder: colors.neutral[200],
    colorBorderSecondary: colors.neutral[100],
    
    // === TRANSIÇÕES ===
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
  },
  
  components: {
    // === BUTTON ===
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      paddingInline: 24,
      fontWeight: 500,
      primaryShadow: `0 2px 4px ${colors.primary[500]}20`,
    },
    
    // === CARD ===
    Card: {
      borderRadius: 12,
      paddingLG: 24,
      boxShadowTertiary: '0 2px 12px rgba(0, 0, 0, 0.04)',
    },
    
    // === INPUT ===
    Input: {
      borderRadius: 8,
      controlHeight: 40,
      paddingInline: 16,
    },
    
    // === MODAL ===
    Modal: {
      borderRadius: 16,
      paddingLG: 32,
    },
    
    // === MENU ===
    Menu: {
      borderRadius: 8,
      itemBorderRadius: 6,
      itemHeight: 44,
      itemPaddingInline: 16,
    },
    
    // === TABS ===
    Tabs: {
      itemColor: colors.neutral[600],
      itemSelectedColor: colors.primary[500],
      itemHoverColor: colors.primary[400],
      inkBarColor: colors.primary[500],
    },
    
    // === TYPOGRAPHY ===
    Typography: {
      titleMarginBottom: '0.5em',
      titleMarginTop: '1.2em',
    },
  },
  
  // === ALGORITMO DE TEMA ===
  algorithm: undefined, // Usar o algoritmo padrão
};

// Tema escuro para cerimônias noturnas
export const hauxendaDarkTheme: ThemeConfig = {
  ...hauxendaTheme,
  token: {
    ...hauxendaTheme.token,
    
    // === CORES DE FUNDO ESCURO ===
    colorBgBase: colors.neutral[900],
    colorBgContainer: colors.neutral[800],
    colorBgElevated: colors.neutral[700],
    colorBgLayout: colors.neutral[900],
    colorBgSpotlight: colors.neutral[800],
    
    // === CORES DE TEXTO ESCURO ===
    colorText: colors.neutral[100],
    colorTextSecondary: colors.neutral[300],
    colorTextTertiary: colors.neutral[400],
    colorTextQuaternary: colors.neutral[500],
    
    // === CORES DE BORDA ESCURO ===
    colorBorder: colors.neutral[700],
    colorBorderSecondary: colors.neutral[800],
  },
};

// Exportar cores para uso em componentes customizados
export { colors };

// Tokens de design para uso consistente
export const designTokens = {
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
  },
  
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.06)',
    md: '0 2px 8px rgba(0, 0, 0, 0.08)',
    lg: '0 4px 16px rgba(0, 0, 0, 0.12)',
    xl: '0 8px 32px rgba(0, 0, 0, 0.16)',
  },
  
  transitions: {
    fast: '0.1s ease-in-out',
    normal: '0.2s ease-in-out',
    slow: '0.3s ease-in-out',
  },
};
