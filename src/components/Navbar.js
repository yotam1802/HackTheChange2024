"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcHome } from "react-icons/fc"; // Optional icon

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <nav className="bg-background text-foreground p-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FcHome className="w-5 h-5" /> {/* Optional icon */}
          <h1 className="text-lg font-semibold tracking-wide">MyApp</h1>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-full border border-foreground transition-colors flex items-center justify-center text-foreground text-sm h-8 px-4 hover:bg-foreground hover:text-background hover:border-transparent"
        >
          Log Out
        </button>
      </div>
    </nav>
  );
}
