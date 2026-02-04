import { Button, Text } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ChevronLeft } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BlogContent from "../../components/BlogContent";
import Errorbox from "../../components/Errorbox";
import Loading from "../../components/Loading";
import { api, queryClient } from "../../lib/api";
import { GenericError, GenericResponse } from "../../lib/types";
import { mutationErrorHandler } from "../../lib/utils";
import { Blog } from "../BlogListing";

export type AdminBlogDetails = Blog & {
  approvedBy: string;
  blogAuthor: Blog["blogAuthor"] & {
    linkedin: string;
    mobile: string;
    email: string;
  };
};

function useAdminBlogDetails(id: string) {
  return useQuery<GenericResponse<AdminBlogDetails>, AxiosError<GenericError>>({
    queryKey: ["admin", "blogs", id],
    queryFn: async () => (await api("adminAuth").get(`/blogs/${id}`)).data,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id, // Ensure query only runs if `id` is defined
  });
}

function useAdminBlogsApproval(id?: string) {
  const navigate = useNavigate();
  return useMutation<
    GenericResponse,
    AxiosError<GenericError>,
    "approve" | "reject"
  >({
    mutationFn: async (data) =>
      (await api("adminAuth").post(`/blogs/${id}/approve`, { intent: data }))
        .data,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["admin", "blogs", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "blogs"] });
    },
    onError: (err) => mutationErrorHandler(err, navigate, "/admin/signin"),
  });
}

export default function AdminBlogSpotlight() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useAdminBlogDetails(id || "");
  const { mutate, isPending } = useAdminBlogsApproval(id);

  useEffect(() => {
    if (error) mutationErrorHandler(error, navigate, "/admin/signin");
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [error]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Errorbox message={error.message} />;
  }

  const blog = data?.data;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="subtle"
          leftSection={<ChevronLeft size={18} />}
          radius="md"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>

      {!blog || Object.keys(blog).length === 0 ? (
        <Errorbox message="No data! Must be an invalid link. Please refresh or go back and try again" />
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
              {blog.title}
            </h1>
            <div>
              {!blog.approvedBy ? (
                <Button
                  radius="md"
                  variant="filled"
                  color="green"
                  onClick={() => mutate("approve")}
                  disabled={isPending || isLoading}
                  size="md"
                >
                  Approve Blog
                </Button>
              ) : (
                <Button
                  radius="md"
                  variant="filled"
                  color="red"
                  onClick={() => mutate("reject")}
                  disabled={isPending || isLoading}
                  size="md"
                >
                  Reject Blog
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              {blog.coverImage && (
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full object-cover aspect-video rounded-lg mb-6"
                />
              )}
              <div className="prose max-w-none">
                <BlogContent markdownContent={blog.content}></BlogContent>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 space-y-4 sticky top-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Author Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <Text size="xs" c="dimmed" className="uppercase tracking-wide">
                      Name
                    </Text>
                    <Text size="sm" fw={500} className="text-gray-900">
                      {blog.blogAuthor.name}
                    </Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed" className="uppercase tracking-wide">
                      Email
                    </Text>
                    <Text size="sm" fw={500} className="text-gray-900">
                      {blog.blogAuthor.email}
                    </Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed" className="uppercase tracking-wide">
                      Mobile
                    </Text>
                    <Text size="sm" fw={500} className="text-gray-900">
                      {blog.blogAuthor.mobile}
                    </Text>
                  </div>
                  {blog.blogAuthor.linkedin && (
                    <div>
                      <Text size="xs" c="dimmed" className="uppercase tracking-wide">
                        LinkedIn
                      </Text>
                      <Link
                        to={blog.blogAuthor.linkedin}
                        target="_blank"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View Profile
                      </Link>
                    </div>
                  )}
                  {blog.references && blog.references.length > 0 && (
                    <div>
                      <Text size="xs" c="dimmed" className="uppercase tracking-wide mb-2">
                        References
                      </Text>
                      <div className="space-y-1">
                        {blog.references.map((ref, idx) => (
                          <Link
                            key={idx}
                            to={ref}
                            target="_blank"
                            className="block text-blue-600 hover:underline text-xs break-all"
                          >
                            {ref}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
