'use client';

import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';

interface Node {
  id: string;
  name: string;
  type: string;
  val?: number;
  x?: number;
  y?: number;
  z?: number;
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
const TYPE_COLORS_CSS = TYPE_COLORS;
const DEFAULT_COLOR = '#6b7280';

export default function Graph3DView({ data }: { data: GraphData }) {
  const router = useRouter();
  const graphRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverNode, setHoverNode] = useState<Node | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [focusedNode, setFocusedNode] = useState<Node | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [matchCount, setMatchCount] = useState(0);

  // Responsive dimensions
  useEffect(() => {
    let raf: number;
    function update() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: Math.max(400, window.innerHeight - 200) });
      }
    }
    function onResize() { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }
    update();
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const h = () => setContextMenu(null);
    window.addEventListener('click', h);
    return () => window.removeEventListener('click', h);
  }, []);

  // Search: highlight set (doesn't filter)
  const highlightIds = useMemo(() => {
    if (searchQuery.length < 2) { setMatchCount(0); return null; }
    const q = searchQuery.toLowerCase();
    const ids = new Set<string>();
    for (const n of data.nodes) {
      if (n.name.toLowerCase().includes(q)) ids.add(n.id);
    }
    setMatchCount(ids.size);
    return ids.size > 0 ? ids : null;
  }, [searchQuery, data.nodes]);

  // Adjacency list for BFS
  const adjacency = useMemo(() => {
    const adj = new Map<string, Set<string>>();
    for (const link of data.links) {
      const src = typeof link.source === 'string' ? link.source : link.source.id;
      const tgt = typeof link.target === 'string' ? link.target : link.target.id;
      if (!adj.has(src)) adj.set(src, new Set());
      if (!adj.has(tgt)) adj.set(tgt, new Set());
      adj.get(src)!.add(tgt);
      adj.get(tgt)!.add(src);
    }
    return adj;
  }, [data.links]);

  // BFS from focused node: compute n-degree distances
  const focusDistances = useMemo(() => {
    if (!focusedNode) return null;
    const distances = new Map<string, number>();
    const MAX_DEGREE = 5;
    const queue: [string, number][] = [[focusedNode.id, 0]];
    distances.set(focusedNode.id, 0);
    while (queue.length > 0) {
      const [nodeId, depth] = queue.shift()!;
      if (depth >= MAX_DEGREE) continue;
      const neighbors = adjacency.get(nodeId);
      if (!neighbors) continue;
      for (const nid of neighbors) {
        if (!distances.has(nid)) {
          distances.set(nid, depth + 1);
          queue.push([nid, depth + 1]);
        }
      }
    }
    return distances;
  }, [focusedNode, adjacency]);

  // Filter by type only
  const graphData = useMemo(() => {
    let candidateNodes = data.nodes;
    const nodeSet = new Set<string>();
    if (filterType !== 'all') {
      candidateNodes = candidateNodes.filter(n => n.type === filterType);
    }
    const nodes = candidateNodes.map(n => {
      nodeSet.add(n.id);
      return { ...n, val: n.type === 'person' ? 3 : 1.5 };
    });
    const links = data.links.filter(link => {
      const src = typeof link.source === 'string' ? link.source : link.source.id;
      const tgt = typeof link.target === 'string' ? link.target : link.target.id;
      return nodeSet.has(src) && nodeSet.has(tgt);
    });
    return { nodes, links };
  }, [data, filterType]);

  // Configure 3D forces
  useEffect(() => {
    if (!graphRef.current) return;
    const fg = graphRef.current;
    fg.d3Force('charge')?.strength(-20).distanceMax(400);
    fg.d3Force('link')?.distance(30);
    fg.d3Force('center')?.strength(0.8);
  }, []);

  // Node COLOR: fast path using built-in instanced rendering (no custom Three objects)
  const nodeColor = useCallback((node: any) => {
    const isSearchMatch = highlightIds?.has(node.id);
    const isSearchDimmed = highlightIds !== null && !isSearchMatch;
    const isFocused = focusedNode?.id === node.id;
    const focusDist = focusDistances?.get(node.id) ?? null;
    const isFocusDimmed = focusDistances !== null && focusDist === null;

    if (isFocused) return '#ffffff';
    if (isSearchMatch) return '#ffff66';
    if (isSearchDimmed) return 'rgba(100,100,100,0.1)';
    if (isFocusDimmed) return 'rgba(60,60,60,0.08)';
    if (focusDist === 1) return '#ffcc66';
    if (focusDist === 2) return TYPE_COLORS[node.type] || DEFAULT_COLOR;
    if (focusDist !== null && focusDist > 2) return 'rgba(100,90,80,0.2)';
    return TYPE_COLORS[node.type] || DEFAULT_COLOR;
  }, [highlightIds, focusedNode, focusDistances]);

  // Node SIZE: vary by highlight state
  const nodeVal = useCallback((node: any) => {
    const base = node.type === 'person' ? 3 : 1.5;
    const isFocused = focusedNode?.id === node.id;
    const isSearchMatch = highlightIds?.has(node.id);
    const focusDist = focusDistances?.get(node.id) ?? null;
    const isFocusDimmed = focusDistances !== null && focusDist === null;
    const isSearchDimmed = highlightIds !== null && !isSearchMatch;

    if (isFocused) return base * 10;
    if (isSearchMatch) return base * 6;
    if (focusDist === 1) return base * 4;
    if (focusDist === 2) return base * 2;
    if (isFocusDimmed || isSearchDimmed) return base * 0.3;
    return base;
  }, [highlightIds, focusedNode, focusDistances]);

  // Click: fly camera to node
  const handleNodeClick = useCallback((node: any) => {
    setFocusedNode(prev => prev?.id === node.id ? null : node);
    setContextMenu(null);
    if (graphRef.current) {
      const distance = 120;
      const distRatio = 1 + distance / Math.max(1, Math.hypot(node.x || 0, node.y || 0, node.z || 0));
      graphRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        { x: node.x, y: node.y, z: node.z },
        300
      );
    }
  }, []);

  const handleNodeRightClick = useCallback((node: any, event: MouseEvent) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, node });
  }, []);

  const handleBackgroundClick = useCallback(() => {
    setFocusedNode(null);
    setContextMenu(null);
    if (graphRef.current) graphRef.current.zoomToFit(200, 40);
  }, []);

  const nodeLabel = useCallback((node: any) => {
    return `<div style="background:rgba(0,0,0,0.85);padding:4px 8px;border-radius:4px;font-size:12px;border:1px solid rgba(255,255,255,0.2);max-width:220px;pointer-events:none;color:white">
      <div style="font-weight:bold">${node.name}</div>
      <div style="font-size:10px;color:rgba(255,255,255,0.6);text-transform:uppercase">${node.type}</div>
    </div>`;
  }, []);

  // Link rendering
  const linkColor = useCallback((link: any) => {
    const src = typeof link.source === 'string' ? link.source : link.source?.id;
    const tgt = typeof link.target === 'string' ? link.target : link.target?.id;
    if (highlightIds) {
      if (highlightIds.has(src) || highlightIds.has(tgt)) return 'rgba(255,255,100,0.5)';
      return 'rgba(255,255,255,0.015)';
    }
    if (focusDistances) {
      const srcDist = focusDistances.get(src) ?? 999;
      const tgtDist = focusDistances.get(tgt) ?? 999;
      const minDist = Math.min(srcDist, tgtDist);
      if (minDist === 0) return 'rgba(255,255,255,0.9)';
      if (minDist === 1) return 'rgba(255,200,100,0.6)';
      if (minDist === 2) return 'rgba(255,150,80,0.25)';
      if (minDist <= 4) return 'rgba(150,100,50,0.08)';
      return 'rgba(255,255,255,0.008)';
    }
    return 'rgba(255,255,255,0.06)';
  }, [highlightIds, focusDistances]);

  const linkWidth = useCallback((link: any) => {
    const src = typeof link.source === 'string' ? link.source : link.source?.id;
    const tgt = typeof link.target === 'string' ? link.target : link.target?.id;
    if (highlightIds) {
      return (highlightIds.has(src) || highlightIds.has(tgt)) ? 1.2 : 0.05;
    }
    if (focusDistances) {
      const srcDist = focusDistances.get(src) ?? 999;
      const tgtDist = focusDistances.get(tgt) ?? 999;
      const minDist = Math.min(srcDist, tgtDist);
      if (minDist === 0) return 2.5;
      if (minDist === 1) return 1.5;
      if (minDist === 2) return 0.6;
      return 0.03;
    }
    return 0.15;
  }, [highlightIds, focusDistances]);

  const entityTypes = useMemo(() => {
    const counts = new Map<string, number>();
    for (const n of data.nodes) counts.set(n.type, (counts.get(n.type) || 0) + 1);
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [data]);

  // Keyboard
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'SELECT') return;
      if (e.key === 'Escape') {
        setFocusedNode(null);
        setContextMenu(null);
        graphRef.current?.zoomToFit(200, 40);
      }
      if (e.key === ' ') {
        e.preventDefault();
        const controls = graphRef.current?.controls();
        if (controls) controls.autoRotate = !controls.autoRotate;
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div ref={containerRef} className="w-full border border-parchment-dark rounded-lg bg-[#0a0a18] relative overflow-hidden" style={{ height: dimensions.height }}>
      {/* Controls */}
      <div className="absolute top-2 left-2 right-2 z-10 flex flex-wrap gap-2 items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Highlight nodes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 text-sm border border-white/20 rounded bg-black/60 backdrop-blur-sm w-44 sm:w-64 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 text-white placeholder-white/40"
          />
          {searchQuery.length >= 2 && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-yellow-400 font-bold">
              {matchCount} found
            </span>
          )}
        </div>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-2 py-1.5 text-sm border border-white/20 rounded bg-black/60 backdrop-blur-sm text-white focus:outline-none"
        >
          <option value="all">All types ({data.nodes.length.toLocaleString()})</option>
          {entityTypes.map(([t, count]) => (
            <option key={t} value={t}>{t} ({count.toLocaleString()})</option>
          ))}
        </select>
        <button
          onClick={handleBackgroundClick}
          className="px-3 py-1.5 text-sm border border-white/20 rounded bg-black/60 backdrop-blur-sm text-white/70 hover:bg-white/10 transition-colors"
        >
          Reset
        </button>
        <span className="text-xs text-white/40 bg-black/30 px-2 py-1 rounded backdrop-blur-sm ml-auto hidden sm:inline">
          {graphData.nodes.length.toLocaleString()} nodes (3D) | Space: rotate | Click: focus | Esc: reset
        </span>
      </div>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 z-10 bg-black/60 p-2 rounded border border-white/10 text-[10px] backdrop-blur-sm hidden sm:block">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-white/70">
          {Object.entries(TYPE_COLORS_CSS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
              <span className="capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {hoverNode && (
        <div className="absolute bottom-2 right-2 z-10 bg-black/80 p-2 rounded border border-white/10 text-sm backdrop-blur-sm max-w-[200px] text-white">
          <div className="font-bold truncate">{hoverNode.name}</div>
          <div className="text-[10px] text-white/50 uppercase">{hoverNode.type}</div>
        </div>
      )}

      {focusedNode && !contextMenu && (
        <div className="absolute bottom-14 sm:bottom-2 left-1/2 -translate-x-1/2 z-10 bg-black/85 px-4 py-2 rounded-lg border border-white/20 shadow-lg backdrop-blur-sm text-center max-w-xs text-white">
          <div className="font-bold text-sm truncate">{focusedNode.name}</div>
          <div className="text-[10px] text-white/50 uppercase mb-1">{focusedNode.type}</div>
          <div className="flex gap-2 justify-center">
            <button onClick={() => router.push(`/entities/${focusedNode.id}`)} className="text-xs px-3 py-1 bg-accent text-white rounded hover:bg-accent-light transition-colors">View Details</button>
            <button onClick={handleBackgroundClick} className="text-xs px-3 py-1 border border-white/30 rounded text-white/60 hover:bg-white/10 transition-colors">Unfocus</button>
          </div>
        </div>
      )}

      {contextMenu && (
        <div className="fixed z-50 bg-[#1a1a2e] rounded-lg border border-white/20 shadow-xl overflow-hidden min-w-[180px] text-white" style={{ left: contextMenu.x, top: contextMenu.y }} onClick={e => e.stopPropagation()}>
          <div className="px-3 py-2 border-b border-white/10 bg-white/5">
            <div className="font-bold text-sm truncate">{contextMenu.node.name}</div>
            <div className="text-[10px] text-white/50 uppercase">{contextMenu.node.type}</div>
          </div>
          <button onClick={() => { router.push(`/entities/${contextMenu.node.id}`); setContextMenu(null); }} className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors">Full Details</button>
          <button onClick={() => { handleNodeClick(contextMenu.node); setContextMenu(null); }} className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors">Fly To Node</button>
          <button onClick={() => { navigator.clipboard.writeText(contextMenu.node.id); setContextMenu(null); }} className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors border-t border-white/10">Copy ID</button>
        </div>
      )}

      <ForceGraph3D
        ref={graphRef}
        graphData={graphData}
        nodeColor={nodeColor}
        nodeVal={nodeVal}
        nodeRelSize={5}
        nodeLabel={nodeLabel}
        nodeOpacity={0.9}
        onNodeClick={handleNodeClick}
        onNodeRightClick={handleNodeRightClick}
        onNodeHover={setHoverNode as any}
        onBackgroundClick={handleBackgroundClick}
        linkColor={linkColor}
        linkWidth={linkWidth}
        linkOpacity={0.4}
        enableNodeDrag={true}
        enableNavigationControls={true}
        showNavInfo={false}
        backgroundColor="#0a0a18"
        cooldownTime={3000}
        warmupTicks={200}
        d3AlphaDecay={0.05}
        d3VelocityDecay={0.4}
        numDimensions={3}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
}
