import { Badge, Button, Input, Pill, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Errorbox from "../../components/Errorbox";
import Loading from "../../components/Loading";
import Table from "../../components/Table";
import { api } from "../../lib/api";
import { GenericError, GenericResponse } from "../../lib/types";
import { formatDate, mutationErrorHandler } from "../../lib/utils";
import { Blog } from "../BlogListing";

export type AdminBlogType = Blog & { approvedBy: string };

function useAdminBlogs() {
  return useQuery<GenericResponse<AdminBlogType[]>, AxiosError<GenericError>>({
    queryKey: ["admin", "blogs"],
    queryFn: async () => (await api("adminAuth").get("/blogs")).data,
    staleTime: 1000 * 60 * 5,
  });
}

export default function AdminBlogs() {
  const { data, isLoading, error } = useAdminBlogs();
  const navigate = useNavigate();
  const [search, setSearch] = useState<string | undefined>("");

  const filteredBlogs = useMemo(() => {
    if (!data) return [];
    return data.data.filter(
      (blog) =>
        blog.title.toLowerCase().includes(search?.toLowerCase() || "") ||
        blog.blogAuthor.name
          .toLowerCase()
          .includes(search?.toLowerCase() || "") ||
        (blog.references &&
          blog.references
            .join("")
            .toLowerCase()
            .includes(search?.toLowerCase() || "")) ||
        formatDate(blog.createdAt)
          .toLowerCase()
          .includes(search?.toLowerCase() || ""),
    );
  }, [data, search]);

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

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Blogs</h1>
            <Text size="sm" c="dimmed" className="text-gray-500">
              Review and manage blog submissions
            </Text>
          </div>
          <Input
            leftSection={<Search size={18} />}
            placeholder="Search blogs..."
            type="search"
            value={search}
            radius="md"
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80"
            classNames={{
              input: "h-10",
            }}
          />
        </div>
        {!data ? (
          <Errorbox message="Cannot get data due to some unknown error" />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <Table
              headers={[
                { render: "S.No", className: "w-[6%] text-left pl-4" },
                { render: "Blog Title", className: "text-left" },
                { render: "Author", className: "text-left" },
                { render: "References", className: "text-left" },
                { render: "Created On", className: "text-left" },
                { render: "Status", className: "text-center" },
                { render: "Actions", className: "w-[12%] text-center" },
              ]}
              classNames={{
                root: "bg-white",
                header: "bg-gray-50",
                body: "divide-y divide-gray-100",
                row: "hover:bg-gray-50 transition-colors",
              }}
              rows={filteredBlogs.map((r, i) => ({
                id: r.id,
                cells: [
                  {
                    render: (
                      <span className="text-gray-600 font-medium">{i + 1}</span>
                    ),
                    className: "text-left pl-4",
                  },
                  {
                    render: (
                      <span className="font-medium text-gray-900 line-clamp-1">
                        {r.title}
                      </span>
                    ),
                    className: "text-left max-w-xs",
                  },
                  {
                    render: (
                      <span className="text-gray-700 text-sm">
                        {r.blogAuthor.name}
                      </span>
                    ),
                    className: "text-left",
                  },
                  {
                    render: (
                      <div className="flex flex-wrap gap-1">
                        {r.references && r.references.length > 0 ? (
                          r.references.slice(0, 2).map((ref) => (
                            <Link key={ref} to={ref} target="_blank">
                              <Pill size="sm" className="text-xs">
                                DOI
                              </Pill>
                            </Link>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )}
                      </div>
                    ),
                    className: "text-left",
                  },
                  {
                    render: (
                      <span className="text-gray-600 text-sm">
                        {formatDate(r.createdAt)}
                      </span>
                    ),
                    className: "text-left",
                  },
                  {
                    render: (
                      <Badge
                        color={r.approvedBy ? "green" : "yellow"}
                        variant="light"
                        size="sm"
                      >
                        {r.approvedBy ? "Approved" : "Pending"}
                      </Badge>
                    ),
                    className: "text-center",
                  },
                  {
                    render: (
                      <Link to={`/admin/blogs/${r.slug}`}>
                        <Button size="xs" variant="light" radius="md">
                          View
                        </Button>
                      </Link>
                    ),
                    className: "text-center",
                  },
                ],
              }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}
