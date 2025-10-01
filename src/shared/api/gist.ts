import type { Restaurant } from "@/entities/restaurant";

export interface UserAddedRestaurant extends Restaurant {
  googleMapsUrl?: string;
  blogUrl?: string;
  addedAt: string;
}

interface GistData {
  restaurants: UserAddedRestaurant[];
}

interface GistFile {
  content: string;
}

interface GistResponse {
  files: {
    [key: string]: GistFile;
  };
}

const GIST_FILENAME = "craft-beer-restaurants.json";

export class GistApiClient {
  private gistId: string;
  private token?: string;

  constructor(gistId: string, token?: string) {
    this.gistId = gistId;
    this.token = token;
  }

  async fetchRestaurants(): Promise<UserAddedRestaurant[]> {
    try {
      const response = await fetch(
        `https://api.github.com/gists/${this.gistId}`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const gist: GistResponse = await response.json();
      const fileContent = gist.files[GIST_FILENAME]?.content;

      if (!fileContent) {
        return [];
      }

      const data: GistData = JSON.parse(fileContent);
      return data.restaurants || [];
    } catch (error) {
      console.error("Failed to fetch restaurants from Gist:", error);
      return [];
    }
  }

  async addRestaurant(
    restaurant: UserAddedRestaurant,
  ): Promise<UserAddedRestaurant[]> {
    if (!this.token) {
      throw new Error("Authentication required");
    }

    const restaurants = await this.fetchRestaurants();
    const newRestaurants = [...restaurants, restaurant];

    await this.updateGist(newRestaurants);
    return newRestaurants;
  }

  private async updateGist(
    restaurants: UserAddedRestaurant[],
  ): Promise<void> {
    if (!this.token) {
      throw new Error("Authentication required");
    }

    const data: GistData = { restaurants };

    const response = await fetch(
      `https://api.github.com/gists/${this.gistId}`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: {
            [GIST_FILENAME]: {
              content: JSON.stringify(data, null, 2),
            },
          },
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to update Gist: ${errorData.message || response.statusText}`,
      );
    }
  }
}

// クライアントサイド用（読み取り専用）
export function createGistClient(): GistApiClient | null {
  const gistId = process.env.NEXT_PUBLIC_GIST_ID;

  if (!gistId) {
    console.warn("Gist ID is not configured");
    return null;
  }

  return new GistApiClient(gistId);
}

// サーバーサイド用（書き込み可能）
export function createAuthenticatedGistClient(): GistApiClient {
  const gistId = process.env.NEXT_PUBLIC_GIST_ID;
  const token = process.env.GITHUB_TOKEN;

  if (!gistId) {
    throw new Error("NEXT_PUBLIC_GIST_ID is not configured");
  }

  if (!token) {
    throw new Error("GITHUB_TOKEN is not configured");
  }

  return new GistApiClient(gistId, token);
}