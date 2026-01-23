import { Button } from "@/components1/ui/button";
import { Input } from "@/components1/ui/input";
import { Label } from "@/components1/ui/label";
import { Link } from "react-router-dom";
import { signInWithGoogle } from "../../lib/firebaseAuth";
import { toast } from "react-toastify";

interface LoginFormProps {
  email: string;
  password: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onGoogleSignIn?: () => void;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  onInputChange,
  onSubmit,
  onGoogleSignIn,
  isLoading,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const handleLoginWithGoogle = async () => {
    if (onGoogleSignIn) {
      onGoogleSignIn();
    } else {
      // Fallback to direct Firebase auth if no prop provided
      try {
        const user = await signInWithGoogle();
        toast.success(`Welcome ${user.displayName || user.email}!`);
      } catch (error: any) {
        console.error("Google OAuth login failed:", error);
        toast.error(error.message || "Failed to sign in with Google");
      }
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl  text-[#202224] mb-2">
          Login as Student
        </h1>
        <p className="text-[#202224] text-lg">
          Enter your credentials to proceed further
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={onInputChange}
            className="h-10 bg-[#F1F4F9] border-gray-300 text-[#49454F] rounded-xl placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-1">
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={onInputChange}
            className="h-10 bg-white border-gray-300 text-gray-800 rounded-xl placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex items-center justify-between text-sm py-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-600">Remember Password</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:text-blue-700 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base transition-all duration-200 transform hover:scale-[1.02] mt-6"
        >
          {isLoading ? "Logging in..." : "LOGIN"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">or sign in with</span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="flex justify-center space-x-4 mb-4">
        {/* Google */}
        <Button
          variant="outline"
          onClick={handleLoginWithGoogle}
          className="h-10 w-10 rounded-full bg-white border-gray-200 hover:bg-gray-50 p-0"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        </Button>

      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:text-blue-700 hover:underline font-semibold"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
