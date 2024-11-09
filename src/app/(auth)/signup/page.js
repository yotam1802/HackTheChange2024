"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc"; // Google icon from react-icons
import { FaAngleLeft } from "react-icons/fa"; // Import the angle left icon

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (response && response.ok) {
      router.push("/dashboard"); // Redirect to dashboard after signup
    }
  };

  const handleGoogleSignUp = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back Arrow Inside Content */}
        <button
          onClick={handleBack}
          className="text-gray-300 hover:text-gray-100 transition-colors duration-200 mb-4 flex items-center"
          aria-label="Back to Home"
        >
          <FaAngleLeft size={20} className="mr-2" />{" "}
          {/* Smaller icon for close positioning */}
          <span>Back</span>
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-200 mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-gray-200"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-gray-200"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-green-700 bg-opacity-80 text-white font-semibold py-2 rounded-md border-4 border-green-900 transition-all duration-200 hover:bg-opacity-90 hover:border-green-900 focus:border-green-900"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="my-4 flex items-center justify-center">
          <hr className="w-full border-gray-700" />
          <span className="px-3 text-gray-400">OR</span>
          <hr className="w-full border-gray-700" />
        </div>
        <button
          onClick={handleGoogleSignUp}
          className="flex items-center justify-center w-full bg-transparent border border-gray-600 text-gray-300 py-2 rounded-md transition-all duration-200 hover:bg-gray-600"
        >
          <FcGoogle className="w-5 h-5 mr-2" />
          <span>Sign Up with Google</span>
        </button>
        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
