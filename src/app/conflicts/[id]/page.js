"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaAngleLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import Chatbox from "@/components/Chatbox";
import { useInView } from "react-intersection-observer";
import Footer from "@/components/Footer";
import { FaTwitter, FaInstagram, FaFacebook, FaCopy } from "react-icons/fa";

export default function ConflictPage({ params: paramsPromise }) {
  const router = useRouter();
  const params = React.use(paramsPromise);
  const { id } = params;

  const [conflict, setConflict] = useState(null);
  const [casualties, setCasualties] = useState(0);
  const [displaced, setDisplaced] = useState(0);
  const [copied, setCopied] = useState(false);
  const [newsArticles, setNewsArticles] = useState([]); // For news articles

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

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
      // Check if casualties and displacement are strings before using .replace()
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

  useEffect(() => {
    if (conflict) {
      // Fetch related news articles based on the conflict's title
      const fetchNews = async () => {
        try {
          const res = await fetch(
            `/api/news?query=${encodeURIComponent(conflict.title)}`
          );
          console.log();
          const data = await res.json(
            `/api/news?query=${encodeURIComponent(conflict.title)}`
          );
          console.log(`/api/news?query=${encodeURIComponent(conflict.title)}`); // Log full response for debugging
          setNewsArticles(data.slice(0, 6)); // Limit to 9 articles
        } catch (error) {
          console.error("Error fetching news:", error);
        }
      };

      fetchNews();
    }
  }, [conflict]);

  if (!conflict) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-foreground border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const gradientClasses = [
    "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
    "bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600",
    "bg-gradient-to-br from-green-400 via-yellow-500 to-red-500",
  ];

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

        {/* Hero section with gradient overlay */}
        <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] mb-6">
          <Image
            src={conflict.imageSrcUrl}
            alt={conflict.imageDesc}
            layout="fill"
            objectFit="cover"
            className="object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-100 h-full"></div>
          {/* Title over gradient */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-opacity-0 text-center text-white">
            <h1 className="text-3xl sm:text-5xl font-bold">{conflict.title}</h1>
          </div>
        </div>

        <p className="text-gray-500 text-center text-sm sm:text-base mb-6">
          {conflict.imageDesc}
        </p>

        <p className="text-lg sm:text-xl text-center mb-6">
          {conflict.description}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6 my-6">
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
              +{casualties.toLocaleString()}
            </p>
          </motion.div>

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
              +{displaced.toLocaleString()}
            </p>
          </motion.div>
        </div>

        <p className="text-lg sm:text-xl text-center mb-6">
          {conflict.basic_info}
        </p>

        {/* Timeline Section */}
        {conflict.timeline && (
          <section className="timeline-section my-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Conflict Timeline
            </h2>
            <div className="timeline-events space-y-6">
              {conflict.timeline.map((event, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="timeline-event p-4 bg-gray-800 text-white rounded-lg shadow-md"
                >
                  <p className="text-lg font-semibold mb-2">{event.date}</p>
                  <p className="text-gray-300">{event.event}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Display news articles related to the conflict */}
        <section className="news-section my-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Related News
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newsArticles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }} // Stagger fade-in effect
                className="news-article bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg"
              >
                <h3 className="text-lg font-bold mb-2">{article.title}</h3>
                <p className="text-sm text-gray-400 mb-4">
                  {article.description}
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  Source: {article.source} | Published at:{" "}
                  {new Date(article.publishedAt).toLocaleString()}
                </p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Read more
                </a>
              </motion.div>
            ))}
          </div>
        </section>

        {conflict.charities_resources &&
          conflict.charities_resources.length > 0 && (
            <motion.div
              ref={charitiesRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: charitiesInView ? 1 : 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="charities-section mb-24 mt-8"
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
                      className={`${
                        gradientClasses[index % gradientClasses.length]
                      } flex flex-col items-center p-6 text-white rounded-lg shadow-md transition-transform transform hover:scale-105`}
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
                        className="px-4 py-2 rounded-md font-semibold bg-white bg-opacity-20 text-white hover:bg-opacity-100 hover:text-black transition-colors shadow-lg"
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

        {/* Chatbox and Share Link */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 max-md:mt-0 mb-16">
          <Chatbox conflict={conflict.title} />

          <div className="w-full sm:w-1/2 lg:w-1/3 bg-background text-foreground p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Share</h3>
            <p className="mb-4">
              Spread awareness about this conflict by sharing with your network.
            </p>

            <div className="flex flex-col gap-4">
              {/* X (Twitter) */}
              <a
                href={`https://x.com/share?url=${encodeURIComponent(
                  window.location.href
                )}&text=${encodeURIComponent(conflict.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 rounded-md bg-blue-500 text-white font-semibold shadow-lg hover:bg-blue-600 transition-colors"
              >
                <FaTwitter className="mr-2" />
                Share on X
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 rounded-md bg-pink-500 text-white font-semibold shadow-lg hover:bg-pink-600 transition-colors"
              >
                <FaInstagram className="mr-2" />
                Instagram
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  window.location.href
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 rounded-md bg-blue-700 text-white font-semibold shadow-lg hover:bg-blue-800 transition-colors"
              >
                <FaFacebook className="mr-2" />
                Facebook
              </a>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="flex items-center px-4 py-2 rounded-md bg-gray-500 text-white font-semibold shadow-lg hover:bg-gray-600 transition-colors"
              >
                <FaCopy className={`mr-2 ${copied ? "animate-bounce" : ""}`} />
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
