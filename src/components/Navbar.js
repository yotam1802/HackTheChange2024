"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // Import the Image component

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <nav className="bg-background text-foreground py-1 shadow-md h-18 max-h-18 z-50 max-md:px-2">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center justify-between w-full">
          {/* Add a wrapper for the logo and text */}
          <Link
            href="/dashboard"
            className="text-lg font-semibold tracking-wide flex items-center"
          >
            {/* Favicon or logo */}
            <Image
              src="/favicon.ico"
              alt="EmpowerNest favicon"
              width={50} // Set an appropriate size
              height={50} // Set an appropriate size
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
