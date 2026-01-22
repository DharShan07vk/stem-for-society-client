import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, User, Building2, ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components1/ui/calendar";
import { Button } from "@/components1/ui/button";
import { Input } from "@/components1/ui/input";
import { Textarea } from "@/components1/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components1/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components1/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { initializeRazorpay } from "@/lib/utils";
import { RZPY_KEYID } from "@/Constants";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";


export type EnquiryMode = "individual" | "institutional";

type IndividualServiceType = 
  | "career-counselling-full"
  | "career-counselling-session"
  | "mental-wellbeing"
  | "cv-resume-prep"
  | "sop-lor-editing"
  | "research-proposal"
  | "pg-phd-application";

type InstitutionalServiceType =
  | "comprehensive-package"
  | "career-counselling"
  | "entrepreneurship"
  | "personality-development"
  | "mental-wellbeing"
  | "digital-wellness"
  | "sex-education"
  | "single-theme";

type ServiceType = IndividualServiceType | InstitutionalServiceType;

interface EnquiryBackendPayload {
  type: EnquiryMode;
  name: string;
  mobile: string;
  email: string;
  serviceInterest: ServiceType;
  selectedDate: string | null; // YYYY-MM-DD format
  selectedTime: string | null;
  
  // Combined fields (used differently based on type)
  OrganizationName?: string; // Individual org name OR Institution name (matches backend field name exactly)
  designation?: string; // Individual profession OR Institutional designation
  requirements?: string; // Institutional requirements
  concerns?: string; // Individual concerns
  
  amount: number; // in paise
}

interface CreatePaymentResponse {
  orderId: string;
  amount: number;
}

interface GenericError {
  error: string;
  message: string;
}

interface GenericResponse<T> {
  data: T;
  message: string;
  success: boolean;
}


interface FormData {
  // Common fields
  fullName: string;
  contactNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  serviceInterest: string;
  preferredDate: Date | undefined;
  selectedTime: string;
  
  // Individual specific fields
  gender: string;
  profession: string;
  instituteOrOrganization: string;
  concern: string;
  
  // Institutional specific fields
  designation: string;
  department: string;
  instituteName: string;
  requirements: string;
}


interface EnquiryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  mode: EnquiryMode;
  preSelectedService?: string;
}

const individualServices = [
  { value: "career-counselling-full", label: "Career Counselling & Guidance (Full)" },
  { value: "career-counselling-session", label: "Career Counselling (Single Session)" },
  { value: "mental-wellbeing", label: "Mental Well-being" },
  { value: "cv-resume-prep", label: "CV/Resume Preparation" },
  { value: "sop-lor-editing", label: "SOP/LOR Editing & Preparation" },
  { value: "research-proposal", label: "Research Proposal Editing" },
  { value: "pg-phd-application", label: "PG/PhD Abroad Application Guidance" },
];

const institutionalServices = [
  { value: "comprehensive-package", label: "Comprehensive Package (Recommended)" },
  { value: "career-counselling", label: "Career Counselling and Guidance" },
  { value: "entrepreneurship", label: "Entrepreneurship" },
  { value: "personality-development", label: "Attitude and Personality Development" },
  { value: "mental-wellbeing", label: "Mental Well-being" },
  { value: "digital-wellness", label: "Digital Wellness & Social Media Awareness" },
  { value: "sex-education", label: "Sex Education" },
  { value: "single-theme", label: "Single-Theme Program" },
];

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

function useSubmitEnquiry() {
  return useMutation<
    GenericResponse<CreatePaymentResponse>,
    AxiosError<GenericError>,
    EnquiryBackendPayload,
    unknown
  >({
    mutationFn: async (data) => {
      console.log(" Sending enquiry to backend:", data);
      const response = await api().post("/enquiry/ind_inst", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    onError: (err) => {
      console.error(" Enquiry submission error:", err);
      const errorMsg = err.response?.data?.message || "Failed to submit enquiry";
      toast.error(errorMsg);
    },
  });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatDateForComparison = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const mapFormDataToBackend = (formData: FormData, mode: EnquiryMode, amount: number): EnquiryBackendPayload => {
  const basePayload: EnquiryBackendPayload = {
    type: mode,
    name: formData.fullName,
    mobile: formData.contactNumber,
    email: formData.email,
    serviceInterest: formData.serviceInterest as ServiceType,
    selectedDate: formData.preferredDate ? formatDateForComparison(formData.preferredDate) : null,
    selectedTime: formData.selectedTime || null,
    amount,
  };

  // Add mode-specific fields (matches backend schema exactly)
  if (mode === "individual") {
    return {
      ...basePayload,
      OrganizationName: formData.instituteOrOrganization || undefined,
      designation: formData.profession || undefined, // profession → designation
      concerns: formData.concern || undefined,
    };
  } else {
    // institutional mode
    return {
      ...basePayload,
      OrganizationName: formData.instituteOrOrganization || undefined,
      designation: formData.designation || undefined,
      requirements: formData.requirements || undefined,
    };
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const EnquiryPopup = ({ isOpen, onClose, mode, preSelectedService }: EnquiryPopupProps) => {
  // ========== STATE ==========
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    contactNumber: "",
    email: "",
    address: "",
    city: "",
    state: "",
    serviceInterest: preSelectedService || "",
    preferredDate: undefined,
    selectedTime: "",
    gender: "",
    profession: "",
    instituteOrOrganization: "",
    concern: "",
    designation: "",
    department: "",
    instituteName: "",
    requirements: "",
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // ========== MUTATIONS ==========
  const { mutateAsync: submitEnquiry, isPending: isSubmitting } = useSubmitEnquiry();

  // ========== CONSTANTS ==========
  const availableTimes = [
    "10:30 AM",
    "11:30 AM",
    "12:30 PM",
    "3:30 PM",
    "4:30 PM",
    "5:30 PM",
  ];

  // ========== EFFECTS ==========
  useEffect(() => {
    if (preSelectedService) {
      setFormData(prev => ({ ...prev, serviceInterest: preSelectedService }));
    }
  }, [preSelectedService]);

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        serviceInterest: preSelectedService || "",
        selectedTime: "",
        preferredDate: undefined,
      }));
      setSelectedDate(undefined);
      setCurrentMonth(new Date());
    }
  }, [isOpen, preSelectedService]);

  // ========== HANDLERS ==========
  const handleInputChange = (field: keyof FormData, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    handleInputChange("preferredDate", date);
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth()));
  };

  const handleDropdownDateSelect = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    setSelectedDate(date);
    handleInputChange("preferredDate", date);
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth()));
  };

  // ========== VALIDATION ==========
  const validateForm = (): boolean => {
    const requiredFields = mode === "individual" 
      ? ["fullName", "contactNumber", "email", "serviceInterest"]
      : ["designation", "instituteOrOrganization", "contactNumber", "email", "serviceInterest"];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof FormData]) {
        console.log(field);
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Phone validation
    const phoneRegex = /^[+]?[\d\s-]{10,}$/;
    if (!phoneRegex.test(formData.contactNumber)) {
      toast.error("Please enter a valid contact number (minimum 10 digits)");
      return false;
    }

    return true;
  };

  const isTimeSlotPast = (timeSlot: string) => {
    if (!selectedDate) return false;

    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    if (!isToday) return false;

    const [time, period] = timeSlot.split(" ");
    const [hours, minutes] = time.split(":").map(Number);

    let hour24 = hours;
    if (period === "PM" && hours !== 12) {
      hour24 = hours + 12;
    } else if (period === "AM" && hours === 12) {
      hour24 = 0;
    }

    const slot = new Date();
    slot.setHours(hour24, minutes, 0, 0);

    const currentWithBuffer = new Date();
    currentWithBuffer.setMinutes(currentWithBuffer.getMinutes() + 30);

    return slot <= currentWithBuffer;
  };

  // ========== DATA GENERATION ==========
  const generateAvailableDates = () => {
    const dates = [] as { value: string; label: string }[];
    const today = new Date();
    const oneMonthFromToday = new Date(today);
    oneMonthFromToday.setMonth(today.getMonth() + 1);

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      if (date <= oneMonthFromToday) {
        dates.push({
          value: formatDateForComparison(date),
          label: date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        });
      }
    }

    return dates;
  };

  // ========== PAYMENT & SUBMISSION ==========
  const handlePayment = useCallback(async () => {
    try {
      if (!validateForm()) {
        return;
      }

      const amount = mode === "individual" ? 300000 : 3000000; // in paise

      // Map frontend form data to backend payload
      const backendPayload = mapFormDataToBackend(formData, mode, amount);

      console.log("📤 Submitting to backend:", backendPayload);

      // Submit enquiry to backend
      const response = await submitEnquiry(backendPayload);

      if (!response || !response.data) {
        toast.error("Failed to create payment order");
        return;
      }

      const order = response.data;
      console.log(" Enquiry submitted, order created:", order);

      // Initialize Razorpay
      const rzrpyInit = await initializeRazorpay();
      if (!rzrpyInit) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      const options = {
        key: RZPY_KEYID,
        amount: Number(order.amount),
        currency: "INR",
        name: "STEM for Society",
        description: mode === "individual" ? "Individual Enquiry" : "Institutional Enquiry",
        order_id: order.orderId,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.contactNumber,
        },
        theme: {
          color: "#0389FF",
        },
        handler: function (response: { razorpay_payment_id: string }) {
          console.log(" Payment successful:", response);
          toast.success("Payment successful! We will contact you shortly.");
          onClose();
        },
        modal: {
          ondismiss: function () {
            console.log(" Payment cancelled by user");
          },
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(" Payment error:", error);
      toast.error("Failed to process payment. Please try again.");
    }
  }, [formData, mode, submitEnquiry]);

  if (!isOpen) return null;

  const services = mode === "individual" ? individualServices : institutionalServices;
  const isSingleTheme = mode === "institutional" && formData.serviceInterest === "single-theme";

  // Use Portal to render popup at root level to avoid stacking context issues
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop - non-clickable */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Popup Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4 animate-in fade-in zoom-in duration-200">
        {/* Header with mode toggle */}
        <div className="sticky top-0 bg-white z-10 px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-slate-900">
            {mode === "individual" ? "Book Your Session" : isSingleTheme ? "Discuss Custom Needs" : "Partner With Us"}
          </h2>
          <p className="text-slate-500 mt-1">
            {mode === "individual"
              ? "Take the first step towards your goals. Fill out the form below to get started."
              : isSingleTheme
              ? "Share your institution's requirements and we'll get back to you shortly."
              : "Tell us about your institution's needs. We'll build a custom plan for you."}
          </p>
        </div>

        {/* Form Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-200px)]"
             style={{
               position: 'relative',
               zIndex: 1,
             }}
        >
          {mode === "individual" ? (
            // Individual Form (aligned rows + calendar/time)
            <div className="space-y-6">
              {/* Row 1: Full Name, Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Jane Doe"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="h-12 rounded-xl border-slate-200 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleInputChange("gender", value)}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 relative z-[100]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2: Institute/Org, Profession */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Institute / Organization</label>
                  <Input
                    placeholder="University / Company Name"
                    value={formData.instituteOrOrganization}
                    onChange={(e) => handleInputChange("instituteOrOrganization", e.target.value)}
                    className="h-12 rounded-xl border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Profession</label>
                  <Select
                    value={formData.profession}
                    onValueChange={(value) => handleInputChange("profession", value)}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 relative z-[100]">
                      <SelectValue placeholder="Student / Professional" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="fresher">Fresher</SelectItem>
                      <SelectItem value="researcher">Researcher</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 3: Phone, Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="+91 9876543210"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                    className="h-12 rounded-xl border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="sfs@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-12 rounded-xl border-slate-200"
                  />
                </div>
              </div>

              {/* Row 4: Address */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                <Input
                  placeholder="Street Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="h-12 rounded-xl border-slate-200"
                />
              </div>

              {/* Row 5: State, City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                  <Input
                    placeholder="Maharashtra"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className="h-12 rounded-xl border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                  <Input
                    placeholder="Mumbai"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="h-12 rounded-xl border-slate-200"
                  />
                </div>
              </div>

              {/* Row 6: Area of interest */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Area of Interest <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.serviceInterest}
                  onValueChange={(value) => handleInputChange("serviceInterest", value)}
                >
                  <SelectTrigger className="h-12 rounded-xl border-slate-200 relative z-[100]">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999]">
                    {services.map((service) => (
                      <SelectItem key={service.value} value={service.value}>
                        {service.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Row 7: Calendar (left) + Date/Time (right) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calendar */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                      className="p-2 hover:bg-slate-100 rounded-full"
                    >
                      <ChevronLeft className="h-5 w-5 text-slate-600" />
                    </button>
                    <h3 className="font-semibold text-slate-900">
                      {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                      className="p-2 hover:bg-slate-100 rounded-full"
                    >
                      <ChevronRight className="h-5 w-5 text-slate-600" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                      <div key={day} className="p-2 text-xs font-medium text-slate-500">{day}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {(() => {
                      const today = new Date();
                      const oneMonthFromToday = new Date(today);
                      oneMonthFromToday.setMonth(today.getMonth() + 1);

                      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
                      const startDate = new Date(firstDay);
                      startDate.setDate(startDate.getDate() - firstDay.getDay());

                      const days = [] as JSX.Element[];
                      const currentDate = new Date(startDate);

                      for (let i = 0; i < 42; i++) {
                        const date = new Date(currentDate);
                        const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                        const isSelected = selectedDate && formatDateForComparison(date) === formatDateForComparison(selectedDate);
                        const isToday = formatDateForComparison(date) === formatDateForComparison(today);
                        const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));
                        const isAfterOneMonth = date > oneMonthFromToday;
                        const isDisabled = !isCurrentMonth || isPastDate || isAfterOneMonth;

                        days.push(
                          <button
                            type="button"
                            key={i}
                            onClick={() => {
                              if (!isDisabled) handleDateSelect(date);
                            }}
                            className={cn(
                              "w-10 h-10 text-sm rounded-full transition-all flex items-center justify-center mx-auto",
                              isDisabled && "text-slate-300 cursor-not-allowed",
                              !isDisabled && isSelected && "bg-[#0389FF] text-white font-semibold",
                              !isDisabled && !isSelected && isToday && "bg-blue-100 text-blue-600 font-semibold",
                              !isDisabled && !isSelected && !isToday && isCurrentMonth && "hover:bg-slate-100 text-slate-900",
                              !isCurrentMonth && "text-slate-300"
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

                {/* Date dropdown + time */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Date of the Session</label>
                    <Select
                      value={selectedDate ? formatDateForComparison(selectedDate) : ""}
                      onValueChange={handleDropdownDateSelect}
                    >
                      <SelectTrigger className="w-full h-12 bg-slate-50 border border-slate-200 rounded-lg relative z-[100]">
                        <SelectValue placeholder="Select Date" />
                      </SelectTrigger>
                      <SelectContent className="z-[9999]">
                        {generateAvailableDates().map((date) => (
                          <SelectItem key={date.value} value={date.value}>
                            {date.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 mb-4">Available Time</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableTimes.map((time) => {
                        const disabled = isTimeSlotPast(time);
                        const isActive = formData.selectedTime === time;
                        return (
                          <button
                            type="button"
                            key={time}
                            onClick={() => {
                              if (!disabled) handleInputChange("selectedTime", time);
                            }}
                            className={cn(
                              "px-3 py-3 rounded-lg text-sm border transition-all",
                              disabled && "text-slate-400 border-slate-200 cursor-not-allowed",
                              !disabled && isActive && "border-[#0389FF] bg-blue-50 text-[#0389FF] font-semibold",
                              !disabled && !isActive && "border-slate-200 hover:border-[#0389FF] hover:bg-blue-50/50"
                            )}
                            disabled={disabled}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Concern */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Concern</label>
                <Textarea
                  placeholder="Briefly tell us your concern..."
                  value={formData.concern}
                  onChange={(e) => handleInputChange("concern", e.target.value)}
                  className="min-h-[100px] rounded-xl border-slate-200 resize-none"
                />
              </div>
            </div>
          ) : isSingleTheme ? (
            // Single-Theme Simplified Form (only 6 fields, no calendar)
            <div className="space-y-6">
              {/* Row 1: Name, Designation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="h-12 rounded-xl border-slate-200 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Principal"
                    value={formData.designation}
                    onChange={(e) => handleInputChange("designation", e.target.value)}
                    className="h-12 rounded-xl border-slate-200"
                  />
                </div>
              </div>

              {/* Row 2: Contact Number, Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="+91 9876543210"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                    className="h-12 rounded-xl border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="principal@school.edu"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-12 rounded-xl border-slate-200"
                  />
                </div>
              </div>

              {/* Row 3: Institute Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Institute Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Lincoln High School"
                  value={formData.instituteOrOrganization}
                  onChange={(e) => handleInputChange("instituteOrOrganization", e.target.value)}
                  className="h-12 rounded-xl border-slate-200"
                />
              </div>

              {/* Row 4: Requirements */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Requirements / Questions
                </label>
                <Textarea
                  placeholder="E.g., We are looking for a program for 200 11th-grade students..."
                  value={formData.requirements}
                  onChange={(e) => handleInputChange("requirements", e.target.value)}
                  className="min-h-[120px] rounded-xl border-slate-200 resize-none"
                />
              </div>
            </div>
          ) : (
            // Full Institutional Form (with calendar and all details)
            <div className="space-y-6">
              {/* Row 1: Full Name, Designation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="h-12 rounded-xl border-slate-200 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Principal"
                    value={formData.designation}
                    onChange={(e) => handleInputChange("designation", e.target.value)}
                    className="h-12 rounded-xl border-slate-200"
                  />
                </div>
              </div>

              {/* Row 2: Institute Name, Department */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Institute Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Lincoln High School"
                    value={formData.instituteOrOrganization}
                    onChange={(e) => handleInputChange("instituteOrOrganization", e.target.value)}
                    className="h-12 rounded-xl border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Department
                  </label>
                  <Input
                    placeholder="Administration"
                    value={formData.department}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                    className="h-12 rounded-xl border-slate-200"
                  />
                </div>
              </div>

              {/* Row 3: Contact Number, Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="+91 9876543210"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                    className="h-12 rounded-xl border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="principal@school.edu"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-12 rounded-xl border-slate-200"
                  />
                </div>
              </div>

              {/* Row 4: Address */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                <Input
                  placeholder="Street Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="h-12 rounded-xl border-slate-200"
                />
              </div>

              {/* Row 5: State, City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                  <Input
                    placeholder="Maharashtra"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className="h-12 rounded-xl border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                  <Input
                    placeholder="Mumbai"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="h-12 rounded-xl border-slate-200"
                  />
                </div>
              </div>

              {/* Row 6: Area of Interest */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Area of Interest <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.serviceInterest}
                  onValueChange={(value) => handleInputChange("serviceInterest", value)}
                >
                  <SelectTrigger className="h-12 rounded-xl border-slate-200 relative z-[100]">
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999]">
                    {services.map((service) => (
                      <SelectItem key={service.value} value={service.value}>
                        {service.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Row 7: Calendar (left) + Date/Time (right) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calendar */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                      className="p-2 hover:bg-slate-100 rounded-full"
                    >
                      <ChevronLeft className="h-5 w-5 text-slate-600" />
                    </button>
                    <h3 className="font-semibold text-slate-900">
                      {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                      className="p-2 hover:bg-slate-100 rounded-full"
                    >
                      <ChevronRight className="h-5 w-5 text-slate-600" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                      <div key={day} className="p-2 text-xs font-medium text-slate-500">{day}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {(() => {
                      const today = new Date();
                      const oneMonthFromToday = new Date(today);
                      oneMonthFromToday.setMonth(today.getMonth() + 1);

                      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
                      const startDate = new Date(firstDay);
                      startDate.setDate(startDate.getDate() - firstDay.getDay());

                      const days = [] as JSX.Element[];
                      const currentDate = new Date(startDate);

                      for (let i = 0; i < 42; i++) {
                        const date = new Date(currentDate);
                        const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                        const isSelected = selectedDate && formatDateForComparison(date) === formatDateForComparison(selectedDate);
                        const isToday = formatDateForComparison(date) === formatDateForComparison(today);
                        const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));
                        const isAfterOneMonth = date > oneMonthFromToday;
                        const isDisabled = !isCurrentMonth || isPastDate || isAfterOneMonth;

                        days.push(
                          <button
                            type="button"
                            key={i}
                            onClick={() => {
                              if (!isDisabled) handleDateSelect(date);
                            }}
                            className={cn(
                              "w-10 h-10 text-sm rounded-full transition-all flex items-center justify-center mx-auto",
                              isDisabled && "text-slate-300 cursor-not-allowed",
                              !isDisabled && isSelected && "bg-[#0389FF] text-white font-semibold",
                              !isDisabled && !isSelected && isToday && "bg-blue-100 text-blue-600 font-semibold",
                              !isDisabled && !isSelected && !isToday && isCurrentMonth && "hover:bg-slate-100 text-slate-900",
                              !isCurrentMonth && "text-slate-300"
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

                {/* Date dropdown + time */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Date of Meeting</label>
                    <Select
                      value={selectedDate ? formatDateForComparison(selectedDate) : ""}
                      onValueChange={handleDropdownDateSelect}
                    >
                      <SelectTrigger className="w-full h-12 bg-slate-50 border border-slate-200 rounded-lg relative z-[100]">
                        <SelectValue placeholder="Select Date" />
                      </SelectTrigger>
                      <SelectContent className="z-[9999]">
                        {generateAvailableDates().map((date) => (
                          <SelectItem key={date.value} value={date.value}>
                            {date.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 mb-4">Available Time</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableTimes.map((time) => {
                        const disabled = isTimeSlotPast(time);
                        const isActive = formData.selectedTime === time;
                        return (
                          <button
                            type="button"
                            key={time}
                            onClick={() => {
                              if (!disabled) handleInputChange("selectedTime", time);
                            }}
                            className={cn(
                              "px-3 py-3 rounded-lg text-sm border transition-all",
                              disabled && "text-slate-400 border-slate-200 cursor-not-allowed",
                              !disabled && isActive && "border-[#0389FF] bg-blue-50 text-[#0389FF] font-semibold",
                              !disabled && !isActive && "border-slate-200 hover:border-[#0389FF] hover:bg-blue-50/50"
                            )}
                            disabled={disabled}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements / Questions */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Requirements / Questions
                </label>
                <Textarea
                  placeholder="E.g., We are looking for a program for 200 11th-grade students..."
                  value={formData.requirements}
                  onChange={(e) => handleInputChange("requirements", e.target.value)}
                  className="min-h-[100px] rounded-xl border-slate-200 resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer with Submit Button */}
        <div className="sticky bottom-0 z-20 bg-white px-6 py-4 border-t border-gray-100">
          <Button
            onClick={handlePayment}
            disabled={isSubmitting}
            className=" z-50 w-full h-14 bg-[#0389FF] hover:bg-[#0389FF]/90 text-white rounded-xl font-semibold text-base shadow-lg shadow-blue-200 transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : mode === "individual" ? (
              <span className="flex items-center gap-2">
                Book Session
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Request Proposal
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EnquiryPopup;
