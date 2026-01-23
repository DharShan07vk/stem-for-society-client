import { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../lib/hooks";
import { signInWithGoogle } from "../lib/firebaseAuth";
import { API_URL } from "../Constants";
import LoginStages from "@/components1/ui/LoginStages";
import LoginForm from "@/components1/ui/LoginForm";
import { queryClient } from "@/lib/api";

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  const { signIn, isSigningIn, user } = useUser({
    extraOnSuccess: () => {
      toast.success("Login was successful!");
      setIsGoogleSigningIn(false);
    },
  });

  // Google sign-in function - with proper cancellation handling
  const handleGoogleSignIn = async () => {
    try {
      // Disable all background activities
      setIsGoogleSigningIn(true);      
      const firebaseUser = await signInWithGoogle();
      
      const googleEmail = firebaseUser.email!;
      // Create a CONSISTENT password based on Firebase UID (not random)
      const googlePassword = `Google${firebaseUser.uid.substring(0, 6)}123@!`;
      const firstName = (firebaseUser.displayName?.split(' ')[0] || 'GoogleUser').padEnd(5, 'X');
      const lastName = firebaseUser.displayName?.split(' ').slice(1).join(' ') || '';
      
      // Generate unique mobile number from Firebase UID
      const generateUniqueeMobile = (uid: string): string => {
        const uidNumbers = uid.replace(/[^0-9]/g, '').substring(0, 9);
        const mobile = `7${uidNumbers.padEnd(9, '0').substring(0, 9)}`;
        return mobile;
      };
      
      const uniqueMobile = generateUniqueeMobile(firebaseUser.uid);
      
      // CLEAR PREVIOUS SESSION DATA BEFORE NEW LOGIN
      queryClient.clear();
      localStorage.clear();
      
      // Always try registration first (will fail silently if user exists)
      fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: googleEmail,
          firstName, lastName,
          password: googlePassword,
          confirmPassword: googlePassword,
          mobile: uniqueMobile,
        }),
      }).catch(() => {}); // Ignore registration errors
      
      // Immediately attempt login (works for both new and existing users)
      signIn({
        email: googleEmail,
        password: googlePassword
      });
      
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      // Check if user cancelled the sign-in process
      if (error.code === 'auth/popup-closed-by-user' || 
          error.code === 'auth/cancelled-popup-request' ||
          error.code === 'auth/popup-blocked' ||
          error.message?.includes('popup') ||
          error.message?.includes('cancelled') ||
          error.message?.includes('closed') ||
          error.message?.includes('aborted')) {
        // User cancelled - don't show error toast, just reset loading state
        console.log('User cancelled Google sign-in');
      } else {
        // Show error for actual failures
        toast.error(error.message || "Failed to sign in with Google");
      }
      
      // Always reset loading state when there's any error
      setIsGoogleSigningIn(false);
    }
  };

  if (user) return <Navigate to={"/"} />;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (formData.email && formData.password) {
      // CLEAR PREVIOUS SESSION DATA BEFORE NEW LOGIN
      queryClient.clear();
      localStorage.clear();
      
      signIn(formData);
    } else {
      toast.error("Please fill in all fields");
    }
  };

  // Determine if any loading state is active
  const isAnyLoading = isSigningIn || isGoogleSigningIn;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div
        className={`absolute inset-0 bg-cover transition-all duration-300 ${
          isGoogleSigningIn ? 'animate-none blur-sm' : 'animate-subtle-zoom'
        }`}
        style={{
          backgroundImage: `url("/lovable-uploads/cc0094aa-ced3-4e50-b5f1-d61b7b6d2988.png")`,
          backgroundPosition: "center 70%",
        }}
      />
      {/* Background Overlay */}
      <div className={`absolute inset-0 transition-all duration-300 ${
        isGoogleSigningIn ? 'bg-black bg-opacity-60' : 'bg-black bg-opacity-20'
      }`}></div>

      {/* Global Loading Overlay for Google Sign-in */}
      {isGoogleSigningIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4 shadow-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-lg font-medium text-gray-800">Signing in with Google...</p>
            <p className="text-sm text-gray-600 text-center">Please complete the sign-in process in the popup window</p>
            {/* Optional: Add cancel button for better UX */}
            <button 
              onClick={() => setIsGoogleSigningIn(false)}
              className="mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden md:block relative z-10 min-h-screen">
        <LoginStages>
          {(stage) => (
            <>
              {/* Logo */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 transition-all ${
                  stage === "logoTransition"
                    ? "duration-[2500ms]"
                    : "duration-[1500ms]"
                } ${
                  stage === "initial" || stage === "textFadeOut"
                    ? "left-1/2 -translate-x-1/2"
                    : "left-[25%] -translate-x-1/2"
                } ${isGoogleSigningIn ? 'opacity-30' : ''}`}
                style={{
                  transitionTimingFunction:
                    "cubic-bezier(0.25, 0.1, 0.25, 1)",
                  transform:
                    "translate3d(var(--tw-translate-x), var(--tw-translate-y), 0)",
                }}
              >
                <img
                  src="/lovable-uploads/ceabc523-dba1-475b-b670-7ed6b88782a1.png"
                  alt="STEM for Society Logo"
                  className={`object-contain transition-all ${
                    stage === "logoTransition"
                      ? "duration-[2500ms]"
                      : "duration-[1500ms]"
                  } ${
                    stage === "initial" || stage === "textFadeOut"
                      ? "h-32 w-32 md:h-48 md:w-48 lg:h-64 lg:w-64"
                      : "h-40 w-40 md:h-56 md:w-56 lg:h-72 lg:w-72 opacity-50"
                  } ${
                    stage === "logoTransition" && !isGoogleSigningIn
                      ? "animate-pulse-glow-delayed"
                      : ""
                  }`}
                  style={{
                    transitionTimingFunction:
                      "cubic-bezier(0.25, 0.1, 0.25, 1)",
                  }}
                />
              </div>

              {/* Slogan Text */}
              <div
                className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                  stage === "initial"
                    ? "opacity-100 translate-y-24 md:translate-y-32 lg:translate-y-40"
                    : "opacity-0 -translate-y-5"
                } ${isGoogleSigningIn ? 'opacity-30' : ''}`}
              >
                <h1 className="text-xl md:text-4xl lg:text-2xl font-bold text-white text-center px-4 leading-tight">
                  Let's Innovate, Incubate and Impact the world together!
                </h1>
              </div>

              {/* Login Form Panel */}
              <div
                className={`absolute right-0 top-0 h-full w-1/2 transition-all ${
                  stage === "logoTransition"
                    ? "duration-[2500ms]"
                    : "duration-[1500ms]"
                } ${
                  stage === "logoTransition"
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
                } ${isGoogleSigningIn ? 'pointer-events-none' : ''}`}
                style={{
                  transitionTimingFunction:
                    "cubic-bezier(0.25, 0.1, 0.25, 1)",
                  transform:
                    "translate3d(var(--tw-translate-x), var(--tw-translate-y), 0)",
                }}
              >
                <div className={`absolute inset-0 bg-white/50 rounded-l-3xl backdrop-blur-sm transition-all duration-300 ${
                  isGoogleSigningIn ? 'opacity-30' : ''
                }`}></div>
                <div className="relative z-10 h-full max-h-screen overflow-y-auto flex items-center justify-center px-4 md:px-8 py-4">
                  <LoginForm
                    email={formData.email}
                    password={formData.password}
                    onInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                    onGoogleSignIn={handleGoogleSignIn}
                    isLoading={isAnyLoading}
                  />
                </div>
              </div>
            </>
          )}
        </LoginStages>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden relative z-10 min-h-screen flex flex-col">
        <div className={`flex-1 flex items-center justify-center pt-16 transition-all duration-300 ${
          isGoogleSigningIn ? 'opacity-30' : ''
        }`}>
          <img
            src="/lovable-uploads/ceabc523-dba1-475b-b670-7ed6b88782a1.png"
            alt="STEM for Society Logo"
            className={`h-24 w-24 object-contain opacity-50 ${
              !isGoogleSigningIn ? 'animate-pulse-glow-delayed' : ''
            }`}
          />
        </div>
        <div className={`flex-1 relative transition-all duration-300 ${
          isGoogleSigningIn ? 'pointer-events-none' : ''
        }`}>
          <div className={`absolute inset-0 bg-white/50 rounded-t-3xl backdrop-blur-sm transition-all duration-300 ${
            isGoogleSigningIn ? 'opacity-30' : ''
          }`}></div>
          <div className="relative z-10 max-h-[60vh] overflow-y-auto flex items-start justify-center px-4 pt-8 pb-4">
            <div className="w-full max-w-sm">
              <LoginForm
                email={formData.email}
                password={formData.password}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                onGoogleSignIn={handleGoogleSignIn}
                isLoading={isAnyLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
