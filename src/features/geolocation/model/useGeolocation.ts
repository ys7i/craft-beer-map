"use client";

import { useCallback, useEffect, useState } from "react";
import type { UserLocation } from "@/entities/location";
import {
  type GeolocationError,
  getCurrentPosition,
} from "@/shared/lib/geolocation";

interface UseGeolocationReturn {
  userLocation: UserLocation | null;
  error: GeolocationError | null;
  isLoading: boolean;
  refetch: () => void;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<GeolocationError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const position = await getCurrentPosition();
      const userLoc: UserLocation = {
        id: "user-location",
        latitude: position.latitude,
        longitude: position.longitude,
        name: "現在位置",
        timestamp: Date.now(),
      };
      setUserLocation(userLoc);
    } catch (err) {
      setError(err as GeolocationError);
      setUserLocation(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return {
    userLocation,
    error,
    isLoading,
    refetch: fetchLocation,
  };
};
