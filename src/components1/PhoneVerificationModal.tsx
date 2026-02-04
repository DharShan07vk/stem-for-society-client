import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components1/ui/button";
import { Input } from "@/components1/ui/input";
import { Label } from "@/components1/ui/label";

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (phoneNumber: string) => void;
  userEmail: string;
}

const PhoneVerificationModal = ({ 
  isOpen,  
  onSuccess,
}: PhoneVerificationModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState(""); // 10 digits only
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePhoneNumber = (phone: string): boolean => {
    // Must be exactly 10 digits starting with 6-9 (Indian mobile)
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error("Please enter a valid 10-digit mobile number starting with 6-9");
      return;
    }

    setIsSubmitting(true);

    try {
      // Pass the phone number back to parent component
      onSuccess(phoneNumber);
      toast.success("Phone number added successfully!");
    } catch (error: any) {
      console.error("Error submitting phone number:", error);
      toast.error("Failed to add phone number. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Add Your Phone Number</h2>
          <p className="text-gray-600 text-sm">
            We need your mobile number for booking sessions and notifications
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="phone" className="text-gray-700 font-medium">
              Mobile Number
            </Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
                +91
              </span>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setPhoneNumber(value.slice(0, 10));
                }}
                placeholder="9876543210"
                className="pl-12"
                maxLength={10}
                disabled={isSubmitting}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter your 10-digit mobile number (without +91)
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || phoneNumber.length !== 10}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding Phone Number...
              </span>
            ) : (
              "Continue"
            )}
          </Button>


        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-700">
            <span className="font-semibold">Why we need this?</span> Your phone number helps us:
          </p>
          <ul className="text-xs text-gray-600 mt-2 space-y-1 ml-4 list-disc">
            <li>Send booking confirmations via SMS</li>
            <li>Enable emergency communication</li>
            <li>Provide better support</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerificationModal;
