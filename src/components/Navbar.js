"use client";
import { useState, useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaBell } from "react-icons/fa"; // Import the Bell icon from react-icons

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession(); // Access the session to get notifications count
  const notificationsCount = session?.user?.notifications || 0; // Default to 0 if undefined
  const [showNotifications, setShowNotifications] = useState(false); // State for toggling notifications dropdown
  const dropdownRef = useRef(null); // Ref to the notifications dropdown

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  // Toggle notifications visibility
  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  // Hardcoded sample notifications
  const sampleNotifications = [
    "Your recent post received 5 new likes.",
    "A user replied to your comment on Conflict Discussion.",
    "System update scheduled for tomorrow.",
    "Welcome to EmpowerNest! Explore the map feature for global insights.",
  ];

  return (
    <nav className="bg-background text-foreground py-1 shadow-md h-18 max-h-18 z-50 max-md:px-2">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center justify-between w-full">
          {/* Logo and text */}
          <Link
            href="/dashboard"
            className="text-lg font-semibold tracking-wide flex items-center"
          >
            <Image
              src="/Logo.png"
              alt="EmpowerNest favicon"
              width={50}
              height={50}
            />
            EmpowerNest
          </Link>
          <Link
            href="/map"
            className="text-foreground text-sm hover:underline mx-4"
          >
            Map
          </Link>
        </div>

        {/* Notification Bell */}
        <div className="relative mr-4" ref={dropdownRef}>
          <FaBell
            className="text-foreground text-xl cursor-pointer"
            onClick={toggleNotifications}
          />
          {notificationsCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {notificationsCount}
            </span>
          )}

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-lg shadow-lg z-[100]">
              <div className="p-4 border-b text-lg font-semibold">
                Notifications
              </div>
              <ul className="max-h-60 overflow-y-auto">
                {sampleNotifications.length > 0 ? (
                  sampleNotifications.map((notification, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      {notification}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-sm text-gray-500">
                    No new notifications
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="rounded-full border border-foreground w-24 transition-colors flex items-center justify-center text-foreground text-xs h-8 px-4 hover:bg-foreground hover:text-background hover:border-transparent"
        >
          Log Out
        </button>
      </div>
    </nav>
  );
}
