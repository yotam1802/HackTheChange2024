"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";  // Import useRouter hook

export default function Page() {
  // Data from the database or API
  const data = {
    title: "Dynamic Title from API",
    imageUrl: "/image.jpg",
    description:
      "This is a dynamically loaded description that provides details about the content.",
    casualties: 3200, // Example casualty count
    displaced: 50000, // Example displaced people count
  };
  
  const [casualtyCount, setCasualtyCount] = useState(0);
  const [displacedCount, setDisplacedCount] = useState(0);
  const [hasStartedCounting, setHasStartedCounting] = useState(false);
  const [fadeInCasualties, setFadeInCasualties] = useState(false);
  const [fadeInDisplaced, setFadeInDisplaced] = useState(false);

  const sectionRef = useRef(null);
  const casualtyRef = useRef(null);
  const displacedRef = useRef(null);

  // Function to animate the count-up
  const countUp = (target, setState) => {
    let count = 0;
    const interval = setInterval(() => {
      count += Math.ceil(target / 100); // Increment by a fraction of the target
      if (count >= target) {
        clearInterval(interval);
        setState(target); // Ensure it ends at the target value
      } else {
        setState(count);
      }
    }, 50); // Update the count every 50 milliseconds
  };

  // Trigger the count-up effect when the component mounts
  useEffect(() => {
    if (hasStartedCounting) {
      countUp(data.casualties, setCasualtyCount);
      countUp(data.displaced, setDisplacedCount);
    }
  }, [hasStartedCounting, data.casualties, data.displaced]);

  useEffect(() => {
    // Intersection Observer to start animation when element is in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStartedCounting(true); // Start counting when the section enters the viewport
        }
      },
      {
        threshold: 0.5, // Trigger when 50% of the element is in view
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setFadeInCasualties(true); // Trigger fade-in when visible
        }
      },
      {
        threshold: 0.5, // Trigger when 50% of the element is in view
      }
    );

    if (casualtyRef.current) {
      observer.observe(casualtyRef.current);
    }

    return () => {
      if (casualtyRef.current) {
        observer.unobserve(casualtyRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setFadeInDisplaced(true);
        }
      },
      {
        threshold: 0.5, 
      }
    );

    if (displacedRef.current) {
      observer.observe(displacedRef.current);
    }

    return () => {
      if (displacedRef.current) {
        observer.unobserve(displacedRef.current);
      }
    };
  }, []);

  const handleBackClick = () => {
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground p-6 overflow-auto">
      <button
        onClick={handleBackClick}
        className="absolute top-6 left-6 p-3 bg-third_color text-white rounded-full shadow-md hover:bg-red-800 w-20 text-2xl transition-all duration-300 ease-in-out"
      >
        &lt;
      </button>
      <h1 className="text-4xl font-bold text-center my-6">{data.title}</h1>
      <div className="relative w-full h-[500px] rounded-md overflow-hidden">
        <Image
          src={data.imageUrl}
          alt={data.title}
          layout="fill"
          objectFit="contain"
          className="object-cover"
        />
      </div>
      <p className="text-lg my-6 text-center mb-20">{data.description}</p>
      <div
        ref={sectionRef}
        className="flex justify-around my-6 mb-20"
      >
        <div
          ref={casualtyRef}
          className={`flex flex-col items-center p-4 bg-third_color text-white rounded-lg shadow-md transition-opacity duration-700 w-[300px] ${
            fadeInCasualties ? "opacity-100" : "opacity-0"
          }`}
        >
          <h3 className="text-xl font-semibold">Casualties:</h3>
          <p className="text-4xl font-bold">{casualtyCount}</p>
        </div>
        <div
          ref={displacedRef}
          className={`flex flex-col items-center p-4 bg-third_color text-white rounded-lg shadow-md transition-opacity duration-700 w-[300px] ${
            fadeInDisplaced ? "opacity-100" : "opacity-0"
          }`}
        >
          <h3 className="text-xl font-semibold">Displaced People:</h3>
          <p className="text-4xl font-bold">{displacedCount}</p>
        </div>
      </div>
      <p className="text-lg my-6 text-center">
        As the world becomes more interconnected through technology, the importance of data security continues to grow. New advancements in encryption and cybersecurity are constantly being developed to safeguard sensitive information from evolving threats. Organizations are now adopting more robust security measures to protect their data, ensuring compliance with regulatory standards and building trust with consumers. In addition to cybersecurity protocols, businesses are increasingly using artificial intelligence to monitor and respond to potential risks in real-time, making it easier to prevent data breaches before they occur. The integration of AI and machine learning into security systems is reshaping the way we think about online safety, providing innovative solutions to protect personal and corporate data alike.
      </p>
    </div>
  );
}
