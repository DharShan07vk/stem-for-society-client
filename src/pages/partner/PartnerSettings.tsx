

import { Button, Paper, Text, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import PartnerErrorHandler from "../../components/PartnerErrorHandler";
import { usePartner, usePartnerProfileData } from "../../lib/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GenericError, GenericResponse } from "../../lib/types";
import { AxiosError } from "axios";
import { api } from "../../lib/api";
import { mutationErrorHandler } from "../../lib/utils";
import { toast } from "react-toastify";

type ProfileDefault = {
  companyName: string;
  email: string;
  cinOrGst: string;
  firstName: string;
  lastName?: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
  logo?: File | null;
  digitalSign?: File | null;
};

function usePartnerProfileSubmit() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation<GenericResponse, AxiosError<GenericError>, FormData>({
    mutationFn: async (data) => {
      return (
        await api("partnerAuth").post("/partner/misc/profile", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      ).data;
    },
    onError: (err) => mutationErrorHandler(err, navigate, "/partner/"),
    onSuccess(data) {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["partner", "profile"] });
    },
  });
}

export default function PartnerSettings() {
  const { user, isLoading, error } = usePartner();
  const {
    isLoading: partnerProfileLoading,
    error: partnerProfileError,
    data: partnerProfile,
  } = usePartnerProfileData();
  const { isPending: profileSaving, mutate: saveProfile } =
    usePartnerProfileSubmit();

  const [formData, setFormData] = useState<ProfileDefault>({
    companyName: "",
    email: "",
    cinOrGst: "",
    firstName: "",
    lastName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
    logo: null,
    digitalSign: null,
  });

  const [logoPreview, setLogoPreview] = useState<string>("");
  const [digitalSignPreview, setDigitalSignPreview] = useState<string>("");
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string>("");
  const [currentDigitalSignUrl, setCurrentDigitalSignUrl] =
    useState<string>("");

  useEffect(() => {
    if (partnerProfile) {
      setFormData((prevData) => ({
        ...prevData,
        state: partnerProfile.address?.state || "",
        addressLine1: partnerProfile.address?.addressLine1 || "",
        cinOrGst: partnerProfile.gst || "",
        city: partnerProfile.address?.city || "",
        companyName: partnerProfile.institutionName || "",
        email: partnerProfile.email || "",
        firstName: partnerProfile.firstName || "",
        lastName: partnerProfile.lastName ?? "",
        phone: partnerProfile.mobile || "",
        pincode: partnerProfile.address?.pincode || "",
        logo: null,
        digitalSign: null,
      }));

      setCurrentLogoUrl(partnerProfile.logo || "");
      setCurrentDigitalSignUrl(partnerProfile.digitalSign || "");
      setLogoPreview("");
      setDigitalSignPreview("");
    }
  }, [partnerProfile]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: "logo" | "digitalSign"
  ) => {
    const file = event.target.files?.[0] || null;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: file,
    }));

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (fieldName === "logo") {
        setLogoPreview(previewUrl);
        setCurrentLogoUrl("");
      } else {
        setDigitalSignPreview(previewUrl);
        setCurrentDigitalSignUrl("");
      }
    } else {
      if (fieldName === "logo") {
        setLogoPreview("");
      } else {
        setDigitalSignPreview("");
      }
    }
  };

  const handleSaveChanges = () => {
    const submitData = new FormData();

    // Always append all fields (old values if unchanged)
    submitData.append("email", formData.email || "");
    submitData.append("firstName", formData.firstName || "");
    submitData.append("lastName", formData.lastName || "");
    submitData.append("phone", formData.phone || "");
    submitData.append("city", formData.city || "");
    submitData.append("state", formData.state || "");
    submitData.append("pincode", formData.pincode || "");
    submitData.append("institutionName", formData.companyName || "");
    submitData.append("gst", formData.cinOrGst || "");
    submitData.append("addressLine1", formData.addressLine1 || "");

    // Files only if new selected
    if (formData.logo instanceof File) {
      submitData.append("logo", formData.logo);
    }
    if (formData.digitalSign instanceof File) {
      submitData.append("digitalSign", formData.digitalSign);
    }

    saveProfile(submitData);
  };

  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
      if (digitalSignPreview && digitalSignPreview.startsWith("blob:")) {
        URL.revokeObjectURL(digitalSignPreview);
      }
    };
  }, [logoPreview, digitalSignPreview]);

  if (isLoading || partnerProfileLoading) {
    return <Loading />;
  }

  if (error || partnerProfileError)
    return <PartnerErrorHandler error={error || partnerProfileError!} />;

  if (!user) return <Navigate to={"/partner"} />;

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2 animate-in slide-in-from-top duration-500">
        <h1 className="text-3xl font-semibold text-gray-900">Profile Settings</h1>
        <p className="text-sm text-gray-600">Manage your profile and institution information</p>
      </div>

      {/* Main Form */}
      <Paper p="xl" withBorder className="rounded-xl animate-in slide-in-from-bottom duration-500 delay-100">
        <div className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <Text size="sm" c="dimmed" className="uppercase tracking-wide font-medium">
              Personal Information
            </Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="First Name"
                placeholder="Enter your first name"
                size="md"
                required
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                classNames={{
                  input: "transition-all duration-200 focus:shadow-sm",
                }}
              />
              <TextInput
                label="Last Name"
                placeholder="Enter your last name"
                size="md"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleInputChange}
                classNames={{
                  input: "transition-all duration-200 focus:shadow-sm",
                }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Email Address"
                placeholder="Enter your email"
                size="md"
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                classNames={{
                  input: "transition-all duration-200 focus:shadow-sm",
                }}
              />
              <TextInput
                label="Phone Number"
                placeholder="Enter your phone"
                size="md"
                required
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                classNames={{
                  input: "transition-all duration-200 focus:shadow-sm",
                }}
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <Text size="sm" c="dimmed" className="uppercase tracking-wide font-medium">
              Address Information
            </Text>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextInput
                label="City"
                placeholder="Enter city"
                size="md"
                required
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                classNames={{
                  input: "transition-all duration-200 focus:shadow-sm",
                }}
              />
              <TextInput
                label="State"
                placeholder="Enter state"
                size="md"
                required
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                classNames={{
                  input: "transition-all duration-200 focus:shadow-sm",
                }}
              />
              <TextInput
                label="Pincode"
                placeholder="Enter pincode"
                size="md"
                type="number"
                required
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                classNames={{
                  input: "transition-all duration-200 focus:shadow-sm",
                }}
              />
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-6 pt-4 border-t border-gray-200">
            <Text size="sm" c="dimmed" className="uppercase tracking-wide font-medium">
              Documents & Signatures
            </Text>
            
            {/* Logo Upload */}
            <div className="space-y-3">
              <div>
                <Text size="sm" fw={500} className="mb-1">
                  Company Logo
                </Text>
                <Text size="xs" c="dimmed">
                  Upload your company or institution logo
                </Text>
              </div>
              
              {(logoPreview || currentLogoUrl) && (
                <div className="inline-block">
                  <img
                    src={logoPreview || currentLogoUrl}
                    alt="Company Logo"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                  />
                  <Text size="xs" c="dimmed" className="mt-2 text-center">
                    {logoPreview ? "New logo selected" : "Current logo"}
                  </Text>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "logo")}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload">
                  <Button
                    component="span"
                    variant="light"
                    radius="md"
                    size="sm"
                    className="cursor-pointer"
                  >
                    {currentLogoUrl || logoPreview ? "Change Logo" : "Upload Logo"}
                  </Button>
                </label>
                {formData.logo && (
                  <Text size="sm" c="green" fw={500}>
                    ✓ {formData.logo.name}
                  </Text>
                )}
              </div>
            </div>

            {/* Digital Signature Upload */}
            <div className="space-y-3">
              <div>
                <Text size="sm" fw={500} className="mb-1">
                  Digital Signature
                </Text>
                <Text size="xs" c="dimmed">
                  Upload your digital signature for certificates
                </Text>
              </div>
              
              {(digitalSignPreview || currentDigitalSignUrl) && (
                <div className="inline-block">
                  <img
                    src={digitalSignPreview || currentDigitalSignUrl}
                    alt="Digital Signature"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                  />
                  <Text size="xs" c="dimmed" className="mt-2 text-center">
                    {digitalSignPreview ? "New signature selected" : "Current signature"}
                  </Text>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "digitalSign")}
                  className="hidden"
                  id="digital-sign-upload"
                />
                <label htmlFor="digital-sign-upload">
                  <Button
                    component="span"
                    variant="light"
                    radius="md"
                    size="sm"
                    className="cursor-pointer"
                  >
                    {currentDigitalSignUrl || digitalSignPreview
                      ? "Change Signature"
                      : "Upload Signature"}
                  </Button>
                </label>
                {formData.digitalSign && (
                  <Text size="sm" c="green" fw={500}>
                    ✓ {formData.digitalSign.name}
                  </Text>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button
              fullWidth
              size="lg"
              radius="md"
              disabled={profileSaving}
              type="submit"
              onClick={handleSaveChanges}
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:shadow-md"
            >
              {profileSaving ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
}
