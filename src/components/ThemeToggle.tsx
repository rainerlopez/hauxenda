import React from 'react';
import { Button, Tooltip } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  size?: 'small' | 'middle' | 'large';
  style?: React.CSSProperties;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'middle', 
  style 
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Tooltip title={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}>
      <Button
        type="text"
        size={size}
        icon={isDark ? <SunOutlined /> : <MoonOutlined />}
        onClick={toggleTheme}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
        aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      />
    </Tooltip>
  );
};
