import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoogleAuthButton } from '../components/elements/GoogleAuthButton';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState('');
  const [userId, setUserId] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { signIn, verifyOTP } = useAuth();

  const handleGoogleSuccess = (result) => {
    // Redirect to auth handler which will properly route to home
    navigate('/auth-redirect');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn(formData.email, formData.password);
      
      if (result.success) {
        // Redirect to auth handler which will properly route to home
        navigate('/auth-redirect');
      } else if (result.needsVerification) {
        setUserId(result.userId);
        setShowOTP(true);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await verifyOTP(userId, otp);
      
      if (result.success) {
        // Redirect to auth handler which will properly route to home
        navigate('/auth-redirect');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // If OTP verification is needed, show OTP form
  if (showOTP) {
    return (
      <div className="min-h-screen">
        {/* Spacer div to push content down below a fixed navbar */}
        <div className="w-full h-[10vh]"></div>
        <div className="flex items-center justify-center p-6 md:p-8">
          <div className="max-w-lg w-full space-y-8">
            {/* Logo */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <img src="/photos/favicon.ico" alt="Heartisans" className="w-12 h-12 mr-3" />
                <h1 className="text-6xl font-bold text-gray-900">
                  Heartisans
                </h1>
              </div>
              <p className="text-2xl text-gray-500 mb-10">Where Heart meets Art</p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-gray-900 text-center">
                Verify your email
              </h2>
              <p className="mt-6 text-center text-xl text-gray-600">
                We sent a verification code to {formData.email}
              </p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleOTPSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-base">
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="login-otp" className="block text-xl font-medium text-gray-700 mb-4">
                  Verification Code
                </label>
                <input
                  id="login-otp"
                  name="otp"
                  type="text"
                  required
                  maxLength="6"
                  className="w-full px-6 py-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-3xl tracking-widest font-mono"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-6 px-6 rounded-lg text-xl font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowOTP(false)}
                  className="text-xl text-green-600 hover:text-green-700 font-medium"
                >
                  ← Back to login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Spacer div to push content down below a fixed navbar */}
      <div className="w-full h-[10vh]"></div>
      <div className="flex items-center justify-center p-6 md:p-8">
        <div className="max-w-lg w-full space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <img src="/photos/favicon.ico" alt="Heartisans" className="w-12 h-12 mr-3" />
              <h1 className="text-6xl font-bold text-gray-900">
                Heartisans
              </h1>
            </div>
            <p className="text-2xl text-gray-500 mb-10">Where Heart meets Art</p>
          </div>

          {/* Welcome back section */}
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-6 text-xl text-gray-600">Please enter your details</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-lg">
                {error}
              </div>
            )}
            
            <div className="space-y-6">
              <div>
                <label htmlFor="login-email" className="block text-xl font-medium text-gray-700 mb-4">
                  Email address
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-6 py-6 text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="login-password" className="block text-xl font-medium text-gray-700 mb-4">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="w-full px-6 py-6 pr-16 text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-6 w-6 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-3 block text-lg text-gray-700">
                  Remember for 30 days
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-lg text-green-600 hover:text-green-700 font-medium"
              >
                Forgot password
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-6 px-6 rounded-lg text-xl font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-lg">
                <span className="px-3 bg-gray-50 text-gray-500">Or</span>
              </div>
            </div>

            <GoogleAuthButton isSignUp={false} onSuccess={handleGoogleSuccess} />

            <p className="text-center text-lg text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-green-600 hover:text-green-700"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
