"use client";
import Map, { Marker } from "react-map-gl";
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
import Image from "next/image";

export default function MapPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conflicts, setConflicts] = useState([]);
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [zoom, setZoom] = useState(3); // State to track zoom level
  const mapRef = useRef(null);

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
        ref={mapRef}
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
        onZoom={(e) => setZoom(e.viewState.zoom)} // Update zoom state
      >
        <NavigationControl position="top-left" />
        <FullscreenControl position="top-left" />
        <GeolocateControl position="top-left" />

        {conflicts.map((conflict) => (
          <div key={conflict.id}>
            <ConflictMarker
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

            {/* Tank Marker: Only show when zoomed in and conflict selected */}
            {selectedConflict === conflict.id && zoom > 5 && (
              <Marker
                longitude={conflict.longitude}
                latitude={conflict.latitude + 0.3} // Position the tank above the conflict marker
              >
                <div className="animate-tank">
                  <Image
                    src="/icons/tank.png"
                    alt="Tank Icon"
                    width={30}
                    height={30}
                  />
                </div>
              </Marker>
            )}
          </div>
        ))}
      </Map>

      {/* CSS Animation for Tank Movement */}
      <style jsx>{`
        .animate-tank {
          animation: tankMove 3s infinite linear;
        }

        @keyframes tankMove {
          0% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(10px, -5px);
          }
          50% {
            transform: translate(15px, 0);
          }
          75% {
            transform: translate(10px, 5px);
          }
          100% {
            transform: translate(0, 0);
          }
        }
      `}</style>
    </div>
  );
}
