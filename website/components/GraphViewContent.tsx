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

const PERSON_PRIORITY_TYPES = ['person', 'location', 'clan', 'organization'];

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

  // Responsive dimensions
  useEffect(() => {
    function updateDimensions() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: Math.max(400, window.innerHeight - 200),
        });
      }
    }
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Close context menu on click elsewhere
  useEffect(() => {
    function handleClick() { setContextMenu(null); }
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

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

  // Click: animate and center on node
  const handleNodeClick = useCallback((node: any) => {
    setFocusedNode(node);
    setContextMenu(null);

    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 800);
      graphRef.current.zoom(4, 800);
    }
  }, []);

  // Right-click: show context menu
  const handleNodeRightClick = useCallback((node: any, event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    const clientX = 'clientX' in event ? event.clientX : (event as TouchEvent).touches?.[0]?.clientX || 0;
    const clientY = 'clientY' in event ? event.clientY : (event as TouchEvent).touches?.[0]?.clientY || 0;
    setContextMenu({ x: clientX, y: clientY, node });
  }, []);

  // Double-click: go to detail page
  const handleNodeDblClick = useCallback((node: any) => {
    router.push(`/entities/${node.id}`);
  }, [router]);

  // Background click: reset zoom
  const handleBackgroundClick = useCallback(() => {
    setFocusedNode(null);
    setContextMenu(null);
    if (graphRef.current) {
      graphRef.current.zoomToFit(400, 40);
    }
  }, []);

  // Custom node rendering -- fast path for zoomed out, detailed when zoomed in
  const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isFocused = focusedNode?.id === node.id;
    const baseSize = node.type === 'person' ? 3 : 1.5;

    // At very low zoom with 50K+ nodes, draw minimal dots
    if (globalScale < 0.3 && !isFocused) {
      ctx.fillStyle = getColor(node.type);
      ctx.fillRect(node.x - baseSize * 0.5, node.y - baseSize * 0.5, baseSize, baseSize);
      return;
    }

    const r = baseSize * (isFocused ? 2 : 1);

    // Glow effect for focused node
    if (isFocused) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, r + 4, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(node.x, node.y, r + 2, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
      ctx.fill();
    }

    // Node circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
    ctx.fillStyle = getColor(node.type);
    ctx.fill();

    if (isFocused) {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Labels: only when zoomed in enough, or for focused node
    if (isFocused || (showLabels && globalScale > 1.5) || globalScale > 4) {
      const label = node.name;
      const fontSize = Math.max(10 / globalScale, 1.2);
      ctx.font = `${isFocused ? 'bold ' : ''}${fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = isFocused ? '#000' : 'rgba(0,0,0,0.6)';
      ctx.fillText(label, node.x, node.y + r + 1);
    }
  }, [focusedNode, showLabels]);

  // Distinct entity types for filter dropdown
  const entityTypes = useMemo(() => {
    const types = new Set(data.nodes.map(n => n.type));
    return Array.from(types).sort();
  }, [data]);

  return (
    <div ref={containerRef} className="w-full border border-parchment-dark rounded-lg bg-white relative overflow-hidden" style={{ height: dimensions.height }}>
      {/* Controls bar */}
      <div className="absolute top-2 left-2 right-2 z-10 flex flex-wrap gap-2 items-center">
        {/* Search */}
        <input
          type="text"
          placeholder="Search nodes..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="px-3 py-1.5 text-sm border border-parchment-dark rounded bg-white/90 backdrop-blur-sm w-40 sm:w-56 focus:outline-none focus:ring-1 focus:ring-accent"
        />

        {/* Type filter */}
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-2 py-1.5 text-sm border border-parchment-dark rounded bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="all">All types</option>
          {entityTypes.map(t => (
            <option key={t} value={t}>{t} ({data.nodes.filter(n => n.type === t).length})</option>
          ))}
        </select>

        {/* Labels toggle */}
        <button
          onClick={() => setShowLabels(!showLabels)}
          className={`px-3 py-1.5 text-sm border rounded backdrop-blur-sm transition-colors ${
            showLabels ? 'bg-accent text-white border-accent' : 'bg-white/90 border-parchment-dark text-ink-light'
          }`}
        >
          Labels
        </button>

        {/* Reset view */}
        <button
          onClick={handleBackgroundClick}
          className="px-3 py-1.5 text-sm border border-parchment-dark rounded bg-white/90 backdrop-blur-sm text-ink-light hover:bg-parchment-dark/30 transition-colors"
        >
          Reset
        </button>

        {/* Node count */}
        <span className="text-xs text-ink-light bg-white/80 px-2 py-1 rounded backdrop-blur-sm ml-auto hidden sm:inline">
          {graphData.nodes.length} nodes / {graphData.links.length} links
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
        nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
          const r = node.type === 'person' ? 6 : 4;
          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
        }}
        onNodeClick={handleNodeClick}
        onNodeRightClick={handleNodeRightClick}
        onNodeHover={setHoverNode as any}
        onBackgroundClick={handleBackgroundClick}
        linkColor={() => 'rgba(209,213,219,0.4)'}
        linkWidth={0.5}
        enableNodeDrag={true}
        cooldownTime={5000}
        warmupTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.4}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
}
