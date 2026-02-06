import { Button, Paper, Text, TextInput, Title } from "@mantine/core";
import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { usePartner } from "../../lib/hooks";

type PartnerSignInForm = {
  email: string;
  password: string;
};

export default function PartnerSignIn() {
  const { user } = usePartner();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<PartnerSignInForm>({
    email: "",
    password: "",
  });

  const { signIn, isSigningIn } = usePartner({
    extraOnSuccess: () => navigate("/partner"),
  });

  const handleSubmit = () => {
    signIn(formData);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (user) return <Navigate to={"/partner"} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <Paper
        p="xl"
        withBorder
        shadow="md"
        className="w-full max-w-md rounded-2xl animate-in zoom-in duration-500 bg-white"
      >
        <div className="text-center space-y-2 mb-8">
          <Title order={2} className="text-gray-900">
            Partner Login
          </Title>
          <Text size="sm" c="dimmed">
            Enter your credentials to access your dashboard
          </Text>
        </div>
        
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <TextInput
            label="Email Address"
            placeholder="Enter your email"
            size="md"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            leftSection={<Mail size={16} className="text-gray-500" />}
            classNames={{
              input: "transition-all duration-200 focus:shadow-sm",
            }}
          />
          <TextInput
            label="Password"
            placeholder="Enter your password"
            size="md"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleInputChange}
            leftSection={<Lock size={16} className="text-gray-500" />}
            classNames={{
              input: "transition-all duration-200 focus:shadow-sm",
            }}
          />
          <Button
            fullWidth
            size="md"
            radius="md"
            disabled={isSigningIn}
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:shadow-md mt-6"
          >
            {isSigningIn ? "Signing in..." : "Login"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Text size="sm" c="dimmed">
            Want to partner with us?{" "}
            <Link to={"/partner/signup"}>
              <Text span c="blue" fw={500} className="hover:underline transition-all">
                Sign up now
              </Text>
            </Link>
          </Text>
        </div>
      </Paper>
    </div>
  );
}
