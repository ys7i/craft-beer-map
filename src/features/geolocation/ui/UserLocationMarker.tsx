"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { UserLocation } from "@/entities/location";

interface UserLocationMarkerProps {
  userLocation: UserLocation;
}

const createUserLocationIcon = () => {
  return L.divIcon({
    html: `<div style="
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #3B82F6;
      border: 3px solid white;
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
      position: relative;
    ">
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: white;
      "></div>
    </div>`,
    className: "user-location-marker",
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
};

export function UserLocationMarker({ userLocation }: UserLocationMarkerProps) {
  return (
    <Marker
      position={[userLocation.latitude, userLocation.longitude]}
      icon={createUserLocationIcon()}
    >
      <Popup>
        <div className="text-center">
          <div className="font-semibold text-blue-700">📍 現在位置</div>
        </div>
      </Popup>
    </Marker>
  );
}
