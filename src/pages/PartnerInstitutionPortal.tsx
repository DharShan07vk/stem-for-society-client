import { Button } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { usePartner } from "@/lib/hooks";
import { GenericError, GenericResponse } from "../lib/types";
import { mutationErrorHandler } from "../lib/utils";
import { Input } from "@/components1/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components1/ui/select";
import { Checkbox } from "@/components1/ui/checkbox";
import SignupLayout from "@/components1/ui/SignupLayout";

// ===== UPDATED TYPES WITH NEW FIELDS =====
type PartnerInstitutionForm = {
  companyName: string;
  email: string;
  gst: string;
  instructorName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  acceptTerms: boolean;
  password: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  signUpAs: "institution";
  trainingTopics?: string[];
  domain?: string;
  otp: string;
  topic: string;
  sector: string;
  logo?: File | null;
  digitalSign?: File | null;
};

// ===== HOOK FOR BACKEND CONNECTIVITY =====
function usePartnerInstitutionSignUp() {
  const navigate = useNavigate();
  return useMutation<
    GenericResponse,
    AxiosError<GenericError>,
    FormData,
    unknown
  >({
    mutationFn: async (formData: FormData) => {
      const response = await api().post("/partner/auth/register", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Registration successful!");
      navigate("/partner-signin");
    },
    onError: (err) => mutationErrorHandler(err),
  });
}

const PartnerInstitutionPortal = () => {
  const { user } = usePartner();
  const [currentStep, setCurrentStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState<PartnerInstitutionForm>({
    companyName: "",
    email: "",
    gst: "",
    instructorName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    acceptTerms: false,
    password: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    signUpAs: "institution",
    trainingTopics: [],
    domain: "",
    otp: "",
    topic: "",
    sector: "",
    logo: null,
    digitalSign: null,
  });

  const registerMutation = usePartnerInstitutionSignUp();

  // Redirect if user is already logged in
  if (user) return <Navigate to={"/partner"} />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Update the handleFileChange function to include file validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'logo' | 'digitalSign') => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Check file type - only allow PNG and JPG
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Only PNG and JPG files are allowed for ${fieldName === 'logo' ? 'company logo' : 'digital signature'}`);
        // Clear the input
        e.target.value = '';
        return;
      }
      
      // Check file size (optional - limit to 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error(`File size must be less than 5MB`);
        // Clear the input
        e.target.value = '';
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [fieldName]: file }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, acceptTerms: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!formData.acceptTerms) {
      return toast.error("Accept terms to continue!");
    }
    
    if (!formData.logo) {
      return toast.error("Please upload company logo");
    }
    
    if (!formData.digitalSign) {
      return toast.error("Please upload digital signature");
    }
    
    if (otpSent && !formData.otp) {
      return toast.error("Please enter OTP");
    }
    
    if (!formData.email || !formData.password || !formData.phone || !formData.topic || !formData.sector) {
      return toast.error("Please fill in all required fields");
    }
    
    // Create FormData object for file uploads
    const submitData = new FormData();
    
    // Append all form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'logo' || key === 'digitalSign') {
        if (value instanceof File) {
          submitData.append(key, value);
        }
      } else if (key === 'trainingTopics' && Array.isArray(value)) {
        submitData.append(key, JSON.stringify(value));
      } else if (value !== null && value !== undefined) {
        submitData.append(key, String(value));
      }
    });
    
    registerMutation.mutate(submitData);
  };

  // Update the form validation in handleNext function
  const handleNext = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!formData.companyName || !formData.gst || !formData.instructorName || !formData.logo || !formData.digitalSign) {
        toast.error("Please fill in all required fields and upload both logo and digital signature");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.country || !formData.state || !formData.city || !formData.pincode || !formData.addressLine1) {
        toast.error("Please fill in all required address fields");
        return;
      }
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const sendOTP = () => {
    if (formData.phone && formData.phone.length >= 10) {
      setOtpSent(true);
      toast.info("OTP sent to your mobile number");
      console.log("Sending OTP to:", formData.phone);
    } else {
      toast.error("Please enter a valid mobile number");
    }
  };

  const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) => (
    <div className="flex justify-center mb-6">
      <div className="flex items-center space-x-4">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                isActive 
                  ? 'bg-[#0389FF] text-white' 
                  : isCompleted 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < totalSteps && (
                <div className={`w-16 h-0.5 ${
                  isCompleted || stepNumber === currentStep 
                    ? 'bg-[#0389FF] bg-opacity-30' 
                    : 'bg-gray-300'
                }`}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-right text-sm text-gray-600 mb-4">
              Company Information
            </div>
            
            <div>
              <Input
                placeholder="Enter your company name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="bg-white/80 rounded-xl"
                required
              />
            </div>
            
            <div>
              <Input
                placeholder="Enter your GST number"
                name="gst"
                value={formData.gst}
                onChange={handleChange}
                className="bg-white/80 rounded-xl"
                required
              />
            </div>
            
            <div>
              <Input
                placeholder="Enter your name"
                name="instructorName"
                value={formData.instructorName}
                onChange={handleChange}
                className="bg-white/80 rounded-xl"
                required
              />
            </div>
            
            {/* Company Logo Upload - UPDATED */}
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Logo <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 block">Only PNG and JPG files allowed (Max: 5MB)</span>
              </label>
              <div className="flex items-center justify-between bg-white/80 rounded-xl border border-gray-300 p-3">
                <div className="flex-1">
                  {formData.logo ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-green-600 font-medium">
                        {formData.logo.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({(formData.logo.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">
                      No file selected
                    </span>
                  )}
                </div>
                <div className="ml-3">
                  <label className="cursor-pointer bg-[#0389FF] hover:bg-[#0389FF]/90 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors">
                    Choose File
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,image/png,image/jpg,image/jpeg"
                      onChange={(e) => handleFileChange(e, 'logo')}
                      className="hidden"
                      required
                    />
                  </label>
                </div>
              </div>
            </div>
            
            {/* Digital Signature Upload - UPDATED */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Digital Signature <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 block">Only PNG and JPG files allowed (Max: 5MB)</span>
              </label>
              <div className="flex items-center justify-between bg-white/80 rounded-xl border border-gray-300 p-3">
                <div className="flex-1">
                  {formData.digitalSign ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-green-600 font-medium">
                        {formData.digitalSign.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({(formData.digitalSign.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">
                      No file selected
                    </span>
                  )}
                </div>
                <div className="ml-3">
                  <label className="cursor-pointer bg-[#0389FF] hover:bg-[#0389FF]/90 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors">
                    Choose File
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,image/png,image/jpg,image/jpeg"
                      onChange={(e) => handleFileChange(e, 'digitalSign')}
                      className="hidden"
                      required
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-right text-sm text-gray-600 mb-4">
              Address Details
            </div>
            
            <div>
              <Select value={formData.country} onValueChange={(value) => handleSelectChange('country', value)}>
                <SelectTrigger className="bg-white/80 rounded-xl">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="India" className="bg-white text-black rounded-xl 
            data-[highlighted]:bg-white data-[highlighted]:text-black data-[highlighted]:rounded-xl 
            data-[state=checked]:bg-[#0389FF]">India</SelectItem>
                  <SelectItem value="USA" className="bg-white text-black rounded-xl 
            data-[highlighted]:bg-white data-[highlighted]:text-black data-[highlighted]:rounded-xl 
            data-[state=checked]:bg-[#0389FF]">United States</SelectItem>
                  <SelectItem value="UK" className="bg-white text-black rounded-xl 
            data-[highlighted]:bg-white data-[highlighted]:text-black data-[highlighted]:rounded-xl 
            data-[state=checked]:bg-[#0389FF]   ">United Kingdom</SelectItem>
                  <SelectItem value="Canada" className="bg-white text-black rounded-xl 
            data-[highlighted]:bg-white data-[highlighted]:text-black data-[highlighted]:rounded-xl 
            data-[state=checked]:bg-[#0389FF] ">Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={formData.state} onValueChange={(value) => handleSelectChange('state', value)}>
                <SelectTrigger className="bg-white/80 rounded-xl">
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="maharashtra" className="bg-white text-black rounded-xl 
            data-[highlighted]:bg-white data-[highlighted]:text-black data-[highlighted]:rounded-xl 
            data-[state=checked]:bg-[#0389FF]">Maharashtra</SelectItem>
                  <SelectItem value="karnataka" className="bg-white text-black rounded-xl 
            data-[highlighted]:bg-white data-[highlighted]:text-black data-[highlighted]:rounded-xl 
            data-[state=checked]:bg-[#0389FF]">Karnataka</SelectItem>
                  <SelectItem value="tamil-nadu" className="bg-white text-black rounded-xl 
            data-[highlighted]:bg-white data-[highlighted]:text-black data-[highlighted]:rounded-xl 
            data-[state=checked]:bg-[#0389FF]">Tamil Nadu</SelectItem>
                  <SelectItem value="gujarat" className="bg-white text-black rounded-xl 
            data-[highlighted]:bg-white data-[highlighted]:text-black data-[highlighted]:rounded-xl 
            data-[state=checked]:bg-[#0389FF]">Gujarat</SelectItem>
                  <SelectItem value="delhi" className="bg-white text-black rounded-xl 
            data-[highlighted]:bg-white data-[highlighted]:text-black data-[highlighted]:rounded-xl 
            data-[state=checked]:bg-[#0389FF]">Delhi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Enter your city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="bg-white/80 rounded-xl flex-1"
                required
              />
              <Input
                placeholder="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="bg-white/80 rounded-xl w-32"
                required
              />
            </div>
            
            <div>
              <Input
                placeholder="Address Line 1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                className="bg-white/80 rounded-xl"
                required
              />
            </div>
            
            <div>
              <Input
                placeholder="Address Line 2 (Optional)"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                className="bg-white/80 rounded-xl"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-right text-sm text-gray-600 mb-4">
              Account & Professional Details
            </div>

            <div>
              <Input
                placeholder="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-white/80 rounded-xl"
                required
              />
            </div>

            <div>
              <Input
                placeholder="Create Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="bg-white/80 rounded-xl"
                required
              />
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Mobile Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="bg-white/80 rounded-xl flex-1"
                required
              />
              <Button 
                type="button" 
                onClick={sendOTP}
                className="bg-[#0389FF] hover:bg-[#0389FF]/90 rounded-xl"
                disabled={!formData.phone || formData.phone.length < 10}
              >
                {otpSent ? "Resend OTP" : "Send OTP"}
              </Button>
            </div>
            
            {otpSent && (
              <div className="bg-yellow-100 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm">⚠️ OTP sent to {formData.phone}</span>
              </div>
            )}
            
            {otpSent && (
              <div>
                <Input
                  placeholder="Enter 6-digit OTP"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  className="bg-white/80 rounded-xl"
                  maxLength={6}
                  required
                />
              </div>
            )}

            <div>
              <Select value={formData.topic} onValueChange={(value) => handleSelectChange('topic', value)}>
                <SelectTrigger className="bg-white/80 rounded-xl">
                  <SelectValue placeholder="Which topic do you want to teach?" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="programming" className="bg-white text-black rounded-xl 
            data-[highlighted]:bg-white data-[highlighted]:text-black data-[highlighted]:rounded-xl 
            data-[state=checked]:bg-[#0389FF]">Programming & Coding</SelectItem>
                  <SelectItem value="data-science" className="bg-white text-black rounded-xl 
            data-[highlighted]:bg-white data-[highlighted]:text-black data-[highlighted]:rounded-xl 
            data-[state=checked]:bg-[#0389FF]">Data Science</SelectItem>
                  <SelectItem value="ai-ml" className="bg-white text-black rounded-xl 
            data-[highlighted]:bg-white data-[highlighted]:text-black data-[highlighted]:rounded-xl 
            data-[state=checked]:bg-[#0389FF]">AI & Machine Learning</SelectItem>
                  <SelectItem value="robotics" className="bg-white text-black rounded-xl 
            data-[highlighted]:bg-white data-[highlighted]:text-black data-[highlighted]:rounded-xl 
            data-[state=checked]:bg-[#0389FF]">Robotics</SelectItem>
                  <SelectItem value="web-development" className="bg-white text-black rounded-xl 
            data-[highlighted]:bg-white data-[highlighted]:text-black data-[highlighted]:rounded-xl 
            data-[state=checked]:bg-[#0389FF]">Web Development</SelectItem>
                  <SelectItem value="mobile-development" className="bg-white text-black rounded-xl 
            data-[highlighted]:bg-white data-[highlighted]:text-black data-[highlighted]:rounded-xl 
            data-[state=checked]:bg-[#0389FF]">Mobile Development</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={formData.sector} onValueChange={(value) => handleSelectChange('sector', value)}>
                <SelectTrigger className="bg-white/80 rounded-xl">
                  <SelectValue placeholder="Which sector do you want to work in?" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="education" className="bg-white text-black rounded-xl 
            data-[highlighted]:bg-white data-[highlighted]:text-black data-[highlighted]:rounded-xl 
            data-[state=checked]:bg-[#0389FF]">Education</SelectItem>
                  <SelectItem value="healthcare" className="bg-white text-black rounded-xl 
            data-[highlighted]:bg-white data-[highlighted]:text-black data-[highlighted]:rounded-xl 
            data-[state=checked]:bg-[#0389FF]">Healthcare</SelectItem>
                  <SelectItem value="finance" className="bg-white text-black rounded-xl 
            data-[highlighted]:bg-white data-[highlighted]:text-black data-[highlighted]:rounded-xl 
            data-[state=checked]:bg-[#0389FF]">Finance</SelectItem>
                  <SelectItem value="technology" className="bg-white text-black rounded-xl 
            data-[highlighted]:bg-white data-[highlighted]:text-black data-[highlighted]:rounded-xl 
            data-[state=checked]:bg-[#0389FF]">Technology</SelectItem>
                  <SelectItem value="manufacturing" className="bg-white text-black rounded-xl 
            data-[highlighted]:bg-white data-[highlighted]:text-black data-[highlighted]:rounded-xl 
            data-[state=checked]:bg-[#0389FF]">Manufacturing</SelectItem>
                  <SelectItem value="agriculture" className="bg-white text-black rounded-xl 
            data-[highlighted]:bg-white data-[highlighted]:text-black data-[highlighted]:rounded-xl 
            data-[state=checked]:bg-[#0389FF]">Agriculture</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={handleCheckboxChange}
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <Link to="/terms" className="text-[#0389FF] hover:underline">
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-[#0389FF] hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <SignupLayout 
      title="Innovate, Incubate and Impact the world together!" 
      subtitle="Join us to Innovate, Incubate and Impact!"
    >
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Partner With Us - Institution</h1>
          
          <p className="text-gray-600 text-sm">
            {currentStep === 1 && "Enter your company details to proceed further"}
            {currentStep === 2 && "Enter your address details to proceed further"}
            {currentStep === 3 && "Complete your account setup and verify details"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <StepIndicator currentStep={currentStep} totalSteps={3} />
          
          {renderStepContent()}

          <div className="flex justify-between space-x-4">
            {currentStep > 1 && (
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className="px-6 rounded-xl border-[#0389FF] text-[#0389FF] hover:bg-[#0389FF] hover:text-white"
              >
                Back
              </Button>
            )}
            
            <div className="flex-1" />
            
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-[#0389FF] hover:bg-[#0389FF]/90 text-white px-6 rounded-xl"
              >
                CONTINUE
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-[#0389FF] hover:bg-[#0389FF]/90 text-white px-6 rounded-xl"
                disabled={!formData.acceptTerms || registerMutation.isPending || (otpSent && !formData.otp)}
              >
                {registerMutation.isPending ? "SIGNING UP..." : "SIGN UP"}
              </Button>
            )}
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/partner-signin" className="text-[#0389FF] hover:text-[#0389FF]/80 hover:underline font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </SignupLayout>
  );
};

export default PartnerInstitutionPortal;

