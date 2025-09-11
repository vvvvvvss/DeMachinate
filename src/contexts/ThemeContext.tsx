import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeSettings } from '../types';

interface ThemeContextType {
  theme: 'light' | 'dark';
  settings: ThemeSettings;
  updateSettings: (settings: Partial<ThemeSettings>) => void;
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

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ThemeSettings>({
    mode: 'auto',
    autoSwitchTime: { light: '06:00', dark: '18:00' },
    fontSize: 'medium',
    highContrast: false,
    colorblindFriendly: false
  });

  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const determineTheme = () => {
      if (settings.mode === 'light') return 'light';
      if (settings.mode === 'dark') return 'dark';
      
      // Auto mode - check time
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const lightTime = parseInt(settings.autoSwitchTime.light.split(':')[0]) * 60 + 
                       parseInt(settings.autoSwitchTime.light.split(':')[1]);
      const darkTime = parseInt(settings.autoSwitchTime.dark.split(':')[0]) * 60 + 
                      parseInt(settings.autoSwitchTime.dark.split(':')[1]);
      
      return currentTime >= lightTime && currentTime < darkTime ? 'light' : 'dark';
    };

    setTheme(determineTheme());
    
    // Update every minute for auto mode
    if (settings.mode === 'auto') {
      const interval = setInterval(determineTheme, 60000);
      return () => clearInterval(interval);
    }
  }, [settings]);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-font-size', settings.fontSize);
    document.documentElement.setAttribute('data-high-contrast', settings.highContrast.toString());
    document.documentElement.setAttribute('data-colorblind-friendly', settings.colorblindFriendly.toString());
  }, [theme, settings]);

  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light'
    }));
  };

  return (
    <ThemeContext.Provider value={{ theme, settings, updateSettings, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};