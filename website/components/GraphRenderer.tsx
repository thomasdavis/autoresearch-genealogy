'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// This dynamically imports the graph component ONLY on the client
const GraphComponent = dynamic(() => import('./GraphViewContent'), { 
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-parchment/10 animate-pulse rounded-lg flex items-center justify-center border border-parchment-dark">
    <span className="text-ink-light italic">Initializing knowledge graph...</span>
  </div>
});

export default function GraphRenderer({ data }: { data: any }) {
  return <GraphComponent data={data} />;
}
