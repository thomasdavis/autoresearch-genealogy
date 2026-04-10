'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { ScatterplotLayer, ArcLayer, TextLayer } from '@deck.gl/layers';
import type { MapDataBundle, MapEvent } from '../lib/map-queries';
import MapTimeSlider from './MapTimeSlider';
import MapDetailsPane from './MapDetailsPane';

// FNQ center
const INITIAL_CENTER: [number, number] = [145.5, -17.0];
const INITIAL_ZOOM = 6.5;

// Distinct colors for pinned entities (up to 8, then cycles)
const PIN_COLORS: [number, number, number][] = [
  [220, 38, 38],   // red
  [37, 99, 235],   // blue
  [22, 163, 74],   // green
  [168, 85, 247],  // purple
  [234, 179, 8],   // yellow
  [6, 182, 212],   // cyan
  [236, 72, 153],  // pink
  [249, 115, 22],  // orange
];

interface PersonPresence {
  personId: string;
  personName: string;
  lat: number;
  lng: number;
  locationName: string;
  eventCount: number;
}

interface LocationYearData {
  locationName: string;
  lat: number;
  lng: number;
  eventCount: number;
}

interface PinnedEntity {
  id: string;
  name: string;
  color: [number, number, number];
}

interface PinnedArc {
  personId: string;
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  fromYear: number;
  toYear: number;
  fromLocation: string;
  toLocation: string;
}

interface PinnedPresence {
  personId: string;
  personName: string;
  lat: number;
  lng: number;
  locationName: string;
  year: number;
}

export default function TemporalMapContent({ data }: { data: MapDataBundle }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const overlayRef = useRef<MapboxOverlay | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [selectedYear, setSelectedYear] = useState(() => {
    const years = Object.entries(data.eventCountsByYear)
      .sort((a, b) => b[1] - a[1]);
    return years.length > 0 ? parseInt(years[0][0]) : 1900;
  });
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [yearWindow, setYearWindow] = useState(0);

  // Pinned entities: persisted across year changes
  const [pinnedEntities, setPinnedEntities] = useState<PinnedEntity[]>([]);

  const pinnedIds = useMemo(
    () => new Set(pinnedEntities.map((p) => p.id)),
    [pinnedEntities]
  );

  const pinnedColorMap = useMemo(() => {
    const map = new Map<string, [number, number, number]>();
    for (const p of pinnedEntities) {
      map.set(p.id, p.color);
    }
    return map;
  }, [pinnedEntities]);

  const togglePin = useCallback(
    (personId: string, personName: string) => {
      setPinnedEntities((prev) => {
        if (prev.some((p) => p.id === personId)) {
          return prev.filter((p) => p.id !== personId);
        }
        const color = PIN_COLORS[prev.length % PIN_COLORS.length];
        return [...prev, { id: personId, name: personName, color }];
      });
    },
    []
  );

  const clearPinned = useCallback(() => setPinnedEntities([]), []);

  // Filter events to the active year window
  const filteredEvents = useMemo(() => {
    return data.events.filter(
      (e) => Math.abs(e.year - selectedYear) <= yearWindow
    );
  }, [data.events, selectedYear, yearWindow]);

  // Aggregate locations for the active year
  const locationData = useMemo(() => {
    const agg = new Map<string, LocationYearData>();
    for (const ev of filteredEvents) {
      const key = ev.locationName;
      const existing = agg.get(key);
      if (existing) {
        existing.eventCount++;
      } else {
        agg.set(key, {
          locationName: ev.locationName,
          lat: ev.lat,
          lng: ev.lng,
          eventCount: 1,
        });
      }
    }
    return Array.from(agg.values());
  }, [filteredEvents]);

  // Person presence for the active year
  const personPresences = useMemo(() => {
    const agg = new Map<string, PersonPresence>();
    for (const ev of filteredEvents) {
      for (let i = 0; i < ev.personIds.length; i++) {
        const key = `${ev.personIds[i]}:${ev.locationName}`;
        const existing = agg.get(key);
        if (existing) {
          existing.eventCount++;
        } else {
          agg.set(key, {
            personId: ev.personIds[i],
            personName: ev.personNames[i],
            lat: ev.lat + (hashJitter(ev.personIds[i]) * 0.008),
            lng: ev.lng + (hashJitter(ev.personIds[i] + 'x') * 0.008),
            locationName: ev.locationName,
            eventCount: 1,
          });
        }
      }
    }
    return Array.from(agg.values());
  }, [filteredEvents]);

  // Pinned entity presences: show ALL historical positions up to current year.
  // Every location a pinned entity has been recorded at, so you see the full trail.
  const pinnedPresences = useMemo(() => {
    if (pinnedIds.size === 0) return [];
    const results: PinnedPresence[] = [];
    const seen = new Set<string>();
    for (const ev of data.events) {
      if (ev.year > selectedYear) continue; // only up to current year
      for (let i = 0; i < ev.personIds.length; i++) {
        if (!pinnedIds.has(ev.personIds[i])) continue;
        const key = `${ev.personIds[i]}:${ev.locationName}`;
        if (seen.has(key)) continue;
        seen.add(key);
        results.push({
          personId: ev.personIds[i],
          personName: ev.personNames[i],
          lat: ev.lat + (hashJitter(ev.personIds[i]) * 0.008),
          lng: ev.lng + (hashJitter(ev.personIds[i] + 'x') * 0.008),
          locationName: ev.locationName,
          year: ev.year,
        });
      }
    }
    return results;
  }, [data.events, selectedYear, pinnedIds]);

  // Movement arcs for ALL pinned entities
  const pinnedArcs = useMemo(() => {
    if (pinnedIds.size === 0) return [];
    const allArcs: PinnedArc[] = [];

    for (const personId of pinnedIds) {
      const personEvents = data.events
        .filter((e) => e.personIds.includes(personId))
        .sort((a, b) => a.year - b.year);

      const seen = new Set<string>();
      const stops: { year: number; lat: number; lng: number; locationName: string }[] = [];
      for (const ev of personEvents) {
        const key = `${ev.year}:${ev.locationName}`;
        if (!seen.has(key)) {
          seen.add(key);
          stops.push({ year: ev.year, lat: ev.lat, lng: ev.lng, locationName: ev.locationName });
        }
      }

      for (let i = 1; i < stops.length; i++) {
        const prev = stops[i - 1];
        const curr = stops[i];
        if (prev.locationName !== curr.locationName) {
          allArcs.push({
            personId,
            fromLat: prev.lat,
            fromLng: prev.lng,
            toLat: curr.lat,
            toLng: curr.lng,
            fromYear: prev.year,
            toYear: curr.year,
            fromLocation: prev.locationName,
            toLocation: curr.locationName,
          });
        }
      }
    }
    return allArcs;
  }, [pinnedIds, data.events]);

  // Initialize MapLibre map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        name: 'Parchment',
        sources: {
          'carto-light': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
              'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
          },
        },
        layers: [
          {
            id: 'carto-light-layer',
            type: 'raster',
            source: 'carto-light',
            minzoom: 0,
            maxzoom: 20,
          },
        ],
      },
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      maxZoom: 14,
      minZoom: 3,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-left');

    const overlay = new MapboxOverlay({
      interleaved: false,
      layers: [],
    });
    map.addControl(overlay as unknown as maplibregl.IControl);

    mapRef.current = map;
    overlayRef.current = overlay;

    return () => {
      map.remove();
      mapRef.current = null;
      overlayRef.current = null;
    };
  }, []);

  // Update deck.gl layers when data changes
  useEffect(() => {
    if (!overlayRef.current) return;

    const layers = [
      // Layer 1: Location circles
      new ScatterplotLayer({
        id: 'locations',
        data: locationData,
        getPosition: (d: LocationYearData) => [d.lng, d.lat],
        getRadius: (d: LocationYearData) => Math.max(600, Math.sqrt(d.eventCount) * 1200),
        getFillColor: [139, 69, 19, 100],
        getLineColor: [139, 69, 19, 180],
        stroked: true,
        lineWidthMinPixels: 1,
        radiusUnits: 'meters',
        radiusMinPixels: 4,
        radiusMaxPixels: 40,
        pickable: true,
        onClick: (_info: any) => {},
        onHover: (info: any) => {
          if (tooltipRef.current) {
            if (info.object) {
              const d = info.object as LocationYearData;
              tooltipRef.current.style.display = 'block';
              tooltipRef.current.style.left = `${info.x + 12}px`;
              tooltipRef.current.style.top = `${info.y + 12}px`;
              tooltipRef.current.innerHTML = `<strong>${d.locationName}</strong><br/>${d.eventCount} event${d.eventCount !== 1 ? 's' : ''} in ${selectedYear}${yearWindow > 0 ? ` (${String.fromCharCode(177)}${yearWindow})` : ''}`;
            } else {
              tooltipRef.current.style.display = 'none';
            }
          }
        },
      }),

      // Layer 2: Person presence dots (non-pinned, dimmed if there are pins)
      new ScatterplotLayer({
        id: 'persons',
        data: personPresences.filter((d) => !pinnedIds.has(d.personId)),
        getPosition: (d: PersonPresence) => [d.lng, d.lat],
        getRadius: 400,
        getFillColor: pinnedIds.size > 0
          ? [239, 68, 68, 60]    // dim when pins are active
          : [239, 68, 68, 180],
        radiusUnits: 'meters',
        radiusMinPixels: 3,
        radiusMaxPixels: 12,
        pickable: true,
        onClick: (info: any) => {
          if (info.object) {
            const d = info.object as PersonPresence;
            togglePin(d.personId, d.personName);
          }
        },
        onHover: (info: any) => {
          if (tooltipRef.current) {
            if (info.object) {
              const d = info.object as PersonPresence;
              const isPinned = pinnedIds.has(d.personId);
              tooltipRef.current.style.display = 'block';
              tooltipRef.current.style.left = `${info.x + 12}px`;
              tooltipRef.current.style.top = `${info.y + 12}px`;
              tooltipRef.current.innerHTML = `<strong>${d.personName}</strong><br/>${d.locationName}<br/>${d.eventCount} event${d.eventCount !== 1 ? 's' : ''}<br/><em style="opacity:0.6">${isPinned ? 'click to unpin' : 'click to pin'}</em>`;
            } else {
              tooltipRef.current.style.display = 'none';
            }
          }
        },
      }),

      // Layer 3: Pinned entity presence dots (colored, larger).
      // Shows all historical positions. Current-year positions are large and bright;
      // past positions are smaller and softer, forming a breadcrumb trail.
      new ScatterplotLayer({
        id: 'pinned-persons',
        data: pinnedPresences,
        getPosition: (d: PinnedPresence) => [d.lng, d.lat],
        getRadius: (d: PinnedPresence) => {
          const isCurrent = Math.abs(d.year - selectedYear) <= yearWindow;
          return isCurrent ? 800 : 500;
        },
        getFillColor: (d: PinnedPresence) => {
          const c = pinnedColorMap.get(d.personId) || [220, 38, 38];
          const isCurrent = Math.abs(d.year - selectedYear) <= yearWindow;
          return [c[0], c[1], c[2], isCurrent ? 230 : 100];
        },
        getLineColor: (d: PinnedPresence) => {
          const isCurrent = Math.abs(d.year - selectedYear) <= yearWindow;
          return isCurrent ? [255, 255, 255, 200] : [255, 255, 255, 80];
        },
        stroked: true,
        lineWidthMinPixels: 1,
        radiusUnits: 'meters',
        radiusMinPixels: 4,
        radiusMaxPixels: 18,
        pickable: true,
        onClick: (info: any) => {
          if (info.object) {
            const d = info.object as PinnedPresence;
            togglePin(d.personId, d.personName);
          }
        },
        onHover: (info: any) => {
          if (tooltipRef.current) {
            if (info.object) {
              const d = info.object as PinnedPresence;
              tooltipRef.current.style.display = 'block';
              tooltipRef.current.style.left = `${info.x + 12}px`;
              tooltipRef.current.style.top = `${info.y + 12}px`;
              tooltipRef.current.innerHTML = `<strong>${d.personName}</strong><br/>${d.locationName} (${d.year})<br/><em style="opacity:0.6">click to unpin</em>`;
            } else {
              tooltipRef.current.style.display = 'none';
            }
          }
        },
      }),

      // Layer 4: Location labels
      new TextLayer({
        id: 'location-labels',
        data: locationData.filter((d) => d.eventCount >= 3),
        getPosition: (d: LocationYearData) => [d.lng, d.lat],
        getText: (d: LocationYearData) => d.locationName,
        getSize: 12,
        getColor: [44, 36, 22, 200],
        getAngle: 0,
        getTextAnchor: 'start' as const,
        getAlignmentBaseline: 'center' as const,
        getPixelOffset: [12, 0],
        fontFamily: 'Georgia, serif',
        fontWeight: 'bold',
        outlineWidth: 2,
        outlineColor: [255, 255, 255, 220],
        sizeUnits: 'pixels' as const,
        billboard: false,
      }),

      // Layer 5: Movement arcs for pinned entities.
      // Shows all arcs where the movement has started by the current year.
      // Arcs accumulate as trail: advance the year and the web of lines grows.
      // The most recent movement is drawn brightest; older ones stay visible but softer.
      ...(pinnedArcs.length > 0
        ? [
            new ArcLayer({
              id: 'pinned-arcs',
              data: pinnedArcs.filter((d) => d.fromYear <= selectedYear),
              getSourcePosition: (d: PinnedArc) => [d.fromLng, d.fromLat],
              getTargetPosition: (d: PinnedArc) => [d.toLng, d.toLat],
              getSourceColor: (d: PinnedArc) => {
                const c = pinnedColorMap.get(d.personId) || [220, 38, 38];
                // Most recent arc is brightest, older ones fade but stay visible
                const isCurrent = d.fromYear <= selectedYear && d.toYear >= selectedYear;
                const isFuture = d.toYear > selectedYear;
                if (isFuture) return [c[0], c[1], c[2], 40]; // hasn't completed yet
                if (isCurrent) return [c[0], c[1], c[2], 240]; // actively happening
                return [c[0], c[1], c[2], 140]; // past, stays visible
              },
              getTargetColor: (d: PinnedArc) => {
                const c = pinnedColorMap.get(d.personId) || [220, 38, 38];
                const isCurrent = d.fromYear <= selectedYear && d.toYear >= selectedYear;
                const isFuture = d.toYear > selectedYear;
                if (isFuture) return [c[0], c[1], c[2], 30];
                if (isCurrent) return [c[0], c[1], c[2], 220];
                return [c[0], c[1], c[2], 120];
              },
              getWidth: (d: PinnedArc) => {
                const isCurrent = d.fromYear <= selectedYear && d.toYear >= selectedYear;
                return isCurrent ? 3 : 2;
              },
              pickable: true,
              onHover: (info: any) => {
                if (tooltipRef.current) {
                  if (info.object) {
                    const d = info.object as PinnedArc;
                    const name = pinnedEntities.find((p) => p.id === d.personId)?.name || '';
                    tooltipRef.current.style.display = 'block';
                    tooltipRef.current.style.left = `${info.x + 12}px`;
                    tooltipRef.current.style.top = `${info.y + 12}px`;
                    tooltipRef.current.innerHTML = `<strong>${name}</strong><br/>${d.fromLocation} &rarr; ${d.toLocation}<br/>${d.fromYear} &rarr; ${d.toYear}`;
                  } else {
                    tooltipRef.current.style.display = 'none';
                  }
                }
              },
            }),
          ]
        : []),
    ];

    overlayRef.current.setProps({ layers });
  }, [locationData, personPresences, pinnedPresences, pinnedArcs, pinnedIds, pinnedColorMap, pinnedEntities, selectedYear, yearWindow]);

  // Fly to event when clicked in the details pane
  const handleEventClick = useCallback(
    (event: MapEvent) => {
      setSelectedEventId(event.eventId);
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [event.lng, event.lat],
          zoom: Math.max(mapRef.current.getZoom(), 9),
          duration: 1200,
        });
      }
    },
    []
  );

  return (
    <div className="w-full h-full flex rounded-lg overflow-hidden border border-parchment-dark bg-[#f0ebe0]">
      {/* Map area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 relative min-h-0">
          <div className="absolute inset-0">
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>

          {/* Tooltip */}
          <div
            ref={tooltipRef}
            className="absolute pointer-events-none z-10 bg-white/95 text-ink text-xs px-2 py-1 rounded shadow-md border border-parchment-dark"
            style={{ display: 'none' }}
          />

          {/* Pinned entities banner */}
          {pinnedEntities.length > 0 && (
            <div className="absolute top-2 right-2 z-10 bg-white/95 backdrop-blur rounded shadow-md border border-parchment-dark max-w-xs">
              <div className="px-3 py-1.5 border-b border-parchment-dark/50 flex items-center justify-between">
                <span className="text-xs font-bold text-ink-light uppercase tracking-wider">
                  Tracking {pinnedEntities.length}
                </span>
                <button
                  onClick={clearPinned}
                  className="text-xs text-ink-light hover:text-ink"
                >
                  Clear all
                </button>
              </div>
              <div className="px-2 py-1.5 flex flex-wrap gap-1.5">
                {pinnedEntities.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => togglePin(p.id, p.name)}
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium hover:opacity-70 transition-opacity"
                    style={{
                      backgroundColor: `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, 0.15)`,
                      color: `rgb(${p.color[0]}, ${p.color[1]}, ${p.color[2]})`,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: `rgb(${p.color[0]}, ${p.color[1]}, ${p.color[2]})` }}
                    />
                    {p.name}
                    <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Year window control */}
          <div className="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur rounded px-2 py-1 shadow text-xs flex items-center gap-2">
            <span className="text-ink-light">Window:</span>
            {[0, 2, 5, 10].map((w) => (
              <button
                key={w}
                onClick={() => setYearWindow(w)}
                className={`px-1.5 py-0.5 rounded ${
                  yearWindow === w
                    ? 'bg-accent text-white'
                    : 'hover:bg-parchment-dark/30 text-ink-light'
                }`}
              >
                {w === 0 ? 'Exact' : `${String.fromCharCode(177)}${w}`}
              </button>
            ))}
          </div>
        </div>

        {/* Time slider */}
        <MapTimeSlider
          yearRange={data.yearRange}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          eventCountsByYear={data.eventCountsByYear}
        />
      </div>

      {/* Details pane */}
      <MapDetailsPane
        events={filteredEvents}
        selectedYear={selectedYear}
        onEventClick={handleEventClick}
        selectedEventId={selectedEventId}
      />
    </div>
  );
}

/**
 * Deterministic jitter for a string key, in range [-0.5, 0.5].
 * Used to offset overlapping person markers at the same location.
 */
function hashJitter(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) | 0;
  }
  return ((hash & 0xffff) / 0xffff) - 0.5;
}
