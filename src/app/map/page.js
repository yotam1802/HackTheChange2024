"use client";
import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ConflictMarker from "@/components/ConflictMarker";
import Navbar from "@/components/Navbar";

export default function MapPage() {
  return (
    <div className="w-full">
      <Navbar />
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: 0,
          latitude: 40,
          zoom: 1.5,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/dark-v10"
      >
        <ConflictMarker
          latitude={31.7683}
          longitude={35.2137}
          title={"Israel/Palestine War"}
          description={"Talaal"}
        />
      </Map>
    </div>
  );
}
