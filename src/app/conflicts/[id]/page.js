"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaAngleLeft } from "react-icons/fa";
import { use } from "react";
import Chatbox from "@/components/Chatbox";

export default function ConflictPage({ params: paramsPromise }) {
  const router = useRouter();
  const params = use(paramsPromise); // Unwrap params with `use()`
  const { id } = params;
  const [conflict, setConflict] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchConflict = async () => {
        try {
          const res = await fetch(`/cache/conflicts.json`);
          const data = await res.json();
          const selectedConflict = data.find(
            (c) => parseInt(c.id) === parseInt(id)
          );
          setConflict(selectedConflict);
        } catch (error) {
          console.error("Error loading conflict data:", error);
        }
      };

      fetchConflict();
    }
  }, [id]);

  if (!conflict)
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-foreground">
        Loading conflict data...
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <button
        onClick={() => router.push("/map")}
        className="flex items-center text-foreground text-lg mb-6 hover:underline hover:text-third_color"
      >
        <FaAngleLeft className="mr-2" />
        Back to Map
      </button>

      <h1 className="text-3xl sm:text-4xl font-bold text-center my-4 sm:my-6">
        {conflict.title}
      </h1>

      <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-md overflow-hidden shadow-lg mb-6">
        <Image
          src={conflict.imageSrcUrl}
          alt={conflict.imageDesc}
          layout="fill"
          objectFit="cover"
          className="object-cover"
        />
      </div>

      <p className="text-gray-500 text-center text-sm sm:text-base mb-6">
        {conflict.imageDesc}
      </p>

      <p className="text-lg sm:text-xl text-center">{conflict.description}</p>

      <div className="flex flex-col sm:flex-row justify-center gap-6 my-6">
        <div className="flex flex-col items-center p-6 bg-third_color text-white rounded-lg shadow-md w-full sm:w-[250px] lg:w-[300px] transition-transform transform hover:scale-105">
          <h3 className="text-xl font-semibold mb-2">Casualties:</h3>
          <p className="text-3xl sm:text-4xl font-bold">
            {conflict.casualties}
          </p>
        </div>

        <div className="flex flex-col items-center p-6 bg-third_color text-white rounded-lg shadow-md w-full sm:w-[250px] lg:w-[300px] transition-transform transform hover:scale-105">
          <h3 className="text-xl font-semibold mb-2">Displaced People:</h3>
          <p className="text-3xl sm:text-4xl font-bold">
            {conflict.displacement}
          </p>
        </div>
      </div>

      <p className="text-lg sm:text-xl text-center mb-6">
        {conflict.basic_info}
      </p>

      <Chatbox />
    </div>
  );
}
