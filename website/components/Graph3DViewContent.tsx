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
  __threeObj?: any;
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

const TYPE_COLORS: Record<string, number> = {
  person: 0xef4444,
  location: 0x3b82f6,
  document: 0x10b981,
  clan: 0xf59e0b,
  organization: 0x8b5cf6,
  surname: 0xec4899,
  ship: 0x06b6d4,
  occupation: 0x84cc16,
  medical: 0xf97316,
};
const TYPE_COLORS_CSS: Record<string, string> = {
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
const DEFAULT_COLOR = 0x6b7280;
const HIGHLIGHT_COLOR = 0xffffff;
const DIM_OPACITY = 0.08;

function getColorHex(type: string): number {
  return TYPE_COLORS[type] || DEFAULT_COLOR;
}

// Sprite textures cached per color
const spriteTextureCache = new Map<string, THREE.Texture>();
function makeSpriteTexture(color: number, glow: boolean = false): THREE.Texture {
  const key = `${color}-${glow}`;
  if (spriteTextureCache.has(key)) return spriteTextureCache.get(key)!;
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  const r = (color >> 16) & 0xff;
  const g = (color >> 8) & 0xff;
  const b = color & 0xff;
  if (glow) {
    gradient.addColorStop(0, `rgba(${r},${g},${b},1)`);
    gradient.addColorStop(0.2, `rgba(${r},${g},${b},1)`);
    gradient.addColorStop(0.5, `rgba(${r},${g},${b},0.6)`);
    gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
  } else {
    gradient.addColorStop(0, `rgba(${r},${g},${b},1)`);
    gradient.addColorStop(0.4, `rgba(${r},${g},${b},0.8)`);
    gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  spriteTextureCache.set(key, texture);
  return texture;
}

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

  // Close context menu
  useEffect(() => {
    const h = () => setContextMenu(null);
    window.addEventListener('click', h);
    return () => window.removeEventListener('click', h);
  }, []);

  // Compute highlight set from search query (doesn't filter -- highlights in place)
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

  // Build adjacency list once for fast neighbor lookups
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

  // When a node is focused, compute n-degree distances via BFS (max 5 degrees)
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

  // Filter by type only (search is highlight, not filter)
  const graphData = useMemo(() => {
    let candidateNodes = data.nodes;
    const nodeSet = new Set<string>();

    if (filterType !== 'all') {
      candidateNodes = candidateNodes.filter(n => n.type === filterType);
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
  }, [data, filterType]);

  // Configure 3D forces
  useEffect(() => {
    if (!graphRef.current) return;
    const fg = graphRef.current;
    fg.d3Force('charge')?.strength(-20).distanceMax(600);
    fg.d3Force('link')?.distance(40);
    fg.d3Force('center')?.strength(0.8);
  }, []);

  // Node rendering: highlight search matches, show n-degree focus falloff
  const nodeThreeObject = useCallback((node: any) => {
    const isSearchMatch = highlightIds?.has(node.id);
    const isSearchDimmed = highlightIds !== null && !isSearchMatch;
    const isFocused = focusedNode?.id === node.id;
    const focusDist = focusDistances?.get(node.id) ?? null;
    const isFocusConnected = focusDist !== null;
    const isFocusDimmed = focusDistances !== null && !isFocusConnected;

    // Determine opacity based on focus distance (exponential falloff)
    let opacity = 1;
    if (isFocusDimmed) {
      opacity = 0.03;
    } else if (focusDist !== null && focusDist > 0) {
      opacity = Math.max(0.1, 1 / (focusDist * 0.8));
    }
    if (isSearchDimmed) opacity = DIM_OPACITY;

    // Color and glow
    const color = isFocused ? HIGHLIGHT_COLOR : getColorHex(node.type);
    const shouldGlow = isFocused || isSearchMatch || (focusDist !== null && focusDist <= 1);
    const texture = makeSpriteTexture(color, shouldGlow);

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity,
    });
    const sprite = new THREE.Sprite(material);

    // Size: focused > 1st degree > 2nd degree > ... > unconnected
    const baseSize = node.type === 'person' ? 8 : 4;
    let size = baseSize;
    if (isFocused) {
      size = baseSize * 3;
    } else if (isSearchMatch) {
      size = baseSize * 2.5;
    } else if (focusDist === 1) {
      size = baseSize * 2;
    } else if (focusDist === 2) {
      size = baseSize * 1.5;
    } else if (isFocusDimmed) {
      size = baseSize * 0.5;
    }
    sprite.scale.set(size, size, 1);

    // Labels for focused, 1st-degree neighbors, or search matches
    const showLabel = isFocused || isSearchMatch || (focusDist !== null && focusDist <= 1);
    if (showLabel && node.name) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const fontSize = 48;
      ctx.font = `bold ${fontSize}px sans-serif`;
      const textWidth = ctx.measureText(node.name).width;
      canvas.width = textWidth + 20;
      canvas.height = fontSize + 16;
      ctx.font = `bold ${fontSize}px sans-serif`;
      const labelAlpha = isFocused ? 1 : focusDist === 1 ? 0.8 : 0.9;
      ctx.fillStyle = `rgba(255,255,255,${labelAlpha})`;
      ctx.textBaseline = 'middle';
      ctx.fillText(node.name, 10, canvas.height / 2);

      const labelTexture = new THREE.CanvasTexture(canvas);
      labelTexture.needsUpdate = true;
      const labelMaterial = new THREE.SpriteMaterial({ map: labelTexture, transparent: true, depthWrite: false, opacity });
      const labelSprite = new THREE.Sprite(labelMaterial);
      const labelScale = size * 0.35;
      labelSprite.scale.set(labelScale * (canvas.width / canvas.height), labelScale, 1);
      labelSprite.position.set(0, -size * 0.7, 0);

      const group = new THREE.Group();
      group.add(sprite);
      group.add(labelSprite);
      return group;
    }

    return sprite;
  }, [highlightIds, focusedNode, focusDistances]);

  // Click: fly camera to node
  const handleNodeClick = useCallback((node: any) => {
    setFocusedNode(node);
    setContextMenu(null);
    if (graphRef.current) {
      const distance = 150;
      const distRatio = 1 + distance / Math.hypot(node.x || 0, node.y || 0, node.z || 0);
      graphRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        { x: node.x, y: node.y, z: node.z },
        300
      );
    }
  }, []);

  // Right-click
  const handleNodeRightClick = useCallback((node: any, event: MouseEvent) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, node });
  }, []);

  // Background click
  const handleBackgroundClick = useCallback(() => {
    setFocusedNode(null);
    setContextMenu(null);
    if (graphRef.current) graphRef.current.zoomToFit(200, 40);
  }, []);

  // Node label on hover
  const nodeLabel = useCallback((node: any) => {
    return `<div style="background:rgba(0,0,0,0.85);padding:4px 8px;border-radius:4px;font-size:12px;border:1px solid rgba(255,255,255,0.2);max-width:220px;pointer-events:none;color:white">
      <div style="font-weight:bold">${node.name}</div>
      <div style="font-size:10px;color:rgba(255,255,255,0.6);text-transform:uppercase">${node.type}</div>
    </div>`;
  }, []);

  // Link rendering: highlight by search, focus distance, or default dim
  const linkColor = useCallback((link: any) => {
    const src = typeof link.source === 'string' ? link.source : link.source?.id;
    const tgt = typeof link.target === 'string' ? link.target : link.target?.id;

    // Search highlighting
    if (highlightIds) {
      if (highlightIds.has(src) || highlightIds.has(tgt)) return 'rgba(255,255,100,0.5)';
      return 'rgba(255,255,255,0.02)';
    }

    // Focus distance highlighting
    if (focusDistances) {
      const srcDist = focusDistances.get(src) ?? 999;
      const tgtDist = focusDistances.get(tgt) ?? 999;
      const minDist = Math.min(srcDist, tgtDist);
      if (minDist === 0) return 'rgba(255,255,255,0.9)';   // direct from focused
      if (minDist === 1) return 'rgba(255,200,100,0.6)';   // 1st degree
      if (minDist === 2) return 'rgba(255,150,80,0.3)';    // 2nd degree
      if (minDist === 3) return 'rgba(200,120,60,0.15)';   // 3rd degree
      if (minDist <= 5) return 'rgba(150,100,50,0.08)';    // 4th-5th
      return 'rgba(255,255,255,0.01)';                     // beyond
    }

    return 'rgba(255,255,255,0.08)';
  }, [highlightIds, focusDistances]);

  const linkWidth = useCallback((link: any) => {
    const src = typeof link.source === 'string' ? link.source : link.source?.id;
    const tgt = typeof link.target === 'string' ? link.target : link.target?.id;

    if (highlightIds) {
      if (highlightIds.has(src) || highlightIds.has(tgt)) return 1.2;
      return 0.05;
    }

    if (focusDistances) {
      const srcDist = focusDistances.get(src) ?? 999;
      const tgtDist = focusDistances.get(tgt) ?? 999;
      const minDist = Math.min(srcDist, tgtDist);
      if (minDist === 0) return 2.5;
      if (minDist === 1) return 1.5;
      if (minDist === 2) return 0.8;
      if (minDist === 3) return 0.4;
      return 0.05;
    }

    return 0.2;
  }, [highlightIds, focusDistances]);

  // Entity types for dropdown
  const entityTypes = useMemo(() => {
    const counts = new Map<string, number>();
    for (const n of data.nodes) {
      counts.set(n.type, (counts.get(n.type) || 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [data]);

  // Keyboard: Escape to unfocus
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
        // Auto-rotate toggle
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
          className="px-2 py-1.5 text-sm border border-white/20 rounded bg-black/60 backdrop-blur-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
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
        <span className="text-xs text-white/40 bg-black/30 px-2 py-1 rounded backdrop-blur-sm ml-auto hidden sm:inline" title="Mouse: orbit/zoom. Space: auto-rotate. Click: fly to node. Right-click: menu. Esc: reset.">
          {graphData.nodes.length.toLocaleString()} nodes (3D WebGL) | Space: rotate | Esc: reset
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

      {/* Hover tooltip */}
      {hoverNode && (
        <div className="absolute bottom-2 right-2 z-10 bg-black/80 p-2 rounded border border-white/10 text-sm backdrop-blur-sm max-w-[200px] text-white">
          <div className="font-bold truncate">{hoverNode.name}</div>
          <div className="text-[10px] text-white/50 uppercase">{hoverNode.type}</div>
        </div>
      )}

      {/* Focused node info */}
      {focusedNode && !contextMenu && (
        <div className="absolute bottom-14 sm:bottom-2 left-1/2 -translate-x-1/2 z-10 bg-black/85 px-4 py-2 rounded-lg border border-white/20 shadow-lg backdrop-blur-sm text-center max-w-xs text-white">
          <div className="font-bold text-sm truncate">{focusedNode.name}</div>
          <div className="text-[10px] text-white/50 uppercase mb-1">{focusedNode.type}</div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => router.push(`/entities/${focusedNode.id}`)}
              className="text-xs px-3 py-1 bg-accent text-white rounded hover:bg-accent-light transition-colors"
            >
              View Details
            </button>
            <button
              onClick={handleBackgroundClick}
              className="text-xs px-3 py-1 border border-white/30 rounded text-white/60 hover:bg-white/10 transition-colors"
            >
              Unfocus
            </button>
          </div>
        </div>
      )}

      {/* Right-click context menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-[#1a1a2e] rounded-lg border border-white/20 shadow-xl overflow-hidden min-w-[180px] text-white"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={e => e.stopPropagation()}
        >
          <div className="px-3 py-2 border-b border-white/10 bg-white/5">
            <div className="font-bold text-sm truncate">{contextMenu.node.name}</div>
            <div className="text-[10px] text-white/50 uppercase">{contextMenu.node.type}</div>
          </div>
          <button
            onClick={() => { router.push(`/entities/${contextMenu.node.id}`); setContextMenu(null); }}
            className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Full Details
          </button>
          <button
            onClick={() => { handleNodeClick(contextMenu.node); setContextMenu(null); }}
            className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Fly To Node
          </button>
          <button
            onClick={() => { navigator.clipboard.writeText(contextMenu.node.id); setContextMenu(null); }}
            className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors flex items-center gap-2 border-t border-white/10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
            </svg>
            Copy ID
          </button>
        </div>
      )}

      <ForceGraph3D
        ref={graphRef}
        graphData={graphData}
        nodeThreeObject={nodeThreeObject}
        nodeThreeObjectExtend={false}
        nodeLabel={nodeLabel}
        onNodeClick={handleNodeClick}
        onNodeRightClick={handleNodeRightClick}
        onNodeHover={setHoverNode as any}
        onBackgroundClick={handleBackgroundClick}
        linkColor={linkColor}
        linkWidth={linkWidth}
        linkOpacity={0.3}
        enableNodeDrag={true}
        enableNavigationControls={true}
        showNavInfo={false}
        backgroundColor="#0a0a18"
        cooldownTime={3000}
        warmupTicks={300}
        d3AlphaDecay={0.05}
        d3VelocityDecay={0.4}
        numDimensions={3}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
}
