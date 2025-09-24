"use client";

import type { LatLngTuple } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MapProps {
  center?: LatLngTuple;
  zoom?: number;
  className?: string;
}

const DEFAULT_CENTER: LatLngTuple = [34.7024, 135.4959]; // 大阪駅
const DEFAULT_ZOOM = 13;

export function LeafletMap({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  className = "h-[600px] w-full",
}: MapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      className={className}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}
