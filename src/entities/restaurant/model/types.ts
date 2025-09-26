export interface Restaurant {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  priceLevel?: number;
  photoUrl?: string;
  openingHours?: string[];
}

export interface RestaurantSearchParams {
  latitude: number;
  longitude: number;
  radius?: number; // meters, default 5000
  keyword?: string;
  minRating?: number;
}

export interface RestaurantSearchResult {
  restaurants: Restaurant[];
  nextPageToken?: string;
}
