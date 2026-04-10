'use client';

import dynamic from 'next/dynamic';
import type { MapDataBundle } from '../lib/map-queries';

const TemporalMapContent = dynamic(() => import('./TemporalMapContent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#1a1a2e] animate-pulse rounded-lg flex items-center justify-center border border-parchment-dark">
      <span className="text-white/40 italic">Loading temporal map...</span>
    </div>
  ),
});

export default function TemporalMapRenderer({ data }: { data: MapDataBundle }) {
  return <TemporalMapContent data={data} />;
}
