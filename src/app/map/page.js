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
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function MapPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conflicts, setConflicts] = useState([]);
  const [selectedConflict, setSelectedConflict] = useState(null);
  const mapRef = useRef(null); // Ref to access the Map component

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

    fetchConflicts();
  }, []);

  const flyToConflict = (conflict) => {
    setSelectedConflict(conflict.id);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [conflict.longitude, conflict.latitude - 1],
        zoom: 6,
        speed: 1.2,
        curve: 1,
      });
    }
  };

  return (
    <div className="w-full">
      <Navbar />
      <Map
        ref={mapRef} // Attach ref to the Map component
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

        {conflicts.map((conflict) => (
          <ConflictMarker
            key={conflict.id}
            latitude={conflict.latitude}
            longitude={conflict.longitude}
            title={conflict.title}
            description={conflict.description}
            isOpen={selectedConflict === conflict.id}
            onClick={() => flyToConflict(conflict)}
            imageURL={conflict.imageSrcUrl}
            imageDesc={conflict.imageDesc}
            id={conflict.id}
          />
        ))}
      </Map>
    </div>
  );
}
