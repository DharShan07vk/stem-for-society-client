import {
  Button,
  Checkbox,
  PasswordInput,
  SegmentedControl,
  TagsInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../lib/api";
import { usePartner } from "../../lib/hooks";
import { GenericError, GenericResponse } from "../../lib/types";
import { mutationErrorHandler } from "../../lib/utils";
import { 
  isValidEmail, 
  isValidPhone, 
  isValidPincode, 
  isValidGst 
} from "../../lib/validation";

type PartnerSignUpForm = {
  companyName: string;
  email: string;
  hasGst: boolean;
  cinOrGst: string;
  instructorName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  acceptTerms: boolean;
  password: string;
  city: string;
  state: string;
  pincode: string;
  signUpAs: "individual" | "institution";
  trainingTopics?: string[];
};

function usePartnerSignUp() {
  const navigate = useNavigate();
  return useMutation<
    GenericResponse,
    AxiosError<GenericError>,
    PartnerSignUpForm,
    unknown
  >({
    mutationFn: async (data: PartnerSignUpForm) => {
      const response = await api().post("/partner/auth/register", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Registration successful!");
      navigate("/partner/signin");
    },
    onError: (err) => mutationErrorHandler(err),
  });
}

function PartnerSignUp() {
  const { user } = usePartner();

  const [formData, setFormData] = useState<PartnerSignUpForm>({
    companyName: "",
    email: "",
    hasGst: true,
    cinOrGst: "",
    instructorName: "",
    phone: "",
    addressLine1: "",
    acceptTerms: false,
    city: "",
    password: "",
    state: "",
    pincode: "",
    signUpAs: "individual",
  });

  const registerMutation = usePartnerSignUp();

  const handleSubmit = () => {
    if (!formData.acceptTerms) {
      return toast.error("Accept terms to continue!");
    }

    // Backend-matching validations
    if (formData.signUpAs === "institution") {
      if (!formData.companyName) return toast.error("Company name is required");
      if (formData.hasGst) {
        if (!formData.cinOrGst) return toast.error("GST number is required");
        if (!isValidGst(formData.cinOrGst)) return toast.error("Invalid GST format (Example: 22AAAAA0000A1Z5)");
      }
    }

    if (!formData.instructorName) return toast.error("Instructor name is required");
    if (formData.instructorName.length > 50) return toast.error("Instructor name must be under 50 characters");
    
    if (!formData.phone) return toast.error("Phone number is required");
    if (!isValidPhone(formData.phone)) return toast.error("Invalid mobile number (Starts with 6-9, 10 digits)");

    if (!formData.city) return toast.error("City is required");
    if (!formData.state) return toast.error("State is required");
    
    if (!formData.pincode) return toast.error("Pincode is required");
    if (!isValidPincode(formData.pincode)) return toast.error("Invalid pincode (Exactly 6 digits)");

    if (!formData.email) return toast.error("Email is required");
    if (!isValidEmail(formData.email)) return toast.error("Invalid email format");

    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    registerMutation.mutate(formData);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (user) return <Navigate to={"/partner"} />;

  return (
    <div className="flex items-center justify-center flex-col w-full gap-7 my-10 rounded-lg">
      <div className="lg:w-2/3 p-3 lg:p-0 flex items-center flex-col gap-6">
        <Title order={1}>Partner with us!</Title>
        We invite individuals, startups, and corporations to collaborate with
        STEM for Society in developing an innovative course focused on enhancing
        technological and Hands on experience. This partnership aims to create
        educational opportunities that empower participants to address
        real-world challenges. If you are interested in joining this impactful
        initiative, please fill up the form below.
      </div>
      <div className="flex flex-col justify-center items-center p-3 w-full gap-2">
        <SegmentedControl
          data={[
            { label: "I'm an individual", value: "individual" },
            { label: "We're an institution / corporate", value: "institution" },
          ]}
          className="lg:w-2/3 w-full"
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              signUpAs: e as PartnerSignUpForm["signUpAs"],
            }))
          }
        />
        {formData.signUpAs === "institution" && (
          <>
            <TextInput
              label="Company Name"
              placeholder="Enter your company name"
              size="md"
              className="lg:w-2/3 w-full"
              required
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
            />

            <Checkbox
              label="Do you have GST?"
              name="hasGst"
              checked={formData.hasGst}
              onChange={(e) => setFormData(prev => ({ ...prev, hasGst: e.currentTarget.checked }))}
              className="lg:w-2/3 w-full"
            />
            {formData.hasGst && (
              <TextInput
                label="GST No."
                placeholder="Enter your GST"
                size="md"
                className="lg:w-2/3 w-full"
                required
                name="cinOrGst"
                value={formData.cinOrGst}
                onChange={handleInputChange}
              />
            )}
          </>
        )}
        <TextInput
          label="Instructor name"
          placeholder="Enter your name"
          size="md"
          className="lg:w-2/3 w-full"
          required
          name="instructorName"
          value={formData.instructorName}
          onChange={handleInputChange}
        />
        <TextInput
          label="Phone No."
          placeholder="Enter your phone"
          size="md"
          className="lg:w-2/3 w-full"
          required
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
        />
        {formData.signUpAs === "institution" && (
          <>
            <TextInput
              label="Address Line 1"
              placeholder=""
              size="md"
              className="lg:w-2/3 w-full"
              required
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleInputChange}
            />
            <TextInput
              label="Address Line 2"
              placeholder=""
              size="md"
              className="lg:w-2/3 w-full"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleInputChange}
            />
          </>
        )}
        <TextInput
          label="City"
          placeholder=""
          size="md"
          className="lg:w-2/3 w-full"
          name="city"
          required
          value={formData.city}
          onChange={handleInputChange}
        />
        <TextInput
          label="State"
          placeholder=""
          size="md"
          className="lg:w-2/3 w-full"
          name="state"
          required
          value={formData.state}
          onChange={handleInputChange}
        />
        <TextInput
          label="Pincode"
          placeholder=""
          size="md"
          className="lg:w-2/3 w-full"
          name="pincode"
          type="number"
          required
          value={formData.pincode}
          onChange={handleInputChange}
        />
        <TagsInput
          type="text"
          placeholder="Add topics"
          label="Topics that you will be teaching"
          description={"Press enter after each topic"}
          size="md"
          className="lg:w-2/3 w-full"
          value={formData.trainingTopics}
          onChange={(values) =>
            setFormData((prev) => ({ ...prev, trainingTopics: values }))
          }
        />
        <TextInput
          label="Email Address"
          placeholder="Enter your email"
          size="md"
          type="email"
          className="lg:w-2/3 w-full"
          required
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <PasswordInput
          label="Password"
          placeholder="••••••••"
          size="md"
          className="lg:w-2/3 w-full"
          required
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <div className="lg:w-2/3 w-full">
          <Checkbox
            label={
              <span className="font-semibold">
                I accept the{" "}
                <span className="text-blue-700 font-semibold">
                  terms and conditions.
                </span>
              </span>
            }
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleInputChange}
            required
          />
        </div>
        <Button
          radius={999}
          w="400"
          type="submit"
          disabled={registerMutation.isPending}
          onClick={handleSubmit}
        >
          Sign Up
        </Button>
        <div className="w-2/3 flex flex-row gap-2 justify-center mb-3">
          <Text ta="left" fw={500}>
            Have an account?
          </Text>
          <Link to="/partner/signin">
            <Text ta="left" c="blue" fw={500}>
              Log In
            </Text>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PartnerSignUp;
