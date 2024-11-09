"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <nav className="bg-background text-foreground p-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-lg font-semibold tracking-wide">Empowernest</h1>
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
