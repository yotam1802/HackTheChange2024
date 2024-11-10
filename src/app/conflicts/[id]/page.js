"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaAngleLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import Chatbox from "@/components/Chatbox";
import { useInView } from "react-intersection-observer"; // Import useInView hook

export default function ConflictPage({ params: paramsPromise }) {
  const router = useRouter();
  const params = React.use(paramsPromise); // Unwrap the params promise using React.use()
  const { id } = params;

  const [conflict, setConflict] = useState(null);
  const [casualties, setCasualties] = useState(0);
  const [displaced, setDisplaced] = useState(0);

  // Set up Intersection Observer for Casualties section
  const { ref: casualtiesRef, inView: casualtiesInView } = useInView({
    triggerOnce: true, // Trigger only once when the element comes into view
    threshold: 0.5, // Trigger when 50% of the element is visible
  });

  // Set up Intersection Observer for Displaced People section
  const { ref: displacedRef, inView: displacedInView } = useInView({
    triggerOnce: true, // Trigger only once when the element comes into view
    threshold: 0.5, // Trigger when 50% of the element is visible
  });

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

  useEffect(() => {
    if (conflict) {
      const casualtyTarget =
        typeof conflict.casualties === "string"
          ? parseInt(conflict.casualties.replace(/,/g, ""))
          : conflict.casualties;

      const displacedTarget =
        typeof conflict.displacement === "string"
          ? parseInt(conflict.displacement.replace(/,/g, ""))
          : conflict.displacement;

      // Function to animate numbers
      const animateNumbers = (target, setValue, duration) => {
        const start = 0;
        const startTime = performance.now();

        const update = (timestamp) => {
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const value = Math.floor(start + (target - start) * progress);

          setValue(value);

          if (progress < 1) {
            requestAnimationFrame(update);
          }
        };

        requestAnimationFrame(update);
      };

      // Animate casualties and displaced only if they're in the viewport
      if (casualtiesInView) animateNumbers(casualtyTarget, setCasualties, 5000);
      if (displacedInView) animateNumbers(displacedTarget, setDisplaced, 5000);
    }
  }, [conflict, casualtiesInView, displacedInView]);

  if (!conflict) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-foreground border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
        {/* Casualties Section */}
        <motion.div
          ref={casualtiesRef} // Set the ref for intersection observer
          initial={{ opacity: 0, x: -150 }}
          animate={{
            opacity: casualtiesInView ? 1 : 0,
            x: casualtiesInView ? 0 : -150,
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            delay: 0.25,
          }}
          className="flex flex-col items-center p-6 bg-third_color text-white rounded-lg shadow-md w-full sm:w-[250px] lg:w-[300px] transition-transform transform hover:scale-105"
        >
          <h3 className="text-xl font-semibold mb-2">Casualties:</h3>
          <p className="text-3xl sm:text-4xl font-bold">
            {casualties.toLocaleString()}
          </p>
        </motion.div>

        {/* Displaced People Section */}
        <motion.div
          ref={displacedRef} // Set the ref for intersection observer
          initial={{ opacity: 0, x: 150 }}
          animate={{
            opacity: displacedInView ? 1 : 0,
            x: displacedInView ? 0 : 150,
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            delay: 0.25,
          }}
          className="flex flex-col items-center p-6 bg-third_color text-white rounded-lg shadow-md w-full sm:w-[250px] lg:w-[300px] transition-transform transform hover:scale-105"
        >
          <h3 className="text-xl font-semibold mb-2">Displaced People:</h3>
          <p className="text-3xl sm:text-4xl font-bold">
            {displaced.toLocaleString()}
          </p>
        </motion.div>
      </div>

      <p className="text-lg sm:text-xl text-center mb-6">
        {conflict.basic_info}
      </p>

      <Chatbox conflict={conflict.title} />
    </div>
  );
}
