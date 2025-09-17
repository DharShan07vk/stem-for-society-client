import {
  Button,
  FileInput,
  Modal,
  SegmentedControl,
  Select,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Calendar, ChevronLeft, Upload, UploadCloud } from "lucide-react";
import { useMemo, useState } from "react";
import { FaLocationArrow, FaSpinner } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RichTextEditorNew from "../../components/RichTextEditorNew.client";
import { api } from "../../lib/api";
import { courseCategories, CourseCategoriesType } from "../../lib/data";
import { GenericError, GenericResponse } from "../../lib/types";
import { mutationErrorHandler } from "../../lib/utils";

type UploadSignatureType = {
  signature: string;
  cloudName: string;
  timestamp: string;
  apiKey: string;
};

type VideoUploadResponse = {
  public_id: string | null;
  source: "cloudinary" | "youtube";
  secure_url: string;
};

type PartnerCreateCourseForm = {
  title: string;
  description: string;
  cover: File | null;
  trainingLink: string;
  location: string;
  startDate: Date | null;
  endDate: Date | null;
  cost: number;
  category: CourseCategoriesType | null;
  mode: "ONLINE" | "OFFLINE" | "HYBRID";
  lessons: (
    | {
        title: string;
        content: string;
        video: string;
        type: "ONLINE";
        id: number;
      }
    | {
        title: string;
        location: string;
        type: "OFFLINE";
        id: number;
      }
  )[];
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
      formData.append("trainingLink", data.trainingLink);
      formData.append("location", data.location);
      formData.append("type", data.mode);
      formData.append("category", data.category);
      formData.append("startDate", data.startDate?.toISOString() || "");
      formData.append("endDate", data.endDate?.toISOString() || "");
      formData.append("cost", data.cost.toString());
      if (data.mode !== "OFFLINE") {
        formData.append(
          "lessons",
          JSON.stringify(
            data.lessons.map((less) =>
              less.type === "ONLINE"
                ? {
                    type: "ONLINE",
                    title: less.title,
                    content: less.content,
                    id: less.id,
                    video: less.video,
                  }
                : {
                    type: "OFFLINE",
                    title: less.title,
                    id: less.id,
                    location: less.location,
                  },
            ),
          ),
        );
      }

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

const generateUploadSignature = async () => {
  const signature = await api("partnerAuth").post<
    GenericResponse<UploadSignatureType>
  >("/partner/trainings/sign-asset");
  return signature;
};

async function deleteAsset(publicId: string) {
  const response = await api("partnerAuth").post<GenericResponse>(
    "/partner/trainings/delete-asset",
    { public_id: publicId },
  );
  return response.data;
}

async function uploadToCloudinary(
  file: File,
  signature: UploadSignatureType,
): Promise<VideoUploadResponse | { error: { message: string } }> {
  const url =
    "https://api.cloudinary.com/v1_1/" + signature.cloudName + "/auto/upload";
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", signature.timestamp);
  formData.append("signature", signature.signature);
  formData.append("folder", "signed_upload_demo");
  formData.append("return_delete_token", "true");
  const uploadRequest = await fetch(url, {
    method: "POST",
    body: formData,
  });
  const uploadResponse = await uploadRequest.json();
  return uploadResponse;
}
const VideoUpload = ({
  day,
  type,
  setState,
}: {
  day: number;
  type?: "HYBRID";
  setState: React.Dispatch<React.SetStateAction<PartnerCreateCourseForm>>;
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<
    "waiting" | "uploading" | "uploaded" | "failed"
  >("waiting");
  const [uploadResponse, setUploadResponse] =
    useState<VideoUploadResponse | null>(null);
  const [description, setDescription] = useState<
    | {
        content: string;
        title: string;
      }
    | { title: string; location: string }
  >({
    content: "",
    title: "",
  });
  const [isOnline, setIsOnline] = useState(true);

  // Helper function to update lesson
  const updateLesson = (updates: any) => {
    setState((prev) => ({
      ...prev,
      lessons: prev.lessons.map((lesson) =>
        lesson.id === day
          ? { ...lesson, ...updates }
          : lesson,
      ),
    }));
  };

  return (
    <div className="flex flex-col gap-2 w-full my-5">
      <div className="flex items-center gap-3">
        Day {day}{" "}
        {type === "HYBRID" && (
          <div className="flex gap-2 text-sm items-center">
            ONLINE{" "}
            <Switch
              checked={!isOnline}
              onChange={() => {
                setIsOnline(!isOnline);
                // @ts-expect-error chi
                setState((prev) => ({
                  ...prev,
                  lessons: prev.lessons.map((lesson) =>
                    lesson.id === day
                      ? {
                          ...lesson,
                          type: !isOnline ? "ONLINE" : "OFFLINE",
                        }
                      : lesson,
                  ),
                }));
              }}
            />{" "}
            OFFLINE
          </div>
        )}
      </div>
      <TextInput
        label="Title"
        placeholder="Title for this module"
        className="w-full"
        name="title"
        value={description?.title}
        onChange={(e) => {
          const newTitle = e.target.value;
          setDescription((prev) => ({ ...prev, title: newTitle }));
          updateLesson({ title: newTitle });
        }}
      />
      {isOnline ? (
        <>
          <div
            className="p-2 flex gap-2 pl-3 cursor-pointer text-gray-400 rounded-md border bg-white text-sm"
            onClick={() => setModalOpen(true)}
          >
            <UploadCloud />
            {uploadResponse ? (
              <>
                {uploadStatus === "uploading" && (
                  <p className="mt-2 flex gap-2 items-center text-xs text-gray-700">
                    <FaSpinner className="animate-spin" />
                    Uploading...
                  </p>
                )}
                {uploadStatus === "failed" && (
                  <p className="mt-2 flex gap-2 items-center text-xs text-red-500">
                    <MdError />
                    Upload failed! Please try again!
                  </p>
                )}
                {uploadResponse?.source === "cloudinary" ? (
                  uploadStatus === "uploaded" && (
                    <>
                      Video URL:{" "}
                      <Link to={uploadResponse.secure_url} target="_blank">
                        {uploadResponse.secure_url}
                      </Link>
                    </>
                  )
                ) : (
                  <>
                    Youtube URL:{" "}
                    <Link to={uploadResponse.secure_url} target="_blank">
                      {uploadResponse.secure_url}
                    </Link>
                  </>
                )}
              </>
            ) : (
              "Click here to upload videos"
            )}
          </div>
          <RichTextEditorNew
            // @ts-expect-error mas
            value={description?.content || ""}
            onChange={(val) => {
              setDescription((prev) => ({ ...prev, content: val }));
              updateLesson({ content: val });
            }}
          />
        </>
      ) : (
        <TextInput
          label="Location"
          placeholder="Enter address or city"
          leftSection={<FaLocationArrow size={13} />}
          className="w-full"
          name="location"
          // @ts-expect-error ma3
          value={description.location || ""}
          onChange={(e) => {
            const newLocation = e.target.value;
            setDescription((prev) => ({ ...prev, location: newLocation }));
            updateLesson({ location: newLocation });
          }}
        />
      )}
      <Modal
        onClose={() => setModalOpen(!modalOpen)}
        opened={modalOpen}
        title={"Select video for lesson"}
        classNames={{
          body: "flex flex-col gap-3",
        }}
      >
        <FileInput
          label="Video"
          placeholder="Choose a video file"
          accept="video/*"
          onChange={async (file) => {
            setUploadStatus("uploading");
            if (!file && uploadResponse?.public_id) {
              await deleteAsset(uploadResponse.public_id);
              setUploadStatus("waiting");
              setUploadResponse(null);
              updateLesson({ video: "" });
              return;
            }
            if (!file) {
              return;
            }
            try {
              const signature = await generateUploadSignature();
              const upload = await uploadToCloudinary(file, signature.data.data);
              console.log("🚀 ~ onChange={ ~ upload:", upload);
              if ("error" in upload) {
                setUploadStatus("failed");
                toast.error(upload.error.message);
                return;
              }
              setUploadStatus("uploaded");
              const response = { ...upload, source: "cloudinary" as const };
              setUploadResponse(response);
              updateLesson({ video: upload.secure_url });
            } catch (error) {
              setUploadStatus("failed");
              toast.error("Upload failed. Please try again.");
            }
          }}
          className="w-full"
          leftSection={<Upload size={16} />}
          clearable
        />
        {uploadStatus === "uploading" && (
          <p className="mt-2 flex gap-2 items-center text-xs text-gray-700">
            <FaSpinner className="animate-spin" />
            Uploading...
          </p>
        )}
        {uploadStatus === "failed" && (
          <p className="mt-2 flex gap-2 items-center text-xs text-red-500">
            <MdError />
            Upload failed! Please try again!
          </p>
        )}
        <div className="flex justify-between gap-4 items-center">
          <hr className="border-none bg-gray-300 h-[1px] w-full" />
          <span className="text-gray-500 text-sm">OR</span>
          <hr className="border-none bg-gray-300 h-[1px] w-full" />
        </div>
        {uploadStatus === "waiting" && (
          <TextInput
            label="Youtube URL"
            placeholder="https://youtube.com/watch?v=xxxxxxx"
            value={
              uploadResponse?.source === "youtube"
                ? uploadResponse.secure_url
                : ""
            }
            onChange={(e) => {
              const youtubeUrl = e.target.value;
              const response = {
                secure_url: youtubeUrl,
                public_id: null,
                source: "youtube" as const,
              };
              setUploadResponse(response);
              updateLesson({ video: youtubeUrl });
            }}
          />
        )}
        <Button onClick={() => setModalOpen(false)}>Save</Button>
      </Modal>
    </div>
  );
};

export default function PartnerCreateCourse() {
  const [formData, setFormData] = useState<PartnerCreateCourseForm>({
    title: "",
    description: "",
    cover: null,
    trainingLink: "",
    location: "",
    startDate: null,
    endDate: null,
    cost: 0,
    category: null,
    mode: "ONLINE",
    lessons: [],
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

  const numberOfDays = useMemo(() => {
  if (formData.startDate && formData.endDate) {
    const start = new Date(formData.startDate).getTime();
    const end = new Date(formData.endDate).getTime();
    const final = 1 + Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    
    if (formData.lessons.length !== final) {
      setFormData((prev) => ({
        ...prev,
        lessons: Array.from({ length: final }, (_, index) => {
          const existingLesson = prev.lessons.find(l => l.id === index + 1);          return existingLesson || {
            title: "",
            content: "",
            video: "",
            type: "ONLINE" as const,
            id: index + 1,
          };
        }),
      }));
    }
    return final;
  }
  return 0;
}, [formData.startDate, formData.endDate]);
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
          <div className="flex items-center w-2/3 gap-3">
            <span className="text-sm">Mode</span>
            <SegmentedControl
              data={["ONLINE", "OFFLINE", "HYBRID"]}
              onChange={(val) =>
                handleInputChange({ target: { value: val, name: "mode" } })
              }
            />
          </div>
          {formData.startDate &&
            formData.endDate &&
            (formData.mode === "ONLINE" ? (
              <div className="lg:w-2/3 w-full space-y-6">
                {[...Array(numberOfDays)].map((_, index) => (
                  <VideoUpload
                    day={index + 1}
                    key={index}
                    setState={setFormData}
                  />
                ))}
              </div>
            ) : formData.mode === "HYBRID" ? (
              <div className="lg:w-2/3 w-full">
                {[...Array(numberOfDays)].map((_, index) => (
                  <VideoUpload
                    day={index + 1}
                    key={index}
                    type="HYBRID"
                    setState={setFormData}
                  />
                ))}
              </div>
            ) : (
              <TextInput
                label="Location"
                placeholder="Enter address or city"
                size="md"
                leftSection={<FaLocationArrow size={13} />}
                className="lg:w-2/3 w-full mt-4"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            ))}
          <Select
            data={courseCategories}
            clearable={false}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                category: value as PartnerCreateCourseForm["category"],
              }))
            }
            label="Choose category"
            className="lg:w-2/3 w-full"
            value={formData.category}
          />
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
