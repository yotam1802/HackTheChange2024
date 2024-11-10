"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading")
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-foreground border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div
        className="relative w-full h-[80vh] bg-cover bg-center flex items-end"
        style={{ backgroundImage: "url('/hero-background.jpg')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Hero Text */}
        <div className="relative z-10 text-center text-white p-8 w-full flex flex-col items-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Welcome to EmpowerNest
          </h1>
          <div className="flex gap-4">
            <a
              className="rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base h-10 sm:h-12 px-6 flex items-center justify-center transition-colors shadow-lg"
              href="/signup"
            >
              Get Started
            </a>
            <a
              className="rounded-full border border-white text-white hover:bg-white hover:text-blue-500 transition-colors text-sm sm:text-base h-10 sm:h-12 px-6 flex items-center justify-center shadow-lg"
              href="/login"
            >
              Login
            </a>
          </div>
        </div>
      </div>

      {/* Additional Content */}
      <div className="flex flex-col items-center justify-center p-8 bg-gray-850 text-gray-100">
        <h2 className="text-2xl sm:text-3xl font-semibold mt-8 mb-4 text-white">
          Why Choose EmpowerNest?
        </h2>
        <p className="max-w-2xl text-center mb-8 text-lg text-gray-200">
          EmpowerNest is a platform dedicated to fostering understanding and
          empathy by bringing you real-time information on current conflicts
          worldwide. Through transparent, insightful, and data-driven content,
          we aim to support peaceful dialogue and encourage informed discussions
          about global issues.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl">
          <div className="text-center p-6 bg-gray-800 rounded-lg shadow-md hover:bg-gray-750 transition-colors">
            <h3 className="text-xl font-semibold mb-2 text-white">
              Real-Time Conflict Maps
            </h3>
            <p className="text-gray-300">
              Explore interactive maps showcasing global conflict zones with
              details on affected regions, current status, and recent updates.
            </p>
          </div>

          <div className="text-center p-6 bg-gray-800 rounded-lg shadow-md hover:bg-gray-750 transition-colors">
            <h3 className="text-xl font-semibold mb-2 text-white">
              Data-Driven Insights
            </h3>
            <p className="text-gray-300">
              Access statistical insights on casualties, displacement, and
              humanitarian needs, empowering you with comprehensive conflict
              data.
            </p>
          </div>

          <div className="text-center p-6 bg-gray-800 rounded-lg shadow-md hover:bg-gray-750 transition-colors">
            <h3 className="text-xl font-semibold mb-2 text-white">
              Charitable Initiatives
            </h3>
            <p className="text-gray-300">
              Connect with organizations supporting conflict-affected areas,
              allowing you to directly contribute to peacebuilding efforts.
            </p>
          </div>

          <div className="text-center p-6 bg-gray-800 rounded-lg shadow-md hover:bg-gray-750 transition-colors">
            <h3 className="text-xl font-semibold mb-2 text-white">
              Discussion Forums
            </h3>
            <p className="text-gray-300">
              Join conversations with a global community to discuss perspectives
              and propose solutions to foster peace and understanding.
            </p>
          </div>

          <div className="text-center p-6 bg-gray-800 rounded-lg shadow-md hover:bg-gray-750 transition-colors">
            <h3 className="text-xl font-semibold mb-2 text-white">
              Educational Resources
            </h3>
            <p className="text-gray-300">
              Access articles, reports, and historical overviews that provide
              context to current conflicts, helping you become an informed
              global citizen.
            </p>
          </div>

          <div className="text-center p-6 bg-gray-800 rounded-lg shadow-md hover:bg-gray-750 transition-colors">
            <h3 className="text-xl font-semibold mb-2 text-white">
              Alerts and Notifications
            </h3>
            <p className="text-gray-300">
              Receive timely notifications about updates in active conflict
              zones, keeping you aware of crucial developments.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
