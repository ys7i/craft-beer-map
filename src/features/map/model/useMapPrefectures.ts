"use client";

import type { Map as LeafletMap } from "leaflet";
import { useCallback, useState } from "react";
import { getPrefecturesFromBounds } from "@/shared/lib/prefecture";

interface UseMapPrefecturesReturn {
  prefectures: string[];
  isLoading: boolean;
  error: string | null;
  updateFromMap: (map: LeafletMap) => Promise<void>;
}

export const useMapPrefectures = (): UseMapPrefecturesReturn => {
  const [prefectures, setPrefectures] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFromMap = useCallback(async (map: LeafletMap) => {
    setIsLoading(true);
    setError(null);

    try {
      const bounds = map.getBounds();
      const boundsObj = {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      };

      const foundPrefectures = await getPrefecturesFromBounds(boundsObj);
      setPrefectures(foundPrefectures);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to detect prefectures";
      setError(errorMessage);
      setPrefectures([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    prefectures,
    isLoading,
    error,
    updateFromMap,
  };
};
