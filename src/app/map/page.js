"use client";
import Map from "react-map-gl";

export default function App() {
  return (
    <Map
      mapboxAccessToken={process.env.MAPBOX_TOKEN}
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
      }}
      style={{ width: 600, height: 400 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    />
  );
}
