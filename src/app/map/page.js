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
  const [zoom, setZoom] = useState(3);
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
        onZoom={(e) => setZoom(e.viewState.zoom)}
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

            {/* Multiple Tank Markers: Only show when zoomed in and conflict selected */}
            {selectedConflict === conflict.id && zoom > 5 && (
              <>
                <Marker
                  longitude={conflict.longitude + 0.1}
                  latitude={conflict.latitude + 0.3}
                >
                  <div className="animate-tank1">
                    <Image
                      src="/icons/tank.png"
                      alt="Tank Icon"
                      width={30}
                      height={30}
                    />
                  </div>
                </Marker>
                <Marker
                  longitude={conflict.longitude - 0.1}
                  latitude={conflict.latitude + 0.3}
                >
                  <div className="animate-tank2">
                    <Image
                      src="/icons/tank.png"
                      alt="Tank Icon"
                      width={30}
                      height={30}
                    />
                  </div>
                </Marker>
              </>
            )}
          </div>
        ))}
      </Map>

      {/* CSS Animation for Tank Movement */}
      <style jsx>{`
        .animate-tank1 {
          animation: tankMove1 3s infinite linear;
        }
        .animate-tank2 {
          animation: tankMove2 4s infinite linear;
        }

        @keyframes tankMove1 {
          0% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(10px, -10px);
          }
          50% {
            transform: translate(15px, 5px);
          }
          75% {
            transform: translate(5px, 10px);
          }
          100% {
            transform: translate(0, 0);
          }
        }

        @keyframes tankMove2 {
          0% {
            transform: translate(0, 0);
          }
          20% {
            transform: translate(-10px, 10px);
          }
          40% {
            transform: translate(-15px, -5px);
          }
          60% {
            transform: translate(-5px, -10px);
          }
          80% {
            transform: translate(-10px, 5px);
          }
          100% {
            transform: translate(0, 0);
          }
        }
      `}</style>
    </div>
  );
}
