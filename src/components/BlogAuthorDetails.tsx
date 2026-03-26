import { Button, Image, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import bg from "../assets/bg.webp";
import { queryClient } from "../lib/api";
import { useBlogStepper } from "../lib/hooks";
import { useQuery } from "@tanstack/react-query";

export const OverlayedImage: React.FC = () => {
  return (
    <div className="relative">
      {/* Image */}
      <Image src={bg} radius="sm" alt="Background" />

      {/* Black transparent layer */}
      <div className="absolute inset-0 bg-black opacity-5  rounded-md"></div>
    </div>
  );
};

export type AuthorDetails = {
  name: string;
  phoneNumber: string;
  emailAddress: string;
  linkedInProfileUrl: string;
  designation: string;
};

function BlogAuthorDetails() {
  const { data: existingAuthorDetails } = useQuery<AuthorDetails | undefined>({
    queryKey: ["blog", "authorDetails"],
    staleTime: Infinity,
    gcTime: Infinity,
  });
  const [formData, setFormData] = useState(
    existingAuthorDetails ?? {
      name: "",
      phoneNumber: "",
      emailAddress: "",
      linkedInProfileUrl: "",
      designation: "",
    },
  );
  const { setActive } = useBlogStepper();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    queryClient.setQueryData(["blog", "authorDetails"], formData);
    setActive(1);
  };

  return (
    <div className="flex flex-row h-full w-full p-6 gap-5 shadow-md">
      <form
        className="flex-1 flex items-center justify-center flex-col w-full gap-5"
        onSubmit={handleSubmit}
      >
        <Title order={4}>Author Details</Title>
        <TextInput
          label="Name"
          name="name"
          description="Enter your full name"
          placeholder="John Doe"
          size="md"
          className="w-full"
          required
          value={formData.name}
          onChange={handleChange}
        />
        <TextInput
          label="Phone Number"
          name="phoneNumber"
          placeholder="+1 234 567 890"
          size="md"
          className="w-full"
          required
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        <TextInput
          label="Email Address"
          name="emailAddress"
          placeholder="example@example.com"
          size="md"
          type="email"
          className="w-full"
          required
          value={formData.emailAddress}
          onChange={handleChange}
        />
        <TextInput
          label="LinkedIn Profile URL"
          name="linkedInProfileUrl"
          placeholder="https://www.linkedin.com/in/username"
          size="md"
          className="w-full"
          type="url"
          required
          value={formData.linkedInProfileUrl}
          onChange={handleChange}
        />
        <TextInput
          label="Designation"
          name="designation"
          placeholder="Software Engineer"
          size="md"
          className="w-full"
          value={formData.designation}
          onChange={handleChange}
        />
        {/* Don't know what this affiliation is used for */}
        {/* <TextInput
          label="Affiliation"
          name="affiliation"
          placeholder="Tech Company"
          size="md"
          className="w-full"
          value={formData.affiliation}
          onChange={handleChange}
        /> */}
        <Button radius={999} type="submit" w="100%">
          Next
        </Button>
      </form>
      <div className="flex-1 h-full hidden md:block">
        <OverlayedImage />
      </div>
    </div>
  );
}

export default BlogAuthorDetails;
