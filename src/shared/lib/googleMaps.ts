export interface GoogleMapsLocation {
  latitude: number;
  longitude: number;
  placeId?: string;
}

/**
 * Google Maps URLから位置情報を抽出
 * 対応形式:
 * - https://maps.app.goo.gl/... (短縮URL)
 * - https://www.google.com/maps/place/.../@35.6812,139.7671,17z
 * - https://www.google.com/maps?q=35.6812,139.7671
 * - https://goo.gl/maps/...
 */
export async function extractLocationFromGoogleMapsUrl(
  url: string,
): Promise<GoogleMapsLocation> {
  try {
    // 短縮URLの場合はリダイレクト先を取得
    let finalUrl = url;
    if (
      url.includes("maps.app.goo.gl") ||
      url.includes("goo.gl/maps") ||
      url.includes("g.page")
    ) {
      const response = await fetch(url, { redirect: "follow" });
      finalUrl = response.url;
    }

    // Place IDを抽出
    const placeIdMatch = finalUrl.match(/place\/([^\/]+)\//);
    const placeId = placeIdMatch ? placeIdMatch[1] : undefined;

    // 座標を抽出（@lat,lng,zoom形式）
    const coordMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordMatch) {
      return {
        latitude: parseFloat(coordMatch[1]),
        longitude: parseFloat(coordMatch[2]),
        placeId,
      };
    }

    // 座標を抽出（?q=lat,lng形式）
    const qMatch = finalUrl.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qMatch) {
      return {
        latitude: parseFloat(qMatch[1]),
        longitude: parseFloat(qMatch[2]),
        placeId,
      };
    }

    // Place IDがある場合はGoogle Places APIで詳細取得
    if (placeId) {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
      if (!apiKey) {
        throw new Error("Google Places API key is not configured");
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${apiKey}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch place details");
      }

      const data = await response.json();
      if (data.result?.geometry?.location) {
        return {
          latitude: data.result.geometry.location.lat,
          longitude: data.result.geometry.location.lng,
          placeId,
        };
      }
    }

    throw new Error("Could not extract location from Google Maps URL");
  } catch (error) {
    throw new Error(
      `Invalid Google Maps URL: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}