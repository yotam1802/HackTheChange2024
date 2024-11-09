"use client";
import Map, { Marker, Popup } from "react-map-gl";
import { useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

export default function App() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="w-full">
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: 35.2137,
          latitude: 31.7683,
          zoom: 6,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/dark-v10"
      >
        {/* Minimalistic Marker for Israel/Palestine */}
        <Marker
          longitude={35.2137}
          latitude={31.7683}
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setShowPopup(true);
          }}
        >
          <div
            className="flex items-center justify-center w-4 h-4 bg-white rounded-full cursor-pointer"
            style={{
              boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.5)",
            }}
          ></div>
        </Marker>

        {/* Popup that shows when marker is clicked */}
        {showPopup && (
          <Popup
            longitude={35.2137}
            latitude={31.7683}
            onClose={() => setShowPopup(false)}
            closeOnClick={true}
            anchor="top"
          >
            <div className="p-2 text-white">
              <h2 className="font-bold">Israel/Palestine Region</h2>
              <p>Information about this area can be displayed here.</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
