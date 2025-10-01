import { NextRequest, NextResponse } from "next/server";
import {
  createAuthenticatedGistClient,
  type UserAddedRestaurant,
} from "@/shared/api/gist";
import { extractLocationFromGoogleMapsUrl } from "@/shared/lib/googleMaps";

interface AddRestaurantRequest {
  name: string;
  googleMapsUrl: string;
  blogUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AddRestaurantRequest = await request.json();

    // バリデーション
    if (!body.name || !body.googleMapsUrl) {
      return NextResponse.json(
        { message: "Name and Google Maps URL are required" },
        { status: 400 },
      );
    }

    // Google Maps URLから位置情報を抽出
    const location = await extractLocationFromGoogleMapsUrl(
      body.googleMapsUrl,
    );

    // 新しいレストランオブジェクトを作成
    const newRestaurant: UserAddedRestaurant = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      name: body.name,
      latitude: location.latitude,
      longitude: location.longitude,
      address: "", // Google Places APIから取得することも可能
      googleMapsUrl: body.googleMapsUrl,
      blogUrl: body.blogUrl || undefined,
      addedAt: new Date().toISOString(),
    };

    // Gistに追加
    const gistClient = createAuthenticatedGistClient();
    await gistClient.addRestaurant(newRestaurant);

    return NextResponse.json(
      {
        message: "Restaurant added successfully",
        restaurant: newRestaurant,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding restaurant:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to add restaurant",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const gistClient = createAuthenticatedGistClient();
    const restaurants = await gistClient.fetchRestaurants();

    return NextResponse.json({ restaurants }, { status: 200 });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch restaurants",
      },
      { status: 500 },
    );
  }
}