"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Beer } from "lucide-react";
import { renderToString } from "react-dom/server";
import type { Restaurant } from "@/entities/restaurant";

interface RestaurantMarkerProps {
  restaurant: Restaurant;
}

const createBeerIcon = () => {
  const iconHtml = renderToString(
    <div className="w-8 h-8 bg-amber-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
      <Beer size={18} color="white" strokeWidth={2.5} />
    </div>
  );

  return new L.DivIcon({
    html: iconHtml,
    className: 'beer-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const beerIcon = createBeerIcon();

export function RestaurantMarker({ restaurant }: RestaurantMarkerProps) {
  return (
    <Marker
      position={[restaurant.latitude, restaurant.longitude]}
      icon={beerIcon}
    >
      <Popup>
        <div className="min-w-[250px] p-2">
          <div className="flex items-start gap-3">
            {restaurant.photoUrl && (
              <img
                src={restaurant.photoUrl}
                alt={restaurant.name}
                className="w-16 h-16 object-cover rounded-md flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-base mb-1">
                {restaurant.name}
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                {restaurant.rating && (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span>{restaurant.rating}</span>
                  </div>
                )}
                {restaurant.priceLevel && (
                  <div className="text-green-600">
                    {"¥".repeat(restaurant.priceLevel)}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500 border-t pt-2">
            📍 {restaurant.address}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
