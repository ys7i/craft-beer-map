interface PrefectureFeature {
  type: "Feature";
  properties: {
    nam: string;
    nam_ja: string;
    id: number;
  };
  geometry: {
    type: "MultiPolygon";
    coordinates: number[][][][];
  };
}

interface PrefectureCollection {
  type: "FeatureCollection";
  features: PrefectureFeature[];
}

let prefecturesData: PrefectureCollection | null = null;

// Alternative: Winding number algorithm for better accuracy
function pointInPolygonWinding(
  point: [number, number],
  polygon: number[][]
): boolean {
  const [px, py] = point;
  let wn = 0; // winding number

  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    if (yi <= py) {
      if (yj > py) {
        // upward crossing
        if (isLeft(xi, yi, xj, yj, px, py) > 0) {
          // point left of edge
          wn++;
        }
      }
    } else {
      if (yj <= py) {
        // downward crossing
        if (isLeft(xi, yi, xj, yj, px, py) < 0) {
          // point right of edge
          wn--;
        }
      }
    }
  }

  return wn !== 0;
}

// Helper function for winding algorithm
function isLeft(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0);
}

// Check if point is in MultiPolygon
function pointInMultiPolygon(
  point: [number, number],
  multiPolygon: number[][][][]
): boolean {
  for (const polygon of multiPolygon) {
    // Check exterior ring (polygon[0])
    if (pointInPolygonWinding(point, polygon[0])) {
      // Check if point is in any hole (polygon[1], polygon[2], ...)
      let inHole = false;
      for (let i = 1; i < polygon.length; i++) {
        if (pointInPolygonWinding(point, polygon[i])) {
          inHole = true;
          break;
        }
      }
      if (!inHole) {
        return true;
      }
    }
  }
  return false;
}

// Load prefecture data
async function loadPrefectureData(): Promise<PrefectureCollection> {
  if (prefecturesData) {
    return prefecturesData;
  }

  try {
    const response = await fetch("/data/japan-prefectures.geojson");
    if (!response.ok) {
      throw new Error(
        `Failed to load prefecture data: ${response.status} ${response.statusText}`
      );
    }
    prefecturesData = await response.json();
    return prefecturesData!;
  } catch (error) {
    throw new Error(`Failed to load prefecture data: ${error}`);
  }
}

// Get prefecture from coordinates
export async function getPrefectureFromCoordinates(
  longitude: number,
  latitude: number
): Promise<string | null> {
  const data = await loadPrefectureData();
  const point: [number, number] = [longitude, latitude];

  for (const feature of data.features) {
    if (pointInMultiPolygon(point, feature.geometry.coordinates)) {
      return feature.properties.nam_ja;
    }
  }

  return null;
}

// Get prefectures from bounding box
export async function getPrefecturesFromBounds(bounds: {
  north: number;
  south: number;
  east: number;
  west: number;
}): Promise<string[]> {
  const data = await loadPrefectureData();
  const prefectures = new Set<string>();

  // Check corners and center of bounding box
  const testPoints: [number, number][] = [
    [bounds.west, bounds.north], // NW
    [bounds.east, bounds.north], // NE
    [bounds.east, bounds.south], // SE
    [bounds.west, bounds.south], // SW
    [(bounds.west + bounds.east) / 2, (bounds.north + bounds.south) / 2], // Center
  ];

  for (const point of testPoints) {
    for (const feature of data.features) {
      if (pointInMultiPolygon(point, feature.geometry.coordinates)) {
        prefectures.add(feature.properties.nam_ja);
        break; // Found, no need to check other prefectures
      }
    }
  }

  // Also check if any prefecture intersects with the bounding box
  for (const feature of data.features) {
    const coords = feature.geometry.coordinates;
    let intersects = false;

    for (const polygon of coords) {
      for (const ring of polygon) {
        for (const coord of ring) {
          const lng = coord[0];
          const lat = coord[1];
          if (
            lng >= bounds.west &&
            lng <= bounds.east &&
            lat >= bounds.south &&
            lat <= bounds.north
          ) {
            intersects = true;
            break;
          }
        }
        if (intersects) break;
      }
      if (intersects) break;
    }

    if (intersects) {
      prefectures.add(feature.properties.nam_ja);
    }
  }

  return Array.from(prefectures);
}
