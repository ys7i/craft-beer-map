import fs from "node:fs";
import path from "node:path";
import type { Restaurant } from "../src/entities/restaurant";
import { placesApi } from "../src/shared/api/places";

const OUTPUT_DIR = path.join(__dirname, "../public/data/restaurants");

// 都道府県の主要都市座標
const PREFECTURE_CENTERS = {
  北海道: { lat: 43.0642, lng: 141.3469, code: "hokkaido" },
  青森県: { lat: 40.8244, lng: 140.7402, code: "aomori" },
  岩手県: { lat: 39.7036, lng: 141.1527, code: "iwate" },
  宮城県: { lat: 38.2682, lng: 140.8719, code: "miyagi" },
  秋田県: { lat: 39.7186, lng: 140.1024, code: "akita" },
  山形県: { lat: 38.2404, lng: 140.3633, code: "yamagata" },
  福島県: { lat: 37.7503, lng: 140.4676, code: "fukushima" },
  茨城県: { lat: 36.3418, lng: 140.4467, code: "ibaraki" },
  栃木県: { lat: 36.5657, lng: 139.8836, code: "tochigi" },
  群馬県: { lat: 36.3911, lng: 139.0608, code: "gunma" },
  埼玉県: { lat: 35.8617, lng: 139.6455, code: "saitama" },
  千葉県: { lat: 35.6074, lng: 140.1065, code: "chiba" },
  東京都: { lat: 35.6762, lng: 139.6503, code: "tokyo" },
  神奈川県: { lat: 35.4478, lng: 139.6425, code: "kanagawa" },
  新潟県: { lat: 37.9026, lng: 139.0234, code: "niigata" },
  富山県: { lat: 36.6959, lng: 137.2114, code: "toyama" },
  石川県: { lat: 36.5944, lng: 136.6256, code: "ishikawa" },
  福井県: { lat: 36.0652, lng: 136.2217, code: "fukui" },
  山梨県: { lat: 35.6642, lng: 138.5684, code: "yamanashi" },
  長野県: { lat: 36.6513, lng: 138.181, code: "nagano" },
  岐阜県: { lat: 35.3912, lng: 136.7223, code: "gifu" },
  静岡県: { lat: 34.9756, lng: 138.3829, code: "shizuoka" },
  愛知県: { lat: 35.1802, lng: 136.9066, code: "aichi" },
  三重県: { lat: 34.7303, lng: 136.5086, code: "mie" },
  滋賀県: { lat: 35.0045, lng: 135.8686, code: "shiga" },
  京都府: { lat: 35.0116, lng: 135.7681, code: "kyoto" },
  大阪府: { lat: 34.6937, lng: 135.5023, code: "osaka" },
  兵庫県: { lat: 34.6913, lng: 135.183, code: "hyogo" },
  奈良県: { lat: 34.6851, lng: 135.8048, code: "nara" },
  和歌山県: { lat: 34.2261, lng: 135.1675, code: "wakayama" },
  鳥取県: { lat: 35.5036, lng: 134.238, code: "tottori" },
  島根県: { lat: 35.4723, lng: 133.0505, code: "shimane" },
  岡山県: { lat: 34.6617, lng: 133.9349, code: "okayama" },
  広島県: { lat: 34.3853, lng: 132.4553, code: "hiroshima" },
  山口県: { lat: 34.1861, lng: 131.4707, code: "yamaguchi" },
  徳島県: { lat: 34.0658, lng: 134.5592, code: "tokushima" },
  香川県: { lat: 34.3401, lng: 134.0434, code: "kagawa" },
  愛媛県: { lat: 33.8416, lng: 132.7657, code: "ehime" },
  高知県: { lat: 33.5597, lng: 133.5311, code: "kochi" },
  福岡県: { lat: 33.6064, lng: 130.4183, code: "fukuoka" },
  佐賀県: { lat: 33.2494, lng: 130.2989, code: "saga" },
  長崎県: { lat: 32.7503, lng: 129.8777, code: "nagasaki" },
  熊本県: { lat: 32.7898, lng: 130.7417, code: "kumamoto" },
  大分県: { lat: 33.2382, lng: 131.6126, code: "oita" },
  宮崎県: { lat: 31.9077, lng: 131.4202, code: "miyazaki" },
  鹿児島県: { lat: 31.5602, lng: 130.5581, code: "kagoshima" },
  沖縄県: { lat: 26.2124, lng: 127.6792, code: "okinawa" },
};

interface PrefectureRestaurantData {
  prefecture: string;
  prefectureCode: string;
  center: { lat: number; lng: number };
  restaurants: Restaurant[];
  lastUpdated: string;
  count: number;
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchRestaurantsForPrefecture(
  prefecture: string,
  center: { lat: number; lng: number; code: string },
): Promise<PrefectureRestaurantData> {
  console.log(`Fetching restaurants for ${prefecture}...`);

  const allRestaurants: Restaurant[] = [];
  let nextPageToken: string | undefined;

  do {
    try {
      const result = await placesApi.searchRestaurants(
        {
          latitude: center.lat,
          longitude: center.lng,
          radius: 15000,
          keyword: "クラフトビール専門店",
        },
        nextPageToken,
      );

      allRestaurants.push(...result.restaurants);
      nextPageToken = result.nextPageToken;

      console.log(
        `Found ${result.restaurants.length} restaurants for ${prefecture} (total: ${allRestaurants.length})`,
      );

      if (nextPageToken) {
        await delay(2000);
      }
    } catch (error) {
      console.error(`Error fetching data for ${prefecture}:`, error);
      break;
    }
  } while (nextPageToken);

  return {
    prefecture,
    prefectureCode: center.code,
    center: { lat: center.lat, lng: center.lng },
    restaurants: allRestaurants,
    lastUpdated: new Date().toISOString(),
    count: allRestaurants.length,
  };
}

async function generateStaticData() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const results: Record<string, number> = {};

  for (const [prefecture, center] of Object.entries(PREFECTURE_CENTERS)) {
    try {
      const data = await fetchRestaurantsForPrefecture(prefecture, center);

      const filePath = path.join(OUTPUT_DIR, `${center.code}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      results[prefecture] = data.count;
      console.log(`Saved ${data.count} restaurants to ${center.code}.json`);

      await delay(1000);
    } catch (error) {
      console.error(`Failed to process ${prefecture}:`, error);
      results[prefecture] = 0;
    }
  }

  const summary = {
    lastUpdated: new Date().toISOString(),
    totalPrefectures: Object.keys(PREFECTURE_CENTERS).length,
    results,
  };

  const summaryPath = path.join(OUTPUT_DIR, "summary.json");
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  console.log("Static data generation completed");
  return results;
}

if (require.main === module) {
  generateStaticData()
    .then((results) => {
      console.log("Generation completed:", results);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Generation failed:", error);
      process.exit(1);
    });
}

export { generateStaticData };
