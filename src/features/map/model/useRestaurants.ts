"use client";

import { useState, useEffect } from "react";
import type { Restaurant } from "@/entities/restaurant";

interface RestaurantData {
  prefecture: string;
  prefectureCode: string;
  center: {
    lat: number;
    lng: number;
  };
  restaurants: Restaurant[];
}

// 都道府県名からファイル名へのマッピング
const PREFECTURE_CODE_MAP: Record<string, string> = {
  "北海道": "hokkaido",
  "青森県": "aomori",
  "岩手県": "iwate",
  "宮城県": "miyagi",
  "秋田県": "akita",
  "山形県": "yamagata",
  "福島県": "fukushima",
  "茨城県": "ibaraki",
  "栃木県": "tochigi",
  "群馬県": "gunma",
  "埼玉県": "saitama",
  "千葉県": "chiba",
  "東京都": "tokyo",
  "神奈川県": "kanagawa",
  "新潟県": "niigata",
  "富山県": "toyama",
  "石川県": "ishikawa",
  "福井県": "fukui",
  "山梨県": "yamanashi",
  "長野県": "nagano",
  "岐阜県": "gifu",
  "静岡県": "shizuoka",
  "愛知県": "aichi",
  "三重県": "mie",
  "滋賀県": "shiga",
  "京都府": "kyoto",
  "大阪府": "osaka",
  "兵庫県": "hyogo",
  "奈良県": "nara",
  "和歌山県": "wakayama",
  "鳥取県": "tottori",
  "島根県": "shimane",
  "岡山県": "okayama",
  "広島県": "hiroshima",
  "山口県": "yamaguchi",
  "徳島県": "tokushima",
  "香川県": "kagawa",
  "愛媛県": "ehime",
  "高知県": "kochi",
  "福岡県": "fukuoka",
  "佐賀県": "saga",
  "長崎県": "nagasaki",
  "熊本県": "kumamoto",
  "大分県": "oita",
  "宮崎県": "miyazaki",
  "鹿児島県": "kagoshima",
  "沖縄県": "okinawa"
};

export function useRestaurants(prefectures: string[]) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (prefectures.length === 0) {
      setRestaurants([]);
      return;
    }

    const loadRestaurants = async () => {
      try {
        setLoading(true);
        setError(null);

        const allRestaurants: Restaurant[] = [];
        const loadPromises = prefectures.map(async (prefecture) => {
          const prefectureCode = PREFECTURE_CODE_MAP[prefecture];
          if (!prefectureCode) {
            console.warn(`Prefecture code not found for: ${prefecture}`);
            return;
          }

          try {
            const response = await fetch(`/data/restaurants/${prefectureCode}.json`);
            if (!response.ok) {
              console.warn(`Failed to fetch ${prefecture} restaurants: ${response.status}`);
              return;
            }

            const data: RestaurantData = await response.json();
            allRestaurants.push(...data.restaurants);
          } catch (err) {
            console.warn(`Error loading ${prefecture} restaurants:`, err);
          }
        });

        await Promise.all(loadPromises);
        setRestaurants(allRestaurants);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, [prefectures]);

  return { restaurants, loading, error };
}