"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaAngleLeft } from "react-icons/fa"; // Import the angle left icon
import ErrorMessage from "@/components/ErrorMessage";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result && result.ok) {
      router.push("/dashboard");
    } else {
      setError("");
      setTimeout(() => {
        setError("Invalid email or password. Please try again.");
      }, 10);
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg">
        {/* Back Arrow Inside Content */}
        <button
          onClick={handleBack}
          className="text-gray-300 hover:text-gray-100 transition-colors duration-200 mb-4 flex items-center"
          aria-label="Back to Home"
        >
          <FaAngleLeft size={20} className="mr-2" />
          <span>Back</span>
        </button>

        {error && <ErrorMessage message={error} />}
        <h2 className="text-2xl font-bold text-center text-gray-200 mb-6">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-gray-200"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-gray-200"
          />
          <button
            type="submit"
            className="w-full bg-green-700 bg-opacity-80 text-white font-semibold py-2 rounded-md border-4 border-green-900 transition-all duration-200 hover:bg-opacity-90 hover:border-green-900 focus:border-green-900"
          >
            Login
          </button>
        </form>
        <div className="my-4 flex items-center justify-center">
          <hr className="w-full border-gray-700" />
          <span className="px-3 text-gray-400">OR</span>
          <hr className="w-full border-gray-700" />
        </div>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full bg-transparent border border-gray-600 text-gray-300 py-2 rounded-md transition-all duration-200 hover:bg-gray-600"
        >
          <FcGoogle className="w-5 h-5 mr-2" />
          <span>Login with Google</span>
        </button>
        <p className="mt-6 text-center text-gray-400">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
