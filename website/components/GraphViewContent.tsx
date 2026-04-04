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

function getColorHex(type: string): number {
  return TYPE_COLORS[type] || DEFAULT_COLOR;
}

// Pre-build sprite textures per type for GPU instancing
const spriteTextureCache = new Map<number, THREE.Texture>();
function getSpriteTexture(color: number): THREE.Texture {
  if (spriteTextureCache.has(color)) return spriteTextureCache.get(color)!;
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  // Radial gradient for a glowing dot
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  const r = (color >> 16) & 0xff;
  const g = (color >> 8) & 0xff;
  const b = color & 0xff;
  gradient.addColorStop(0, `rgba(${r},${g},${b},1)`);
  gradient.addColorStop(0.4, `rgba(${r},${g},${b},0.8)`);
  gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  spriteTextureCache.set(color, texture);
  return texture;
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

  // Close context menu
  useEffect(() => {
    function handleClick() { setContextMenu(null); }
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const keysDown = new Set<string>();
    const PAN_SPEED = 60;
    const ZOOM_SPEED = 120;
    const ROTATE_SPEED = 0.08;
    let animFrame: number;

    function tick() {
      const fg = graphRef.current;
      if (!fg || keysDown.size === 0) { animFrame = 0; return; }

      const cam = fg.camera();
      const pos = fg.cameraPosition();
      if (!cam || !pos) { animFrame = requestAnimationFrame(tick); return; }

      let dx = 0, dy = 0, dz = 0;

      // WASD / Arrow keys: pan
      if (keysDown.has('arrowleft') || keysDown.has('a')) dx -= PAN_SPEED;
      if (keysDown.has('arrowright') || keysDown.has('d')) dx += PAN_SPEED;
      if (keysDown.has('arrowup') || keysDown.has('w')) dy += PAN_SPEED;
      if (keysDown.has('arrowdown') || keysDown.has('s')) dy -= PAN_SPEED;

      // +/- or E/Q: zoom
      if (keysDown.has('equal') || keysDown.has('+') || keysDown.has('e')) dz -= ZOOM_SPEED;
      if (keysDown.has('minus') || keysDown.has('-') || keysDown.has('q')) dz += ZOOM_SPEED;

      // R/F: rotate (tilt camera around Z axis for a 3D perspective peek)
      if (keysDown.has('r')) {
        const controls = fg.controls();
        if (controls) {
          controls.autoRotate = false;
          const target = controls.target;
          const angle = ROTATE_SPEED;
          const cx = pos.x - target.x;
          const cy = pos.y - target.y;
          const newX = cx * Math.cos(angle) - cy * Math.sin(angle) + target.x;
          const newY = cx * Math.sin(angle) + cy * Math.cos(angle) + target.y;
          fg.cameraPosition({ x: newX, y: newY, z: pos.z }, target, 0);
          animFrame = requestAnimationFrame(tick);
          return;
        }
      }
      if (keysDown.has('f')) {
        const controls = fg.controls();
        if (controls) {
          controls.autoRotate = false;
          const target = controls.target;
          const angle = -ROTATE_SPEED;
          const cx = pos.x - target.x;
          const cy = pos.y - target.y;
          const newX = cx * Math.cos(angle) - cy * Math.sin(angle) + target.x;
          const newY = cx * Math.sin(angle) + cy * Math.cos(angle) + target.y;
          fg.cameraPosition({ x: newX, y: newY, z: pos.z }, target, 0);
          animFrame = requestAnimationFrame(tick);
          return;
        }
      }

      // Home: reset view
      if (keysDown.has('home')) {
        fg.zoomToFit(200, 40);
        keysDown.delete('home');
        animFrame = requestAnimationFrame(tick);
        return;
      }

      if (dx !== 0 || dy !== 0 || dz !== 0) {
        // Scale pan speed with zoom distance
        const zoomFactor = Math.max(pos.z / 1000, 0.1);
        fg.cameraPosition(
          { x: pos.x + dx * zoomFactor, y: pos.y + dy * zoomFactor, z: Math.max(50, pos.z + dz * zoomFactor) },
          undefined,
          0
        );
      }

      animFrame = requestAnimationFrame(tick);
    }

    function onKeyDown(e: KeyboardEvent) {
      // Don't capture if typing in an input
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'SELECT') return;

      const key = e.key.toLowerCase();
      const handled = ['arrowleft','arrowright','arrowup','arrowdown','w','a','s','d','e','q','r','f','equal','minus','+','-','home'];
      if (handled.includes(key)) {
        e.preventDefault();
        keysDown.add(key);
        if (!animFrame) animFrame = requestAnimationFrame(tick);
      }

      // Space: toggle labels
      if (key === ' ') {
        e.preventDefault();
        setShowLabels(prev => !prev);
      }
      // Escape: unfocus / close menu
      if (key === 'escape') {
        setFocusedNode(null);
        setContextMenu(null);
        graphRef.current?.zoomToFit(400, 40);
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      keysDown.delete(e.key.toLowerCase());
      if (keysDown.size === 0 && animFrame) {
        cancelAnimationFrame(animFrame);
        animFrame = 0;
      }
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, []);

  // Configure forces and camera on mount
  useEffect(() => {
    if (!graphRef.current) return;
    const fg = graphRef.current;
    // Stronger charge to cluster nodes tightly
    fg.d3Force('charge')?.strength(-15).distanceMax(500);
    fg.d3Force('link')?.distance(30);
    fg.d3Force('center')?.strength(1);
    // Top-down camera
    setTimeout(() => {
      if (fg.camera()) {
        fg.cameraPosition({ x: 0, y: 0, z: 2000 }, { x: 0, y: 0, z: 0 }, 0);
      }
    }, 200);
  }, []);

  // Filter data
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

  // Node: GPU sprite
  const nodeThreeObject = useCallback((node: any) => {
    const color = getColorHex(node.type);
    const texture = getSpriteTexture(color);
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const sprite = new THREE.Sprite(material);
    const size = node.type === 'person' ? 8 : 4;
    sprite.scale.set(size, size, 1);
    return sprite;
  }, []);

  // Click: animate camera to node
  const handleNodeClick = useCallback((node: any) => {
    setFocusedNode(node);
    setContextMenu(null);
    if (graphRef.current) {
      const distance = 200;
      graphRef.current.cameraPosition(
        { x: node.x, y: node.y, z: distance },
        { x: node.x, y: node.y, z: 0 },
        300
      );
    }
  }, []);

  // Right-click: context menu
  const handleNodeRightClick = useCallback((node: any, event: MouseEvent) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, node });
  }, []);

  // Background click: reset
  const handleBackgroundClick = useCallback(() => {
    setFocusedNode(null);
    setContextMenu(null);
    if (graphRef.current) {
      graphRef.current.zoomToFit(200, 40);
    }
  }, []);

  // Node label (shown on hover via ThreeJS CSS2D or title)
  const nodeLabel = useCallback((node: any) => {
    return `<div style="background:rgba(255,255,255,0.95);padding:4px 8px;border-radius:4px;font-size:12px;border:1px solid #d1c8b8;max-width:200px;pointer-events:none">
      <div style="font-weight:bold">${node.name}</div>
      <div style="font-size:10px;color:#888;text-transform:uppercase">${node.type}</div>
    </div>`;
  }, []);

  // Entity types for dropdown
  const entityTypes = useMemo(() => {
    const counts = new Map<string, number>();
    for (const n of data.nodes) {
      counts.set(n.type, (counts.get(n.type) || 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [data]);

  return (
    <div ref={containerRef} className="w-full border border-parchment-dark rounded-lg bg-[#1a1a2e] relative overflow-hidden" style={{ height: dimensions.height }}>
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
          <option value="all">All types ({data.nodes.length.toLocaleString()})</option>
          {entityTypes.map(([t, count]) => (
            <option key={t} value={t}>{t} ({count.toLocaleString()})</option>
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
        <span className="text-xs text-white/60 bg-black/30 px-2 py-1 rounded backdrop-blur-sm ml-auto hidden sm:inline" title="WASD/Arrows: pan, E/Q: zoom, R/F: rotate, Space: labels, Home: reset, Esc: unfocus">
          {graphData.nodes.length.toLocaleString()} nodes / {graphData.links.length.toLocaleString()} links (WebGL) | ? keys
        </span>
      </div>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 z-10 bg-black/50 p-2 rounded border border-white/10 text-[10px] backdrop-blur-sm hidden sm:block">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-white/80">
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
        <div className="absolute bottom-2 right-2 z-10 bg-black/70 p-2 rounded border border-white/10 text-sm backdrop-blur-sm max-w-[200px] text-white">
          <div className="font-bold truncate">{hoverNode.name}</div>
          <div className="text-[10px] text-white/60 uppercase">{hoverNode.type}</div>
        </div>
      )}

      {/* Focused node info */}
      {focusedNode && !contextMenu && (
        <div className="absolute bottom-14 sm:bottom-2 left-1/2 -translate-x-1/2 z-10 bg-black/80 px-4 py-2 rounded-lg border border-white/20 shadow-lg backdrop-blur-sm text-center max-w-xs text-white">
          <div className="font-bold text-sm truncate">{focusedNode.name}</div>
          <div className="text-[10px] text-white/60 uppercase mb-1">{focusedNode.type}</div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => router.push(`/entities/${focusedNode.id}`)}
              className="text-xs px-3 py-1 bg-accent text-white rounded hover:bg-accent-light transition-colors"
            >
              View Details
            </button>
            <button
              onClick={handleBackgroundClick}
              className="text-xs px-3 py-1 border border-white/30 rounded text-white/70 hover:bg-white/10 transition-colors"
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
            onClick={() => { navigator.clipboard.writeText(contextMenu.node.id); setContextMenu(null); }}
            className="w-full text-left px-3 py-2 text-sm hover:bg-parchment/50 transition-colors flex items-center gap-2 border-t border-parchment-dark/30"
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
        nodeLabel={nodeLabel}
        onNodeClick={handleNodeClick}
        onNodeRightClick={handleNodeRightClick}
        onNodeHover={setHoverNode as any}
        onBackgroundClick={handleBackgroundClick}
        linkColor={() => 'rgba(255,255,255,0.15)'}
        linkWidth={0.2}
        linkOpacity={0.3}
        enableNodeDrag={true}
        enableNavigationControls={true}
        showNavInfo={false}
        backgroundColor="#0f0f1a"
        cooldownTime={3000}
        warmupTicks={300}
        d3AlphaDecay={0.05}
        d3VelocityDecay={0.4}
        numDimensions={2}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
}
