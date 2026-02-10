// src/pages/auth/Login.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { Input, PhoneInput } from '../../components/common/Input';
import { VALIDATION, ERROR_MESSAGES } from '../../utils/constants';
import { FaGoogle } from "react-icons/fa";

export const Login = () => {
  const navigate = useNavigate();
  const { login, loginGoogle, loginPhone, verifyPhone, loading, error, clearError } = useAuth();

  // Tab state
  const [activeTab, setActiveTab] = useState('email'); // 'email', 'google', 'phone'

  // Email/Password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Phone state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Validation errors
  const [validationErrors, setValidationErrors] = useState({});

  const validateEmail = () => {
    const errors = {};

    if (!email) {
      errors.email = ERROR_MESSAGES.EMAIL_REQUIRED;
    } else if (!VALIDATION.EMAIL_REGEX.test(email)) {
      errors.email = ERROR_MESSAGES.INVALID_EMAIL;
    }

    if (!password) {
      errors.password = ERROR_MESSAGES.PASSWORD_REQUIRED;
    } else if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      errors.password = ERROR_MESSAGES.PASSWORD_TOO_SHORT;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePhone = () => {
    const errors = {};

    if (!phone) {
      errors.phone = ERROR_MESSAGES.PHONE_REQUIRED;
    } else if (!VALIDATION.PHONE_REGEX.test(phone)) {
      errors.phone = ERROR_MESSAGES.INVALID_PHONE;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };



  const handleEmailLogin = async (e) => {
    e.preventDefault();
    clearError();
    
    if (!validateEmail()) return;

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Error already in context
      console.error('Login failed:', err);
    }
  };

  const handleGoogleLogin = async () => {
    clearError();
    
    try {
      await loginGoogle();
      navigate('/dashboard');
    } catch (err) {
      console.error('Google login failed:', err);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    clearError();
    
    if (!validatePhone()) return;

    try {
      await loginPhone(`+91${phone}`);
      setOtpSent(true);
    } catch (err) {
      console.error('Send OTP failed:', err);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    clearError();

    if (!otp || otp.length !== 6) {
      setValidationErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return;
    }

    try {
      await verifyPhone(otp);
      navigate('/dashboard');
    } catch (err) {
      console.error('OTP verification failed:', err);
    }
  };


  const tabs = [
    { id: 'email', label: 'Email' },
    { id: 'google', label: 'Google' },
    { id: 'phone', label: 'Phone' },
  ];



  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="p-4 md:p-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">LastMile</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back
            </h2>
            <p className="text-uber-dark-gray text-lg">
              Sign in to continue
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-uber-gray">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  clearError();
                  setValidationErrors({});
                }}
                className={clsx(
                  'flex-1 py-3 text-base font-medium transition-all',
                  'border-b-2',
                  activeTab === tab.id
                    ? 'border-uber-black text-uber-black'
                    : 'border-transparent text-uber-dark-gray hover:text-uber-black'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-uber">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Tab Content */}
          <div className="space-y-6">
            {/* EMAIL TAB */}
            {activeTab === 'email' && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <Input
                  type="email"
                  label="Email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationErrors.email) {
                      setValidationErrors({ ...validationErrors, email: null });
                    }
                  }}
                  error={validationErrors.email}
                  required
                  autoComplete="email"
                />

                <Input
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) {
                      setValidationErrors({ ...validationErrors, password: null });
                    }
                  }}
                  error={validationErrors.password}
                  required
                  autoComplete="current-password"
                />

                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-uber-dark-gray hover:text-uber-black"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="full"
                  loading={loading}
                >
                  Continue
                </Button>
              </form>
            )}

            {/* GOOGLE TAB */}
            {activeTab === 'google' && (
              <div className="space-y-4">
                <p className="text-uber-dark-gray text-center mb-6">
                  Sign in with your Google account
                </p>

                <Button
                  onClick={handleGoogleLogin}
                  variant="secondary"
                  size="full"
                  loading={loading}
                  className="flex items-center justify-center gap-3"
                >
                  <FaGoogle />
                  <span>Continue with Google</span>
                </Button>

                <p className="text-xs text-uber-dark-gray text-center">
                  By continuing, you agree to receive account-related emails from LastMile
                </p>
              </div>
            )}

            {/* PHONE TAB */}
            {activeTab === 'phone' && (
              <div className="space-y-4">
                {!otpSent ? (
                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <PhoneInput
                      label="Phone Number"
                      value={phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setPhone(value);
                        if (validationErrors.phone) {
                          setValidationErrors({ ...validationErrors, phone: null });
                        }
                      }}
                      error={validationErrors.phone}
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      size="full"
                      loading={loading}
                    >
                      Send OTP
                    </Button>

                    {/* reCAPTCHA container */}
                    <div id="recaptcha-container"></div>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div className="text-center mb-4">
                      <p className="text-uber-dark-gray">
                        Enter the 6-digit code sent to
                      </p>
                      <p className="font-medium">+91 {phone}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtp('');
                        }}
                        className="text-sm text-uber-dark-gray hover:text-uber-black mt-2"
                      >
                        Change number
                      </button>
                    </div>

                    <Input
                      type="text"
                      label="Enter OTP"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 6) {
                          setOtp(value);
                          if (validationErrors.otp) {
                            setValidationErrors({ ...validationErrors, otp: null });
                          }
                        }
                      }}
                      error={validationErrors.otp}
                      maxLength={6}
                      inputMode="numeric"
                      autoFocus
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      size="full"
                      loading={loading}
                    >
                      Verify OTP
                    </Button>

                    <button
                      type="button"
                      onClick={handleSendOTP}
                      className="w-full text-sm text-uber-dark-gray hover:text-uber-black"
                      disabled={loading}
                    >
                      Resend OTP
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-uber-dark-gray">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-uber-black font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-uber-dark-gray">
        <p>© 2026 LastMile Technologies Inc.</p>
      </footer>
    </div>
  );
};

/**
 * Google Icon Component
 */
// const GoogleIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 20 20">
//     <path fill="#4285F4" d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"/>
//     <path fill="#34A853" d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"/>
//     <path fill="#FBBC05" d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"/>
//     <path fill="#EA4335" d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"/>
//   </svg>
// );

// Helper for conditional classes
import { clsx } from 'clsx';