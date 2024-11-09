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

export default function MapPage() {
  const [conflicts, setConflicts] = useState([]);
  const [selectedConflict, setSelectedConflict] = useState(null);

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
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/dark-v10"
      >
        <NavigationControl position="top-left" />
        <FullscreenControl position="top-left" />
        <GeolocateControl position="top-left" />
        {conflicts.map((conflict, index) => {
          return (
            <ConflictMarker
              key={index}
              latitude={conflict.latitude}
              longitude={conflict.longitude}
              title={conflict.title}
              description={conflict.description}
              isOpen={selectedConflict === index}
              onClick={() => handleMarkerClick(index)}
              imageURL={conflict.imageSrcUrl}
              imageDesc={conflict.imageDesc}
            />
          );
        })}
      </Map>
    </div>
  );
}
