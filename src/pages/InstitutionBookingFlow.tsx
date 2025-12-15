import React, { useState, useCallback, useEffect } from 'react';
import Header from '@/components1/Header';
import { Button } from '@/components1/ui/button';
import { Input } from '@/components1/ui/input';
import { Card } from '@/components1/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components1/ui/select';
import { ArrowLeft, Share2, Check, AlertTriangle, ChevronLeft, ChevronRight, Send, AlertCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { GenericError, GenericResponse, RazorpayOrderOptions } from '../lib/types';
import { AxiosError } from 'axios';
import { api } from '../lib/api';
import { toast } from 'react-toastify';
import { mutationErrorHandler, initializeRazorpay } from '../lib/utils';
import { RZPY_KEYID } from '../Constants';
import { useShare } from '@/hooks/useShare';
import { SharePopup } from '@/components1/ui/SharePopup';

// Backend types from Pricing.tsx
type CreatePaymentResponse = {
  orderId: string;
  amount: number;
};

// ADDED: OTP response types
type SendOTPResponse = {
  message: string;
  data: any;
};

type VerifyOTPResponse = {
  message: string;
};

// Backend form data type (what gets sent to backend)
type InstitutionSignUpForm = {
  schoolName: string;
  contactName: string;
  contactMobile: string;
  contactEmail: string;
  studentsCount: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  plan?: "Basics" | "Premium";
  selectedDate?: string;
  selectedTime?: string;
};

// Frontend form data type (includes UI-only fields)
interface FormData {
  // Backend fields
  schoolName: string;
  contactName: string;
  contactMobile: string;
  contactEmail: string;
  studentsCount: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  plan: "Basics" | "Premium";
  selectedDate: string;
  selectedTime: string;
  // Frontend-only fields (not sent to backend) - REMOVED: institutionName, manualInstitutionName
  firstName: string;
  lastName: string;
  country: string;
  mobileNumber: string;
  otp: string;
  otpSent: boolean;
  otpVerified: boolean;
  numberOfStudents: string;
}

// Custom hook for institution signup
function useInstitutionSignUp() {
  return useMutation<
    GenericResponse<CreatePaymentResponse>,
    AxiosError<GenericError>,
    InstitutionSignUpForm,
    unknown
  >({
    mutationFn: async (data) => {
      const response = await api().post("/enquiry/plans", data);
      return response.data;
    },
    onError: (err) => mutationErrorHandler(err),
  });
}

// ADDED: Custom hook for sending email OTP
function useSendEmailOTP() {
  return useMutation<
    SendOTPResponse,
    AxiosError<GenericError>,
    { email: string,
      institutionName : string,
      mobile : string;
     },
    unknown
  >({
    mutationFn: async (data) => {
      const response = await api().post("/email/sendOTP", data);
      return response.data;
    },
    onError: (err) => mutationErrorHandler(err),
  });
}

// ADDED: Custom hook for verifying email OTP
function useVerifyEmailOTP() {
  return useMutation<
    VerifyOTPResponse,
    AxiosError<GenericError>,
    { email: string; otp: number },
    unknown
  >({
    mutationFn: async (data) => {
      const response = await api().post("/email/verifyOTP", data);
      return response.data;
    },
    onError: (err) => mutationErrorHandler(err),
  });
}

const InstitutionBookingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { mutateAsync, isPending } = useInstitutionSignUp();
  const { mutateAsync: sendOTP, isPending: isSendingOTP } = useSendEmailOTP();
  const { mutateAsync: verifyOTP, isPending: isVerifyingOTP } = useVerifyEmailOTP();
  const { isShowing, handleShare } = useShare();

  // UPDATED: Email OTP verification states
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    // Backend fields
    schoolName: '', // This will be directly typed now
    contactName: '',
    contactEmail: '',
    contactMobile: '',
    studentsCount: 0,
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    plan: 'Premium',
    selectedDate: '',
    selectedTime: '',
    // Frontend-only fields (REMOVED: institutionName, manualInstitutionName)
    firstName: '',
    lastName: '',
    country: 'in', // Default to India
    mobileNumber: '',
    otp: '',
    otpSent: false,
    otpVerified: false,
    numberOfStudents: '',
  });

  // OTP timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0 && formData.otpSent) {
      setCanResendOtp(true);
    }
    return () => clearInterval(interval);
  }, [otpTimer, formData.otpSent]);

  const steps = [
    { number: 1, title: 'Institution Information' },
    { number: 2, title: 'Point of Contact' },
    { number: 3, title: 'Student Information' },
    { number: 4, title: 'Schedule Meet' },
  ];

  const timeSlots = [
    '10:30 AM', '11:30 AM', '12:30 PM', '3:30 PM', '4:30 PM', '5:30 PM'
  ];

  const nextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!formData.schoolName || !formData.addressLine1 || !formData.city || !formData.state || !formData.pincode) {
        toast.error("Please fill all required fields");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.contactName || !formData.contactEmail || !formData.contactMobile) {
        toast.error("Please fill all required fields");
        return;
      }
      if (!formData.otpVerified) {
        toast.error("Please verify your email address with OTP");
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.numberOfStudents || !formData.plan) {
        toast.error("Please fill all required fields");
        return;
      }
    } else if (currentStep === 4) {
      if (!selectedDate) {
        toast.error("Please select a date");
        return;
      }
      if (!formData.selectedTime) {
        toast.error("Please select a time slot");
        return;
      }
      
      // Check if selected time is not in the past for today
      if (isTimeSlotPast(formData.selectedTime)) {
        toast.error("Please select a future time slot");
        return;
      }
    }

    if (currentStep === 4) {
      handlePayment();
    } else if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: string | number | Date | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Helper function to format date consistently
  const formatDateForComparison = (date: Date) => {
    return date.getFullYear() + '-' + 
           String(date.getMonth() + 1).padStart(2, '0') + '-' + 
           String(date.getDate()).padStart(2, '0');
  };

  // Helper function to check if a time slot is in the past for today
  const isTimeSlotPast = (timeSlot: string) => {
    if (!selectedDate) return false;
    
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    
    if (!isToday) return false; // If not today, no time slots are past
    
    // Convert time slot to 24-hour format for comparison
    const [time, period] = timeSlot.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) {
      hour24 = hours + 12;
    } else if (period === 'AM' && hours === 12) {
      hour24 = 0;
    }
    
    // Create a date object for the time slot
    const timeSlotDate = new Date();
    timeSlotDate.setHours(hour24, minutes, 0, 0);
    
    // Add 30 minutes buffer to current time
    const currentTimeWithBuffer = new Date();
    currentTimeWithBuffer.setMinutes(currentTimeWithBuffer.getMinutes() + 30);
    
    return timeSlotDate <= currentTimeWithBuffer;
  };

  // UPDATED: Handle email OTP sending
  const handleSendOTP = async () => {
    if (!formData.contactEmail) {
      toast.error("Please enter email address first");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contactEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const response = await sendOTP({
        email: formData.contactEmail,
        institutionName : formData.schoolName,
        mobile: formData.contactMobile
      });

      if (response.message) {
        toast.success(`OTP sent successfully to ${formData.contactEmail}`);
        updateFormData('otpSent', true);
        
        // Start 60-second timer for resend
        setOtpTimer(60);
        setCanResendOtp(false);
      } else {
        toast.error('Failed to send OTP');
      }
    } catch (error: any) {
      console.error('Email OTP sending failed:', error);
      
      if (error.response?.status === 429) {
        toast.error('Too many requests. Please try again later.');
      } else if (error.response?.status === 400) {
        toast.error('Invalid email address');
      } else {
        toast.error('Failed to send OTP. Please try again.');
      }
    }
  };

  // UPDATED: Handle email OTP verification
  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      toast.error("Please enter OTP");
      return;
    }
    
    if (formData.otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const response = await verifyOTP({
        email: formData.contactEmail,
        otp: parseInt(formData.otp)
      });

      if (response.message) {
        toast.success("Email address verified successfully!");
        updateFormData('otpVerified', true);
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('OTP verification failed:', error);
      
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.error;
        if (errorMessage === 'OTP has expired') {
          toast.error('OTP has expired. Please request a new one.');
          updateFormData('otpSent', false);
          updateFormData('otp', '');
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

  // Handle OTP resending
  const handleResendOTP = async () => {
    if (!canResendOtp) {
      toast.info(`Please wait ${otpTimer} seconds before resending`);
      return;
    }

    // Reset OTP states
    updateFormData('otp', '');
    updateFormData('otpSent', false);
    updateFormData('otpVerified', false);
    
    // Resend OTP
    await handleSendOTP();
  };

  // Get country code based on selected country
  const getCountryCode = () => {
    const countryCodes: { [key: string]: string } = {
      'us': '+1',
      'in': '+91',
      'uk': '+44',
      'ca': '+1',
      'au': '+61'
    };
    return countryCodes[formData.country] || '+91';
  };

  // UPDATED: Format phone number for display
  const getFormattedPhoneNumber = () => {
    return `${getCountryCode()} ${formData.contactMobile}`;
  };

  const calculatePrice = () => {
    // Institution pricing based on plan selection
    if (formData.plan === 'Basics') {
      return 20000; // ₹20,000 for Basics plan
    } else if (formData.plan === 'Premium') {
      return 40000; // ₹40,000 for Premium plan
    }
    return 0; // Default if no plan selected
  };

  // Updated handleDateSelect to properly sync with dropdown
  const handleDateSelect = (date: Date) => {
    console.log('Calendar selected:', date.toDateString());
    setSelectedDate(date);
    updateFormData('selectedDate', formatDateForComparison(date));
    
    // Update calendar month to show the selected date
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth()));
  };

  // Updated handleDropdownDateSelect to properly sync with calendar
  const handleDropdownDateSelect = (value: string) => {
    console.log('Dropdown selected value:', value);
    
    // Parse the date properly to avoid timezone issues
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed in Date constructor
    
    console.log('Dropdown selected date:', date.toDateString());
    setSelectedDate(date);
    updateFormData('selectedDate', value);
    
    // Update calendar month to show the selected date
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth()));
  };

  // Updated generateAvailableDates to use consistent date formatting
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    const oneMonthFromToday = new Date(today);
    oneMonthFromToday.setMonth(today.getMonth() + 1);
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Only include dates within one month
      if (date <= oneMonthFromToday) {
        dates.push({
          value: formatDateForComparison(date), // Use consistent formatting
          label: date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        });
      }
    }
    
    return dates;
  };

  const handlePayment = useCallback(async () => {
    try {
      const rzrpyInit = await initializeRazorpay();
      if (!rzrpyInit) return toast.error("Unable to initialize payment!");

      if (!selectedDate || !formData.selectedTime) {
        toast.error("Please select date and time for your session");
        return;
      }

      // Prepare data for backend (exclude frontend-only fields)
      const backendData: InstitutionSignUpForm = {
        schoolName: formData.schoolName,
        contactName: formData.contactName,
        contactMobile: formData.contactMobile,
        contactEmail: formData.contactEmail,
        studentsCount: parseInt(formData.numberOfStudents) || 0,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || undefined,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        plan: formData.plan,
        selectedDate: formData.selectedDate, // Already formatted as YYYY-MM-DD
        selectedTime: formData.selectedTime,
      };

      console.log("Sending to backend:", backendData);

      const data = await mutateAsync(backendData);

      console.log("🚀 ~ handlePayment ~ data:", data);

      if (!data || !data.data) {
        toast.error("Something went wrong in creating payment!");
        return;
      }
      const order = data.data;

      const options: RazorpayOrderOptions = {
        key: RZPY_KEYID,
        amount: Number(order.amount) * 100,
        currency: "INR",
        name: "Stem for Society",
        description: `${formData.plan} plan purchase`,
        image: "https://stem-4-society.netlify.app/logo-01.png",
        order_id: order.orderId,
        prefill: {
          name: formData.contactName + " - " + formData.schoolName,
          email: formData.contactEmail,
          contact: formData.contactMobile,
        },
        async handler(response) {
          toast.success(
            "Payment was made successfully! We will verify the payment and will be in touch with you shortly",
            { autoClose: false, draggable: false },
          );
          setCurrentStep(5); // Move to success step
          try{
            await api().post("/email/send-institution-booking", {
              userEmail: formData.contactEmail,
              userName: formData.contactName + " - " + formData.schoolName,
              institutionName : formData.schoolName,
              serviceType : formData.plan,
              amount : Number(order.amount),
              currency : "INR",
              paymentId : response.razorpay_payment_id,
              sessionDate : formData.selectedDate,
            });
            console.log("Email sent successfully");
          }
          catch(error){
            console.log("Email Error ", error);
          }
        },
      };

      // @ts-expect-error Razorpay global variable
      const rzp: RazorpayInstance = new window.Razorpay(options);

      // Razorpay event handler
      rzp.on("payment.failed", (res) => {
        console.log("Failure:", res);
        toast.error("Payment failed! Reason:\n" + res.error.description, {
          autoClose: false,
          closeOnClick: false,
        });
        toast.error(
          "Please note Order ID: " +
            res.error.metadata.order_id +
            "\n Payment ID: " +
            res.error.metadata.payment_id,
          { autoClose: false, closeOnClick: false },
        );
      });

      rzp.open();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.status === 401) {
          toast.error("Please login again");
          return;
        }
      }
      console.log("🚀 ~ handlePayment ~ error:", error);
      toast.error("Something went wrong in the payment process");
    }
  }, [formData, selectedDate, mutateAsync]);

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-8 mb-12">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
            currentStep === step.number 
              ? "bg-blue-500 text-white" 
              : currentStep > step.number 
                ? "bg-gray-300 text-gray-600"
                : "bg-gray-200 text-gray-500"
          )}>
            {step.number}
          </div>
          {step.number === currentStep ? (
            <div className="text-blue-500 text-sm font-medium ml-2">
              {step.title}
            </div>
          ) : step.number < currentStep ? (
            <div className="text-gray-500 text-sm ml-2">
              {step.title}
            </div>
          ) : null}
          {/* Add line connector between steps */}
          {index < steps.length - 1 && (
            <div className="w-16 h-0.5 bg-gray-200 mx-4"></div>
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* UPDATED: Direct manual input instead of dropdown */}
      <div>
        <Input
          placeholder="Institution/School Name *"
          value={formData.schoolName}
          onChange={(e) => updateFormData('schoolName', e.target.value)}
          className="h-12 bg-gray-100 border-0 placeholder:text-gray-500"
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <span className="text-blue-800 text-sm">
          Enter your institution or school name exactly as it appears in official webpage.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Address line 1 *"
          value={formData.addressLine1}
          onChange={(e) => updateFormData('addressLine1', e.target.value)}
          className="h-12 bg-gray-100 border-0 placeholder:text-gray-500"
        />
        <Input
          placeholder="Address line 2"
          value={formData.addressLine2}
          onChange={(e) => updateFormData('addressLine2', e.target.value)}
          className="h-12 bg-gray-100 border-0 placeholder:text-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="City *"
          value={formData.city}
          onChange={(e) => updateFormData('city', e.target.value)}
          className="h-12 bg-gray-100 border-0 placeholder:text-gray-500"
        />
        <Input
          placeholder="State *"
          value={formData.state}
          onChange={(e) => updateFormData('state', e.target.value)}
          className="h-12 bg-gray-100 border-0 placeholder:text-gray-500"
        />
      </div>

      <div>
        <Input
          placeholder="Pincode *"
          value={formData.pincode}
          onChange={(e) => updateFormData('pincode', e.target.value)}
          className="h-12 bg-gray-100 border-0 placeholder:text-gray-500"
        />
      </div>
    </div>
  );

  // UPDATED: Step 2 now uses email OTP instead of mobile OTP
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Contact Person Name *"
          value={formData.contactName}
          onChange={(e) => updateFormData('contactName', e.target.value)}
          className="h-12 bg-gray-100 border-0 placeholder:text-gray-500"
          disabled={formData.otpVerified}
        />
        <div className="relative">
          <Input
            placeholder="Contact Email *"
            type="email"
            value={formData.contactEmail}
            onChange={(e) => updateFormData('contactEmail', e.target.value)}
            className="h-12 bg-gray-100 border-0 placeholder:text-gray-500"
            disabled={formData.otpVerified}
          />
          {formData.otpVerified && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Check className="h-5 w-5 text-green-500" />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select 
          value={formData.country}
          onValueChange={(value) => updateFormData('country', value)}
        >
          <SelectTrigger className="h-12 bg-gray-100 border-0 text-gray-500">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us">🇺🇸 United States (+1)</SelectItem>
            <SelectItem value="in">🇮🇳 India (+91)</SelectItem>
            <SelectItem value="uk">🇬🇧 United Kingdom (+44)</SelectItem>
            <SelectItem value="ca">🇨🇦 Canada (+1)</SelectItem>
            <SelectItem value="au">🇦🇺 Australia (+61)</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="md:col-span-2">
          <Input
            placeholder="Mobile Number *"
            value={formData.contactMobile}
            onChange={(e) => {
              // Only allow numbers and limit to 10 digits for most countries
              const value = e.target.value.replace(/\D/g, '').slice(0, 10);
              updateFormData('contactMobile', value);
            }}
            className="h-12 bg-gray-100 border-0 placeholder:text-gray-500"
            maxLength={10}
          />
        </div>
      </div>

      {!formData.otpVerified && (
        <div className="flex items-center justify-end">
          <Button 
            onClick={handleSendOTP}
            disabled={!formData.contactEmail || isSendingOTP}
            className={`px-8 ${formData.otpSent ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          >
            <Mail className="h-4 w-4 mr-2" />
            {isSendingOTP ? 'Sending...' : formData.otpSent ? 'OTP Sent' : 'Send Email OTP'}
          </Button>
        </div>
      )}

      {formData.otpSent && !formData.otpVerified && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
            <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-blue-800 text-sm">
              <p className="font-medium">OTP sent to {formData.contactEmail}</p>
              <p className="mt-1">Enter the 6-digit code you received in your email (valid for 10 minutes)</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Enter 6-digit OTP"
                value={formData.otp}
                onChange={(e) => {
                  // Only allow numbers and limit to 6 digits
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  updateFormData('otp', value);
                }}
                className="h-12 bg-gray-100 border-0 placeholder:text-gray-500"
                maxLength={6}
                disabled={isVerifyingOTP}
              />
              <Button 
                onClick={handleVerifyOTP}
                disabled={!formData.otp || formData.otp.length !== 6 || isVerifyingOTP}
                className="px-6 bg-green-500 hover:bg-green-600 text-white"
              >
                {isVerifyingOTP ? 'Verifying...' : 'Verify'}
              </Button>
            </div>

            {/* Resend OTP option */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Didn't receive the email?
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResendOTP}
                disabled={!canResendOtp || isSendingOTP}
                className="text-blue-600 hover:text-blue-700 px-2"
              >
                {canResendOtp ? 'Resend OTP' : `Resend in ${otpTimer}s`}
              </Button>
            </div>
          </div>
        </>
      )}

      {formData.otpVerified && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="h-5 w-5 text-white" />
          </div>
          <div className="text-green-800">
            <p className="font-medium">Email address verified successfully!</p>
            <p className="text-sm">Email: {formData.contactEmail}</p>
          </div>
        </div>
      )}

      {/* UPDATED: Additional security info for email verification */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
          <div className="text-gray-700 text-sm">
            <p className="font-medium mb-2">Why do we need to verify your email address?</p>
            <ul className="space-y-1 text-xs">
              <li>• To send you important session updates and meeting links</li>
              <li>• To ensure secure communication about your booking</li>
              <li>• To send confirmation emails and reminders</li>
              <li>• To prevent fraudulent bookings and protect our platform</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <Select 
          value={formData.numberOfStudents}
          onValueChange={(value) => {
            updateFormData('numberOfStudents', value);
            updateFormData('studentsCount', parseInt(value.split('-')[0]) || 0);
          }}
        >
          <SelectTrigger className="w-full h-12 bg-gray-100 border-0 text-gray-500">
            <SelectValue placeholder="Number of Students *" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-50">1-50 Students</SelectItem>
            <SelectItem value="51-100">51-100 Students</SelectItem>
            <SelectItem value="101-200">101-200 Students</SelectItem>
            <SelectItem value="200+">200+ Students</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basics Plan */}
        <div 
          className={`border rounded-lg p-6 cursor-pointer transition-all ${
            formData.plan === 'Basics' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
          }`} 
          onClick={() => updateFormData('plan', 'Basics')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              updateFormData('plan', 'Basics');
            }
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Basics</h3>
            <div className={`w-4 h-4 rounded-full border-2 ${
              formData.plan === 'Basics' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
            } flex items-center justify-center`}>
              {formData.plan === 'Basics' && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">Essential Skills to Shape a Promising Future</p>
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex items-center"><span className="text-green-500 mr-2">✔</span>Career Counselling</div>
            <div className="flex items-center"><span className="text-green-500 mr-2">✔</span>Psychology Counselling</div>
            <div className="flex items-center"><span className="text-green-500 mr-2">✔</span>Time Management Training</div>
            <div className="flex items-center"><span className="text-green-500 mr-2">✔</span>Personality Development</div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900">₹ 20,000.00</span>
            <span className="text-gray-500 text-sm">/ Per Year</span>
          </div>
        </div>

        {/* Premium Plan */}
        <div 
          className={`border rounded-lg p-6 cursor-pointer transition-all ${
            formData.plan === 'Premium' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
          }`} 
          onClick={() => updateFormData('plan', 'Premium')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              updateFormData('plan', 'Premium');
            }
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Premium</h3>
            <div className={`w-4 h-4 rounded-full border-2 ${
              formData.plan === 'Premium' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
            } flex items-center justify-center`}>
              {formData.plan === 'Premium' && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">Comprehensive Training for a Brighter Tomorrow</p>
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex items-center"><span className="text-green-500 mr-2">✔</span>Career Counselling</div>
            <div className="flex items-center"><span className="text-green-500 mr-2">✔</span>Psychology Counselling</div>
            <div className="flex items-center"><span className="text-green-500 mr-2">✔</span>Sex Education</div>
            <div className="flex items-center"><span className="text-green-500 mr-2">✔</span>Entrepreneurship Training</div>
            <div className="flex items-center"><span className="text-green-500 mr-2">✔</span>Personality Development</div>
            <div className="flex items-center"><span className="text-green-500 mr-2">✔</span>Industrial Visit</div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900">₹ 40,000.00</span>
            <span className="text-gray-500 text-sm">/ Per Year</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-3xl font-bold text-blue-600 mb-2">₹ {calculatePrice().toLocaleString()}.00</div>
        <div className="text-gray-600">Selected Plan: {formData.plan}</div>
        <div className="text-gray-600">Students: {formData.numberOfStudents}</div>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const today = new Date();
    const oneMonthFromToday = new Date(today);
    oneMonthFromToday.setMonth(today.getMonth() + 1);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-2"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-medium">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-2"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-4 text-center text-sm text-gray-500">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2">{day}</div>
              ))}
            </div>

            {/* Calendar grid generation */}
            <div className="grid grid-cols-7 gap-1">
              {(() => {
                const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
                const startDate = new Date(firstDay);
                startDate.setDate(startDate.getDate() - firstDay.getDay()); // Go to start of week
                
                const days = [];
                const currentDate = new Date(startDate);
                
                // Generate 42 days (6 weeks) to fill the calendar grid
                for (let i = 0; i < 42; i++) {
                  const date = new Date(currentDate);
                  const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                  
                  // Better date comparison for selection
                  const isSelected = selectedDate && 
                    formatDateForComparison(date) === formatDateForComparison(selectedDate);
                  
                  const isToday = formatDateForComparison(date) === formatDateForComparison(new Date());
                  const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));
                  const isAfterOneMonth = date > oneMonthFromToday;
                  const isDisabled = !isCurrentMonth || isPastDate || isAfterOneMonth;
                  
                  days.push(
                    <button
                      key={i}
                      onClick={() => {
                        if (!isDisabled) {
                          handleDateSelect(date);
                        }
                      }}
                      className={`p-2 text-sm rounded-lg transition-colors ${
                        isDisabled
                          ? 'text-gray-300 cursor-not-allowed'
                          : isSelected
                            ? 'bg-blue-500 text-white'
                            : isToday
                              ? 'bg-blue-100 text-blue-600 font-semibold'
                              : isCurrentMonth
                                ? 'hover:bg-gray-100 text-gray-900'
                                : 'text-gray-400'
                      }`}
                      disabled={isDisabled}
                      aria-label={`Select date ${date.getDate()}`}
                    >
                      {date.getDate()}
                    </button>
                  );
                  
                  currentDate.setDate(currentDate.getDate() + 1);
                }
                
                return days;
              })()}
            </div>
            
            <div className="mt-4 text-xs text-gray-500 text-center">
              Available dates: Today to {oneMonthFromToday.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* Right side */}
          <div className="space-y-6">
            <div>
              <label htmlFor="date-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              {/* Updated Select with proper value synchronization */}
              <Select 
                value={selectedDate ? formatDateForComparison(selectedDate) : ''} 
                onValueChange={handleDropdownDateSelect}
              >
                <SelectTrigger id="date-select" className="w-full h-12 bg-gray-100 border-0 text-gray-700">
                  <SelectValue placeholder="Select Date" />
                </SelectTrigger>
                <SelectContent>
                  {generateAvailableDates().map((date) => (
                    <SelectItem key={date.value} value={date.value}>
                      {date.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">Available Time</h4>
              
              {/* Show info message for today's date */}
              {selectedDate && formatDateForComparison(selectedDate) === formatDateForComparison(today) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-blue-800 text-sm flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    For today's session, only future time slots are available (30 min advance booking required)
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map((time) => {
                  const isPastTime = isTimeSlotPast(time);
                  const isSelected = formData.selectedTime === time;
                  
                  return (
                    <button
                      key={time}
                      onClick={() => {
                        if (!isPastTime) {
                          updateFormData('selectedTime', time);
                        }
                      }}
                      disabled={isPastTime}
                      className={`p-3 text-sm rounded-lg border transition-colors ${
                        isPastTime
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                          : isSelected
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-white'
                      }`}
                      aria-label={`Select time ${time}`}
                    >
                      <span>{time}</span>
                      {isPastTime && (
                        <div className="text-xs text-gray-400 mt-1">Past</div>
                      )}
                    </button>
                  );
                })}
              </div>
              
              {/* Show message if no available time slots for today */}
              {selectedDate && 
               formatDateForComparison(selectedDate) === formatDateForComparison(today) && 
               timeSlots.every(time => isTimeSlotPast(time)) && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
                  <p className="text-orange-800 text-sm text-center">
                    ⏰ No more time slots available for today. Please select tomorrow or a future date.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <span className="text-yellow-800 text-sm">
                After payment, your session will be booked and a Meet link will be shared instantly.
              </span>
            </div>
            
            {/* Add payment summary for institution booking */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Institution:</span>
                  <span className="font-medium">{formData.schoolName || 'Not selected'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected Date:</span>
                  <span className="font-medium">
                    {selectedDate ? selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    }) : 'Not selected'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected Time:</span>
                  <span className="font-medium">{formData.selectedTime || 'Not selected'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected Plan:</span>
                  <span className="font-medium">{formData.plan} Plan</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Students:</span>
                  <span className="font-medium">{formData.numberOfStudents || 'Not selected'}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Amount to Pay:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{calculatePrice().toLocaleString()}.00
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="text-center space-y-8">
      <div className="bg-green-50 border border-green-200 rounded-2xl p-12">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Session Booked Successfully</h2>
          <p className="text-gray-600 max-w-md">
            Your institution session has been scheduled. A secure meeting link will be sent to your email.
          </p>
          
          {/* Show booked session details */}
          {selectedDate && formData.selectedTime && (
            <div className="bg-white border border-green-200 rounded-lg p-4 text-left max-w-md">
              <h4 className="font-medium text-green-900 mb-2">Session Details:</h4>
              <p className="text-green-800 text-sm">
                <strong>Date:</strong> {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-green-800 text-sm">
                <strong>Time:</strong> {formData.selectedTime}
              </p>
              <p className="text-green-800 text-sm">
                <strong>Institution:</strong> {formData.schoolName}
              </p>
              <p className="text-green-800 text-sm">
                <strong>Amount Paid:</strong> ₹{calculatePrice().toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-center space-x-4">
        <Button 
          variant="outline" 
          className="px-8 h-12"
          onClick={() => window.location.href = '/'}
        >
          Back to Home
        </Button>
        {/* <Button className="bg-[#0389FF] hover:bg-[#0389FF]/90 text-white px-8 h-12">
          DOWNLOAD CONFIRMATION
        </Button> */}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative overflow-hidden min-h-screen" style={{ height: '100%', minHeight: '100%' }}>
        {/* Grid background */}
        <div 
          className="absolute inset-0 opacity-50 pointer-events-none z-0"
          style={{
            minHeight: '100vh',
            backgroundImage: `
              linear-gradient(rgba(107,114,128,0.5) 2px, transparent 2px),
              linear-gradient(90deg, rgba(107,114,128,0.5) 2px, transparent 2px)
            `,
            backgroundSize: '100px 100px',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 35%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 35%, transparent 100%)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
          }}
        />

        {/* Content above grid */}
        <div className="relative z-10">
          <Header />

          {/* Navigation Bar */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link to="/institution-pricing">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 bg-[#0389FF] text-white border-[#0389FF] rounded-full px-4 hover:bg-[#0389FF]/90"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center space-x-2 bg-[#0389FF] text-white border-[#0389FF] rounded-full px-4 hover:bg-[#0389FF]/90"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-medium text-gray-900 mb-2">Book your Session</h1>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              <span className="text-yellow-500">Institution Plans & Pricing</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep <= 4 && renderStepIndicator()}

        <Card className="p-8 shadow-sm min-h-96">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderSuccess()}
        </Card>

        {currentStep <= 4 && (
          <div className="flex justify-between items-center mt-8">
            {/* Back Button */}
            <Button 
              onClick={handleBack}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold h-12"
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              BACK
            </Button>

            {/* Continue/Payment Button */}
            <Button 
              onClick={nextStep}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg font-semibold h-12"
              disabled={isPending || (currentStep === 2 && !formData.otpVerified)}
            >
              {currentStep === 4 ? (isPending ? 'PROCESSING...' : 'PROCEED TO PAYMENT') : 'CONTINUE'}
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3">
              <span className="text-blue-900 font-bold text-lg">
                <img 
                  src="/lovable-uploads/FooterLogo.png" 
                  alt="STEM for Society Logo" 
                  className="w-full h-full object-contain"
                />
              </span>
            </div>
            <div>
              <h4 className="text-xl font-bold">STEM FOR SOCIETY</h4>
              <p className="text-blue-200 text-sm">Let's innovate, incubate and impact the world together!</p>
            </div>
          </div>
        </div>
      </footer>
      <SharePopup isVisible={isShowing} />
    </div>
  );
};

export default InstitutionBookingFlow;