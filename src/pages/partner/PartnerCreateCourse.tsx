import {
  Alert,
  Button,
  FileInput,
  Paper,
  SegmentedControl,
  Select,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Calendar, ChevronLeft, Link2, Plus, X } from "lucide-react";
import { useState } from "react";
import { FaLocationArrow } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../lib/api";
import { courseCategories, CourseCategoriesType } from "../../lib/data";
import { GenericError, GenericResponse } from "../../lib/types";
import { mutationErrorHandler } from "../../lib/utils";

type PartnerCreateCourseForm = {
  title: string;
  description: string;
  cover: File | null;
  courseType: "Skill Development" | "Finishing School";
  location: string;
  meetingLink: string;
  startDate: Date | null;
  endDate: Date | null;
  cost: number;
  category: string | null;
  mode: "ONLINE" | "OFFLINE" | "HYBRID";
  whoIsItFor: string[];
  whatYouWillLearn: string[];
};

function useCreateCourse() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation<
    GenericResponse,
    AxiosError<GenericError>,
    PartnerCreateCourseForm,
    unknown
  >({
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.cover) {
        formData.append("cover", data.cover);
      }
      formData.append("course_type", data.courseType);
      formData.append("location", data.location);
      formData.append("trainingLink", data.meetingLink);
      formData.append("type", data.mode);
      formData.append("category", data.category);
      formData.append("startDate", data.startDate?.toISOString() || "");
      formData.append("endDate", data.endDate?.toISOString() || "");
      formData.append("cost", data.cost.toString());
      formData.append("whoIsItFor", JSON.stringify(data.whoIsItFor));
      formData.append("whatYouWillLearn", JSON.stringify(data.whatYouWillLearn));

      const response = await api("partnerAuth").post(
        "/partner/trainings",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    },
    onError: (err) => mutationErrorHandler(err, navigate, "/partner/signin"),
    onSuccess: () => {
      toast.success(
        "Course details submitted successfully! Our team will review and approve shortly!",
      );
      navigate("/partner/trainings");
      queryClient.invalidateQueries({ queryKey: ["partner", "trainings"] });
    },
  });
}



export default function PartnerCreateCourse() {
  const [formData, setFormData] = useState<PartnerCreateCourseForm>({
    title: "",
    description: "",
    cover: null,
    courseType: "Skill Development",
    location: "",
    meetingLink: "",
    startDate: null,
    endDate: null,
    cost: 0,
    category: null,
    mode: "ONLINE",
    whoIsItFor: [""],
    whatYouWillLearn: [""],
  });
  console.log("🚀 ~ PartnerCreateCourse ~ r:", formData);

  const { mutate: submitCourseDetails, isPending } = useCreateCourse();

  const handleSubmit = () => {
    try {
      submitCourseDetails(formData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | { target: { name: string; value: string } },
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileInputChange = (payload: File | null) => {
    setFormData((prevData) => ({
      ...prevData,
      cover: payload,
    }));
  };

  const handleDateChange = (
    name: "startDate" | "endDate",
    value: Date | null,
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle adding a new bullet point
  const handleAddBulletPoint = (field: "whoIsItFor" | "whatYouWillLearn") => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: [...prevData[field], ""],
    }));
  };

  // Handle removing a bullet point
  const handleRemoveBulletPoint = (
    field: "whoIsItFor" | "whatYouWillLearn",
    index: number,
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field].filter((_, i) => i !== index),
    }));
  };

  // Handle updating a bullet point
  const handleBulletPointChange = (
    field: "whoIsItFor" | "whatYouWillLearn",
    index: number,
    value: string,
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field].map((item, i) => (i === index ? value : item)),
    }));
  };


  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6 animate-in fade-in duration-500">
      {/* Back Button & Header */}
      <div className="space-y-4 animate-in slide-in-from-top duration-500">
        <div>
          {/*// @ts-expect-error shutup */}
          <Link to={-1}>
            <Button 
              variant="subtle" 
              leftSection={<ChevronLeft size={18} />}
              radius="md"
              className="hover:bg-gray-100 transition-colors"
            >
              Back
            </Button>
          </Link>
        </div>
        
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Create Training Course</h1>
          <p className="text-sm text-gray-600 mt-1">Share your knowledge and skills with the community</p>
        </div>
      </div>

      {/* Main Form */}
      <Paper p="xl" withBorder className="rounded-xl animate-in slide-in-from-bottom duration-500 delay-100">
        <div className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <Text size="sm" c="dimmed" className="uppercase tracking-wide font-medium">
              Basic Information
            </Text>
            <TextInput
              label="Course Title"
              placeholder="e.g., Introduction to Web Development"
              size="md"
              required
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              classNames={{
                input: "transition-all duration-200 focus:shadow-sm",
              }}
            />
            <Textarea
              label="Course Description"
              placeholder="Provide a comprehensive description including syllabus and key topics..."
              size="md"
              minRows={4}
              required
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              classNames={{
                input: "transition-all duration-200 focus:shadow-sm",
              }}
            />
            <FileInput
              label="Upload Cover Image"
              description="Recommended size: 1280x720 pixels"
              placeholder="Click to select an image"
              size="md"
              accept="image/*"
              name="cover"
              value={formData.cover}
              onChange={handleFileInputChange}
              classNames={{
                input: "transition-all duration-200 focus:shadow-sm",
              }}
            />
          </div>

          {/* Course Type & Category Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <Text size="sm" c="dimmed" className="uppercase tracking-wide font-medium">
              Course Type & Category
            </Text>
            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <Text size="sm" fw={500}>Course Type</Text>
                <SegmentedControl
                  data={["Skill Development", "Finishing School"]}
                  value={formData.courseType}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      courseType: val as "Skill Development" | "Finishing School",
                      category: null,
                    }))
                  }
                  size="md"
                  fullWidth
                />
              </div>
              
              {formData.courseType === "Finishing School" ? (
                <Select
                  data={courseCategories}
                  clearable={false}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: value,
                    }))
                  }
                  label="Category"
                  size="md"
                  value={formData.category}
                  classNames={{
                    input: "transition-all duration-200 focus:shadow-sm",
                  }}
                />
              ) : (
                <TextInput
                  label="Category"
                  placeholder="e.g., Web Development, Data Science, Digital Marketing"
                  size="md"
                  value={formData.category || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  classNames={{
                    input: "transition-all duration-200 focus:shadow-sm",
                  }}
                />
              )}
            </div>
          </div>

          {/* Schedule Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <Text size="sm" c="dimmed" className="uppercase tracking-wide font-medium">
              Schedule & Duration
            </Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateTimePicker
                label="Start Date & Time"
                placeholder="Select start date and time"
                value={formData.startDate}
                minDate={new Date()}
                onChange={(value) => handleDateChange("startDate", value)}
                leftSection={<Calendar size={16} />}
                size="md"
                classNames={{
                  input: "transition-all duration-200 focus:shadow-sm",
                }}
              />
              <DateTimePicker
                label="End Date & Time"
                placeholder="Select end date and time"
                value={formData.endDate}
                minDate={
                  formData.startDate ? new Date(formData.startDate) : new Date()
                }
                onChange={(value) => handleDateChange("endDate", value)}
                leftSection={<Calendar size={16} />}
                size="md"
                classNames={{
                  input: "transition-all duration-200 focus:shadow-sm",
                }}
              />
            </div>
            <Alert color="blue" variant="light" className="text-xs">
              Note: Date and timings are subject to administrative approval and may be adjusted
            </Alert>
          </div>

          {/* Delivery Mode Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <Text size="sm" c="dimmed" className="uppercase tracking-wide font-medium">
              Delivery Mode
            </Text>
            <div className="flex flex-col gap-2">
              <Text size="sm" fw={500}>Mode of Delivery</Text>
              <SegmentedControl
                data={["ONLINE", "OFFLINE", "HYBRID"]}
                value={formData.mode}
                onChange={(val) =>
                  handleInputChange({ target: { value: val, name: "mode" } })
                }
                size="md"
                fullWidth
              />
            </div>
            {(formData.mode === "ONLINE" || formData.mode === "HYBRID") && (
              <TextInput
                label="Meeting Link"
                placeholder="Enter Google Meet, Zoom, or Teams link"
                size="md"
                leftSection={<Link2 size={16} />}
                name="meetingLink"
                value={formData.meetingLink}
                onChange={handleInputChange}
                classNames={{
                  input: "transition-all duration-200 focus:shadow-sm",
                }}
              />
            )}
            {(formData.mode === "OFFLINE" || formData.mode === "HYBRID") && (
              <TextInput
                label="Location"
                placeholder="Enter complete address or city"
                size="md"
                leftSection={<FaLocationArrow size={13} />}
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                classNames={{
                  input: "transition-all duration-200 focus:shadow-sm",
                }}
              />
            )}
          </div>

          {/* Course Details Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <Text size="sm" c="dimmed" className="uppercase tracking-wide font-medium">
              Course Details
            </Text>
            
            {/* Who is it for */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <Text size="sm" fw={500}>
                    Who is it for? <span className="text-red-500">*</span>
                  </Text>
                  <Text size="xs" c="dimmed">
                    Define your target audience
                  </Text>
                </div>
                <Button
                  size="xs"
                  variant="light"
                  onClick={() => handleAddBulletPoint("whoIsItFor")}
                  leftSection={<Plus size={14} />}
                >
                  Add Point
                </Button>
              </div>
              <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                {formData.whoIsItFor.map((point, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-gray-600 mt-3 font-medium">•</span>
                    <TextInput
                      placeholder={`e.g., Beginners with basic coding knowledge`}
                      value={point}
                      onChange={(e) =>
                        handleBulletPointChange("whoIsItFor", index, e.target.value)
                      }
                      className="flex-1"
                      size="sm"
                    />
                    {formData.whoIsItFor.length > 1 && (
                      <Button
                        size="xs"
                        variant="subtle"
                        color="red"
                        onClick={() => handleRemoveBulletPoint("whoIsItFor", index)}
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* What you will learn */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <Text size="sm" fw={500}>
                    What you will learn <span className="text-red-500">*</span>
                  </Text>
                  <Text size="xs" c="dimmed">
                    List key learning outcomes
                  </Text>
                </div>
                <Button
                  size="xs"
                  variant="light"
                  onClick={() => handleAddBulletPoint("whatYouWillLearn")}
                  leftSection={<Plus size={14} />}
                >
                  Add Point
                </Button>
              </div>
              <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                {formData.whatYouWillLearn.map((point, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-gray-600 mt-3 font-medium">•</span>
                    <TextInput
                      placeholder={`e.g., Build responsive websites using HTML & CSS`}
                      value={point}
                      onChange={(e) =>
                        handleBulletPointChange("whatYouWillLearn", index, e.target.value)
                      }
                      className="flex-1"
                      size="sm"
                    />
                    {formData.whatYouWillLearn.length > 1 && (
                      <Button
                        size="xs"
                        variant="subtle"
                        color="red"
                        onClick={() =>
                          handleRemoveBulletPoint("whatYouWillLearn", index)
                        }
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <Text size="sm" c="dimmed" className="uppercase tracking-wide font-medium">
              Pricing
            </Text>
            <TextInput
              label="Registration Cost"
              placeholder="Enter course fee"
              size="md"
              type="number"
              leftSection={<span className="text-gray-600 font-medium">₹</span>}
              step={0.01}
              name="cost"
              required
              value={formData.cost}
              onChange={handleInputChange}
              classNames={{
                input: "transition-all duration-200 focus:shadow-sm",
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button
              fullWidth
              size="lg"
              radius="md"
              type="submit"
              onClick={handleSubmit}
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:shadow-md"
            >
              {isPending ? "Creating Course..." : "Create Course"}
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
}
