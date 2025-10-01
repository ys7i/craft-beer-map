"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

interface RestaurantFormData {
  name: string;
  googleMapsUrl: string;
  blogUrl: string;
}

export default function AdminPage() {
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: "",
    googleMapsUrl: "",
    blogUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add restaurant");
      }

      setMessage({
        type: "success",
        text: "レストランを追加しました！",
      });
      setFormData({ name: "", googleMapsUrl: "", blogUrl: "" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "エラーが発生しました",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
            🍺 管理者ページ
          </h1>
          <p className="text-gray-600 mt-2">
            クラフトビールレストランを追加
          </p>
        </header>

        <Card className="border-amber-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-amber-700">
              新しいレストランを追加
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  レストラン名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="例: クラフトビアバー 東京"
                />
              </div>

              <div>
                <label
                  htmlFor="googleMapsUrl"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Google Maps 共有URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="googleMapsUrl"
                  required
                  value={formData.googleMapsUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, googleMapsUrl: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="https://maps.app.goo.gl/..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Google Mapsで「共有」→「リンクをコピー」したURLを貼り付け
                </p>
              </div>

              <div>
                <label
                  htmlFor="blogUrl"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  ブログURL（オプション）
                </label>
                <input
                  type="url"
                  id="blogUrl"
                  value={formData.blogUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, blogUrl: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="https://example.com/blog/..."
                />
              </div>

              {message && (
                <div
                  className={`p-4 rounded-md ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3"
              >
                {loading ? "追加中..." : "レストランを追加"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-amber-600 hover:text-amber-700 underline"
          >
            ← マップに戻る
          </a>
        </div>
      </div>
    </div>
  );
}