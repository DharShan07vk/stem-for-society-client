import React, { useCallback, useState } from 'react';
import Header from '@/components1/Header';
import Footer from '@/components1/Footer';
import { Button } from '@/components1/ui/button';
import { Input } from '@/components1/ui/input';
import { Card } from '@/components1/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components1/ui/select';
import { ArrowLeft, Share2, Check, Shield, Leaf, ChevronLeft, ChevronRight, AlertCircle, Calendar, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { useShare } from '@/hooks/useShare';
import { SharePopup } from '@/components1/ui/SharePopup';
import { GenericError, GenericResponse, RazorpayOrderOptions } from '../lib/types';
import { AxiosError } from 'axios';
import { api } from '../lib/api';
import { toast } from 'react-toastify';
import { mutationErrorHandler, initializeRazorpay } from '../lib/utils';
import { RZPY_KEYID } from '../Constants';
import { Checkbox } from '@/components1/ui/checkbox';
import { Icon } from '@iconify/react';

// Backend types
const careerCounsellingServices = [
  "Career choice",
  "CV/Resume prep", 
  "Research Proposal editing",
  "LOR/SOP editing & preparation",
  "Shortlisting Abroad PhD",
  "PG/PhD abroad application guidance",
  "Post Doc Application",
  "Industry jobs",
] as const;

type CareerCounsellingServiceType = (typeof careerCounsellingServices)[number];

type CreatePaymentResponse = {
  orderId: string;
  amount: number;
};

type SendOTPResponse = {
  message: string;
  data: any;
}
type VerifyOTPResponse = {
  message: string;
}

// Backend form data type (what gets sent to backend) - UPDATED
type CareerCounsellingForm = {
  firstName: string;
  lastName?: string;
  email: string;
  mobile: string;
  service?: CareerCounsellingServiceType;
  plan?: "Basics" | "Premium";
  selectedDate?: string; // YYYY-MM-DD format
  selectedTime?: string; // e.g., "4:30 PM"
  studentId?: string; // Added for discount calculation
};

// Frontend form data type (includes UI-only fields)
interface FormData {
  // Backend fields
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  service?: CareerCounsellingServiceType;
  plan?: "Basics" | "Premium";
  careerStage: string;
  concerns: string;
  // New UI fields from design - Step 1
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  isEmailVerified: boolean;
  otp: string;
  otpSent: boolean;
  // New UI fields from design - Step 2
  countryCode: string;
  selectedDate: string;
  selectedTime: string;
  // Step 3 - Plan and Services
  step3SubStep: 'choosePlan' | 'selectService';
  selectedServices: CareerCounsellingServiceType[];
}

// UPDATED: Custom hook for career counselling booking
function useRegisterCareer() {
  return useMutation<
    GenericResponse<CreatePaymentResponse>,
    AxiosError<GenericError>,
    CareerCounsellingForm,
    unknown
  >({
    mutationFn: async (data) => {
      console.log('Sending to backend:', data); // Debug log
      
      const response = await api().post("/enquiry/career", data, {
        headers: {
          "Content-Type": "application/json", // Changed from multipart since no file upload
        },
      });
      return response.data;
    },
    onError: (err) => mutationErrorHandler(err),
  });
}

function useSendEmailOTP() {
  return useMutation<
    SendOTPResponse,
    AxiosError<GenericError>,
    { email: string,
      institutionName: string,
      mobile: string;

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

function useVerifyEmailOtp() {
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

const CareerCounsellingBookingFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const { isShowing, handleShare } = useShare();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { mutateAsync, isPending } = useRegisterCareer();
  const { mutateAsync: sendOTP, isPending: isSendingOTP } = useSendEmailOTP();
  const { mutateAsync: verifyOTP, isPending: isVerifyingOTP } = useVerifyEmailOtp();
  const [otpTimer,setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(true);
  
  
  const [formData, setFormData] = useState<FormData>({
    // Backend fields
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    service: undefined,
    plan: undefined,
    careerStage: '',
    concerns: '',
    
    // New UI-only fields from design - Step 1
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isEmailVerified: false,
    otpSent: false,
    otp:'',
    // Step 2 fields
    countryCode: '+91',
    selectedDate: '',
    selectedTime: '',
    // Step 3 - Plan and Services
    step3SubStep: 'choosePlan',
    selectedServices: [],
  });

  // Dynamic step titles based on step3SubStep
  const getStep3Title = () => {
    return formData.step3SubStep === 'choosePlan' ? 'Choose Plan' : 'Select service';
  };

  const steps = [
    { number: 1, title: 'Personal Information' },
    { number: 2, title: 'Contact Information' },
    { number: 3, title: getStep3Title() },
    { number: 4, title: 'Schedule Session' },
  ];

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

    const handleSendOtp = async () => {
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
      const response = await sendOTP({ 
        email: formData.email,
        institutionName : "Psychology Counselling",
        mobile : formData.mobile 
      });
      if(response.message){
        toast.success("OTP sent! Check your inbox.");
        updateFormData('otpSent', true);
        setOtpTimer(60);
        setCanResendOtp(false);
      }
      else{
        toast.error("Failed to send email otp");
      }
      
    } catch (error) {
      toast.error("Failed to send verification email");
    }
  };

    const handleVerifyOtp = async () => {
      updateFormData('isEmailVerified', true);
    if (!formData.otp || formData.otp.length < 4) {
      toast.error("Please enter the OTP");
      return;
    }

    // try {
    //   const result = await verifyOTP({
    //     email: formData.email,
    //     otp: parseInt(formData.otp)
    //   });
      
    //   if (result.message) {
    //     updateFormData('isEmailVerified', true);
    //     toast.success("Email verified successfully!");
    //   } else {
    //     toast.error("Invalid OTP. Please try again.");
    //   }
    // } catch (error: any) {
    //   if (error.response?.status === 400) {
    //     const errorMessage = error.response?.data?.error;
    //     if (errorMessage === 'OTP has expired') {
    //       toast.error('OTP has expired. Please request a new one.');
    //       updateFormData('otpSent', false);
    //       updateFormData('otp', '');
    //     } else if (errorMessage === 'Invalid OTP') {
    //       toast.error('Invalid OTP. Please check and try again.');
    //     } else {
    //       toast.error('Invalid or expired OTP. Please try again.');
    //     }
    //   } else {
    //     toast.error('OTP verification failed. Please try again.');
    //   }
    // }
  };

  const availableTimes = [
    '10:30 AM', '11:30 AM', '12:30 PM', '3:30 PM', '4:30 PM', '5:30 PM'
  ];

  // FIX: Helper function to check if a time slot is in the past for today
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
        if (formData.mobile.length !== 10) {
          toast.error("Please enter a valid 10-digit mobile number");
          return false;
        }
        if (!formData.isEmailVerified){
          toast.error("Please verify your email address with OTP");
          return false;
        }
        return true;
        
      case 3:
        // Validate based on sub-step
        if (formData.step3SubStep === 'choosePlan') {
          if (!formData.plan) {
            toast.error("Please select a plan to continue");
            return false;
          }
        }
        // Service selection is optional (0 or more services allowed)
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

    if (currentStep === 3) {
      // Handle Step 3 sub-steps
      if (formData.step3SubStep === 'choosePlan') {
        // Move to selectService sub-step
        setFormData(prev => ({ ...prev, step3SubStep: 'selectService' }));
      } else {
        // Move to Step 4
        setCurrentStep(4);
      }
    } else if (currentStep === 4) {
      handlePayment();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 5) {
      // From success page, navigate to home
      navigate('/');
    } else if (currentStep === 3) {
      // Handle Step 3 sub-steps
      if (formData.step3SubStep === 'selectService') {
        // Go back to choosePlan sub-step
        setFormData(prev => ({ ...prev, step3SubStep: 'choosePlan' }));
      } else {
        // Go back to Step 2
        setCurrentStep(2);
      }
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const updateFormData = (field: string, value: string | Date | boolean |null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // FIX: Helper function to format date consistently
  const formatDateForComparison = (date: Date) => {
    return date.getFullYear() + '-' + 
           String(date.getMonth() + 1).padStart(2, '0') + '-' + 
           String(date.getDate()).padStart(2, '0');
  };

  // FIX: Updated handleDateSelect to properly sync with dropdown
  const handleDateSelect = (date: Date) => {
    console.log('Calendar selected:', date.toDateString());
    setSelectedDate(date);
    updateFormData('selectedDate', date);
    
    // Update calendar month to show the selected date
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth()));
  };

  // FIX: Updated handleDropdownDateSelect to properly sync with calendar
  const handleDropdownDateSelect = (value: string) => {
    console.log('Dropdown selected value:', value);
    
    // Parse the date properly to avoid timezone issues
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed in Date constructor
    
    console.log('Dropdown selected date:', date.toDateString());
    setSelectedDate(date);
    updateFormData('selectedDate', date);
    
    // Update calendar month to show the selected date
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth()));
  };

  // FIX: Updated generateAvailableDates to use consistent date formatting
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

  // FIX: Updated calculatePrice function to use actual plan/service pricing
  const calculatePrice = () => {
    let basePrice = 0;
    
    // If on select service sub-step, calculate based on selected services
    if (formData.step3SubStep === 'selectService' && formData.selectedServices.length > 0) {
      basePrice = formData.selectedServices.length * 2000;
    } else if (formData.plan) {
      // Calculate based on plan
      switch (formData.plan) {
        case 'Basics':
          basePrice = 30000; // Standard plan
          break;
        case 'Premium':
          basePrice = 50000; // Premium plan
          break;
        default:
          basePrice = 2000; // Default
      }
    } else {
      basePrice = 2000; // Default price
    }
    
    return basePrice;
  };


  // Payment handler using backend logic
  const handlePayment = useCallback(async () => {
    try {
      const rzrpyInit = await initializeRazorpay();
      if (!rzrpyInit) return toast.error("Unable to initialize payment!");

      // FIXED: Validate required fields before sending
      if (!selectedDate) {
        toast.error("Please select a date for your session");
        return;
      }
      
      if (!formData.selectedTime) {
        toast.error("Please select a time for your session");
        return;
      }

      // Determine service based on selected services (send first one if multiple, backend expects single)
      const selectedService = formData.selectedServices.length > 0 
        ? formData.selectedServices[0] 
        : formData.service;

      // FIXED: Prepare data for backend with date and time included
      const backendData: CareerCounsellingForm = {
        firstName: formData.firstName,
        lastName: formData.lastName || undefined,
        email: formData.email,
        mobile: formData.mobile,
        service: selectedService,
        plan: formData.plan,
        // ADDED: Send selected date and time (following PsychologyBookingFlow pattern)
        selectedDate: selectedDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        selectedTime: formData.selectedTime, // Format as "4:30 PM"
        
      };

      console.log('Submitting backend data:', backendData);

      const data = await mutateAsync(backendData);

      console.log("🚀 ~ handlePayment ~ data:", data);

      if (!data || !data.data) {
        toast.error("Something went wrong in creating payment!");
        return;
      }
      const order = data.data;

      // Use the amount returned from backend (already discounted)
      const options: RazorpayOrderOptions = {
        key: RZPY_KEYID,
        amount: Number(order.amount) * 100, // Backend returns correct discounted amount
        currency: "INR",
        name: "Stem for Society",
        description: formData.service
          ? `Purchase ${formData.service} service`
          : `Purchase ${formData.plan} plan`,
        image: "https://stem-4-society.netlify.app/logo-01.png",
        order_id: order.orderId,
        prefill: {
          name: formData.firstName + " " + (formData.lastName ?? ""),
          email: formData.email,
          contact: formData.mobile,
        },
        async handler(response) {
          toast.success(
            "Payment was made successfully! We will verify the payment and will be in touch with you shortly",
            { autoClose: false, draggable: false },
          );
          setCurrentStep(5); // Move to success step
          try {
            await api().post("/email/send-career-counseling", {
              userEmail: formData.email,
              userName: formData.firstName + " " + (formData.lastName ?? ""),
              counselingType : formData.service || formData.plan,
              amount : Number(order.amount),
              currency : "INR",
              paymentId : response.razorpay_payment_id,
              sessionDate : formData.selectedDate,
            });
            console.log("Email sent successfully");
          } catch (error) {
            console.log("Email Send error ", error);
          }
        },
      };

      // @ts-expect-error dhe chi pae
      const rzp: RazorpayInstance = new Razorpay(options);

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
      console.error("Payment error:", error);
      toast.error("Something went wrong in the payment process");
    }
  }, [formData, selectedDate, mutateAsync]); // ADDED selectedDate to dependencies

   const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-8 mb-12">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
            currentStep === step.number 
              ? "bg-blue-500 text-white" 
              : currentStep > step.number 
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-500"
          )}>
            {currentStep > step.number ? <Check className="h-4 w-4" /> : step.number}
          </div>
          {step.number === currentStep && (
            <div className="text-blue-500 text-sm font-medium ml-3">
              {step.title}
            </div>
          )}
          {index < steps.length - 1 && (
            <div className="w-16 h-px bg-gray-300 ml-3"></div>
          )}
        </div>
      ))}
    </div>
  );

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
          className="bg-[#F1F4F9] border border-gray-200 h-12 rounded-lg focus:border-[#0389FF] focus:ring-[#0389FF]"
        />
        <Input
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => updateFormData('lastName', e.target.value)}
          className="bg-[#F1F4F9] border border-gray-200 h-12 rounded-lg focus:border-[#0389FF] focus:ring-[#0389FF]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Address line 1 *"
          value={formData.addressLine1}
          onChange={(e) => updateFormData('addressLine1', e.target.value)}
          className="bg-[#F1F4F9] border border-gray-200 h-12 rounded-lg focus:border-[#0389FF] focus:ring-[#0389FF]"
        />
        <Input
          placeholder="Address line 2"
          value={formData.addressLine2}
          onChange={(e) => updateFormData('addressLine2', e.target.value)}
          className="bg-[#F1F4F9] border border-gray-200 h-12 rounded-lg focus:border-[#0389FF] focus:ring-[#0389FF]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select 
          value={formData.city} 
          onValueChange={(value) => updateFormData('city', value)}
          disabled={!formData.state}
        >
          <SelectTrigger className="bg-[#F1F4F9] border border-gray-200 h-12 rounded-lg">
            <SelectValue placeholder={formData.state ? "City *" : "City"} />
          </SelectTrigger>
          <SelectContent>
            {getCitiesForState(formData.state).map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select 
          value={formData.state} 
          onValueChange={(value) => {
            updateFormData('state', value);
            updateFormData('city', ''); // Reset city when state changes
          }}
        >
          <SelectTrigger className="bg-[#F1F4F9] border border-gray-200 h-12 rounded-lg">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            {INDIAN_STATES.map((state) => (
              <SelectItem key={state} value={state}>{state}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Input
        placeholder="Pincode *"
        value={formData.pincode}
        onChange={(e) => updateFormData('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
        className="bg-[#F1F4F9] border border-gray-200 h-12 rounded-lg focus:border-[#0389FF] focus:ring-[#0389FF]"
        maxLength={6}
      />
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-5">
      {/* Email with OTP */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <Input
            placeholder="Email *"
            type="email"
            value={formData.email}
            onChange={(e) => {
              updateFormData('email', e.target.value);
              updateFormData('isEmailVerified', false);
              updateFormData('otpSent', false);
              updateFormData('otp', '');
            }}
            className="bg-gray-50 border border-gray-200 h-12 rounded-lg flex-1 focus:border-[#0389FF] focus:ring-[#0389FF]"
            disabled={formData.isEmailVerified}
          />
          <Button
            type="button"
            onClick={handleSendOtp}
            disabled={isSendingOTP || formData.isEmailVerified || !formData.email}
            className={cn(
              "h-12 px-6 rounded-lg font-medium",
              formData.isEmailVerified 
                ? "bg-green-500 hover:bg-green-600 text-white" 
                : "bg-[#0389FF] hover:bg-[#0389FF]/90 text-white"
            )}
          >
            {formData.isEmailVerified ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Verified
              </>
            ) : isSendingOTP ? (
              "Sending..."
            ) : formData.otpSent ? (
              "Resend OTP"
            ) : (
              "Send OTP"
            )}
          </Button>
        </div>

        {/* OTP Input for Email */}
        {formData.otpSent && !formData.isEmailVerified && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Icon icon="mdi:information-outline" className="h-4 w-4" />
              Enter the OTP sent to your email address
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
                disabled={isVerifyingOTP || !formData.otp || formData.otp.length < 4}
                className="h-12 px-6 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white"
              >
                {isVerifyingOTP ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Number (without OTP) */}
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
          }}
          className="bg-gray-50 border border-gray-200 h-12 rounded-lg flex-1 focus:border-[#0389FF] focus:ring-[#0389FF]"
          maxLength={10}
        />
      </div>
    </div>
  );

  // Helper function to toggle service selection
  const toggleServiceSelection = (service: CareerCounsellingServiceType) => {
    setFormData(prev => {
      const isSelected = prev.selectedServices.includes(service);
      if (isSelected) {
        return {
          ...prev,
          selectedServices: prev.selectedServices.filter(s => s !== service)
        };
      } else {
        return {
          ...prev,
          selectedServices: [...prev.selectedServices, service]
        };
      }
    });
  };

  // Calculate total price for selected services
  const calculateServicesPrice = () => {
    const pricePerService = 2000;
    return formData.selectedServices.length * pricePerService;
  };

  const renderCareerBackground = () => {
    // Sub-step 1: Choose Plan
    if (formData.step3SubStep === 'choosePlan') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standard Plan */}
            <div
              onClick={() => updateFormData('plan', 'Basics')}
              className={cn(
                "border rounded-xl p-6 cursor-pointer transition-all hover:shadow-md bg-[#F8F9FA]",
                formData.plan === 'Basics' 
                  ? "border-[#0389FF] ring-2 ring-[#0389FF]/20" 
                  : "border-gray-200"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1",
                  formData.plan === 'Basics' 
                    ? "border-[#0389FF]" 
                    : "border-gray-300"
                )}>
                  {formData.plan === 'Basics' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0389FF]"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Standard</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Essential Skills to Shape a Promising Future
                  </p>
                  <div className="text-2xl font-bold text-gray-900">
                    ₹ 30,000.00 <span className="text-base font-normal text-gray-500">/ Person</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Plan */}
            <div
              onClick={() => updateFormData('plan', 'Premium')}
              className={cn(
                "border rounded-xl p-6 cursor-pointer transition-all hover:shadow-md bg-[#F8F9FA]",
                formData.plan === 'Premium' 
                  ? "border-[#0389FF] ring-2 ring-[#0389FF]/20" 
                  : "border-gray-200"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1",
                  formData.plan === 'Premium' 
                    ? "border-[#0389FF]" 
                    : "border-gray-300"
                )}>
                  {formData.plan === 'Premium' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0389FF]"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Premium</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Comprehensive Training for a Brighter Tomorrow
                  </p>
                  <div className="text-2xl font-bold text-gray-900">
                    ₹ 50,000.00 <span className="text-base font-normal text-gray-500">/ Person</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Sub-step 2: Select Service
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Want a Specific Service?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {careerCounsellingServices.map((service) => {
            const isSelected = formData.selectedServices.includes(service);
            return (
              <div
                key={service}
                onClick={() => toggleServiceSelection(service)}
                className="flex items-center gap-3 p-3 cursor-pointer transition-all"
              >
                <div className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                  isSelected 
                    ? "border-[#0389FF] bg-[#0389FF]" 
                    : "border-gray-300 bg-white"
                )}>
                  {isSelected && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className={cn(
                  "text-sm",
                  isSelected ? "text-[#0389FF] font-medium" : "text-gray-700"
                )}>{service}</span>
              </div>
            );
          })}
        </div>

        {/* Note and Price Section */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          {/* Note Box */}
          <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              Note: ₹2,000 will be added for each selected course. Total updates automatically.
            </p>
          </div>

          {/* Price Box */}
          <div className="bg-[#F8F9FA] border border-gray-200 rounded-lg p-4 min-w-[200px]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-[#0389FF]">
                  ₹ {calculateServicesPrice().toLocaleString()}.00
                </span>
              </div>
              <div className="text-right text-sm text-gray-600">
                Total Price : ({formData.selectedServices.length}) * 2000₹
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderScheduleSession = () => {
    const today = new Date();
    const oneMonthFromToday = new Date(today);
    oneMonthFromToday.setMonth(today.getMonth() + 1);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Calendar */}
          <div className="bg-white rounded-xl p-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </Button>
              <h3 className="font-semibold text-gray-900">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </Button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-xs font-medium text-gray-500">{day}</div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {(() => {
                const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
                const startDate = new Date(firstDay);
                startDate.setDate(startDate.getDate() - firstDay.getDay());
                
                const days = [];
                const currentDate = new Date(startDate);
                
                for (let i = 0; i < 42; i++) {
                  const date = new Date(currentDate);
                  const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
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
                      className={cn(
                        "w-10 h-10 text-sm rounded-full transition-all flex items-center justify-center mx-auto",
                        isDisabled && "text-gray-300 cursor-not-allowed",
                        !isDisabled && isSelected && "bg-[#0389FF] text-white font-semibold",
                        !isDisabled && !isSelected && isToday && "bg-blue-100 text-blue-600 font-semibold",
                        !isDisabled && !isSelected && !isToday && isCurrentMonth && "hover:bg-gray-100 text-gray-900",
                        !isCurrentMonth && "text-gray-300"
                      )}
                      disabled={isDisabled}
                    >
                      {date.getDate()}
                    </button>
                  );
                  
                  currentDate.setDate(currentDate.getDate() + 1);
                }
                
                return days;
              })()}
            </div>
          </div>

          {/* Right Side - Date Dropdown and Time Selection */}
          <div className="space-y-6">
            {/* Date Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of the Session
              </label>
              <Select 
                value={selectedDate ? formatDateForComparison(selectedDate) : ''} 
                onValueChange={handleDropdownDateSelect}
              >
                <SelectTrigger className="w-full h-12 bg-gray-50 border border-gray-200 rounded-lg">
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

            {/* Time Selection */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Available Time</h4>
              
              <div className="grid grid-cols-3 gap-3">
                {availableTimes.map((time) => {
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
                      className={cn(
                        "p-3 text-sm rounded-lg border transition-all",
                        isPastTime && "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50",
                        !isPastTime && isSelected && "bg-[#0389FF] text-white border-[#0389FF]",
                        !isPastTime && !isSelected && "bg-white text-gray-700 border-gray-200 hover:border-[#0389FF] hover:bg-blue-50"
                      )}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Info Message */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <span className="text-yellow-800 text-sm">
                A link pertaining to the scheduled session will be shared with you prior to the session
              </span>
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
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Successful</h2>
          <p className="text-gray-600 max-w-md text-sm">
            Your career counselling session has been scheduled. A link to the session will have been sent to your email!
          </p>
        </div>
      </div>
      
      <div className="flex justify-center gap-4">
        <Button 
          variant="outline" 
          className="px-6 h-12 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
          onClick={() => window.location.href = '/'}
        >
          Add to Calendar
        </Button>
        <Button 
          className="bg-[#0389FF] hover:bg-[#0389FF]/90 text-white px-6 h-12 rounded-lg"
          onClick={() => {
            // Download functionality placeholder
            toast.success("Session details sent to your email!");
          }}
        >
          Download Link Files
        </Button>
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
             <Button
               variant="outline"
               size="sm"
               onClick={handleBack}
               className="flex items-center space-x-2 text-white border-[#00549FB8] rounded-full px-4 hover:bg-[#00549FB8]/90"
               style={{ backgroundColor: '#00549FB8' }}
             >
               <ArrowLeft className="h-4 w-4" />
               <span>Back</span>
             </Button>
              
             <Button
               variant="outline"
               size="sm"
               onClick={handleShare}
               className="flex items-center space-x-2 text-white border-[#00549FB8] rounded-full px-4 hover:bg-[#00549FB8]/90"
               style={{ backgroundColor: '#00549FB8' }}
             >
               <Share2 className="h-4 w-4" />
               <span>Share</span>
             </Button>
           </div>
         </div>

        <div className="text-center mb-8">
          <p className="text-black mb-5">Book your Session</p>
            <h1 className="text-2xl md:text-3xl font-medium text-[#000000] relative inline-block">
              <span className="relative">
                Career Counselling
                <span className="absolute bottom-1 left-0 w-full h-[30%] bg-yellow-300 -z-10"></span>
              </span>
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep <= 4 && renderStepIndicator()}

        <Card className="p-8 shadow-sm">
          {currentStep === 1 && renderPersonalInfo()}
          {currentStep === 2 && renderContactInfo()}
          {currentStep === 3 && renderCareerBackground()}
          {currentStep === 4 && renderScheduleSession()}
          {currentStep === 5 && renderSuccess()}
        </Card>

        {/* Updated button section with Continue button */}
        {currentStep <= 4 && (
          <div className="flex justify-end items-center mt-8">
            {/* Continue/Payment Button */}
            <Button 
              onClick={nextStep}
              className="bg-[#0389FF] hover:bg-[#0389FF]/90 text-white px-8 py-3 text-sm font-semibold h-12 rounded-lg"
              disabled={isPending}
            >
              {currentStep === 4 ? (isPending ? 'PROCESSING...' : 'PROCEED TO PAYMENT') : 'CONTINUE'}
            </Button>
          </div>
        )}
      </div>

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

export default CareerCounsellingBookingFlow;