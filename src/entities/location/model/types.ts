export interface Location {
  id: string;
  latitude: number;
  longitude: number;
  name?: string;
  description?: string;
}

export interface UserLocation extends Location {
  accuracy?: number;
  timestamp: number;
}

export type LocationCoordinates = {
  latitude: number;
  longitude: number;
};