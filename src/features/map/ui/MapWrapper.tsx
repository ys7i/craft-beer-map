"use client";

import type { LatLngTuple } from "leaflet";
import dynamic from "next/dynamic";

interface MapWrapperProps {
  center?: LatLngTuple;
  zoom?: number;
  className?: string;
}

const LeafletMapComponent = dynamic(
  () => import("./Map").then((mod) => ({ default: mod.LeafletMap })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[600px] w-full items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent mb-4"></div>
          <div className="text-amber-700 font-medium">地図を読み込み中...</div>
        </div>
      </div>
    ),
  },
);

export function MapWrapper(props: MapWrapperProps) {
  return <LeafletMapComponent {...props} />;
}
