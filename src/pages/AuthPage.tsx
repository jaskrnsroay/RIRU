import React, { useState } from 'react';
import AuthForm from '../components/auth/AuthForm';
import { Shield, Users, Globe, Repeat, Languages } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'login' ? 'register' : 'login');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-indigo-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center">
        {/* Left side - App info */}
        <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
          <div className="max-w-md mx-auto lg:mr-0 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <Globe className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white ml-2">Nexus</h1>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Secure messaging for a connected world
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Nexus offers end-to-end encrypted messaging with powerful features designed to keep your conversations private and engaging.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">End-to-End Encryption</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Only you and your recipients can read your messages</p>
                </div>
              </div>
              
              <div className="flex items-start p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Interest-Based Chats</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Connect with people who share your interests</p>
                </div>
              </div>
              
              <div className="flex items-start p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Languages className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Real-Time Translation</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Break language barriers in your conversations</p>
                </div>
              </div>
              
              <div className="flex items-start p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Repeat className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Self-Destructing Messages</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Messages that disappear after being read</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Auth form */}
        <div className="lg:w-1/2">
          <AuthForm mode={authMode} onToggleMode={toggleAuthMode} />
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© 2025 Nexus. All rights reserved.</p>
        <div className="mt-2">
          <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline mx-2">Privacy Policy</a>
          <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline mx-2">Terms of Service</a>
          <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline mx-2">Contact Us</a>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;