import {
  Button,
  FileInput,
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
import { Calendar, ChevronLeft, Plus, X } from "lucide-react";
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
    <div className="w-full mt-4">
      <div className="flex flex-row h-full w-full my-12">
        <div className="flex-1 flex items-center justify-center flex-col w-full gap-5 lg:px-10 ">
          <div className="w-full">
            {/*// @ts-expect-error shutup */}
            <Link to={-1}>
              <Button radius={999} fullWidth={false}>
                <ChevronLeft size={16} />
                Back
              </Button>
            </Link>
          </div>
          <div className="lg:w-2/3 w-full">
            <Title order={1} mb={20}>
              Create Training Course
            </Title>
            <Text size="lg">Giving back to the community.</Text>
          </div>
          <TextInput
            label="Title"
            placeholder="What do you want to teach?"
            size="md"
            className="lg:w-2/3 w-full"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
          <Textarea
            label="Description"
            placeholder="Give brief explanation along with syllabus"
            size="md"
            className="lg:w-2/3 w-full"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <FileInput
            label="Upload Cover"
            description="Size: 1280x720"
            placeholder="Select Image"
            className="lg:w-2/3 w-full"
            size="md"
            accept="image/*"
            name="cover"
            value={formData.cover}
            onChange={handleFileInputChange}
          />

          <div className="flex items-center lg:w-2/3 w-full gap-3">
            <span className="text-sm font-medium">Course Type</span>
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
            />
          </div>

          <div className="flex w-full lg:w-2/3 gap-2">
            <DateTimePicker
              label="Start date and time"
              placeholder="Start date and time"
              value={formData.startDate}
              minDate={new Date()}
              onChange={(value) => handleDateChange("startDate", value)}
              leftSection={<Calendar size={14} />}
              className="w-full"
            />
            <DateTimePicker
              label="End date and time"
              placeholder="End date and time"
              value={formData.endDate}
              minDate={
                formData.startDate ? new Date(formData.startDate) : new Date()
              }
              onChange={(value) => handleDateChange("endDate", value)}
              leftSection={<Calendar size={14} />}
              className="w-full"
            />
          </div>
          <div className="flex items-center lg:w-2/3 w-full gap-3">
            <span className="text-sm font-medium">Mode</span>
            <SegmentedControl
              data={["ONLINE", "OFFLINE", "HYBRID"]}
              value={formData.mode}
              onChange={(val) =>
                handleInputChange({ target: { value: val, name: "mode" } })
              }
            />
          </div>
          {(formData.mode === "ONLINE" || formData.mode === "HYBRID") && (
            <TextInput
              label="Meeting Link"
              placeholder="Enter Google Meet, Zoom, or other meeting link"
              size="md"
              leftSection={<Calendar size={13} />}
              className="lg:w-2/3 w-full"
              name="meetingLink"
              value={formData.meetingLink}
              onChange={handleInputChange}
            />
          )}
          {(formData.mode === "OFFLINE" || formData.mode === "HYBRID") && (
            <TextInput
              label="Location"
              placeholder="Enter address or city"
              size="md"
              leftSection={<FaLocationArrow size={13} />}
              className="lg:w-2/3 w-full"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            />
          )}

          {/* Who is it for - Bullet Points */}
          <div className="lg:w-2/3 w-full">
            <div className="flex items-center justify-between mb-2">
              <Text size="sm" fw={500}>
                Who is it for? <span className="text-red-500">*</span>
              </Text>
              <Button
                size="xs"
                variant="light"
                onClick={() => handleAddBulletPoint("whoIsItFor")}
                leftSection={<Plus size={14} />}
              >
                Add Point
              </Button>
            </div>
            <Text size="xs" c="dimmed" mb="sm">
              Add bullet points describing the target audience (e.g., beginners, professionals, students)
            </Text>
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
              {formData.whoIsItFor.map((point, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-gray-600 mt-3">•</span>
                  <TextInput
                    placeholder={`Point ${index + 1}`}
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
                      <X size={14} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* What you will learn - Bullet Points */}
          <div className="lg:w-2/3 w-full">
            <div className="flex items-center justify-between mb-2">
              <Text size="sm" fw={500}>
                What you will learn <span className="text-red-500">*</span>
              </Text>
              <Button
                size="xs"
                variant="light"
                onClick={() => handleAddBulletPoint("whatYouWillLearn")}
                leftSection={<Plus size={14} />}
              >
                Add Point
              </Button>
            </div>
            <Text size="xs" c="dimmed" mb="sm">
              Add bullet points describing key learning outcomes and skills
            </Text>
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
              {formData.whatYouWillLearn.map((point, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-gray-600 mt-3">•</span>
                  <TextInput
                    placeholder={`Learning outcome ${index + 1}`}
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
                      <X size={14} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
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
              label="Choose category"
              className="lg:w-2/3 w-full"
              value={formData.category}
            />
          ) : (
            <TextInput
              label=" Choose Category"
              placeholder="Enter category (e.g., Web Development, Data Science)"
              size="sm"
              className="lg:w-2/3 w-full"
              value={formData.category || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
            />
          )}
          <TextInput
            label="Registration Cost"
            placeholder="Enter cost of registration"
            size="md"
            type="number"
            leftSection={"₹"}
            step={0.01}
            className="lg:w-2/3 w-full"
            name="cost"
            value={formData.cost}
            onChange={handleInputChange}
          />
          <div className="w-2/3 flex flex-row gap-2">
            <Text ta="left">
              *Date and timings are subjected to be changed by the
              administration.
            </Text>
          </div>
          <Button
            radius={999}
            w="400"
            type="submit"
            onClick={handleSubmit}
            disabled={isPending}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
