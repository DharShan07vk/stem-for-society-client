import React, { useState } from 'react';
import Header from '@/components1/Header';
import { Button } from '@/components1/ui/button';
import { Input } from '@/components1/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components1/ui/select';
import { ArrowLeft, Share2, AlertTriangle, CheckCircle, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { api } from "../lib/api";
import { mutationErrorHandler } from "../lib/utils";
import { GenericError, GenericResponse } from "../lib/types";

// Backend types from CampusAmbassador.tsx
type EduType = "UG" | "PG" | "PhD";

type CaForm = {
  firstName: string;
  lastName?: string;
  email: string;
  mobile: string;
  eduType: EduType;
  department: string;
  collegeName: string;
  yearInCollege?: number;
  collegeCity: string;
  dob: Date | null;
  linkedin: string;
};

// Frontend form data type (includes UI-only fields not sent to backend)
interface FormData {
  // Backend fields (matching CaForm)
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  eduType: EduType;
  department: string;
  collegeName: string;
  yearInCollege?: number;
  collegeCity: string;
  dob: Date | null;
  linkedin: string;
  
  // Frontend-only fields (not sent to backend)
  educationLevel: string; // Maps to eduType
  dateOfBirth: string; // Maps to dob (Date object)
  currentYear: string; // Maps to yearInCollege
  linkedinProfile: string; // Maps to linkedin
  country: string;
  mobileNumber: string; // Maps to mobile
  otp: string;
  institutionName: string; // Maps to collegeName
  manualInstitutionName: string; // Maps to collegeName
  addressLine1: string;
  addressLine2: string;
  city: string; // Maps to collegeCity
  state: string;
}

// Custom hook for campus ambassador signup (from CampusAmbassador.tsx)
function useCampusAmbSignUp() {
  const navigate = useNavigate();
  return useMutation<
    GenericResponse,
    AxiosError<GenericError>,
    CaForm,
    unknown
  >({
    mutationFn: async (data) => {
      const response = await api().post("/enquiry/ca", data);
      return response.data;
    },
    onSuccess(data) {
      toast.success(data.message);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    },
    onError: (err) => mutationErrorHandler(err),
  });
}

const CampusAmbassadorBooking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    // Backend fields
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    eduType: 'UG',
    department: '',
    collegeName: '',
    yearInCollege: undefined,
    collegeCity: '',
    dob: null,
    linkedin: '',
    
    // Frontend-only fields
    educationLevel: '',
    dateOfBirth: '',
    currentYear: '',
    linkedinProfile: '',
    country: '',
    mobileNumber: '',
    otp: '',
    institutionName: '',
    manualInstitutionName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: ''
  });

  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const { isPending, mutate } = useCampusAmbSignUp();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Map frontend fields to backend fields
      if (field === 'educationLevel') {
        updated.eduType = value as EduType;
      }
      if (field === 'linkedinProfile') {
        updated.linkedin = value;
      }
      if (field === 'mobileNumber') {
        updated.mobile = value;
      }
      // FIX: Map dateOfBirth to dob properly
      if (field === 'dateOfBirth') {
        updated.dob = value ? new Date(value) : null;
      }
      if (field === 'currentYear') {
        // Extract number from "1st Year", "2nd Year", etc.
        const yearMatch = value.match(/(\d+)/);
        updated.yearInCollege = yearMatch ? parseInt(yearMatch[1]) : undefined;
      }
      if (field === 'institutionName' && value !== 'other') {
        updated.collegeName = value;
      }
      if (field === 'manualInstitutionName') {
        updated.collegeName = value;
      }
      if (field === 'city') {
        updated.collegeCity = value;
      }
      
      return updated;
    });
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (!formData.firstName || !formData.educationLevel || !formData.department || !formData.dateOfBirth || !formData.currentYear || !formData.linkedinProfile) {
          toast.error("Please fill all required fields");
          return false;
        }
        break;
      case 2:
        if (!formData.email || !formData.mobileNumber || !emailVerified || !otpVerified) {
          toast.error("Please complete email verification and OTP verification");
          return false;
        }
        break;
      case 3:
        if (!formData.institutionName && !formData.manualInstitutionName) {
          toast.error("Please select or enter your institution name");
          return false;
        }
        if (!formData.city) {
          toast.error("Please select your city");
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = () => {
    // Prepare data for backend (only send fields that match CaForm)
    const backendData: CaForm = {
      firstName: formData.firstName,
      lastName: formData.lastName || undefined,
      email: formData.email,
      mobile: formData.mobile,
      eduType: formData.eduType,
      department: formData.department,
      collegeName: formData.collegeName,
      yearInCollege: formData.yearInCollege,
      collegeCity: formData.collegeCity,
      dob: formData.dob, // FIX: Use dob directly (already a Date object)
      linkedin: formData.linkedin,
    };

    console.log("🚀 ~ handleSubmit ~ backendData:", backendData);
    mutate(backendData);
  };

  const handleSendOtp = () => {
    if (!formData.mobileNumber) {
      toast.error("Please enter your mobile number");
      return;
    }
    setOtpSent(true);
    toast.success("OTP sent to your mobile number");
  };

  const handleVerifyOtp = () => {
    if (!formData.otp) {
      toast.error("Please enter the OTP");
      return;
    }
    setOtpVerified(true);
    toast.success("Mobile number verified successfully");
  };

  const handleEmailAuth = () => {
    if (!formData.email) {
      toast.error("Please enter your email address");
      return;
    }
    setEmailVerified(true);
    toast.success("Email verified successfully");
  };

  const stepTitles = [
    'Personal Information',
    'Contact Information', 
    'Institution Information'
  ];

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-8 mb-12">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step === currentStep 
              ? 'bg-blue-500 text-white' 
              : step < currentStep 
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500'
          }`}>
            {step < currentStep ? <Check className="h-4 w-4" /> : step}
          </div>
          {step === currentStep && (
            <div className="text-blue-500 text-sm font-medium ml-3">
              {stepTitles[step - 1]}
            </div>
          )}
          {step < 3 && (
            <div className="w-16 h-px bg-gray-300 ml-3"></div>
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="First Name *"
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          className="h-12 bg-gray-100 border-0 placeholder:text-gray-500"
          required
        />
        <Input
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          className="h-12 bg-gray-100 border-0 placeholder:text-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select onValueChange={(value) => handleInputChange('educationLevel', value)}>
          <SelectTrigger className="h-12 bg-gray-100 border-0 text-gray-500">
            <SelectValue placeholder="Education Level *" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UG">Undergraduate (UG)</SelectItem>
            <SelectItem value="PG">Postgraduate (PG)</SelectItem>
            <SelectItem value="PhD">PhD</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleInputChange('department', value)}>
          <SelectTrigger className="h-12 bg-gray-100 border-0 text-gray-500">
            <SelectValue placeholder="Department *" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Computer Science">Computer Science</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Biology">Biology</SelectItem>
            <SelectItem value="Chemistry">Chemistry</SelectItem>
            <SelectItem value="Physics">Physics</SelectItem>
            <SelectItem value="Mathematics">Mathematics</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="date"
          placeholder="Date of Birth *"
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          className="h-12 bg-gray-100 border-0 placeholder:text-gray-500"
          required
        />

        <Select onValueChange={(value) => handleInputChange('currentYear', value)}>
          <SelectTrigger className="h-12 bg-gray-100 border-0 text-gray-500">
            <SelectValue placeholder="Your Current Year *" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1st Year">1st Year</SelectItem>
            <SelectItem value="2nd Year">2nd Year</SelectItem>
            <SelectItem value="3rd Year">3rd Year</SelectItem>
            <SelectItem value="4th Year">4th Year</SelectItem>
            <SelectItem value="Graduate">Graduate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Input
          placeholder="LinkedIn Profile *"
          value={formData.linkedinProfile}
          onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
          className="h-12 bg-gray-100 border-0 placeholder:text-gray-500"
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="relative">
        <Input
          placeholder="Email *"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="h-12 bg-gray-100 border-0 placeholder:text-gray-500 pr-12"
          required
        />
        {emailVerified && (
          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
          <span className="text-yellow-800 text-sm">
            {emailVerified ? 'Email verified successfully!' : 'Check your inbox and click the verification link.'}
          </span>
        </div>
        <Button 
          className={`px-6 ${emailVerified ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          onClick={handleEmailAuth}
          disabled={emailVerified}
        >
          {emailVerified ? 'Verified' : 'Authenticate'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select onValueChange={(value) => handleInputChange('country', value)}>
          <SelectTrigger className="h-12 bg-gray-100 border-0 text-gray-500">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in">India</SelectItem>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
            <SelectItem value="ca">Canada</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="md:col-span-2">
          <Input
            placeholder="Mobile Number *"
            value={formData.mobileNumber}
            onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
            className="h-12 bg-gray-100 border-0 placeholder:text-gray-500"
            required
          />
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
          <span className="text-yellow-800 text-sm">
            {otpVerified ? 'Mobile number verified!' : 'Enter the OTP sent to your mobile number.'}
          </span>
        </div>
        <Button 
          className={`px-6 ${otpSent ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          onClick={handleSendOtp}
          disabled={otpSent}
        >
          {otpSent ? 'OTP Sent' : 'Send OTP'}
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Enter OTP *"
          value={formData.otp}
          onChange={(e) => handleInputChange('otp', e.target.value)}
          className="h-12 bg-gray-100 border-0 placeholder:text-gray-500 flex-1"
          disabled={!otpSent}
        />
        <Button 
          className={`px-6 ${otpVerified ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          onClick={handleVerifyOtp}
          disabled={!otpSent || otpVerified}
        >
          {otpVerified ? 'Verified' : 'Verify'}
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <Select onValueChange={(value) => handleInputChange('institutionName', value)}>
          <SelectTrigger className="w-full h-12 bg-gray-100 border-0 text-gray-500">
            <SelectValue placeholder="Select Institution Name *" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MIT">MIT</SelectItem>
            <SelectItem value="Stanford University">Stanford University</SelectItem>
            <SelectItem value="Harvard University">Harvard University</SelectItem>
            <SelectItem value="IIT Delhi">IIT Delhi</SelectItem>
            <SelectItem value="IIT Bombay">IIT Bombay</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(formData.institutionName === 'other' || !formData.institutionName) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <Input
            placeholder="Enter the Institution Name *"
            value={formData.manualInstitutionName}
            onChange={(e) => handleInputChange('manualInstitutionName', e.target.value)}
            className="h-12 bg-gray-100 border-0 placeholder:text-gray-500"
          />
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
            <span className="text-yellow-800 text-xs">
              Select your institution from list or enter manually if not listed.
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Address Line 1"
          value={formData.addressLine1}
          onChange={(e) => handleInputChange('addressLine1', e.target.value)}
          className="h-12 bg-gray-100 border-0 placeholder:text-gray-500"
        />
        <Input
          placeholder="Address Line 2"
          value={formData.addressLine2}
          onChange={(e) => handleInputChange('addressLine2', e.target.value)}
          className="h-12 bg-gray-100 border-0 placeholder:text-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select onValueChange={(value) => handleInputChange('city', value)}>
          <SelectTrigger className="h-12 bg-gray-100 border-0 text-gray-500">
            <SelectValue placeholder="City *" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mumbai">Mumbai</SelectItem>
            <SelectItem value="Delhi">Delhi</SelectItem>
            <SelectItem value="Bangalore">Bangalore</SelectItem>
            <SelectItem value="Chennai">Chennai</SelectItem>
            <SelectItem value="Kolkata">Kolkata</SelectItem>
            <SelectItem value="Pune">Pune</SelectItem>
            <SelectItem value="Hyderabad">Hyderabad</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleInputChange('state', value)}>
          <SelectTrigger className="h-12 bg-gray-100 border-0 text-gray-500">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Maharashtra">Maharashtra</SelectItem>
            <SelectItem value="Delhi">Delhi</SelectItem>
            <SelectItem value="Karnataka">Karnataka</SelectItem>
            <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
            <SelectItem value="West Bengal">West Bengal</SelectItem>
            <SelectItem value="Telangana">Telangana</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Application Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">{formData.firstName} {formData.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Education:</span>
            <span className="font-medium">{formData.eduType} - {formData.department}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Institution:</span>
            <span className="font-medium">{formData.collegeName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{formData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date of Birth:</span>
            <span className="font-medium">{formData.dob ? formData.dob.toLocaleDateString() : 'Not provided'}</span>
          </div>
        </div>
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
              <Link to="/campus-ambassador">
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
                className="flex items-center space-x-2 bg-[#0389FF] text-white border-[#0389FF] rounded-full px-4 hover:bg-[#0389FF]/90"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-xl font-medium text-gray-900 mb-2">Apply for</h1>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              <span className="text-yellow-500">Campus Ambassador Program</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStepIndicator()}

        <div className="bg-white rounded-2xl p-8 shadow-sm min-h-96">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        <div className="flex justify-between items-center mt-8">
          <Button 
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold"
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            BACK
          </Button>

          <Button 
            onClick={nextStep}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 font-medium"
            disabled={isPending}
          >
            {currentStep === 3 ? (isPending ? 'SUBMITTING...' : 'SUBMIT APPLICATION') : 'CONTINUE'}
          </Button>
        </div>
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
    </div>
  );
};

export default CampusAmbassadorBooking;
