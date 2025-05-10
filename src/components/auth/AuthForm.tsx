import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import { KeyRound, Mail, Lock, User, Shield, ChevronRight } from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'register';
  onToggleMode: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onToggleMode }) => {
  const { login, isLoading } = useApp();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (mode === 'register' || step === 1) {
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      }
      
      if (mode === 'register') {
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email is invalid';
        }
      }
    }
    
    if (mode === 'login' || step === 2) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (mode === 'register' && formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      
      if (mode === 'register' && formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNextStep = () => {
    if (validateForm() && step === 1) {
      setStep(2);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'register' && step === 1) {
      handleNextStep();
      return;
    }
    
    if (!validateForm()) return;
    
    try {
      if (mode === 'login') {
        await login(formData.username, formData.password);
      } else {
        // In a real app, you would call a registration API
        alert('Registration successful! Please log in.');
        onToggleMode();
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors({ 
        form: 'Authentication failed. Please check your credentials.'
      });
    }
  };
  
  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          {mode === 'login' ? 'Sign in to Nexus' : 'Create your account'}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {mode === 'login' 
            ? 'Enter your credentials to access your account' 
            : 'Join our secure messaging platform'}
        </p>
      </div>
      
      {errors.form && (
        <div className="p-3 text-sm bg-red-100 text-red-800 rounded-lg">
          {errors.form}
        </div>
      )}
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {mode === 'register' && (
          <div className="flex items-center justify-between mb-4">
            <div className="w-full flex items-center">
              <div className={`flex-1 border-t-2 ${step >= 1 ? 'border-indigo-500' : 'border-gray-300'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                step >= 1 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                1
              </div>
              <div className={`flex-1 border-t-2 ${step >= 2 ? 'border-indigo-500' : 'border-gray-300'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                step >= 2 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                2
              </div>
              <div className={`flex-1 border-t-2 ${step >= 3 ? 'border-indigo-500' : 'border-gray-300'}`}></div>
            </div>
          </div>
        )}
        
        {(mode === 'login' || (mode === 'register' && step === 1)) && (
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <div className="mt-1 relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <User size={18} />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className={`pl-10 block w-full px-3 py-2 border ${
                    errors.username ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="Username"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>
            
            {mode === 'register' && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 block w-full px-3 py-2 border ${
                      errors.email ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                    placeholder="your.email@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            )}
          </div>
        )}
        
        {(mode === 'login' || (mode === 'register' && step === 2)) && (
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            
            {mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <Shield size={18} />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`pl-10 block w-full px-3 py-2 border ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            )}
          </div>
        )}
        
        <div>
          {mode === 'register' && step === 1 ? (
            <Button
              type="button"
              fullWidth
              onClick={handleNextStep}
              rightIcon={<ChevronRight size={18} />}
            >
              Next: Security Details
            </Button>
          ) : (
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              leftIcon={mode === 'login' ? <KeyRound size={18} /> : <User size={18} />}
            >
              {mode === 'login' ? 'Sign in' : 'Create Account'}
            </Button>
          )}
        </div>
        
        {mode === 'register' && step === 2 && (
          <div className="mt-2">
            <Button
              type="button"
              variant="ghost"
              fullWidth
              onClick={() => setStep(1)}
            >
              Back to Profile Details
            </Button>
          </div>
        )}
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={onToggleMode}
            className="ml-1 font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-150"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;