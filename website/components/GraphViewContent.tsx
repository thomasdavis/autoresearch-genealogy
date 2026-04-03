'use client';

import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useRouter } from 'next/navigation';

interface Node {
  id: string;
  name: string;
  type: string;
  val?: number;
  x?: number;
  y?: number;
}

interface Link {
  source: string | Node;
  target: string | Node;
  type: string;
  confidence: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

interface ContextMenu {
  x: number;
  y: number;
  node: Node;
}

// Pre-compute color map for fast lookup
const TYPE_COLORS: Record<string, string> = {
  person: '#ef4444',
  location: '#3b82f6',
  document: '#10b981',
  clan: '#f59e0b',
  organization: '#8b5cf6',
  surname: '#ec4899',
  ship: '#06b6d4',
  occupation: '#84cc16',
  medical: '#f97316',
};
const DEFAULT_COLOR = '#6b7280';

function getColor(type: string) {
  return TYPE_COLORS[type] || DEFAULT_COLOR;
}

export default function GraphView({ data }: { data: GraphData }) {
  const router = useRouter();
  const graphRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverNode, setHoverNode] = useState<Node | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [focusedNode, setFocusedNode] = useState<Node | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLabels, setShowLabels] = useState(false);

  // Responsive dimensions -- debounced
  useEffect(() => {
    let raf: number;
    function updateDimensions() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: Math.max(400, window.innerHeight - 200),
        });
      }
    }
    function onResize() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateDimensions);
    }
    updateDimensions();
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); cancelAnimationFrame(raf); };
  }, []);

  // Close context menu on click elsewhere
  useEffect(() => {
    function handleClick() { setContextMenu(null); }
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // Pre-compute a color array keyed by node index for the fastest possible paint
  const nodeColorCache = useMemo(() => {
    const cache = new Map<string, string>();
    for (const n of data.nodes) {
      cache.set(n.id, getColor(n.type));
    }
    return cache;
  }, [data.nodes]);

  // Show all nodes; filter only when user applies type/search filters
  const graphData = useMemo(() => {
    let candidateNodes = data.nodes;
    const nodeSet = new Set<string>();

    if (filterType !== 'all') {
      candidateNodes = candidateNodes.filter(n => n.type === filterType);
    }

    if (searchQuery.length >= 2) {
      const q = searchQuery.toLowerCase();
      candidateNodes = candidateNodes.filter(n => n.name.toLowerCase().includes(q));
    }

    const nodes = candidateNodes.map(n => {
      nodeSet.add(n.id);
      return { ...n, val: n.type === 'person' ? 4 : 2 };
    });

    const links = data.links.filter(link => {
      const src = typeof link.source === 'string' ? link.source : link.source.id;
      const tgt = typeof link.target === 'string' ? link.target : link.target.id;
      return nodeSet.has(src) && nodeSet.has(tgt);
    });

    return { nodes, links };
  }, [data, filterType, searchQuery]);

  // After simulation settles, stop the engine to free CPU
  const handleEngineStop = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.pauseAnimation();
    }
  }, []);

  // Resume animation on interaction
  const resumeAnimation = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.resumeAnimation();
    }
  }, []);

  // Click: animate and center on node
  const handleNodeClick = useCallback((node: any) => {
    setFocusedNode(node);
    setContextMenu(null);
    resumeAnimation();
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 800);
      graphRef.current.zoom(4, 800);
    }
  }, [resumeAnimation]);

  // Right-click: show context menu
  const handleNodeRightClick = useCallback((node: any, event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    const clientX = 'clientX' in event ? event.clientX : (event as TouchEvent).touches?.[0]?.clientX || 0;
    const clientY = 'clientY' in event ? event.clientY : (event as TouchEvent).touches?.[0]?.clientY || 0;
    setContextMenu({ x: clientX, y: clientY, node });
  }, []);

  // Background click: reset zoom
  const handleBackgroundClick = useCallback(() => {
    setFocusedNode(null);
    setContextMenu(null);
    resumeAnimation();
    if (graphRef.current) {
      graphRef.current.zoomToFit(400, 40);
    }
  }, [resumeAnimation]);

  // Focused node id for fast comparison (avoids object identity check in hot path)
  const focusedId = focusedNode?.id ?? null;

  // Custom node rendering -- 3 LOD tiers for performance
  const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isFocused = node.id === focusedId;
    const color = nodeColorCache.get(node.id) || DEFAULT_COLOR;
    const isPerson = node.type === 'person';

    // LOD tier 1: ultra-zoomed-out -- visible dots
    if (globalScale < 0.15 && !isFocused) {
      ctx.fillStyle = color;
      const s = isPerson ? 4 : 2;
      ctx.fillRect(node.x - s * 0.5, node.y - s * 0.5, s, s);
      return;
    }

    // LOD tier 2: zoomed-out -- bigger squares with slight glow for persons
    if (globalScale < 0.5 && !isFocused) {
      const s = isPerson ? 5 : 2.5;
      ctx.fillStyle = color;
      ctx.fillRect(node.x - s * 0.5, node.y - s * 0.5, s, s);
      return;
    }

    // LOD tier 3: normal/zoomed-in -- circles with optional labels
    const baseSize = isPerson ? 5 : 2.5;
    const r = baseSize * (isFocused ? 2.5 : 1);

    if (isFocused) {
      // Outer glow
      ctx.beginPath();
      ctx.arc(node.x, node.y, r + 4, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();
      // Inner glow
      ctx.beginPath();
      ctx.arc(node.x, node.y, r + 2, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();

    if (isFocused) {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Labels only when zoomed in enough or for focused node
    if (isFocused || (showLabels && globalScale > 1.5) || globalScale > 4) {
      const fontSize = Math.max(10 / globalScale, 1.2);
      ctx.font = `${isFocused ? 'bold ' : ''}${fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = isFocused ? '#000' : 'rgba(0,0,0,0.6)';
      ctx.fillText(node.name, node.x, node.y + r + 1);
    }
  }, [focusedId, showLabels, nodeColorCache]);

  // Hit area for pointer -- slightly larger than visual for easier clicking
  const paintNodeArea = useCallback((node: any, color: string, ctx: CanvasRenderingContext2D) => {
    const r = node.type === 'person' ? 6 : 4;
    ctx.fillStyle = color;
    ctx.fillRect(node.x - r, node.y - r, r * 2, r * 2);
  }, []);

  // Distinct entity types for filter dropdown
  const entityTypes = useMemo(() => {
    const counts = new Map<string, number>();
    for (const n of data.nodes) {
      counts.set(n.type, (counts.get(n.type) || 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [data]);

  return (
    <div ref={containerRef} className="w-full border border-parchment-dark rounded-lg bg-white relative overflow-hidden" style={{ height: dimensions.height }}>
      {/* Controls bar */}
      <div className="absolute top-2 left-2 right-2 z-10 flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Search nodes..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="px-3 py-1.5 text-sm border border-parchment-dark rounded bg-white/90 backdrop-blur-sm w-40 sm:w-56 focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-2 py-1.5 text-sm border border-parchment-dark rounded bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="all">All types ({data.nodes.length})</option>
          {entityTypes.map(([t, count]) => (
            <option key={t} value={t}>{t} ({count})</option>
          ))}
        </select>
        <button
          onClick={() => setShowLabels(!showLabels)}
          className={`px-3 py-1.5 text-sm border rounded backdrop-blur-sm transition-colors ${
            showLabels ? 'bg-accent text-white border-accent' : 'bg-white/90 border-parchment-dark text-ink-light'
          }`}
        >
          Labels
        </button>
        <button
          onClick={handleBackgroundClick}
          className="px-3 py-1.5 text-sm border border-parchment-dark rounded bg-white/90 backdrop-blur-sm text-ink-light hover:bg-parchment-dark/30 transition-colors"
        >
          Reset
        </button>
        <span className="text-xs text-ink-light bg-white/80 px-2 py-1 rounded backdrop-blur-sm ml-auto hidden sm:inline">
          {graphData.nodes.length.toLocaleString()} nodes / {graphData.links.length.toLocaleString()} links
        </span>
      </div>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 z-10 bg-white/90 p-2 rounded border border-parchment-dark text-[10px] backdrop-blur-sm hidden sm:block">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {Object.entries(TYPE_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
              <span className="capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hover tooltip */}
      {hoverNode && (
        <div className="absolute bottom-2 right-2 z-10 bg-white/90 p-2 rounded border border-parchment-dark text-sm backdrop-blur-sm max-w-[200px]">
          <div className="font-bold truncate">{hoverNode.name}</div>
          <div className="text-[10px] text-ink-light uppercase">{hoverNode.type}</div>
        </div>
      )}

      {/* Focused node info */}
      {focusedNode && !contextMenu && (
        <div className="absolute bottom-14 sm:bottom-2 left-1/2 -translate-x-1/2 z-10 bg-white/95 px-4 py-2 rounded-lg border border-parchment-dark shadow-lg backdrop-blur-sm text-center max-w-xs">
          <div className="font-bold text-sm truncate">{focusedNode.name}</div>
          <div className="text-[10px] text-ink-light uppercase mb-1">{focusedNode.type}</div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => router.push(`/entities/${focusedNode.id}`)}
              className="text-xs px-3 py-1 bg-accent text-white rounded hover:bg-accent-light transition-colors"
            >
              View Details
            </button>
            <button
              onClick={handleBackgroundClick}
              className="text-xs px-3 py-1 border border-parchment-dark rounded text-ink-light hover:bg-parchment-dark/20 transition-colors"
            >
              Unfocus
            </button>
          </div>
        </div>
      )}

      {/* Right-click context menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-white rounded-lg border border-parchment-dark shadow-xl overflow-hidden min-w-[180px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={e => e.stopPropagation()}
        >
          <div className="px-3 py-2 border-b border-parchment-dark bg-parchment/30">
            <div className="font-bold text-sm truncate">{contextMenu.node.name}</div>
            <div className="text-[10px] text-ink-light uppercase">{contextMenu.node.type}</div>
          </div>
          <button
            onClick={() => { router.push(`/entities/${contextMenu.node.id}`); setContextMenu(null); }}
            className="w-full text-left px-3 py-2 text-sm hover:bg-parchment/50 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Full Details
          </button>
          <button
            onClick={() => { handleNodeClick(contextMenu.node); setContextMenu(null); }}
            className="w-full text-left px-3 py-2 text-sm hover:bg-parchment/50 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Focus Node
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(contextMenu.node.id);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-2 text-sm hover:bg-parchment/50 transition-colors flex items-center gap-2 border-t border-parchment-dark/30"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
            </svg>
            Copy ID
          </button>
        </div>
      )}

      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeCanvasObject={paintNode}
        nodePointerAreaPaint={paintNodeArea}
        onNodeClick={handleNodeClick}
        onNodeRightClick={handleNodeRightClick}
        onNodeHover={setHoverNode as any}
        onBackgroundClick={handleBackgroundClick}
        onEngineStop={handleEngineStop}
        onNodeDragEnd={resumeAnimation}
        onZoom={resumeAnimation}
        linkAutoColorBy={undefined}
        linkCanvasObjectMode={() => 'replace'}
        linkCanvasObject={(link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
          const src = link.source;
          const tgt = link.target;
          if (!src || !tgt || src.x == null || tgt.x == null) return;

          // Graceful LOD for links -- visible at all zooms, stronger when zoomed in
          const alpha = globalScale < 0.08 ? 0.1
                      : globalScale < 0.2  ? 0.15
                      : globalScale < 0.5  ? 0.25
                      : globalScale < 1.5  ? 0.4
                      : 0.55;

          const width = globalScale < 0.15 ? 0.1 : globalScale < 0.5 ? 0.2 : globalScale < 1.5 ? 0.4 : 0.7;

          ctx.beginPath();
          ctx.moveTo(src.x, src.y);
          ctx.lineTo(tgt.x, tgt.y);
          ctx.strokeStyle = `rgba(120,115,110,${alpha})`;
          ctx.lineWidth = width / globalScale;
          ctx.stroke();
        }}
        enableNodeDrag={true}
        cooldownTime={4000}
        warmupTicks={80}
        d3AlphaDecay={0.03}
        d3VelocityDecay={0.4}
        minZoom={0.05}
        maxZoom={20}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
}
