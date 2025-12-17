import React, { useState, useCallback } from 'react';
import Header from '@/components1/Header';
import { Button } from '@/components1/ui/button';
import { Input } from '@/components1/ui/input';
import { Card } from '@/components1/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components1/ui/select';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Upload, Calendar, Download, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { GenericError, GenericResponse, RazorpayOrderOptions } from '../lib/types';
import { AxiosError } from 'axios';
import { api } from '../lib/api';
import { toast } from 'react-toastify';
import { mutationErrorHandler, initializeRazorpay } from '../lib/utils';
import { useShare } from '../hooks/useShare';
import { SharePopup } from '../components1/ui/SharePopup';
import { RZPY_KEYID } from '@/Constants';
import { Icon } from '@iconify/react';

// ============================================
// BACKEND DATA TYPES - What gets sent to backend
// ============================================

/**
 * Backend response type for payment creation
 */
type CreatePaymentResponse = {
  orderId: string;
  amount: number;
};

/**
 * Backend response type for email authentication
 * TODO: Implement endpoint POST /auth/email/send-verification
 */
type EmailAuthResponse = {
  success: boolean;
  message: string;
  verificationId?: string;
};


type OtpVerifyResponse = {
  success: boolean;
  verified: boolean;
  message: string;
};

type PsychologyBookingForm = {
  // Personal Info
  firstName: string;
  lastName?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  // Contact Info
  email: string;
  emailVerified: boolean;
  countryCode: string;
  mobile: string;
  mobileVerified: boolean;
  // Required by backend 
  age: string;
  concerns: string;
  // Document
  documentType: string;
  idCard?: File | null;
  // Schedule
  selectedDate: string;
  selectedTime: string;
};

// Frontend form data type
interface FormData {
  // Step 1: Personal Information
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  // Step 2: Contact Information
  email: string;
  emailVerified: boolean;
  emailVerificationSent: boolean;
  countryCode: string;
  mobile: string;
  mobileVerified: boolean;
  otpSent: boolean;
  otp: string;
  // Legacy fields
  age: string;
  concerns: string;
  // Step 3: Upload ID
  documentType: string;
  idCard: File | null;
  // Step 4: Schedule Session
  selectedDate: string;
  selectedTime: string;
}

//Simple Brute Force verification
function useSendEmailVerification() {
  return useMutation<
    GenericResponse<EmailAuthResponse>,
    AxiosError<GenericError>,
    { email: string },
    unknown
  >({
    mutationFn: async (data) => {
      
      console.log('📧 [BACKEND TODO] Send email verification to:', data.email);
      //Simulate own Verify 
      return {
        data: { success: true, message: 'Verification email sent', verificationId: 'mock-id' },
        message: 'Success'
      } as GenericResponse<EmailAuthResponse>;
    },
    onError: (err) => mutationErrorHandler(err),
  });
}

function useSendMobileOtp() {
  return useMutation<
    GenericResponse<{ success: boolean; message: string }>,
    AxiosError<GenericError>,
    { mobile: string; countryCode: string },
    unknown
  >({
    mutationFn: async (data) => {      
      console.log('📱 [BACKEND TODO] Send OTP to:', data.countryCode, data.mobile);
      return {
        data: { success: true, message: 'OTP sent successfully' },
        message: 'Success'
      } as GenericResponse<{ success: boolean; message: string }>;
    },
    onError: (err) => mutationErrorHandler(err),
  });
}

function useVerifyMobileOtp() {
  return useMutation<
    GenericResponse<OtpVerifyResponse>,
    AxiosError<GenericError>,
    { mobile: string; countryCode: string; otp: string },
    unknown
  >({
    mutationFn: async (data) => {
      console.log('📱 [BACKEND TODO] Verify OTP:', data.otp, 'for', data.mobile);
      return {
        data: { success: true, verified: true, message: 'OTP verified' },
        message: 'Success'
      } as GenericResponse<OtpVerifyResponse>;
    },
    onError: (err) => mutationErrorHandler(err),
  });
}

function useCreatePsychologyPayment() {
  return useMutation<
    GenericResponse<CreatePaymentResponse>,
    AxiosError<GenericError>,
    PsychologyBookingForm,
    unknown
  >({
    mutationFn: async (data) => {
      const formData = new FormData();

      formData.append("firstName", data.firstName);
      if (data.lastName) formData.append("lastName", data.lastName);
      formData.append("city", data.city);
      formData.append("state", data.state);
      formData.append("email", data.email);
      formData.append("mobile", data.mobile);
      formData.append("age", data.age);           
      formData.append("concerns", data.concerns); 
      formData.append("selectedDate", data.selectedDate);
      formData.append("selectedTime", data.selectedTime);
      if (data.idCard) formData.append("idCard", data.idCard);
      
//New Fields But Not in Backend DB
      // formData.append("addressLine1", data.addressLine1);
      // if (data.addressLine2) formData.append("addressLine2", data.addressLine2);
      // formData.append("pincode", data.pincode);
      // formData.append("emailVerified", String(data.emailVerified));
      // formData.append("countryCode", data.countryCode);
      // formData.append("mobileVerified", String(data.mobileVerified));
      // formData.append("documentType", data.documentType);

      console.log('📤 Sending to backend:', {
        firstName: data.firstName,
        lastName: data.lastName,
        city: data.city,
        state: data.state,
        email: data.email,
        mobile: data.mobile,
        age: data.age,
        concerns: data.concerns,
        selectedDate: data.selectedDate,
        selectedTime: data.selectedTime,
        hasIdCard: !!data.idCard
      });

      const response = await api().post("/enquiry/psychology", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onError: (err) => mutationErrorHandler(err),
  });
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh'
];



const COUNTRY_CODES = [
  { code: '+91', country: 'India' },
  { code: '+1', country: 'USA' },
  { code: '+44', country: 'UK' },
  { code: '+971', country: 'UAE' },
  { code: '+65', country: 'Singapore' },
];

const DOCUMENT_TYPES = [
  { value: 'student_id', label: 'Student ID Card' },
  { value: 'aadhar', label: 'Aadhar Card' },
  { value: 'pan', label: 'PAN Card' },
  { value: 'driving_license', label: 'Driving License' },
  { value: 'passport', label: 'Passport' },
  { value: 'other', label: 'Other Government ID' },
];

const AVAILABLE_TIMES = [
  '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
];


const PsychologyBookingFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { isShowing } = useShare();
  
  // API Hooks
  const { mutateAsync: createPayment, isPending } = useCreatePsychologyPayment();
  const { mutateAsync: sendEmailVerification, isPending: isEmailSending } = useSendEmailVerification();
  const { mutateAsync: sendMobileOtp, isPending: isOtpSending } = useSendMobileOtp();
  const { mutateAsync: verifyMobileOtp, isPending: isOtpVerifying } = useVerifyMobileOtp();

  const [formData, setFormData] = useState<FormData>({
    // Step 1
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    // Step 2
    email: '',
    emailVerified: false,
    emailVerificationSent: false,
    countryCode: '+91',
    mobile: '',
    mobileVerified: false,
    otpSent: false,
    otp: '',
    // Legacy fields (required by backend, using defaults)
    age: '18',
    concerns: 'Psychology Counselling',
    // Step 3
    documentType: '',
    idCard: null,
    // Step 4
    selectedDate: '',
    selectedTime: '',
  });

  const steps = [
    { number: 1, title: 'Personal Information' },
    { number: 2, title: 'Contact Information' },
    { number: 3, title: 'Upload ID' },
    { number: 4, title: 'Schedule meet' },
  ];

  const formatDateForComparison = (date: Date) => {
    return date.getFullYear() + '-' + 
           String(date.getMonth() + 1).padStart(2, '0') + '-' + 
           String(date.getDate()).padStart(2, '0');
  };

  const isTimeSlotPast = (timeSlot: string) => {
    if (!selectedDate) return false;
    
    const today = new Date();
    const isToday = formatDateForComparison(selectedDate) === formatDateForComparison(today);
    
    if (!isToday) return false;
    
    const [time, period] = timeSlot.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) hour24 = hours + 12;
    else if (period === 'AM' && hours === 12) hour24 = 0;
    
    const timeSlotDate = new Date();
    timeSlotDate.setHours(hour24, minutes, 0, 0);
    
    const currentTimeWithBuffer = new Date();
    currentTimeWithBuffer.setMinutes(currentTimeWithBuffer.getMinutes() + 30);
    
    return timeSlotDate <= currentTimeWithBuffer;
  };

  const updateFormData = (field: string, value: string | File | Date | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendEmailVerification = async () => {
    if (!formData.email) {
      toast.error("Please enter your email address");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await sendEmailVerification({ email: formData.email });
      updateFormData('emailVerificationSent', true);
      toast.success("Verification link sent! Check your inbox and click the link.");

      setTimeout(() => {
        updateFormData('emailVerified', true);
        toast.success("Email verified successfully!");
      }, 3000);
    } catch (error) {
      toast.error("Failed to send verification email");
    }
  };


  const handleSendOtp = async () => {
    if (!formData.mobile) {
      toast.error("Please enter your mobile number");
      return;
    }
    
    if (formData.mobile.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      await sendMobileOtp({ 
        mobile: formData.mobile, 
        countryCode: formData.countryCode 
      });
      updateFormData('otpSent', true);
      toast.success("OTP sent to your mobile number");
    } catch (error) {
      toast.error("Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp || formData.otp.length < 4) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      const result = await verifyMobileOtp({
        mobile: formData.mobile,
        countryCode: formData.countryCode,
        otp: formData.otp
      });
      
      if (result.data?.verified) {
        updateFormData('mobileVerified', true);
        toast.success("Mobile number verified successfully!");
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error("OTP verification failed");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload an image file (JPG, PNG) only");
        return;
      }
      
      updateFormData('idCard', file);
      toast.success("Document uploaded successfully");
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload an image file (JPG, PNG) only");
        return;
      }
      
      updateFormData('idCard', file);
      toast.success("Document uploaded successfully");
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    updateFormData('selectedDate', formatDateForComparison(date));
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth()));
  };

  const handleDropdownDateSelect = (value: string) => {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    setSelectedDate(date);
    updateFormData('selectedDate', value);
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth()));
  };

  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    const oneMonthFromToday = new Date(today);
    oneMonthFromToday.setMonth(today.getMonth() + 1);
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      if (date <= oneMonthFromToday) {
        dates.push({
          value: formatDateForComparison(date),
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


  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.firstName || !formData.addressLine1 || !formData.city || !formData.state || !formData.pincode) {
          toast.error("Please fill all required fields");
          return false;
        }
        if (formData.pincode.length !== 6) {
          toast.error("Please enter a valid 6-digit pincode");
          return false;
        }
        return true;
        
      case 2:
        if (!formData.email || !formData.mobile) {
          toast.error("Please fill all required fields");
          return false;
        }
        if (!formData.emailVerified) {
          toast.error("Please verify your email address");
          return false;
        }
        if (!formData.mobileVerified) {
          toast.error("Please verify your mobile number with OTP");
          return false;
        }
        return true;
        
      case 3:
        if (!formData.documentType) {
          toast.error("Please select a document type");
          return false;
        }
        // ID upload is optional
        return true;
        
      case 4:
        if (!selectedDate || !formData.selectedDate) {
          toast.error("Please select a date for your session");
          return false;
        }
        if (!formData.selectedTime) {
          toast.error("Please select a time for your session");
          return false;
        }
        if (isTimeSlotPast(formData.selectedTime)) {
          toast.error("Please select a future time slot");
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) return;

    if (currentStep === 4) {
      handlePayment();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 5) {
      // From success page, navigate to home
      navigate('/');
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };


  const handlePayment = useCallback(async () => {
    try {
      // Check if Razorpay is already loaded
      if (typeof window !== 'undefined' && !(window as any).Razorpay) {
        const rzrpyInit = await initializeRazorpay();
        if (!rzrpyInit) {
          toast.error('Failed to initialize payment gateway. Please try again.');
          return;
        }
      }
      
      // Double check Razorpay is available
      if (typeof window === 'undefined' || !(window as any).Razorpay) {
        toast.error('Payment gateway not loaded. Please refresh the page.');
        console.error('Razorpay not found on window object');
        return;
      }

      const backendData: PsychologyBookingForm = {
        firstName: formData.firstName,
        lastName: formData.lastName || undefined,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || undefined,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        email: formData.email,
        emailVerified: formData.emailVerified,
        countryCode: formData.countryCode,
        mobile: formData.mobile,
        mobileVerified: formData.mobileVerified,
        // Required legacy fields for backend
        age: formData.age,
        concerns: formData.concerns,
        documentType: formData.documentType,
        idCard: formData.idCard || undefined,
        selectedDate: formData.selectedDate,
        selectedTime: formData.selectedTime,
      };

      const data = await createPayment(backendData);
      if (!data || !data.data) {
        toast.error('Something went wrong in creating payment. Please try again.');
        return;
      }

      const order = data.data;
      const options: RazorpayOrderOptions = {
        key: RZPY_KEYID,
        amount: Number(order.amount) * 100,
        currency: "INR",
        name: "STEM for Society",
        description: "Psychology Counselling Session",
        order_id: order.orderId,
        image: "https://stem-for-society.netlify.app/logo-01.png",
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          contact: formData.mobile,
        },
        async handler(response) {
          toast.success('Payment Successful! A Meet link has been generated and sent to your email.');
          setCurrentStep(5);
          try {
            await api().post("/email/send-mental-wellbeing", {
              userName: `${formData.firstName} ${formData.lastName}`.trim(),
              userEmail: formData.email,
              sessionType: 'Psychology Counselling',
              amount: Number(order.amount),
              currency: "INR",
              paymentId: response.razorpay_payment_id,
              sessionDate: formData.selectedDate,
              sessionTime: formData.selectedTime,
            });
          } catch (error) {
            console.log("Email Error ", error);
          }
        }
      };

      console.log('🔵 Creating Razorpay instance with options:', {
        key: RZPY_KEYID,
        amount: options.amount,
        order_id: options.order_id,
        currency: options.currency
      });
      
      const RazorpayConstructor = (window as any).Razorpay;
      const rzp = new RazorpayConstructor(options);
      
      rzp.on("payment.failed", (res: any) => {
        console.error("Payment Failure: ", res);
        toast.error('Payment Failed. Please try again.\n' + res.error.description);
      });
      
      console.log('🔵 Opening Razorpay checkout...');
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment. Please try again.');
    }
  }, [formData, createPayment]);


  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all flex-shrink-0",
              currentStep === step.number 
                ? "bg-[#0389FF] text-white border-[#0389FF]" 
                : currentStep > step.number 
                  ? "bg-[#0389FF] text-white border-[#0389FF]"
                  : "bg-white text-gray-400 border-gray-300"
            )}>
              {currentStep > step.number ? <Check className="h-5 w-5" /> : step.number}
            </div>
            <span className={cn(
              "text-xs font-medium whitespace-nowrap hidden sm:block",
              currentStep >= step.number ? "text-[#0389FF]" : "text-gray-400"
            )}>
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={cn(
              "w-8 md:w-16 h-0.5 mx-2",
              currentStep > step.number ? "bg-[#0389FF]" : "bg-gray-300"
            )} />
          )}
        </div>
      ))}
    </div>
  );


  // Get cities based on selected state
  const getCitiesForState = (state: string): string[] => {
    const stateCityMap: Record<string, string[]> = {
      'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Thane', 'Other'],
      'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum', 'Other'],
      'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Other'],
      'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Other'],
      'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Other'],
      'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Other'],
      'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Noida', 'Ghaziabad', 'Other'],
      'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Other'],
      'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Other'],
      'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Other'],
      'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Other'],
      'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Other'],
      'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Other'],
      'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Other'],
      'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Other'],
      'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Other'],
      'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Other'],
      'Uttarakhand': ['Dehradun', 'Haridwar', 'Rishikesh', 'Other'],
      'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala', 'Other'],
      'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Other'],
      'Delhi': ['New Delhi', 'Central Delhi', 'South Delhi', 'North Delhi', 'East Delhi', 'West Delhi', 'Other'],
      'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Other'],
      'Ladakh': ['Leh', 'Kargil', 'Other'],
    };
    return stateCityMap[state] || ['Other'];
  };

  const renderPersonalInfo = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="First Name *"
          value={formData.firstName}
          onChange={(e) => updateFormData('firstName', e.target.value)}
          className="bg-gray-50 border border-gray-200 h-12 rounded-lg focus:border-[#0389FF] focus:ring-[#0389FF]"
        />
        <Input
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => updateFormData('lastName', e.target.value)}
          className="bg-gray-50 border border-gray-200 h-12 rounded-lg focus:border-[#0389FF] focus:ring-[#0389FF]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Address line 1 *"
          value={formData.addressLine1}
          onChange={(e) => updateFormData('addressLine1', e.target.value)}
          className="bg-gray-50 border border-gray-200 h-12 rounded-lg focus:border-[#0389FF] focus:ring-[#0389FF]"
        />
        <Input
          placeholder="Address line 2"
          value={formData.addressLine2}
          onChange={(e) => updateFormData('addressLine2', e.target.value)}
          className="bg-gray-50 border border-gray-200 h-12 rounded-lg focus:border-[#0389FF] focus:ring-[#0389FF]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select 
          value={formData.state} 
          onValueChange={(value) => {
            updateFormData('state', value);
            updateFormData('city', ''); // Reset city when state changes
          }}
        >
          <SelectTrigger className="bg-gray-50 border border-gray-200 h-12 rounded-lg">
            <SelectValue placeholder="State *" />
          </SelectTrigger>
          <SelectContent>
            {INDIAN_STATES.map((state) => (
              <SelectItem key={state} value={state}>{state}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select 
          value={formData.city} 
          onValueChange={(value) => updateFormData('city', value)}
          disabled={!formData.state}
        >
          <SelectTrigger className="bg-gray-50 border border-gray-200 h-12 rounded-lg">
            <SelectValue placeholder={formData.state ? "City *" : "Select State first"} />
          </SelectTrigger>
          <SelectContent>
            {getCitiesForState(formData.state).map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Input
        placeholder="Pincode *"
        value={formData.pincode}
        onChange={(e) => updateFormData('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
        className="bg-gray-50 border border-gray-200 h-12 rounded-lg focus:border-[#0389FF] focus:ring-[#0389FF]"
        maxLength={6}
      />
    </div>
  );

  // ============================================
  // RENDER: STEP 2 - CONTACT INFORMATION
  // ============================================

  const renderContactInfo = () => (
    <div className="space-y-5">
      {/* Email with Authenticate */}
      <div className="space-y-2">
        <div className="flex gap-3">
          <Input
            placeholder="Email *"
            type="email"
            value={formData.email}
            onChange={(e) => {
              updateFormData('email', e.target.value);
              updateFormData('emailVerified', false);
              updateFormData('emailVerificationSent', false);
            }}
            className="bg-gray-50 border border-gray-200 h-12 rounded-lg flex-1 focus:border-[#0389FF] focus:ring-[#0389FF]"
            disabled={formData.emailVerified}
          />
          <Button
            type="button"
            onClick={handleSendEmailVerification}
            disabled={isEmailSending || formData.emailVerified || !formData.email}
            className={cn(
              "h-12 px-6 rounded-lg font-medium",
              formData.emailVerified 
                ? "bg-green-500 hover:bg-green-600 text-white" 
                : "bg-[#0389FF] hover:bg-[#0389FF]/90 text-white"
            )}
          >
            {formData.emailVerified ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Verified
              </>
            ) : isEmailSending ? (
              "Sending..."
            ) : formData.emailVerificationSent ? (
              "Resend"
            ) : (
              "Authenticate"
            )}
          </Button>
        </div>
        {formData.emailVerificationSent && !formData.emailVerified && (
          <p className="text-sm text-amber-600 flex items-center gap-2">
            <Icon icon="mdi:information-outline" className="h-4 w-4" />
            Check your inbox and click the verification link
          </p>
        )}
      </div>

      {/* Mobile with OTP */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <Select value={formData.countryCode} onValueChange={(value) => updateFormData('countryCode', value)}>
            <SelectTrigger className="bg-gray-50 border border-gray-200 h-12 rounded-lg w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COUNTRY_CODES.map((item) => (
                <SelectItem key={item.code} value={item.code}>
                  {item.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Input
            placeholder="Mobile Number *"
            value={formData.mobile}
            onChange={(e) => {
              updateFormData('mobile', e.target.value.replace(/\D/g, '').slice(0, 10));
              updateFormData('mobileVerified', false);
              updateFormData('otpSent', false);
            }}
            className="bg-gray-50 border border-gray-200 h-12 rounded-lg flex-1 focus:border-[#0389FF] focus:ring-[#0389FF]"
            disabled={formData.mobileVerified}
            maxLength={10}
          />
          
          <Button
            type="button"
            onClick={handleSendOtp}
            disabled={isOtpSending || formData.mobileVerified || !formData.mobile || formData.mobile.length < 10}
            className={cn(
              "h-12 px-6 rounded-lg font-medium",
              formData.mobileVerified
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-[#0389FF] hover:bg-[#0389FF]/90 text-white"
            )}
          >
            {formData.mobileVerified ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Verified
              </>
            ) : isOtpSending ? (
              "Sending..."
            ) : formData.otpSent ? (
              "Resend OTP"
            ) : (
              "Send OTP"
            )}
          </Button>
        </div>

        {/* OTP Input */}
        {formData.otpSent && !formData.mobileVerified && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Icon icon="mdi:information-outline" className="h-4 w-4" />
              Enter the OTP sent to your mobile number
            </p>
            <div className="flex gap-3">
              <Input
                placeholder="Enter OTP *"
                value={formData.otp}
                onChange={(e) => updateFormData('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="bg-gray-50 border border-gray-200 h-12 rounded-lg flex-1 focus:border-[#0389FF] focus:ring-[#0389FF]"
                maxLength={6}
              />
              <Button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isOtpVerifying || !formData.otp || formData.otp.length < 4}
                className="h-12 px-6 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white"
              >
                {isOtpVerifying ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ============================================
  // RENDER: STEP 3 - UPLOAD ID
  // ============================================

  const renderUploadId = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Document Type */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Document Type *</label>
          <Select value={formData.documentType} onValueChange={(value) => updateFormData('documentType', value)}>
            <SelectTrigger className="bg-gray-50 border border-gray-200 h-12 rounded-lg">
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {DOCUMENT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <Icon icon="mdi:information-outline" className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">File type: Upload Image Files only (.JPG, PNG)</p>
                <p>File size: Max file size: 5MB.</p>
                <p className="mt-2 text-red-600 font-medium">*Please upload a valid document to proceed.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - File Upload */}
        <div className="space-y-4">
          <div
            onDrop={handleFileDrop}
            onDragOver={(e) => e.preventDefault()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer min-h-[200px] flex flex-col items-center justify-center",
              formData.idCard 
                ? "border-green-400 bg-green-50" 
                : "border-gray-300 bg-gray-50 hover:border-[#0389FF] hover:bg-blue-50"
            )}
          >
            {formData.idCard ? (
              <div className="space-y-3">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-green-700 font-medium">{formData.idCard.name}</p>
                <p className="text-sm text-gray-500">
                  {(formData.idCard.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600">Drag and Drop the file</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleFileUpload}
              className="hidden"
              id="id-upload"
            />
            <label
              htmlFor="id-upload"
              className="flex-1 h-12 border border-[#0389FF] text-[#0389FF] hover:bg-[#0389FF]/5 rounded-lg font-medium flex items-center justify-center cursor-pointer transition-colors"
            >
              {formData.idCard ? 'Update Cover' : 'Upload File'}
            </label>
            {formData.idCard && (
              <Button
                type="button"
                variant="outline"
                onClick={() => updateFormData('idCard', null)}
                className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Re-upload
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================
  // RENDER: STEP 4 - SCHEDULE SESSION
  // ============================================

  const renderScheduleSession = () => {
    const today = new Date();
    const oneMonthFromToday = new Date(today);
    oneMonthFromToday.setMonth(today.getMonth() + 1);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-2 hover:bg-gray-200 rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h3 className="font-semibold text-lg">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-2 hover:bg-gray-200 rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-3 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-xs font-medium text-gray-500 py-2">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {(() => {
                const year = currentMonth.getFullYear();
                const month = currentMonth.getMonth();
                const firstDay = new Date(year, month, 1).getDay();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const days = [];

                for (let i = 0; i < firstDay; i++) {
                  days.push(<div key={`empty-${i}`} className="h-10" />);
                }

                for (let day = 1; day <= daysInMonth; day++) {
                  const date = new Date(year, month, day);
                  const dateStr = formatDateForComparison(date);
                  const todayStr = formatDateForComparison(today);
                  const isBeforeToday = dateStr < todayStr;
                  const isAfterOneMonth = date > oneMonthFromToday;
                  const isDisabled = isBeforeToday || isAfterOneMonth;
                  const isSelected = selectedDate && formatDateForComparison(selectedDate) === dateStr;
                  const isToday = dateStr === todayStr;

                  days.push(
                    <button
                      key={day}
                      disabled={isDisabled}
                      onClick={() => handleDateSelect(date)}
                      className={cn(
                        "h-10 w-10 rounded-full text-sm font-medium transition-all mx-auto",
                        isDisabled 
                          ? "text-gray-300 cursor-not-allowed" 
                          : isSelected
                            ? "bg-[#0389FF] text-white"
                            : isToday
                              ? "bg-blue-100 text-[#0389FF] hover:bg-[#0389FF] hover:text-white"
                              : "text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {day}
                    </button>
                  );
                }

                return days;
              })()}
            </div>
          </div>

          {/* Right Side - Date & Time Selection */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date *</label>
              <Select 
                value={selectedDate ? formatDateForComparison(selectedDate) : ''} 
                onValueChange={handleDropdownDateSelect}
              >
                <SelectTrigger className="bg-gray-50 border border-gray-200 h-12 rounded-lg">
                  <SelectValue placeholder="Choose a date" />
                </SelectTrigger>
                <SelectContent>
                  {generateAvailableDates().map((date) => (
                    <SelectItem key={date.value} value={date.value}>{date.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Available Time *</label>
              <div className="grid grid-cols-2 gap-3">
                {AVAILABLE_TIMES.map((time) => {
                  const isPast = isTimeSlotPast(time);
                  const isSelected = formData.selectedTime === time;
                  
                  return (
                    <button
                      key={time}
                      disabled={isPast}
                      onClick={() => updateFormData('selectedTime', time)}
                      className={cn(
                        "py-3 px-4 rounded-lg text-sm font-medium transition-all border",
                        isPast
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : isSelected
                            ? "bg-[#0389FF] text-white border-[#0389FF]"
                            : "bg-white text-gray-700 border-gray-200 hover:border-[#0389FF] hover:text-[#0389FF]"
                      )}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };


  const renderSuccess = () => (
    <div className="text-center space-y-8">
      {/* Success Card with mint/light green background */}
      <div className="bg-[#E8F5E9] rounded-2xl p-12 md:p-16">
        <div className="flex flex-col items-center space-y-6">
          {/* Green checkmark badge */}
          <Icon icon = "bitcoin-icons:verify-filled" width="75px" height= "75px" className='text-[#5DB900]'></Icon>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Payment Successful
          </h2>
          
          <p className="text-gray-600 max-w-lg text-base md:text-lg leading-relaxed">
            Your session has been scheduled at your selected time. A Meet link has been generated and sent to your email.
          </p>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <Button 
          variant="outline" 
          className="h-12 px-8 rounded-2xl font-medium border-gray-300 hover:bg-gray-50"
          onClick={() => {
            // TODO: Implement add to calendar functionality
            toast.info("Calendar invite will be sent to your email");
          }}
        >
          Add to Calender
        </Button>
        <Button 
          className="h-12 px-8 rounded-2xl font-semibold bg-[#0389FF] hover:bg-[#0389FF]/90 text-white"
          onClick={() => {
            // TODO: Implement download link file
            toast.info("Meet link has been sent to your email");
          }}
        >
          DOWNLOAD LINK FILE
        </Button>
      </div>
    </div>
  );

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50">
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      
      <div className="relative overflow-hidden" style={{ minHeight: '280px' }}>
        {/* Grid background */}
        <div 
          className="absolute inset-0 opacity-50 pointer-events-none z-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(107,114,128,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(107,114,128,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          }}
        />

        <div className="relative z-10">
          <Header />

          {/* Navigation & Title */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Button
              variant="outline"
              onClick={handleBack}
              className="mb-6 h-10 px-4 rounded-full border-[#0389FF] text-[#0389FF] hover:bg-[#0389FF]/5"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="text-center">
              <p className="text-gray-600 mb-2">Book your Session</p>
              <h1 className="text-3xl md:text-4xl font-bold text-[#0389FF]">
                Psychology Counselling
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep <= 4 && renderStepIndicator()}

        <Card className="p-8 shadow-sm border border-gray-200 rounded-xl">
          {currentStep === 1 && renderPersonalInfo()}
          {currentStep === 2 && renderContactInfo()}
          {currentStep === 3 && renderUploadId()}
          {currentStep === 4 && renderScheduleSession()}
          {currentStep === 5 && renderSuccess()}
        </Card>

        {/* Navigation Buttons */}
        {currentStep <= 4 && (
          <div className="mt-8">
            {currentStep === 4 ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Icon icon="mdi:information-outline" className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <p className="text-sm text-amber-800">
                    After payment, your session will be booked and a Meet link will be shared instantly.
                  </p>
                </div>
                <Button 
                  onClick={nextStep}
                  disabled={isPending}
                  className="h-12 px-8 rounded-lg font-semibold bg-[#0389FF] hover:bg-[#0389FF]/90 text-white whitespace-nowrap"
                >
                  {isPending ? "Processing..." : "PROCEED TO PAYMENT"}
                </Button>
              </div>
            ) : (
              <div className="flex justify-end">
                <Button 
                  onClick={nextStep}
                  disabled={isPending}
                  className="h-12 px-8 rounded-lg font-semibold bg-[#0389FF] hover:bg-[#0389FF]/90 text-white"
                >
                  CONTINUE
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#1a365d] text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-4">
              <img 
                src="https://stem-for-society.netlify.app/logo-01.png" 
                alt="STEM for Society" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h3 className="font-bold text-lg">STEM FOR SOCIETY</h3>
              <p className="text-gray-300 text-sm">Let's Innovate, Educate and Impact the world together!</p>
            </div>
          </div>
        </div>
      </footer>
      
      <SharePopup isVisible={isShowing} />
    </div>
  );
};

export default PsychologyBookingFlow;