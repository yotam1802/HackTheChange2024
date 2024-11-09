"use client";
import Map from "react-map-gl";
import {
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ConflictMarker from "@/components/ConflictMarker";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function MapPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conflicts, setConflicts] = useState([]);
  const [selectedConflict, setSelectedConflict] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchConflicts = async () => {
      try {
        const response = await fetch("/cache/conflicts.json");
        const data = await response.json();
        setConflicts(data);
      } catch (error) {
        console.error("Failed to fetch conflicts data:", error);
      }
    };

    fetchConflicts(conflicts);
  }, []);

  const handleMarkerClick = (index) => {
    setSelectedConflict(index === selectedConflict ? null : index);
  };

  return (
    <div className="w-full">
      <Navbar />
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: 40,
          latitude: 30,
          zoom: 3,
        }}
        style={{
          width: "100vw",
          height: "calc(100vh - 64px)",
        }}
        mapStyle="mapbox://styles/mapbox/dark-v10"
      >
        <NavigationControl position="top-left" />
        <FullscreenControl position="top-left" />
        <GeolocateControl position="top-left" />
        {conflicts.map((conflict) => {
          return (
            <ConflictMarker
              key={conflict.id}
              latitude={conflict.latitude}
              longitude={conflict.longitude}
              title={conflict.title}
              description={conflict.description}
              isOpen={selectedConflict === conflict.id}
              onClick={() => handleMarkerClick(conflict.id)}
              imageURL={conflict.imageSrcUrl}
              imageDesc={conflict.imageDesc}
              id={conflict.id}
            />
          );
        })}
      </Map>
    </div>
  );
}
