"use client";

import type { LatLngTuple, Map as LeafletMapType } from "leaflet";
import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { UserLocationMarker, useGeolocation } from "@/features/geolocation";
import { useMapPrefectures } from "../model/useMapPrefectures";
import { useRestaurants } from "../model/useRestaurants";
import { RestaurantMarker } from "./RestaurantMarker";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MapProps {
  center?: LatLngTuple;
  zoom?: number;
  className?: string;
  onPrefecturesChange?: (prefectures: string[]) => void;
}

const DEFAULT_CENTER: LatLngTuple = [34.7024, 135.4959]; // 大阪駅
const DEFAULT_ZOOM = 13;

// Internal component to handle map events
function MapEventHandler({
  updatePrefectureFromMap,
}: {
  updatePrefectureFromMap: (map: LeafletMapType) => Promise<void>;
}) {
  const map = useMap();

  useEffect(() => {
    const handleMoveEnd = () => {
      updatePrefectureFromMap(map);
    };

    // Initial prefecture detection
    updatePrefectureFromMap(map);

    map.on("moveend", handleMoveEnd);
    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [map, updatePrefectureFromMap]);

  return null;
}

// Internal component to render restaurant markers based on current prefectures
function RestaurantLayer({ prefectures }: { prefectures: string[] }) {
  const { restaurants, loading, error } = useRestaurants(prefectures);
  console.log(restaurants, prefectures);

  if (loading || error || restaurants.length === 0) {
    return null;
  }

  return (
    <>
      {restaurants.map((restaurant) => (
        <RestaurantMarker key={restaurant.id} restaurant={restaurant} />
      ))}
    </>
  );
}

export function LeafletMap({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  className = "h-[600px] w-full",
}: MapProps) {
  const { userLocation } = useGeolocation();
  const { prefectures, updateFromMap } = useMapPrefectures();

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
      <MapEventHandler updatePrefectureFromMap={updateFromMap} />
      <RestaurantLayer prefectures={prefectures} />
      {userLocation && <UserLocationMarker userLocation={userLocation} />}
    </MapContainer>
  );
}
