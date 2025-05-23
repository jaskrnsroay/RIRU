import React from 'react';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';
import { AppProvider, useApp } from './context/AppContext';
import { ChatProvider } from './context/ChatContext';

// Main App component with context providers
const App: React.FC = () => {
  return (
    <AppProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </AppProvider>
  );
};

// App content that uses context
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useApp();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <svg className="animate-spin h-full w-full text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading Nexus...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? <ChatPage /> : <AuthPage />;
};

export default App;