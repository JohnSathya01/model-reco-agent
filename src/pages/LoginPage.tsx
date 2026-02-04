import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, user, isAuthenticated, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect immediately without rendering login page
  if (isAuthenticated && user) {
    const redirectPath = {
      'admin': '/admin',
      'engineer': '/',
      'solution-architect': '/architect',
      'project-manager': '/manager',
      'viewer': '/viewer',
    }[user.role] || '/';
    
    return <Navigate to={redirectPath} replace />;
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Dummy credentials for testing
  const dummyCredentials = {
    'admin@test.com': { password: 'admin123', role: 'admin', name: 'Specialisation Head' },
    'engineer@test.com': { password: 'engineer123', role: 'engineer', name: 'Engineer' },
    'arch@test.com': { password: 'arch123', role: 'solution-architect', name: 'Solution Architect' },
    'pm@test.com': { password: 'pm123', role: 'project-manager', name: 'Project Manager' },
    'viewer@test.com': { password: 'viewer123', role: 'viewer', name: 'Viewer User' },
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check dummy credentials
    const user = dummyCredentials[email as keyof typeof dummyCredentials];
    
    if (user && user.password === password) {
      // Update AuthContext with user info
      const userData = {
        email,
        role: user.role as 'admin' | 'engineer' | 'solution-architect' | 'project-manager' | 'viewer',
        name: user.name,
        isAuthenticated: true,
      };
      
      setUser(userData);
      
      // Navigate to role-specific dashboard
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'engineer':
          navigate('/');
          break;
        case 'solution-architect':
          navigate('/architect');
          break;
        case 'project-manager':
          navigate('/manager');
          break;
        case 'viewer':
          navigate('/viewer');
          break;
        default:
          navigate('/');
      }
    } else {
      setError('Invalid email or password');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ML Recommendation Agent
          </h1>
          <p className="text-gray-600">
            Sign in to access your intelligent ML platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Login Failed</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-700 mb-3">Demo Credentials:</p>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between items-center bg-gray-50 rounded px-3 py-2">
                <span className="font-medium">Specialisation Head:</span>
                <span className="font-mono">admin@test.com / admin123</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 rounded px-3 py-2">
                <span className="font-medium">Engineer:</span>
                <span className="font-mono">engineer@test.com / engineer123</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 rounded px-3 py-2">
                <span className="font-medium">Solution Architect:</span>
                <span className="font-mono">arch@test.com / arch123</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 rounded px-3 py-2">
                <span className="font-medium">Project Manager:</span>
                <span className="font-mono">pm@test.com / pm123</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <button className="font-medium text-blue-600 hover:text-blue-700">
            Contact your administrator
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
