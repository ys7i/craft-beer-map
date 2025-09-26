import { MapWrapper } from "@/features/map";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <div className="mb-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent sm:text-6xl">
              🍺 Craft Beer Map
            </h1>
            <div className="mt-2 h-1 w-24 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full"></div>
          </div>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            新たなクラフトビール店を発見しよう
          </p>
          <p className="text-gray-600 mt-2">こだわりのビールが待っています</p>
        </header>

        <Card className="border-amber-200 shadow-2xl shadow-amber-500/10">
          <div className="p-1 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-lg">
            <CardContent className="p-0 bg-white rounded-md overflow-hidden">
              <MapWrapper className="h-[600px] w-full" />
            </CardContent>
          </div>
        </Card>

        <div className="mt-12 text-center">
          <Badge
            variant="secondary"
            className="px-6 py-3 text-amber-700 bg-white/80 hover:bg-white/90 border-amber-200 text-sm font-medium"
          >
            🍻 美味しいクラフトビールを見つけよう
          </Badge>
        </div>
      </main>
    </div>
  );
}
