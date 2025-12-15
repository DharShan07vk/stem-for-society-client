import React, { useCallback, useState } from 'react';
import Header from '@/components1/Header';
import Footer from '@/components1/Footer';
import { Button } from '@/components1/ui/button';
import { Input } from '@/components1/ui/input';
import { Card } from '@/components1/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components1/ui/select';
import { ArrowLeft, Share2, Check, Shield, Leaf, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  age: string;
  studentId: string;
  selectedDate: string; // Changed from string to Date for UI
  selectedTime: string;
  switchPlanOrService: "plans" | "services";
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

const CareerCounsellingBookingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('');
  const { isShowing, handleShare } = useShare();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { mutateAsync, isPending } = useRegisterCareer();
  
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
    
    // Frontend-only fields
    age: '',
    studentId: '',
    selectedDate: '',
    selectedTime: '',
    switchPlanOrService: 'services',
  });

  const steps = [
    { number: 1, title: 'Personal Information' },
    { number: 2, title: 'Contact Information' },
    { number: 3, title: 'Career Background' },
    { number: 4, title: 'Schedule Session' },
  ];

  const availableTimes = [
    '10:30 AM', '11:30 AM', '12:30 PM', '3:30 PM', '4:30 PM', '5:30 PM'
  ];

  const careerStages = [
    'Student - Choosing Major',
    'Fresh Graduate',
    'Early Career (0-3 years)',
    'Mid Career (3-7 years)',
    'Senior Career (7+ years)',
    'Career Change',
    'Returning to Work'
  ];

  const concerns = [
    'Career Path Selection',
    'Job Search Strategy',
    'Interview Preparation',
    'Skill Development',
    'Work-Life Balance',
    'Career Advancement',
    'Industry Transition',
    'Entrepreneurship'
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

  const nextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!formData.firstName || !formData.age) {
        toast.error("Please fill all required fields");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.email || !formData.mobile) {
        toast.error("Please fill all required fields");
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.careerStage || !formData.concerns) {
        toast.error("Please fill all required fields");
        return;
      }
      if (formData.switchPlanOrService === 'services' && !formData.service) {
        toast.error("Please select a service");
        return;
      }
      if (formData.switchPlanOrService === 'plans' && !formData.plan) {
        toast.error("Please select a plan");
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
      
      // FIX: Check if selected time is not in the past for today
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

  const updateFormData = (field: string, value: string | Date | null) => {
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
    
    // Determine base price based on selection
    if (formData.switchPlanOrService === 'plans') {
      switch (formData.plan) {
        case 'Basics':
          basePrice = 30000; // Standard plan from CareerCounselling.tsx
          break;
        case 'Premium':
          basePrice = 50000; // Premium plan from CareerCounselling.tsx
          break;
        default:
          basePrice = 2000; // Default if no plan selected
      }
    } else if (formData.switchPlanOrService === 'services') {
      basePrice = 2000; // All individual services are ₹2,000
    } else {
      basePrice = 2000; // Default price
    }
    
    // Apply student discount if student ID is provided (75% off = pay 25%)
    return formData.studentId ? Math.round(basePrice * 0.25) : basePrice;
  };

  // FIX: Helper function to get pricing display text
  const getPricingInfo = () => {
    if (formData.switchPlanOrService === 'services') {
      return {
        title: formData.service || 'Individual Service',
        description: '45-minute career guidance session'
      };
    } else if (formData.switchPlanOrService === 'plans') {
      const planInfo = {
        'Basics': {
          title: 'Standard Plan',
          description: 'Comprehensive career guidance package'
        },
        'Premium': {
          title: 'Premium Plan', 
          description: 'Complete career transformation program'
        }
      };
      
      const selected = formData.plan;
      return selected ? planInfo[selected] : {
        title: 'Plan Selection',
        description: 'Choose a comprehensive plan'
      };
    }
    
    return {
      title: 'Career Counselling',
      description: '45-minute career guidance session'
    };
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

      // FIXED: Prepare data for backend with date and time included
      const backendData: CareerCounsellingForm = {
        firstName: formData.firstName,
        lastName: formData.lastName || undefined,
        email: formData.email,
        mobile: formData.mobile,
        service: formData.switchPlanOrService === 'services' ? formData.service : undefined,
        plan: formData.switchPlanOrService === 'plans' ? formData.plan : undefined,
        // ADDED: Send selected date and time (following PsychologyBookingFlow pattern)
        selectedDate: selectedDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        selectedTime: formData.selectedTime, // Format as "4:30 PM"
        studentId: formData.studentId || undefined, // For discount calculation
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
          ? `Purchase ${formData.service} service${formData.studentId ? ' (Student Discount Applied)' : ''}`
          : `${formData.plan} plan purchase${formData.studentId ? ' (Student Discount Applied)' : ''}`,
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
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
            currentStep === step.number 
              ? "bg-[#0389FF] text-white" 
              : currentStep > step.number 
                ? "bg-[#0389FF] text-white"
                : "bg-gray-200 text-gray-600"
          )}>
            {step.number}
          </div>
          {currentStep === step.number && (
            <span className="ml-3 text-gray-700 font-medium">{step.title}</span>
          )}
          {index < steps.length - 1 && (
            <div className="w-16 h-0.5 bg-gray-200 mx-4"></div>
          )}
        </div>
      ))}
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="First Name *"
          value={formData.firstName}
          onChange={(e) => updateFormData('firstName', e.target.value)}
          className="bg-gray-100 border-0 h-12"
          required
        />
        <Input
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => updateFormData('lastName', e.target.value)}
          className="bg-gray-100 border-0 h-12"
        />
      </div>
      <Input
        placeholder="Age *"
        value={formData.age}
        onChange={(e) => updateFormData('age', e.target.value)}
        className="bg-gray-100 border-0 h-12"
        required
      />
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center space-x-3">
        <Shield className="h-5 w-5 text-yellow-600" />
        <span className="text-yellow-800 font-medium">Your identity will be 100% confidential</span>
      </div>
      
      <Input
        placeholder="Email *"
        type="email"
        value={formData.email}
        onChange={(e) => updateFormData('email', e.target.value)}
        className="bg-gray-100 border-0 h-12"
        required
      />
      <Input
        placeholder="Mobile Number *"
        value={formData.mobile}
        onChange={(e) => updateFormData('mobile', e.target.value)}
        className="bg-gray-100 border-0 h-12"
        required
      />
      <Input
        placeholder="Student ID (Optional - for discount)"
        value={formData.studentId}
        onChange={(e) => updateFormData('studentId', e.target.value)}
        className="bg-gray-100 border-0 h-12"
      />
      
      {formData.studentId && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
          <Leaf className="h-5 w-5 text-green-600 mt-0.5" />
          <div className="text-green-800 text-sm">
            <p className="font-medium">75% fee waived off with valid student ID!</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderCareerBackground = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Tell us about your career journey</h2>
      
      <Select value={formData.careerStage} onValueChange={(value) => updateFormData('careerStage', value)}>
        <SelectTrigger className="bg-gray-100 border-0 h-12">
          <SelectValue placeholder="Select your career stage *" />
        </SelectTrigger>
        <SelectContent>
          {careerStages.map((stage) => (
            <SelectItem key={stage} value={stage}>{stage}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={formData.concerns} onValueChange={(value) => updateFormData('concerns', value)}>
        <SelectTrigger className="bg-gray-100 border-0 h-12">
          <SelectValue placeholder="What would you like guidance on? *" />
        </SelectTrigger>
        <SelectContent>
          {concerns.map((concern) => (
            <SelectItem key={concern} value={concern}>{concern}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Service/Plan Selection */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <Button
            type="button"
            variant={formData.switchPlanOrService === 'services' ? 'default' : 'outline'}
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                switchPlanOrService: 'services',
                plan: undefined
              }));
            }}
            className="flex-1"
          >
            Individual Services (₹2,000)
          </Button>
          <Button
            type="button"
            variant={formData.switchPlanOrService === 'plans' ? 'default' : 'outline'}
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                switchPlanOrService: 'plans',
                service: undefined
              }));
            }}
            className="flex-1"
          >
            Comprehensive Plans
          </Button>
        </div>

        {formData.switchPlanOrService === 'services' && (
          <Select 
            value={formData.service} 
            onValueChange={(value) => updateFormData('service', value as CareerCounsellingServiceType)}
          >
            <SelectTrigger className="bg-gray-100 border-0 h-12">
              <SelectValue placeholder="Choose from a list of services *" />
            </SelectTrigger>
            <SelectContent>
              {careerCounsellingServices.map((service) => (
                <SelectItem key={service} value={service}>{service}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {formData.switchPlanOrService === 'plans' && (
          <Select 
            value={formData.plan} 
            onValueChange={(value) => updateFormData('plan', value as "Basics" | "Premium")}
          >
            <SelectTrigger className="bg-gray-100 border-0 h-12">
              <SelectValue placeholder="Choose from our plans *" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Basics">Standard Plan - ₹30,000</SelectItem>
              <SelectItem value="Premium">Premium Plan - ₹50,000</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* FIX: Updated pricing display with dynamic content */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-3xl font-bold text-blue-600 mb-2">
          ₹{calculatePrice().toLocaleString()}.00
        </div>
        <div className="text-gray-700 font-medium mb-1">
          {getPricingInfo().title}
        </div>
        <div className="text-gray-600 text-sm">
          {getPricingInfo().description}
        </div>
        
        {/* Show original price with student discount */}
        {formData.studentId && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-green-700 font-medium">🎓 Student Discount (75% OFF)</span>
              <div className="text-right">
                <div className="text-gray-500 line-through text-sm">
                  ₹{(calculatePrice() / 0.25).toLocaleString()}.00
                </div>
                <div className="text-green-600 font-bold">
                  You Save: ₹{((calculatePrice() / 0.25) - calculatePrice()).toLocaleString()}.00
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Show breakdown for plans */}
        {formData.switchPlanOrService === 'plans' && formData.plan && (
          <div className="mt-3 text-xs text-gray-500">
            {formData.plan === 'Basics' && '• Multiple sessions • Progress tracking • Resource materials'}
            {formData.plan === 'Premium' && '• Everything in Standard • Interview prep • Funding guidance • Industry networking'}
          </div>
        )}
      </div>
    </div>
  );

  const renderScheduleSession = () => {
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
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-4 text-center text-sm text-gray-500">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2">{day}</div>
              ))}
            </div>

            {/* FIX: Updated calendar grid with better date comparison */}
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
                  
                  // FIX: Better date comparison for selection
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

          {/* Right side - existing code remains the same */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              {/* FIX: Updated Select with proper value synchronization */}
              <Select 
                value={selectedDate ? formatDateForComparison(selectedDate) : ''} 
                onValueChange={handleDropdownDateSelect}
              >
                <SelectTrigger className="w-full h-12 bg-gray-100 border-0 text-gray-700">
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
              
              {/* FIX: Debug info (remove in production) */}
              {selectedDate && (
                <div className="mt-2 text-xs text-gray-500">
                  Selected: {selectedDate.toDateString()} | Formatted: {formatDateForComparison(selectedDate)}
                </div>
              )}
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
                      className={`p-3 text-sm rounded-lg border transition-colors ${
                        isPastTime
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                          : isSelected
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-white'
                      }`}
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
               availableTimes.every(time => isTimeSlotPast(time)) && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
                  <p className="text-orange-800 text-sm text-center">
                    ⏰ No more time slots available for today. Please select tomorrow or a future date.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
              <Shield className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <span className="text-yellow-800 text-sm">
                After payment, your session will be booked and a Meet link will be shared instantly.
              </span>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <span className="text-yellow-800 text-sm">
                We will be contacting you within 48 hrs of payment confirmation.
              </span>
            </div>
          </div>
        </div>

        {/* Payment summary remains the same */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h4>
          
          <div className="space-y-3">
            {/* FIX: Show selected date in payment summary */}
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
              <span className="font-medium">
                {formData.selectedTime || 'Not selected'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Selected Service/Plan:</span>
              <span className="font-medium">
                {formData.switchPlanOrService === 'services' 
                  ? formData.service 
                  : `${formData.plan} Plan`}
              </span>
            </div>
            
            {formData.studentId && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Original Price:</span>
                  <span className="line-through text-gray-500">
                    ₹{(calculatePrice() / 0.25).toLocaleString()}.00
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Student Discount (75%):</span>
                  <span className="text-green-600 font-medium">
                    -₹{((calculatePrice() / 0.25) - calculatePrice()).toLocaleString()}.00
                  </span>
                </div>
              </>
            )}
            
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Amount to Pay:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{calculatePrice().toLocaleString()}.00
                </span>
              </div>
            </div>
          </div>
          
          {formData.studentId && (
            <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm text-center">
                🎓 Congratulations! You're saving ₹{((calculatePrice() / 0.25) - calculatePrice()).toLocaleString()} with your student discount!
              </p>
            </div>
          )}
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
            Your career counselling session has been scheduled. A secure meeting link will be sent to your email.
          </p>
          
          {/* ADDED: Show booked session details */}
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
                <strong>Service:</strong> {formData.switchPlanOrService === 'services' 
                  ? formData.service 
                  : `${formData.plan} Plan`}
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
             <Link to="/career-counselling">
               <Button
                 variant="outline"
                 size="sm"
                 className="flex items-center space-x-2 text-white border-[#00549FB8] rounded-full px-4 hover:bg-[#00549FB8]/90"
                 style={{ backgroundColor: '#00549FB8' }}
               >
                 <ArrowLeft className="h-4 w-4" />
                 <span>Back</span>
               </Button>
             </Link>
              
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
            <h1 className="text-xl font-medium text-gray-600 mb-2">Book your Session</h1>
            <h2 className="text-4xl font-bold text-gray-900">
              <span className="text-blue-500">Career</span> Counselling
            </h2>
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

        {/* Updated button section with Back and Continue buttons */}
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
              className="bg-[#0389FF] hover:bg-[#0389FF]/90 text-white px-8 py-3 text-lg font-semibold h-12"
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