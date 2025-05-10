import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings, User } from '../types';

interface AppContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  settings: AppSettings;
  theme: 'light' | 'dark';
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

const defaultSettings: AppSettings = {
  theme: 'auto',
  language: 'en',
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
    messagePreview: true,
  },
  privacy: {
    readReceipts: true,
    lastSeen: true,
    typing: true,
    screenshotProtection: false,
  },
  accessibility: {
    fontSize: 'medium',
    highContrast: false,
    reducedMotion: false,
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Effect to determine theme based on settings and time
  useEffect(() => {
    if (settings.theme === 'auto') {
      const hours = new Date().getHours();
      setTheme(hours >= 6 && hours < 18 ? 'light' : 'dark');
      
      // Set up interval to check time every minute for auto theme changes
      const intervalId = setInterval(() => {
        const currentHour = new Date().getHours();
        setTheme(currentHour >= 6 && currentHour < 18 ? 'light' : 'dark');
      }, 60000);
      
      return () => clearInterval(intervalId);
    } else {
      setTheme(settings.theme === 'dark' ? 'dark' : 'light');
    }
  }, [settings.theme]);

  // Apply theme to document body
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Simulate user authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, you'd check localStorage, cookies, or call an API
        const savedUser = localStorage.getItem('currentUser');
        
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock authentication - replace with actual API call
      // This simulates a network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const user: User = {
        id: '1',
        username,
        avatarUrl: `https://source.boringavatars.com/beam/120/${username}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`,
        status: 'available',
        privacyLevel: 'friends',
        achievements: [],
        lastSeen: new Date(),
        isOnline: true
      };
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    localStorage.setItem('appSettings', JSON.stringify({ ...settings, ...newSettings }));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isLoading,
        settings,
        theme,
        login,
        logout,
        updateSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};