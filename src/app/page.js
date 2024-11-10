"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import {
  FaMapMarkedAlt,
  FaChartPie,
  FaHandsHelping,
  FaComments,
  FaBook,
  FaBell,
} from "react-icons/fa";

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
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white p-8 w-full flex flex-col items-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Welcome to EmpowerNest
          </h1>
          <p className="max-w-lg text-lg sm:text-xl text-gray-200 mb-8">
            A place to explore, learn, and engage in global issues affecting us
            all. Join us in making a difference, one informed decision at a
            time.
          </p>
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

      {/* Features Section */}
      <div className="flex flex-col items-center justify-center p-8 bg-blue-600 text-gray-100 py-16">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-white">
          What is EmpowerNest?
        </h2>
        <p className="max-w-2xl text-center mb-8 text-lg text-gray-200">
          EmpowerNest is a platform dedicated to fostering understanding and
          empathy by bringing you real-time information on current conflicts
          worldwide. Through transparent, insightful, and data-driven content,
          we aim to support peaceful dialogue and encourage informed discussions
          about global issues.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl">
          <div className="p-6 rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-purple-500 text-white transform transition-transform hover:scale-105">
            <FaMapMarkedAlt className="text-3xl mb-3 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">
              Real-Time Conflict Maps
            </h3>
            <p>
              Explore interactive maps showcasing global conflict zones with
              details on affected regions, current status, and recent updates.
            </p>
          </div>

          <div className="p-6 rounded-lg shadow-md bg-gradient-to-r from-green-400 to-teal-500 text-white transform transition-transform hover:scale-105">
            <FaChartPie className="text-3xl mb-3 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Data-Driven Insights</h3>
            <p>
              Access statistical insights on casualties, displacement, and
              humanitarian needs, empowering you with comprehensive conflict
              data.
            </p>
          </div>

          <div className="p-6 rounded-lg shadow-md bg-gradient-to-r from-red-500 to-orange-500 text-white transform transition-transform hover:scale-105">
            <FaHandsHelping className="text-3xl mb-3 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">
              Charitable Initiatives
            </h3>
            <p>
              Connect with organizations supporting conflict-affected areas,
              allowing you to directly contribute to peacebuilding efforts.
            </p>
          </div>

          <div className="p-6 rounded-lg shadow-md bg-gradient-to-r from-yellow-500 to-pink-500 text-white transform transition-transform hover:scale-105">
            <FaComments className="text-3xl mb-3 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Discussion Forums</h3>
            <p>
              Join conversations with a global community to discuss perspectives
              and propose solutions to foster peace and understanding.
            </p>
          </div>

          <div className="p-6 rounded-lg shadow-md bg-gradient-to-r from-purple-500 to-indigo-500 text-white transform transition-transform hover:scale-105">
            <FaBook className="text-3xl mb-3 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">
              Educational Resources
            </h3>
            <p>
              Access articles, reports, and historical overviews that provide
              context to current conflicts, helping you become an informed
              global citizen.
            </p>
          </div>

          <div className="p-6 rounded-lg shadow-md bg-gradient-to-r from-teal-500 to-blue-500 text-white transform transition-transform hover:scale-105">
            <FaBell className="text-3xl mb-3 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">
              Alerts and Notifications
            </h3>
            <p>
              Receive timely notifications about updates in active conflict
              zones, keeping you aware of crucial developments.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="flex flex-col items-center justify-center bg-background text-white py-16 px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="text-lg max-w-2xl mb-6">
          Join EmpowerNest and become part of a global movement for peace and
          understanding. Stay informed, participate in discussions, and explore
          ways to help those in need.
        </p>
        <a
          href="/signup"
          className="rounded-full bg-white text-blue-600 hover:bg-gray-100 text-sm sm:text-base h-10 sm:h-12 px-6 flex items-center justify-center transition-colors shadow-lg"
        >
          Join Us Now
        </a>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
