import { Button, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAdmin } from "../../lib/hooks";

type AdminSignInForm = {
  email: string;
  password: string;
};

export default function AdminSignIn() {
  const { user } = useAdmin();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<AdminSignInForm>({
    email: "",
    password: "",
  });

  const { signIn, isSigningIn } = useAdmin({
    extraOnSuccess: () => navigate("/admin/students"),
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

  if (user) return <Navigate to={"/admin/students"} />;

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 space-y-6">
          <div className="text-center space-y-2 mb-8">
            <Title order={1} className="text-3xl font-bold text-gray-900">
              Admin Login
            </Title>
            <Text size="md" c="dimmed" className="text-gray-600">
              Enter your credentials to access the admin panel
            </Text>
          </div>
          <div className="space-y-5">
            <TextInput
              label="Email Address"
              placeholder="admin@example.com"
              size="md"
              radius="md"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              classNames={{
                label: "mb-2 font-medium text-gray-700",
                input: "h-11",
              }}
            />
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              size="md"
              radius="md"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              classNames={{
                label: "mb-2 font-medium text-gray-700",
                input: "h-11",
              }}
            />
            <Button
              radius="md"
              fullWidth
              size="md"
              disabled={isSigningIn}
              type="submit"
              onClick={handleSubmit}
              className="h-11 mt-6 font-semibold bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              {isSigningIn ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
