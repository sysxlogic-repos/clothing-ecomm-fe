import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Phone, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ButtonSpinner } from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [formData, setFormData] = useState({
    phoneNumber: '',
    otp: '',
    countryCode: '+1'
  });
  const [otpTimer, setOtpTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, sendOTP, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // OTP Timer
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (digits.length >= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    } else if (digits.length >= 3) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return digits;
    }
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      phoneNumber: formatted
    }));
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    const phoneDigits = formData.phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    try {
      const fullPhoneNumber = `${formData.countryCode}${phoneDigits}`;
      const result = await sendOTP(fullPhoneNumber);
      
      if (result.success) {
        setStep('otp');
        setOtpTimer(60); // 60 seconds timer
        toast.success('OTP sent successfully!');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (formData.otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const phoneDigits = formData.phoneNumber.replace(/\D/g, '');
      const fullPhoneNumber = `${formData.countryCode}${phoneDigits}`;
      
      const result = await login(fullPhoneNumber, formData.otp);
      
      if (result.success) {
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (otpTimer > 0) return;
    
    setIsLoading(true);
    try {
      const phoneDigits = formData.phoneNumber.replace(/\D/g, '');
      const fullPhoneNumber = `${formData.countryCode}${phoneDigits}`;
      
      const result = await sendOTP(fullPhoneNumber);
      if (result.success) {
        setOtpTimer(60);
        toast.success('OTP resent successfully!');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setFormData(prev => ({ ...prev, otp: '' }));
    setOtpTimer(0);
  };

  return (
    <>
      <Helmet>
        <title>Sign In - Women's Fashion Store</title>
        <meta name="description" content="Sign in to your account to access your orders, wishlist, and personalized recommendations." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-2xl font-bold text-secondary-900">FashionStore</span>
          </Link>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-secondary-900">
              {step === 'phone' ? 'Welcome Back' : 'Verify Your Phone'}
            </h2>
            <p className="mt-2 text-sm text-secondary-600">
              {step === 'phone' 
                ? 'Enter your phone number to sign in'
                : `We sent a 6-digit code to ${formData.phoneNumber}`
              }
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
            {step === 'phone' ? (
              /* Phone Number Step */
              <form onSubmit={handleSendOTP} className="space-y-6">
                {/* Country Code & Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-secondary-700">
                    Phone Number
                  </label>
                  <div className="mt-1 flex rounded-lg shadow-sm">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      className="rounded-l-lg border border-r-0 border-secondary-300 bg-secondary-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+86">🇨🇳 +86</option>
                    </select>
                    <div className="relative flex-1">
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder="(555) 123-4567"
                        className="block w-full rounded-r-lg border border-secondary-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                      <Phone className="absolute left-3 top-2.5 h-5 w-5 text-secondary-400" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <ButtonSpinner />
                  ) : (
                    <>
                      <span>Send OTP</span>
                      <Phone size={18} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* OTP Verification Step */
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                {/* Back Button */}
                <button
                  type="button"
                  onClick={handleBackToPhone}
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  <ArrowLeft size={16} />
                  <span>Change phone number</span>
                </button>

                {/* OTP Input */}
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-secondary-700">
                    Verification Code
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="otp"
                      name="otp"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.otp}
                      onChange={handleInputChange}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="block w-full pl-10 pr-10 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-lg tracking-widest"
                      required
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-secondary-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-secondary-400 hover:text-secondary-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Resend OTP */}
                <div className="text-center">
                  {otpTimer > 0 ? (
                    <p className="text-sm text-secondary-600">
                      Resend code in {otpTimer} seconds
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
                    >
                      Didn't receive the code? Resend
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || formData.otp.length !== 6}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <ButtonSpinner />
                  ) : (
                    <>
                      <span>Verify & Sign In</span>
                      <Lock size={18} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Footer */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-secondary-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-secondary-500">New to FashionStore?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/signup"
                  className="w-full btn-outline text-center block"
                >
                  Create an Account
                </Link>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-secondary-500">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;