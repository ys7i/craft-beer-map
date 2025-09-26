import type {
  Restaurant,
  RestaurantSearchParams,
  RestaurantSearchResult,
} from "@/entities/restaurant";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env" });

interface GooglePlacesPhoto {
  photo_reference: string;
  height: number;
  width: number;
}

interface GooglePlacesResult {
  place_id: string;
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  vicinity: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  website?: string;
  rating?: number;
  price_level?: number;
  photos?: GooglePlacesPhoto[];
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
}

interface GooglePlacesResponse {
  results: GooglePlacesResult[];
  status: string;
  next_page_token?: string;
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

export class PlacesApiClient {
  private baseUrl = "https://maps.googleapis.com/maps/api/place";

  private transformToRestaurant(place: GooglePlacesResult): Restaurant {
    const photoUrl = place.photos?.[0]
      ? `${this.baseUrl}/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${API_KEY}`
      : undefined;

    return {
      id: place.place_id,
      name: place.name,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      address: place.formatted_address || place.vicinity,
      phone: place.formatted_phone_number,
      website: place.website,
      rating: place.rating,
      priceLevel: place.price_level,
      photoUrl,
      openingHours: place.opening_hours?.weekday_text,
    };
  }

  async searchRestaurants(
    params: RestaurantSearchParams,
    pageToken?: string
  ): Promise<RestaurantSearchResult> {
    if (!API_KEY) {
      throw new Error("Google Places API key is not configured");
    }

    const {
      latitude,
      longitude,
      radius = 5000,
      keyword = "craft beer",
      minRating,
    } = params;

    const searchParams = new URLSearchParams({
      location: `${latitude},${longitude}`,
      radius: radius.toString(),
      keyword,
      type: "restaurant",
      key: API_KEY,
    });

    if (minRating) {
      searchParams.append("minprice", "0");
      searchParams.append("maxprice", "4");
    }

    if (pageToken) {
      searchParams.append("pagetoken", pageToken);
    }

    const response = await fetch(
      `${this.baseUrl}/nearbysearch/json?${searchParams}`
    );

    if (!response.ok) {
      throw new Error(`Places API error: ${response.statusText}`);
    }

    const data: GooglePlacesResponse = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      throw new Error(`Places API error: ${data.status}`);
    }

    const restaurants = data.results
      .map((place) => this.transformToRestaurant(place))
      .filter(
        (restaurant) =>
          !minRating || (restaurant.rating && restaurant.rating >= minRating)
      );

    return {
      restaurants,
      nextPageToken: data.next_page_token,
    };
  }
}

export const placesApi = new PlacesApiClient();
