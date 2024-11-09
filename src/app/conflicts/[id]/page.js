"use client";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function ConflictPage({ params }) {
  const router = useRouter();
  const { id } = use(params); // Unwrap params with React's `use()`
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

  if (!conflict) return <p>Loading conflict data...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground p-6 overflow-auto">
      <button
        onClick={() => router.push("/map")}
        className="absolute top-6 left-6 p-3 bg-third_color text-white rounded-full shadow-md hover:bg-red-800 w-20 text-2xl transition-all duration-300 ease-in-out"
      >
        &lt;
      </button>
      <h1 className="text-4xl font-bold text-center my-6">{conflict.title}</h1>
      <div className="relative w-full h-[500px] rounded-md overflow-hidden">
        <Image
          src={conflict.imageSrcUrl}
          alt={conflict.imageDesc}
          layout="fill"
          objectFit="contain"
          className="object-cover"
        />
      </div>
      <p className="text-lg my-6 text-center mb-20 text-gray-500">{conflict.imageDesc}</p>
      <p className="text-lg my-6 text-center mb-20">{conflict.description}</p>
      <div className="flex justify-around my-6 mb-20">
        <div className="flex flex-col items-center p-4 bg-third_color text-white rounded-lg shadow-md w-[300px]">
          <h3 className="text-xl font-semibold">Casualties:</h3>
          <p className="text-4xl font-bold">{conflict.casualties}</p>
        </div>
        <div className="flex flex-col items-center p-4 bg-third_color text-white rounded-lg shadow-md w-[300px]">
          <h3 className="text-xl font-semibold">Displaced People:</h3>
          <p className="text-4xl font-bold">{conflict.displacement}</p>
        </div>
      </div>
      <p className="text-lg my-6 text-center">{conflict.basic_info}</p>
    </div>
  );
}
