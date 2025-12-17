import { useState, useEffect } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../lib/hooks";
import { API_URL } from "../Constants";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import LoginStages from "@/components1/ui/LoginStages";
import { Eye, EyeOff, ArrowLeft, Mail, Shield, Key } from "lucide-react";
import { GenericResponse, GenericError } from "@/lib/types";
import { AxiosError } from "axios";
import { mutationErrorHandler } from "@/lib/utils";

type ForgotPasswordStep = "email" | "otp" | "password";

interface ForgotPasswordFormData {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
  otpSent: boolean;
  otpVerified: boolean;
}

// Inline ForgotPasswordForm Component
interface ForgotPasswordFormProps {
  currentStep: "email" | "otp" | "password";
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendOTP: () => void;
  onVerifyOTP: () => void;
  onResetPassword: () => void;
  onResendOTP: () => void;
  onBackToEmail: () => void;
  onBackToOTP: () => void;
  isLoading: boolean;
}

// API Response Types
type SendOTPResponse = {
  message: string;
  email: string;
};

type VerifyOTPResponse = {
  message: string;
  otp: string;
  email: string;
};

type ResetPasswordResponse = {
  message: string;
  email: string;
  newPassword: string;
};

const ForgotPasswordForm = ({
  currentStep,
  email,
  otp,
  password,
  confirmPassword,
  onInputChange,
  onSendOTP,
  onVerifyOTP,
  onResetPassword,
  onResendOTP,
  onBackToEmail,
  onBackToOTP,
  isLoading,
}: ForgotPasswordFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Password validation functions
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && hasSpecialChar;

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const handleResendOTP = () => {
    onResendOTP();
    setCountdown(60); // 60 seconds countdown
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "email":
        return "Reset Password";
      case "otp":
        return "Verify OTP";
      case "password":
        return "New Password";
      default:
        return "Reset Password";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case "email":
        return "Enter your email address and we'll send you an OTP to reset your password.";
      case "otp":
        return `We've sent a verification code to ${email}. Please enter it below.`;
      case "password":
        return "Enter your new password. Make sure it's strong and secure.";
      default:
        return "";
    }
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case "email":
        return <Mail className="w-8 h-8 text-blue-600" />;
      case "otp":
        return <Shield className="w-8 h-8 text-blue-600" />;
      case "password":
        return <Key className="w-8 h-8 text-blue-600" />;
      default:
        return <Mail className="w-8 h-8 text-blue-600" />;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      if (currentStep === "email") onSendOTP();
      else if (currentStep === "otp") onVerifyOTP();
      else if (currentStep === "password") onResetPassword();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-50 rounded-full p-4">
            {getStepIcon()}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {getStepTitle()}
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed px-2">
          {getStepDescription()}
        </p>
        
        {/* Step Indicator */}
        <div className="flex justify-center space-x-2 pt-4">
          <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
            currentStep === "email" ? "bg-blue-600 scale-110" : "bg-gray-300"
          }`} />
          <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
            currentStep === "otp" ? "bg-blue-600 scale-110" : "bg-gray-300"
          }`} />
          <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
            currentStep === "password" ? "bg-blue-600 scale-110" : "bg-gray-300"
          }`} />
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {/* Email Step */}
        {currentStep === "email" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={onInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                  disabled={isLoading}
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <button
              onClick={onSendOTP}
              disabled={isLoading || !email.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                "Send OTP"
              )}
            </button>
          </div>
        )}

        {/* OTP Step */}
        {currentStep === "otp" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2">
                Verification Code
              </label>
              <div className="relative">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  value={otp}
                  onChange={onInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-center text-2xl tracking-[0.5em] font-mono text-gray-900"
                  disabled={isLoading}
                />
                <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <button
              onClick={onVerifyOTP}
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                "Verify OTP"
              )}
            </button>

            {/* Resend OTP Section */}
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">Didn't receive the code?</p>
              {countdown > 0 ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <p className="text-sm text-blue-600 font-medium">
                    Resend OTP in {countdown}s
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors duration-200 hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>

            {/* Back Button */}
            <button
              onClick={onBackToEmail}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 py-3 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Back to Email</span>
            </button>
          </div>
        )}

        {/* Password Step */}
        {currentStep === "password" && (
          <div className="space-y-6">
            {/* New Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={onInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter new password"
                  className="w-full px-4 py-4 pl-12 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                  disabled={isLoading}
                />
                <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={onInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-4 pl-12 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                  disabled={isLoading}
                />
                <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Enhanced Password Requirements */}
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs text-blue-700 font-medium mb-3">Password Requirements:</p>
              <ul className="text-xs text-blue-600 space-y-2">
                <li className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    hasMinLength ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <span className={hasMinLength ? 'text-green-600' : 'text-gray-500'}>
                    At least 8 characters
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    hasUppercase ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <span className={hasUppercase ? 'text-green-600' : 'text-gray-500'}>
                    One uppercase letter (A-Z)
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    hasLowercase ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <span className={hasLowercase ? 'text-green-600' : 'text-gray-500'}>
                    One lowercase letter (a-z)
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    hasSpecialChar ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <span className={hasSpecialChar ? 'text-green-600' : 'text-gray-500'}>
                    One special character (!@#$%^&*)
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    passwordsMatch ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <span className={passwordsMatch ? 'text-green-600' : 'text-gray-500'}>
                    Passwords match
                  </span>
                </li>
              </ul>
              
              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-blue-700 font-medium">Password Strength:</span>
                    <span className={`text-xs font-medium ${
                      isPasswordValid ? 'text-green-600' : 
                      (hasMinLength && (hasUppercase || hasLowercase)) ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {isPasswordValid ? 'Strong' : 
                       (hasMinLength && (hasUppercase || hasLowercase)) ? 'Medium' : 'Weak'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isPasswordValid ? 'bg-green-500 w-full' : 
                        (hasMinLength && (hasUppercase || hasLowercase)) ? 'bg-yellow-500 w-2/3' : 
                        'bg-red-500 w-1/3'
                      }`}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onResetPassword}
              disabled={isLoading || !isPasswordValid || !passwordsMatch}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Resetting...</span>
                </div>
              ) : (
                "Reset Password"
              )}
            </button>

            {/* Back Button */}
            <button
              onClick={onBackToOTP}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 py-3 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Back to OTP</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center pt-6 border-t border-gray-100">
        <p className="text-sm text-gray-600">
          Remember your password?{" "}
          <Link 
            to="/login" 
            className="text-blue-600 hover:text-blue-700 transition-colors duration-200 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

// Custom Hooks for API calls
function useSendEmailOTP() {
  return useMutation<
    SendOTPResponse,
    AxiosError<GenericError>,
    { email: string },
    unknown
  >({
    mutationFn: async (data) => {
      const response = await api().post("/email/resetOTP", data);
      return response.data;
    },
    onError: (err) => mutationErrorHandler(err),
  });
}

function useVerifyOTP() {
  return useMutation<
    VerifyOTPResponse,
    AxiosError<GenericError>,
    { email: string; otp: string },
    unknown
  >({
    mutationFn: async (data) => {
      const response = await api().post("/email/verifyOTP", data);
      return response.data;
    },
    onError: (err) => mutationErrorHandler(err),
  });
}

function useResetPassword() {
  return useMutation<
    ResetPasswordResponse,
    AxiosError<GenericError>,
    { email: string; newPassword: string },
    unknown
  >({
    mutationFn: async (data) => {
      const response = await api().post("/auth/reset-password", data);
      return response.data;
    },
    onError: (err) => mutationErrorHandler(err),
  });
}

// Main ForgotPassword Component
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>("email");
  const { mutateAsync: sendOTP, isPending: isSendingOTP } = useSendEmailOTP();
  const { mutateAsync: verifyOTP, isPending: isVerifyingOTP } = useVerifyOTP();
  const { mutateAsync: resetPassword, isPending: isResettingPassword } = useResetPassword();

  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
    otpSent: false,
    otpVerified: false,
  });

  const { user } = useUser();

  // Computed loading state
  const isLoading = isSendingOTP || isVerifyingOTP || isResettingPassword;

  // If user is already logged in, redirect to home
  if (user) return <Navigate to={"/"} />;

  // Email validation helper
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation helper
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push("Password must be at least 8 characters long");
    if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter");
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push("Password must contain at least one special character");
    return errors;
  };

  // Handle sending OTP
  const handleSendOTP = async () => {
    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const response = await sendOTP({
        email: formData.email.trim(),
      });

      if (response?.message) {
        toast.success("OTP sent to your email address!");
        setFormData(prev => ({ ...prev, otpSent: true }));
        setCurrentStep("otp");
      } else {
        toast.error('Failed to send OTP');
      }
    } catch (error: any) {
      console.error("Send OTP error:", error);
      
      if (error?.response?.status === 429) {
        toast.error('Too many requests. Please try again later.');
      } else if (error?.response?.status === 400) {
        toast.error('Invalid email address');
      } else if (error?.response?.status === 404) {
        toast.error('Email address not found in our system');
      } else {
        toast.error('Failed to send OTP. Please try again.');
      }
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async () => {
    if (!formData.otp.trim()) {
      toast.error("Please enter the OTP");
      return;
    }

    if (formData.otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    try {
      const response = await verifyOTP({
        email: formData.email.trim(),
        otp: formData.otp.trim(),
      });

      if (response?.message) {
        toast.success("OTP verified successfully!");
        setFormData(prev => ({ ...prev, otpVerified: true }));
        setCurrentStep("password");
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      
      if (error?.response?.status === 400) {
        const errorMessage = error?.response?.data?.error || error?.response?.data?.message;
        if (errorMessage === 'OTP has expired') {
          toast.error('OTP has expired. Please request a new one.');
          setFormData(prev => ({ ...prev, otpSent: false, otp: '' }));
          setCurrentStep("email");
        } else if (errorMessage === 'Invalid OTP') {
          toast.error('Invalid OTP. Please check and try again.');
        } else {
          toast.error('Invalid or expired OTP. Please try again.');
        }
      } else {
        toast.error('OTP verification failed. Please try again.');
      }
    }
  };

  // Handle password reset
  const handleResetPassword = async () => {
    if (!formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Enhanced password validation
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      toast.error(passwordErrors[0]); // Show first error
      return;
    }

    // Security check: ensure OTP was verified
    if (!formData.otpVerified) {
      toast.error("Please verify OTP first");
      setCurrentStep("otp");
      return;
    }

    try {
      const response = await resetPassword({
        email: formData.email.trim(),
        newPassword: formData.password,
      });

      if (response?.message) {
        toast.success("Password reset successfully!");
        
        // Clear form data for security
        setFormData({
          email: "",
          otp: "",
          password: "",
          confirmPassword: "",
          otpSent: false,
          otpVerified: false,
        });
        
        // Redirect to login page
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } catch (error: any) {
      console.error("Reset password error:", error);
      
      if (error?.response?.status === 400) {
        toast.error('Invalid request. Please start the process again.');
        setCurrentStep("email");
      } else if (error?.response?.status === 404) {
        toast.error('Session expired. Please start again.');
        setCurrentStep("email");
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    }
  };

  // Handle resending OTP
  const handleResendOTP = async () => {
    try {
      await handleSendOTP();
    } catch (error) {
      console.error("Resend OTP error:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Input sanitization
    let sanitizedValue = value;
    if (name === "email") {
      sanitizedValue = value.trim().toLowerCase();
    } else if (name === "otp") {
      // Only allow numeric input for OTP
      sanitizedValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    }
    
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
  };

  const handleBackToEmail = () => {
    setCurrentStep("email");
    setFormData((prev) => ({ 
      ...prev, 
      otp: "", 
      password: "", 
      confirmPassword: "",
      otpSent: false,
      otpVerified: false 
    }));
  };

  const handleBackToOTP = () => {
    setCurrentStep("otp");
    setFormData((prev) => ({ 
      ...prev, 
      password: "", 
      confirmPassword: "",
      otpVerified: false 
    }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div
        className={`absolute inset-0 bg-cover transition-all duration-300 ${
          isLoading ? 'animate-none blur-sm' : 'animate-subtle-zoom'
        }`}
        style={{
          backgroundImage: `url("/lovable-uploads/cc0094aa-ced3-4e50-b5f1-d61b7b6d2988.png")`,
          backgroundPosition: "center 70%",
        }}
      />
      {/* Background Overlay */}
      <div className={`absolute inset-0 transition-all duration-300 ${
        isLoading ? 'bg-black bg-opacity-60' : 'bg-black bg-opacity-20'
      }`}></div>

      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4 shadow-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-lg font-medium text-gray-800">
              {currentStep === "email" ? "Sending OTP..." :
                currentStep === "otp" ? "Verifying OTP..." :
                  "Resetting password..."}
            </p>
            <p className="text-sm text-gray-600 text-center">Please wait a moment</p>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden md:block relative z-10 min-h-screen">
        <LoginStages>
          {(stage) => (
            <>
              {/* Logo */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 transition-all ${
                  stage === "logoTransition"
                    ? "duration-[2500ms]"
                    : "duration-[1500ms]"
                } ${
                  stage === "initial" || stage === "textFadeOut"
                    ? "left-1/2 -translate-x-1/2"
                    : "left-[25%] -translate-x-1/2"
                } ${isLoading ? 'opacity-30' : ''}`}
                style={{
                  transitionTimingFunction:
                    "cubic-bezier(0.25, 0.1, 0.25, 1)",
                  transform:
                    "translate3d(var(--tw-translate-x), var(--tw-translate-y), 0)",
                }}
              >
                <img
                  src="/lovable-uploads/ceabc523-dba1-475b-b670-7ed6b88782a1.png"
                  alt="STEM for Society Logo"
                  className={`object-contain transition-all ${
                    stage === "logoTransition"
                      ? "duration-[2500ms]"
                      : "duration-[1500ms]"
                  } ${
                    stage === "initial" || stage === "textFadeOut"
                      ? "h-32 w-32 md:h-48 md:w-48 lg:h-64 lg:w-64"
                      : "h-40 w-40 md:h-56 md:w-56 lg:h-72 lg:w-72 opacity-50"
                  } ${
                    stage === "logoTransition" && !isLoading
                      ? "animate-pulse-glow-delayed"
                      : ""
                  }`}
                  style={{
                    transitionTimingFunction:
                      "cubic-bezier(0.25, 0.1, 0.25, 1)",
                  }}
                />
              </div>

              {/* Slogan Text */}
              <div
                className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                  stage === "initial"
                    ? "opacity-100 translate-y-24 md:translate-y-32 lg:translate-y-40"
                    : "opacity-0 -translate-y-5"
                } ${isLoading ? 'opacity-30' : ''}`}
              >
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white text-center px-4 leading-tight">
                  Reset your password and get back to innovating!
                </h1>
              </div>

              {/* Forgot Password Form Panel */}
              <div
                className={`absolute right-0 top-0 h-full w-1/2 transition-all ${
                  stage === "logoTransition"
                    ? "duration-[2500ms]"
                    : "duration-[1500ms]"
                } ${
                  stage === "logoTransition"
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
                } ${isLoading ? 'pointer-events-none' : ''}`}
                style={{
                  transitionTimingFunction:
                    "cubic-bezier(0.25, 0.1, 0.25, 1)",
                  transform:
                    "translate3d(var(--tw-translate-x), var(--tw-translate-y), 0)",
                }}
              >
                <div className={`absolute inset-0 bg-white/50 rounded-l-3xl backdrop-blur-sm transition-all duration-300 ${
                  isLoading ? 'opacity-30' : ''
                }`}></div>
                <div className="relative z-10 h-full max-h-screen overflow-y-auto flex items-center justify-center px-4 md:px-8 py-4">
                  <ForgotPasswordForm
                    currentStep={currentStep}
                    email={formData.email}
                    otp={formData.otp}
                    password={formData.password}
                    confirmPassword={formData.confirmPassword}
                    onInputChange={handleInputChange}
                    onSendOTP={handleSendOTP}
                    onVerifyOTP={handleVerifyOTP}
                    onResetPassword={handleResetPassword}
                    onResendOTP={handleResendOTP}
                    onBackToEmail={handleBackToEmail}
                    onBackToOTP={handleBackToOTP}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </>
          )}
        </LoginStages>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden relative z-10 min-h-screen flex flex-col">
        <div className={`flex-1 flex items-center justify-center pt-16 transition-all duration-300 ${
          isLoading ? 'opacity-30' : ''
        }`}>
          <img
            src="/lovable-uploads/ceabc523-dba1-475b-b670-7ed6b88782a1.png"
            alt="STEM for Society Logo"
            className={`h-24 w-24 object-contain opacity-50 ${
              !isLoading ? 'animate-pulse-glow-delayed' : ''
            }`}
          />
        </div>
        <div className={`flex-1 relative transition-all duration-300 ${
          isLoading ? 'pointer-events-none' : ''
        }`}>
          <div className={`absolute inset-0 bg-white/50 rounded-t-3xl backdrop-blur-sm transition-all duration-300 ${
            isLoading ? 'opacity-30' : ''
          }`}></div>
          <div className="relative z-10 max-h-[70vh] overflow-y-auto flex items-start justify-center px-4 pt-6 pb-4">
            <div className="w-full max-w-sm">
              <ForgotPasswordForm
                currentStep={currentStep}
                email={formData.email}
                otp={formData.otp}
                password={formData.password}
                confirmPassword={formData.confirmPassword}
                onInputChange={handleInputChange}
                onSendOTP={handleSendOTP}
                onVerifyOTP={handleVerifyOTP}
                onResetPassword={handleResetPassword}
                onResendOTP={handleResendOTP}
                onBackToEmail={handleBackToEmail}
                onBackToOTP={handleBackToOTP}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;