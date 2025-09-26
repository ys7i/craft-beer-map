"use client";

import { useCallback, useState } from "react";
import type {
  Restaurant,
  RestaurantSearchParams,
  RestaurantSearchResult,
} from "@/entities/restaurant";
import { placesApi } from "@/shared/api/places";

interface UseRestaurantSearchReturn {
  restaurants: Restaurant[];
  isLoading: boolean;
  error: string | null;
  hasNextPage: boolean;
  searchRestaurants: (params: RestaurantSearchParams) => Promise<void>;
  loadMore: () => Promise<void>;
  clearResults: () => void;
}

export const useRestaurantSearch = (): UseRestaurantSearchReturn => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [lastSearchParams, setLastSearchParams] =
    useState<RestaurantSearchParams | null>(null);

  const searchRestaurants = useCallback(
    async (params: RestaurantSearchParams) => {
      setIsLoading(true);
      setError(null);
      setLastSearchParams(params);

      try {
        const result: RestaurantSearchResult =
          await placesApi.searchRestaurants(params);
        setRestaurants(result.restaurants);
        setNextPageToken(result.nextPageToken);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to search restaurants";
        setError(errorMessage);
        setRestaurants([]);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const loadMore = useCallback(async () => {
    if (!nextPageToken || !lastSearchParams || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const result: RestaurantSearchResult = await placesApi.searchRestaurants(
        lastSearchParams,
        nextPageToken,
      );
      setRestaurants((prev) => [...prev, ...result.restaurants]);
      setNextPageToken(result.nextPageToken);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load more restaurants";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [nextPageToken, lastSearchParams, isLoading]);

  const clearResults = useCallback(() => {
    setRestaurants([]);
    setError(null);
    setNextPageToken(undefined);
    setLastSearchParams(null);
  }, []);

  return {
    restaurants,
    isLoading,
    error,
    hasNextPage: !!nextPageToken,
    searchRestaurants,
    loadMore,
    clearResults,
  };
};
