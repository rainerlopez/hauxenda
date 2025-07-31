import React from 'react';
import { Button, Tooltip } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  size?: 'small' | 'middle' | 'large';
  type?: 'default' | 'primary' | 'dashed' | 'link' | 'text';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'middle', 
  type = 'text',
  className 
}) => {
  const { themeMode, toggleTheme } = useTheme();

  const tooltipTitle = themeMode === 'light' ? 'Alternar para tema escuro' : 'Alternar para tema claro';
  const icon = themeMode === 'light' ? <MoonOutlined /> : <SunOutlined />;

  return (
    <Tooltip title={tooltipTitle}>
      <Button
        type={type}
        size={size}
        icon={icon}
        onClick={toggleTheme}
        className={className}
        aria-label={tooltipTitle}
      />
    </Tooltip>
  );
};
