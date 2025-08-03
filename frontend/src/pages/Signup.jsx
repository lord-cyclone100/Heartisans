import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoogleAuthButton } from '../components/elements/GoogleAuthButton';

export const Signup = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    isArtisan: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState('');
  const [userId, setUserId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  const { signUp, verifyOTP } = useAuth();

  const handleGoogleSuccess = (result) => {
    // Redirect to auth handler which will properly route to home
    navigate('/auth-redirect');
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const result = await signUp(formData);
      
      if (result.success) {
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
                We sent a verification code to your email address
              </p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleOTPSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-lg">
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="signup-otp" className="block text-xl font-medium text-gray-700 mb-4">
                  Verification Code
                </label>
                <input
                  id="signup-otp"
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
                  ← Back to signup
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
        <div className="max-w-2xl w-full space-y-8">
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

          {/* Create account section */}
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900">Create your account</h2>
            <p className="mt-6 text-xl text-gray-600">
              Join our community of talented artisans
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-lg">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="signup-fullName" className="block text-xl font-medium text-gray-700 mb-4">
                  Full Name
                </label>
                <input
                  id="signup-fullName"
                  name="fullName"
                  type="text"
                  required
                  className="w-full px-6 py-6 text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="signup-userName" className="block text-xl font-medium text-gray-700 mb-4">
                  Username
                </label>
                <input
                  id="signup-userName"
                  name="userName"
                  type="text"
                  required
                  className="w-full px-6 py-6 text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                  placeholder="Choose a username"
                  value={formData.userName}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="signup-email" className="block text-xl font-medium text-gray-700 mb-4">
                Email Address
              </label>
              <input
                id="signup-email"
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="signup-password" className="block text-xl font-medium text-gray-700 mb-4">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="w-full px-6 py-6 pr-16 text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                    placeholder="Create a password"
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
              
              <div>
                <label htmlFor="signup-confirmPassword" className="block text-xl font-medium text-gray-700 mb-4">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="signup-confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="w-full px-6 py-6 pr-16 text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
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
            
            <div className="flex items-center">
              <input
                id="signup-isArtisan"
                name="isArtisan"
                type="checkbox"
                className="h-6 w-6 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                checked={formData.isArtisan}
                onChange={handleChange}
              />
              <label htmlFor="signup-isArtisan" className="ml-3 block text-lg text-gray-900">
                I am an artisan (I want to sell products)
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-6 px-6 rounded-lg text-xl font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-lg">
                <span className="px-3 bg-gray-50 text-gray-500">Or</span>
              </div>
            </div>

            <GoogleAuthButton isSignUp={true} onSuccess={handleGoogleSuccess} />

            <p className="text-center text-lg text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-green-600 hover:text-green-700"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
