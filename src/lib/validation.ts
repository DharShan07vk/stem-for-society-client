/**
 * Validation regex patterns shared across the application.
 * These follow the exact rules enforced by the backend as of 2026-04-02.
 */

export const VALIDATION_REGEX = {
  // Mobile: Starts with 6, 7, 8, or 9 and has exactly 10 digits
  MOBILE: /^[6789]\d{9}$/,
  
  // Mobile (Profile): Starts with 6-9 and has exactly 10 digits
  MOBILE_PROFILE: /^[6-9]\d{9}$/,
  
  // Pincode: Exactly 6 digits
  PINCODE: /^\d{6}$/,
  
  // GST: 15 characters (State code, PAN, Entity code, Checksum)
  // Format: 22AAAAA0000A1Z5
  GST: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  
  // Email: Standard email pattern
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Complex Password (Student Sign-in): 
  // At least 8 chars, one uppercase, one lowercase, one number, one special character
  COMPLEX_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  
  // Names: Min 2, max 100 (for profile/enquiry names)
  NAME: /^[a-zA-Z\s]{2,100}$/,
};

/**
 * Validation Helpers
 */

export const isValidEmail = (email: string) => VALIDATION_REGEX.EMAIL.test(email);

export const isValidPhone = (phone: string) => VALIDATION_REGEX.MOBILE.test(phone);

export const isValidPhoneProfile = (phone: string) => VALIDATION_REGEX.MOBILE_PROFILE.test(phone);

export const isValidPincode = (pincode: string) => VALIDATION_REGEX.PINCODE.test(pincode);

export const isValidGst = (gst: string) => VALIDATION_REGEX.GST.test(gst);

export const isValidComplexPassword = (password: string) => VALIDATION_REGEX.COMPLEX_PASSWORD.test(password);

/**
 * Validates partner/institution details
 */
export const validatePartnerRegistrationStep = (step: number, data: any) => {
  if (step === 1) {
    if (!data.companyName) return "Company name is required";
    if (data.instructorName && (data.instructorName.length < 1 || data.instructorName.length > 50)) {
      return "Instructor name must be between 1 and 50 characters";
    }
    if (data.hasGst) {
      if (!data.gst) return "GST number is required when GST is enabled";
      if (!isValidGst(data.gst)) return "Invalid GST format (Example: 22AAAAA0000A1Z5)";
    }
  } else if (step === 2) {
    if (!data.city) return "City is required";
    if (!data.state) return "State is required";
    if (!data.pincode) return "Pincode is required";
    if (!isValidPincode(data.pincode)) return "Invalid pincode (Exactly 6 digits)";
    if (!data.addressLine1) return "Address line 1 is required";
  } else if (step === 3) {
    if (!data.email) return "Email is required";
    if (!isValidEmail(data.email)) return "Invalid email format";
    if (!data.phone) return "Phone number is required";
    if (!isValidPhone(data.phone)) return "Invalid mobile number (Starts with 6-9, 10 digits)";
    if (!data.password) return "Password is required";
    if (data.password.length < 6) return "Password must be at least 6 characters";
  }
  return null;
};
