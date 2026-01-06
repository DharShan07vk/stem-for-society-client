import { Button, Title } from "@mantine/core";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import BlogAuthorDetails from "../components/BlogAuthorDetails";
import BlogDetails from "../components/BlogDetails";
import BlogStepper from "../components/BlogStepper";
import { BlogStepperProvider } from "../lib/context";
import BlogWrite from "../components/BlogWrite";

function BlogCreate() {
  return (
    <div className="w-full my-4">
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 flex flex-col">
        <Link to={"../"}>
          <Button radius={999}>
            <ChevronLeft size={16} />
            Back
          </Button>
        </Link>
        <div className="mb-10 flex flex-col gap-5">
          <Title order={2} className="mt-5 sm:mt-20">
            Write for the Community.
          </Title>
          <BlogStepperProvider>
            <BlogStepper
              step1Content={<BlogAuthorDetails />}
              step2Content={<BlogWrite />}
              step3Content={<BlogDetails />}
            />
          </BlogStepperProvider>
        </div>
      </div>
    </div>
  );
}

export default BlogCreate;
