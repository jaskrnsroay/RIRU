import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import { X, Sun, Moon, Globe, Bell, Eye, UserCog, Accessibility } from 'lucide-react';
import { AppSettings } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useApp();
  const [activeTab, setActiveTab] = useState('appearance');
  
  if (!isOpen) return null;
  
  const handleUpdateSetting = <K extends keyof AppSettings, T extends AppSettings[K]>(
    category: K,
    value: T
  ) => {
    updateSettings({ [category]: value });
  };
  
  const handleUpdateNestedSetting = <
    K extends keyof AppSettings,
    N extends keyof AppSettings[K],
    T extends AppSettings[K][N]
  >(
    category: K,
    nestedKey: N,
    value: T
  ) => {
    updateSettings({
      [category]: {
        ...settings[category],
        [nestedKey]: value,
      } as AppSettings[K],
    });
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div 
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl h-[80vh] max-h-[600px] overflow-hidden animate-fade-in" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-1/4 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
            </div>
            
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('appearance')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activeTab === 'appearance' 
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {activeTab === 'appearance' ? <Sun className="mr-2" size={18} /> : <Moon className="mr-2" size={18} />}
                Appearance
              </button>
              
              <button
                onClick={() => setActiveTab('language')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activeTab === 'language' 
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Globe className="mr-2" size={18} />
                Language
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activeTab === 'notifications' 
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Bell className="mr-2" size={18} />
                Notifications
              </button>
              
              <button
                onClick={() => setActiveTab('privacy')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activeTab === 'privacy' 
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Eye className="mr-2" size={18} />
                Privacy
              </button>
              
              <button
                onClick={() => setActiveTab('accessibility')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activeTab === 'accessibility' 
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Accessibility className="mr-2" size={18} />
                Accessibility
              </button>
              
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activeTab === 'account' 
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <UserCog className="mr-2" size={18} />
                Account
              </button>
            </nav>
          </div>
          
          {/* Content */}
          <div className="w-3/4 flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {activeTab === 'appearance' && 'Appearance'}
                {activeTab === 'language' && 'Language'}
                {activeTab === 'notifications' && 'Notifications'}
                {activeTab === 'privacy' && 'Privacy'}
                {activeTab === 'accessibility' && 'Accessibility'}
                {activeTab === 'account' && 'Account'}
              </h3>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => handleUpdateSetting('theme', 'light')}
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                          settings.theme === 'light'
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <Sun size={24} className={settings.theme === 'light' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'} />
                        <span className={`mt-2 text-sm font-medium ${
                          settings.theme === 'light'
                            ? 'text-indigo-700 dark:text-indigo-300'
                            : 'text-gray-900 dark:text-gray-300'
                        }`}>Light</span>
                      </button>
                      
                      <button
                        onClick={() => handleUpdateSetting('theme', 'dark')}
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                          settings.theme === 'dark'
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <Moon size={24} className={settings.theme === 'dark' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'} />
                        <span className={`mt-2 text-sm font-medium ${
                          settings.theme === 'dark'
                            ? 'text-indigo-700 dark:text-indigo-300'
                            : 'text-gray-900 dark:text-gray-300'
                        }`}>Dark</span>
                      </button>
                      
                      <button
                        onClick={() => handleUpdateSetting('theme', 'auto')}
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                          settings.theme === 'auto'
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex">
                          <Sun size={24} className={settings.theme === 'auto' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'} />
                          <Moon size={24} className={settings.theme === 'auto' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'} />
                        </div>
                        <span className={`mt-2 text-sm font-medium ${
                          settings.theme === 'auto'
                            ? 'text-indigo-700 dark:text-indigo-300'
                            : 'text-gray-900 dark:text-gray-300'
                        }`}>Auto</span>
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Auto will switch between light and dark based on your system time.
                    </p>
                  </div>
                </div>
              )}
              
              {activeTab === 'language' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Language</h4>
                    <select
                      value={settings.language}
                      onChange={(e) => handleUpdateSetting('language', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-indigo-500 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none transition-colors duration-200"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="ja">日本語</option>
                      <option value="zh">中文</option>
                    </select>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      This will affect the interface language. Chat messages can be translated in-conversation.
                    </p>
                  </div>
                </div>
              )}
              
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Notifications</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Receive notifications for new messages and activity</p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        checked={settings.notifications.enabled}
                        onChange={(e) => handleUpdateNestedSetting('notifications', 'enabled', e.target.checked)}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200"
                        style={{
                          right: settings.notifications.enabled ? '0' : 'auto',
                          left: settings.notifications.enabled ? 'auto' : '0',
                          borderColor: settings.notifications.enabled ? '#4f46e5' : '#d1d5db',
                          backgroundColor: settings.notifications.enabled ? '#4f46e5' : 'white'
                        }}
                      />
                      <label
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer"
                        style={{
                          backgroundColor: settings.notifications.enabled ? '#c7d2fe' : '#d1d5db',
                        }}
                      ></label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sound</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Play a sound for new notifications</p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        checked={settings.notifications.sound}
                        onChange={(e) => handleUpdateNestedSetting('notifications', 'sound', e.target.checked)}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200"
                        style={{
                          right: settings.notifications.sound ? '0' : 'auto',
                          left: settings.notifications.sound ? 'auto' : '0',
                          borderColor: settings.notifications.sound ? '#4f46e5' : '#d1d5db',
                          backgroundColor: settings.notifications.sound ? '#4f46e5' : 'white'
                        }}
                      />
                      <label
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer"
                        style={{
                          backgroundColor: settings.notifications.sound ? '#c7d2fe' : '#d1d5db',
                        }}
                      ></label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Message Preview</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Show message content in notifications</p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        checked={settings.notifications.messagePreview}
                        onChange={(e) => handleUpdateNestedSetting('notifications', 'messagePreview', e.target.checked)}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200"
                        style={{
                          right: settings.notifications.messagePreview ? '0' : 'auto',
                          left: settings.notifications.messagePreview ? 'auto' : '0',
                          borderColor: settings.notifications.messagePreview ? '#4f46e5' : '#d1d5db',
                          backgroundColor: settings.notifications.messagePreview ? '#4f46e5' : 'white'
                        }}
                      />
                      <label
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer"
                        style={{
                          backgroundColor: settings.notifications.messagePreview ? '#c7d2fe' : '#d1d5db',
                        }}
                      ></label>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Read Receipts</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Let others know when you've read their messages</p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        checked={settings.privacy.readReceipts}
                        onChange={(e) => handleUpdateNestedSetting('privacy', 'readReceipts', e.target.checked)}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200"
                        style={{
                          right: settings.privacy.readReceipts ? '0' : 'auto',
                          left: settings.privacy.readReceipts ? 'auto' : '0',
                          borderColor: settings.privacy.readReceipts ? '#4f46e5' : '#d1d5db',
                          backgroundColor: settings.privacy.readReceipts ? '#4f46e5' : 'white'
                        }}
                      />
                      <label
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer"
                        style={{
                          backgroundColor: settings.privacy.readReceipts ? '#c7d2fe' : '#d1d5db',
                        }}
                      ></label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Seen</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Show when you were last active</p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        checked={settings.privacy.lastSeen}
                        onChange={(e) => handleUpdateNestedSetting('privacy', 'lastSeen', e.target.checked)}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200"
                        style={{
                          right: settings.privacy.lastSeen ? '0' : 'auto',
                          left: settings.privacy.lastSeen ? 'auto' : '0',
                          borderColor: settings.privacy.lastSeen ? '#4f46e5' : '#d1d5db',
                          backgroundColor: settings.privacy.lastSeen ? '#4f46e5' : 'white'
                        }}
                      />
                      <label
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer"
                        style={{
                          backgroundColor: settings.privacy.lastSeen ? '#c7d2fe' : '#d1d5db',
                        }}
                      ></label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Screenshot Protection</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Prevent others from taking screenshots (where supported)</p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        checked={settings.privacy.screenshotProtection}
                        onChange={(e) => handleUpdateNestedSetting('privacy', 'screenshotProtection', e.target.checked)}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200"
                        style={{
                          right: settings.privacy.screenshotProtection ? '0' : 'auto',
                          left: settings.privacy.screenshotProtection ? 'auto' : '0',
                          borderColor: settings.privacy.screenshotProtection ? '#4f46e5' : '#d1d5db',
                          backgroundColor: settings.privacy.screenshotProtection ? '#4f46e5' : 'white'
                        }}
                      />
                      <label
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer"
                        style={{
                          backgroundColor: settings.privacy.screenshotProtection ? '#c7d2fe' : '#d1d5db',
                        }}
                      ></label>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'accessibility' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Font Size</h4>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleUpdateNestedSetting('accessibility', 'fontSize', 'small')}
                        className={`px-3 py-1 rounded-md text-sm ${
                          settings.accessibility.fontSize === 'small'
                            ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Small
                      </button>
                      
                      <button
                        onClick={() => handleUpdateNestedSetting('accessibility', 'fontSize', 'medium')}
                        className={`px-3 py-1 rounded-md text-sm ${
                          settings.accessibility.fontSize === 'medium'
                            ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Medium
                      </button>
                      
                      <button
                        onClick={() => handleUpdateNestedSetting('accessibility', 'fontSize', 'large')}
                        className={`px-3 py-1 rounded-md text-sm ${
                          settings.accessibility.fontSize === 'large'
                            ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Large
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">High Contrast</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Increase contrast for better visibility</p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        checked={settings.accessibility.highContrast}
                        onChange={(e) => handleUpdateNestedSetting('accessibility', 'highContrast', e.target.checked)}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200"
                        style={{
                          right: settings.accessibility.highContrast ? '0' : 'auto',
                          left: settings.accessibility.highContrast ? 'auto' : '0',
                          borderColor: settings.accessibility.highContrast ? '#4f46e5' : '#d1d5db',
                          backgroundColor: settings.accessibility.highContrast ? '#4f46e5' : 'white'
                        }}
                      />
                      <label
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer"
                        style={{
                          backgroundColor: settings.accessibility.highContrast ? '#c7d2fe' : '#d1d5db',
                        }}
                      ></label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Reduced Motion</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Minimize animations and transitions</p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        checked={settings.accessibility.reducedMotion}
                        onChange={(e) => handleUpdateNestedSetting('accessibility', 'reducedMotion', e.target.checked)}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200"
                        style={{
                          right: settings.accessibility.reducedMotion ? '0' : 'auto',
                          left: settings.accessibility.reducedMotion ? 'auto' : '0',
                          borderColor: settings.accessibility.reducedMotion ? '#4f46e5' : '#d1d5db',
                          backgroundColor: settings.accessibility.reducedMotion ? '#4f46e5' : 'white'
                        }}
                      />
                      <label
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer"
                        style={{
                          backgroundColor: settings.accessibility.reducedMotion ? '#c7d2fe' : '#d1d5db',
                        }}
                      ></label>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <p className="text-gray-500 dark:text-gray-400">
                    Account settings would include options to update your profile, change password, manage 2FA, and other account-related actions.
                  </p>
                  
                  {/* Placeholder for account settings */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                      This is a demo app. Account settings would be implemented in a full version.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
              <Button
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;