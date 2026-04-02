import {
  ActionIcon,
  Button,
  Card,
  Container,
  FileInput,
  Grid,
  Group,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as z from "zod";
import Loading from "../../components/Loading";
import PartnerErrorHandler from "../../components/PartnerErrorHandler";
import { api } from "../../lib/api";
import { GenericError, GenericResponse } from "../../lib/types";
import { mutationErrorHandler } from "../../lib/utils";
import { PartnerTrainingResponse } from "./PartnerTrainings";

const courseFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  cost: z.number().min(0, "Cost cannot be negative"),
  cut: z.number().min(0).max(100, "Payout must be between 0 and 100"),
  type: z.enum(["ONLINE", "OFFLINE"]),
  location: z.string().optional(),
  link: z.string().url("Must be a valid URL").nullable().or(z.literal("")),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  whoIsItFor: z.array(z.string()).min(1, "Add at least one entry"),
  whatYouWillLearn: z.array(z.string()).min(1, "Add at least one entry"),
  lessons: z
    .array(
      z.object({
        title: z.string().min(3, "Lesson title is required"),
        content: z.string().min(10, "Lesson content is required"),
        type: z.enum(["ONLINE", "OFFLINE"]),
        video: z.string().url("Valid URL required").nullable().or(z.literal("")),
        lastDate: z.date({ required_error: "Lesson date is required" }),
      }),
    )
    .optional(),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

export default function PartnerEditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const { data: trainingData, isLoading, error } = useQuery<
    GenericResponse<PartnerTrainingResponse>,
    AxiosError<GenericError>
  >({
    queryKey: ["partner", "trainings", id],
    queryFn: async () =>
      (await api("partnerAuth").get(`/partner/trainings/${id}`)).data,
  });

  const form = useForm<CourseFormValues>({
    initialValues: {
      title: "",
      description: "",
      category: "",
      cost: 0,
      cut: 70,
      type: "ONLINE",
      location: "",
      link: "",
      startDate: new Date(),
      endDate: new Date(),
      startTime: "",
      endTime: "",
      whoIsItFor: [""],
      whatYouWillLearn: [""],
      lessons: [
        {
          title: "",
          content: "",
          type: "ONLINE",
          video: "",
          lastDate: new Date(),
        },
      ],
    },
    validate: zodResolver(courseFormSchema),
  });

  useEffect(() => {
    if (trainingData?.data) {
      const t = trainingData.data;

      // Handle bullet points which might be JSON strings or arrays
      const parseBulletPoints = (val: any) => {
        if (Array.isArray(val)) return val;
        if (typeof val === "string") {
          try {
            return JSON.parse(val);
          } catch {
            return [val];
          }
        }
        return [""];
      };

      form.setValues({
        title: t.title || "",
        description: t.description || "",
        category: t.category || "",
        cost: Number(t.cost) || 0,
        cut: t.cut || 70,
        type: t.type === "OFFLINE" ? "OFFLINE" : "ONLINE",
        location: t.location || "",
        link: t.link || "",
        startDate: t.startDate ? new Date(t.startDate) : new Date(),
        endDate: t.endDate ? new Date(t.endDate) : new Date(),
        startTime: t.startDate
          ? new Date(t.startDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "",
        endTime: t.endDate
          ? new Date(t.endDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "",
        whoIsItFor: parseBulletPoints((t as any).whoIsItFor),
        whatYouWillLearn: parseBulletPoints((t as any).whatYouWillLearn),
        lessons: (t.lessons || []).map((l: any) => ({
          title: l.title || "",
          content: l.content || "",
          type: l.type === "OFFLINE" ? "OFFLINE" : "ONLINE",
          video: l.video || "",
          lastDate: l.lastDate ? new Date(l.lastDate) : new Date(),
        })),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainingData]);

  const updateMutation = useMutation<
    GenericResponse,
    AxiosError<GenericError>,
    FormData
  >({
    mutationFn: async (formData) => {
      return (
        await api("partnerAuth").patch(`/partner/trainings/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).data;
    },
    onSuccess: (res) => {
      toast.success(res.message || "Course updated successfully");
      queryClient.invalidateQueries({ queryKey: ["partner", "trainings"] });
      navigate(`/partner/trainings/${id}`);
    },
    onError: (err) => mutationErrorHandler(err, navigate, "/partner/signin"),
  });

  const handleSubmit = (values: CourseFormValues) => {
    const formData = new FormData();

    // Prepare dates with times
    const start = new Date(values.startDate);
    const [startH, startM] = values.startTime.split(":").map(Number);
    start.setHours(startH, startM);

    const end = new Date(values.endDate);
    const [endH, endM] = values.endTime.split(":").map(Number);
    end.setHours(endH, endM);

    const payload = {
      ...values,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      whoIsItFor: JSON.stringify(values.whoIsItFor.filter((i) => i.trim())),
      whatYouWillLearn: JSON.stringify(
        values.whatYouWillLearn.filter((i) => i.trim()),
      ),
      lessons: JSON.stringify(
        values.lessons.map((l) => ({
          ...l,
          lastDate: l.lastDate.toISOString(),
        })),
      ),
    };

    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    if (coverImage) {
      formData.append("cover", coverImage);
    }

    updateMutation.mutate(formData);
  };

  if (isLoading) return <Loading />;
  if (error) return <PartnerErrorHandler error={error} />;

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <Link to="/partner/trainings">
              <ActionIcon variant="subtle" size="lg" radius="md">
                <ChevronLeft size={24} />
              </ActionIcon>
            </Link>
            <div>
              <Title order={2} className="text-gray-900">
                Edit Training Course
              </Title>
              <Text size="sm" c="dimmed">
                Modify your course details and curriculum
              </Text>
            </div>
          </Group>
          <Button
            size="md"
            radius="md"
            onClick={() => {
              const validation = form.validate();
              if (validation.hasErrors) {
                console.error("Form validation failed:", validation.errors);
                toast.error("Please fix the errors in the form before saving.");
              } else {
                form.onSubmit(handleSubmit)();
              }
            }}
            loading={updateMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Changes
          </Button>
        </Group>

        <form>
          <Grid gutter="xl">
            {/* Basic Information */}
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Stack gap="md">
                <Card withBorder radius="md" p="xl" className="shadow-sm">
                  <Stack gap="lg">
                    <Title order={4}>Basic Information</Title>
                    <TextInput
                      label="Course Title"
                      placeholder="e.g. Advanced STEM Leadership"
                      required
                      {...form.getInputProps("title")}
                      radius="md"
                    />
                    <Textarea
                      label="Course Description"
                      placeholder="Describe what this course is about..."
                      required
                      minRows={4}
                      {...form.getInputProps("description")}
                      radius="md"
                    />
                    <Grid>
                      <Grid.Col span={6}>
                        <Select
                          label="Category"
                          placeholder="Select category"
                          data={["Technology", "Science", "Engineering", "Mathematics", "Business", "Arts"]}
                          required
                          {...form.getInputProps("category")}
                          radius="md"
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <NumberInput
                          label="Course Cost (₹)"
                          placeholder="0 for free"
                          min={0}
                          required
                          {...form.getInputProps("cost")}
                          radius="md"
                        />
                      </Grid.Col>
                    </Grid>
                  </Stack>
                </Card>

                {/* Logistics & Schedule */}
                <Card withBorder radius="md" p="xl" className="shadow-sm">
                  <Stack gap="lg">
                    <Title order={4}>Logistics & Schedule</Title>
                    <Grid>
                      <Grid.Col span={6}>
                        <Select
                          label="Delivery Type"
                          data={[
                            { label: "Online", value: "ONLINE" },
                            { label: "Offline", value: "OFFLINE" },
                          ]}
                          required
                          {...form.getInputProps("type")}
                          radius="md"
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        {form.values.type === "ONLINE" ? (
                          <TextInput
                            label="Meeting Link"
                            placeholder="Zoom/Meet URL"
                            {...form.getInputProps("link")}
                            radius="md"
                          />
                        ) : (
                          <TextInput
                            label="Physical Location"
                            placeholder="Venue address"
                            {...form.getInputProps("location")}
                            radius="md"
                          />
                        )}
                      </Grid.Col>
                    </Grid>

                    <Grid gutter="md">
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <DateInput
                          label="Start Date"
                          required
                          {...form.getInputProps("startDate")}
                          radius="md"
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <TimeInput
                          label="Start Time"
                          required
                          {...form.getInputProps("startTime")}
                          radius="md"
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <DateInput
                          label="End Date"
                          required
                          {...form.getInputProps("endDate")}
                          radius="md"
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <TimeInput
                          label="End Time"
                          required
                          {...form.getInputProps("endTime")}
                          radius="md"
                        />
                      </Grid.Col>
                    </Grid>
                  </Stack>
                </Card>

                {/* Course Content / Curriculum */}
                <Card withBorder radius="md" p="xl" className="shadow-sm">
                  <Stack gap="lg">
                    <Group justify="space-between">
                      <Title order={4}>Curriculum (Lessons)</Title>
                      <Button
                        variant="light"
                        size="xs"
                        leftSection={<Plus size={14} />}
                        onClick={() =>
                          form.insertListItem("lessons", {
                            title: "",
                            content: "",
                            type: "ONLINE",
                            video: "",
                            lastDate: new Date(),
                          })
                        }
                      >
                        Add Lesson
                      </Button>
                    </Group>

                    {form.values.lessons.map((_, index) => (
                      <Card key={index} withBorder radius="sm" p="md" bg="gray.0">
                        <Stack gap="sm">
                          <Group justify="space-between">
                            <Text fw={600} size="sm">Lesson #{index + 1}</Text>
                            <ActionIcon
                              color="red"
                              variant="subtle"
                              onClick={() => form.removeListItem("lessons", index)}
                              disabled={form.values.lessons.length === 1}
                            >
                              <Trash2 size={16} />
                            </ActionIcon>
                          </Group>
                          <TextInput
                            label="Lesson Title"
                            placeholder="What will be covered?"
                            required
                            {...form.getInputProps(`lessons.${index}.title`)}
                            radius="md"
                          />
                          <Textarea
                            label="Brief Content"
                            placeholder="Topics, exercises, or instructions..."
                            required
                            {...form.getInputProps(`lessons.${index}.content`)}
                            radius="md"
                          />
                          <Grid>
                            <Grid.Col span={6}>
                              <DateInput
                                label="Scheduled Date"
                                required
                                {...form.getInputProps(`lessons.${index}.lastDate`)}
                                radius="md"
                              />
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <TextInput
                                label="Video/Resource URL (Optional)"
                                placeholder="YouTube/Drive Link"
                                {...form.getInputProps(`lessons.${index}.video`)}
                                radius="md"
                              />
                            </Grid.Col>
                          </Grid>
                        </Stack>
                      </Card>
                    ))}
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>

            {/* Sidebar Widgets */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="md">
                {/* Media Upload */}
                <Card withBorder radius="md" p="xl" className="shadow-sm">
                  <Stack gap="md">
                    <Title order={4} size="h5">Course Media</Title>
                    <FileInput
                      label="Change Cover Image"
                      placeholder={trainingData?.data.coverImg ? "Image already exists" : "Choose new image"}
                      leftSection={<Upload size={16} />}
                      accept="image/*"
                      onChange={setCoverImage}
                      radius="md"
                    />
                    {trainingData?.data.coverImg && !coverImage && (
                      <div className="mt-2 text-center">
                        <img
                          src={trainingData.data.coverImg}
                          alt="Current cover"
                          className="w-full h-32 object-cover rounded-md border"
                        />
                        <Text size="xs" c="dimmed" mt={4}>Current active cover</Text>
                      </div>
                    )}
                  </Stack>
                </Card>

                {/* Target Audience & Outcomes */}
                <Card withBorder radius="md" p="xl" className="shadow-sm">
                  <Stack gap="lg">
                    <Title order={4} size="h5">Additional Details</Title>
                    
                    <Stack gap="xs">
                      <Group justify="space-between">
                        <Text size="sm" fw={600}>Who is it for?</Text>
                        <ActionIcon 
                          size="xs" 
                          variant="light" 
                          onClick={() => form.insertListItem("whoIsItFor", "")}
                        >
                          <Plus size={12} />
                        </ActionIcon>
                      </Group>
                      {form.values.whoIsItFor.map((_, index) => (
                        <Group key={index} gap="xs">
                          <TextInput
                            placeholder="e.g. Graduate Students"
                            style={{ flex: 1 }}
                            {...form.getInputProps(`whoIsItFor.${index}`)}
                            radius="md"
                          />
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            onClick={() => form.removeListItem("whoIsItFor", index)}
                            disabled={form.values.whoIsItFor.length === 1}
                          >
                            <Trash2 size={14} />
                          </ActionIcon>
                        </Group>
                      ))}
                    </Stack>

                    <Stack gap="xs">
                      <Group justify="space-between">
                        <Text size="sm" fw={600}>Key Outcomes</Text>
                        <ActionIcon 
                          size="xs" 
                          variant="light" 
                          onClick={() => form.insertListItem("whatYouWillLearn", "")}
                        >
                          <Plus size={12} />
                        </ActionIcon>
                      </Group>
                      {form.values.whatYouWillLearn.map((_, index) => (
                        <Group key={index} gap="xs">
                          <TextInput
                            placeholder="e.g. Learn UI components"
                            style={{ flex: 1 }}
                            {...form.getInputProps(`whatYouWillLearn.${index}`)}
                            radius="md"
                          />
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            onClick={() => form.removeListItem("whatYouWillLearn", index)}
                            disabled={form.values.whatYouWillLearn.length === 1}
                          >
                            <Trash2 size={14} />
                          </ActionIcon>
                        </Group>
                      ))}
                    </Stack>
                  </Stack>
                </Card>

                {/* Instructor Payout Info (Read-only for safety/reference) */}
                <Card withBorder radius="md" p="xl" className="bg-blue-50/50">
                  <Stack gap="xs">
                    <Text fw={600} size="sm">Partner Payout</Text>
                    <Text size="xl" fw={700} c="blue">{form.values.cut}%</Text>
                    <Text size="xs" c="dimmed">You will receive {form.values.cut}% of the enrollment fees. This is set globally for your institution.</Text>
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>
          </Grid>
        </form>
      </Stack>
    </Container>
  );
}
