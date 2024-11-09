"use client";
import { Marker, Popup } from "react-map-gl";
import Image from "next/image";
import "mapbox-gl/dist/mapbox-gl.css";

export default function ConflictMarker({
  latitude,
  longitude,
  title,
  description,
  isOpen,
  onClick,
  imageURL,
  imageDesc,
}) {
  return (
    <div>
      <Marker
        longitude={longitude}
        latitude={latitude}
        onClick={(e) => {
          e.originalEvent.stopPropagation();
          onClick();
        }}
      >
        <div
          className="flex items-center justify-center w-4 h-4 bg-third_color rounded-full cursor-pointer"
          style={{
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.5)",
          }}
        ></div>
      </Marker>

      {/* Popup that shows when the marker is clicked */}
      {isOpen && (
        <Popup
          longitude={longitude}
          latitude={latitude}
          onClose={() => onClick(null)}
          closeOnClick={true}
          anchor="top"
        >
          <div className="p-2 text-black">
            <h2 className="font-bold">{title}</h2>
            <p>{description}</p>
            {imageURL && (
              <div className="mt-2 w-full h-auto max-h-40 relative">
                <Image
                  src={imageURL}
                  alt={imageDesc}
                  layout="responsive"
                  width={400} // Adjust width based on your design
                  height={250} // Adjust height based on your design
                  objectFit="cover"
                  className="rounded"
                />
              </div>
            )}
          </div>
        </Popup>
      )}
    </div>
  );
}
