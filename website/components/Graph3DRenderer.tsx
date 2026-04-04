'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Graph3DComponent = dynamic(() => import('./Graph3DViewContent'), {
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-[#0a0a18] animate-pulse rounded-lg flex items-center justify-center border border-parchment-dark">
    <span className="text-white/40 italic">Initializing 3D knowledge graph...</span>
  </div>
});

export default function Graph3DRenderer({ data }: { data: any }) {
  return <Graph3DComponent data={data} />;
}
