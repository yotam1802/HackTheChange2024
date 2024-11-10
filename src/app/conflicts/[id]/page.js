"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaAngleLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import Chatbox from "@/components/Chatbox";
import { useInView } from "react-intersection-observer";
import Footer from "@/components/Footer";

export default function ConflictPage({ params: paramsPromise }) {
  const router = useRouter();
  const params = React.use(paramsPromise);
  const { id } = params;

  const [conflict, setConflict] = useState(null);
  const [casualties, setCasualties] = useState(0);
  const [displaced, setDisplaced] = useState(0);

  const { ref: casualtiesRef, inView: casualtiesInView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const { ref: displacedRef, inView: displacedInView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const { ref: charitiesRef, inView: charitiesInView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
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
    <>
      <div className="flex flex-col min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
        <button
          onClick={() => router.push("/map")}
          className="flex items-center text-foreground text-lg mb-6 hover:underline hover:text-third_color"
        >
          <FaAngleLeft className="mr-2" />
          Back to Map
        </button>

        <h1 className="text-3xl sm:text-4xl font-bold text-center my-4 sm:my-10">
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

        <p className="text-lg sm:text-xl text-center mb-6">
          {conflict.description}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6 my-6">
          {/* Casualties Section */}
          <motion.div
            ref={casualtiesRef}
            initial={{ opacity: 0, x: -150 }}
            animate={{
              opacity: casualtiesInView ? 1 : 0,
              x: casualtiesInView ? 0 : -150,
            }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.25 }}
            className="flex flex-col items-center p-6 bg-third_color text-white rounded-lg shadow-md w-full sm:w-[250px] lg:w-[300px] transition-transform transform hover:scale-105"
          >
            <h3 className="text-xl font-semibold mb-2">Casualties:</h3>
            <p className="text-3xl sm:text-4xl font-bold">
              {casualties.toLocaleString()}
            </p>
          </motion.div>

          {/* Displaced People Section */}
          <motion.div
            ref={displacedRef}
            initial={{ opacity: 0, x: 150 }}
            animate={{
              opacity: displacedInView ? 1 : 0,
              x: displacedInView ? 0 : 150,
            }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.25 }}
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

        {/* Charities Resources Section */}
        {conflict.charities_resources &&
          conflict.charities_resources.length > 0 && (
            <motion.div
              ref={charitiesRef}
              initial={{ opacity: 0 }}
              animate={{
                opacity: charitiesInView ? 1 : 0,
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="charities-section mb-24 mt-24"
            >
              <h3 className="text-3xl font-semibold text-center my-4">
                Charity Resources
              </h3>
              <p className="text-lg text-center mb-6">
                These organizations are supporting this cause. Consider
                contributing to make a difference.
              </p>
              <div className="flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-5xl px-4">
                  {conflict.charities_resources.map((charity, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center p-6 bg-third_color text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
                    >
                      <h2 className="text-xl font-semibold mb-3 text-center">
                        {charity.name}
                      </h2>
                      <p className="text-center text-sm mb-4">
                        {charity.description ||
                          "Learn more about this charity's efforts to support the cause."}
                      </p>
                      <a
                        href={charity.url}
                        className="bg-white text-third_color px-4 py-2 rounded-md font-semibold transition-colors hover:bg-gray-200"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Website
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        <Chatbox conflict={conflict.title} />
      </div>
      <Footer />
    </>
  );
}
