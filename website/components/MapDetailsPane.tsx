'use client';

import type { MapEvent } from '../lib/map-queries';

interface DetailsPaneProps {
  events: MapEvent[];
  selectedYear: number;
  onEventClick: (event: MapEvent) => void;
  selectedEventId: string | null;
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  birth: '#22c55e',
  death: '#ef4444',
  marriage: '#a855f7',
  migration: '#3b82f6',
  removal: '#f97316',
  residence: '#6366f1',
  employment: '#14b8a6',
  hospitalization: '#f43f5e',
  burial: '#78716c',
  baptism: '#8b5cf6',
  registration: '#64748b',
  observation: '#94a3b8',
  publication: '#06b6d4',
  census: '#84cc16',
  exemption: '#eab308',
};

function getEventColor(type: string): string {
  return EVENT_TYPE_COLORS[type] || '#94a3b8';
}

export default function MapDetailsPane({
  events,
  selectedYear,
  onEventClick,
  selectedEventId,
}: DetailsPaneProps) {
  // Group events by type
  const byType = new Map<string, MapEvent[]>();
  for (const ev of events) {
    const list = byType.get(ev.type) || [];
    list.push(ev);
    byType.set(ev.type, list);
  }

  // Sort types by count descending
  const sortedTypes = Array.from(byType.entries()).sort(
    (a, b) => b[1].length - a[1].length
  );

  return (
    <div className="w-72 bg-white/95 backdrop-blur border-l border-parchment-dark overflow-y-auto flex flex-col">
      <div className="p-3 border-b border-parchment-dark flex-shrink-0">
        <h2 className="font-serif text-lg font-bold text-ink">{selectedYear}</h2>
        <p className="text-xs text-ink-light mt-0.5">
          {events.length} event{events.length !== 1 ? 's' : ''} at{' '}
          {new Set(events.map((e) => e.locationName)).size} location
          {new Set(events.map((e) => e.locationName)).size !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sortedTypes.map(([type, evs]) => (
          <div key={type} className="border-b border-parchment-dark/50">
            <div className="px-3 py-1.5 bg-parchment/30 flex items-center gap-2 sticky top-0">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: getEventColor(type) }}
              />
              <span className="text-xs font-bold text-ink-light uppercase tracking-wider">
                {type}
              </span>
              <span className="text-xs text-ink-light ml-auto">{evs.length}</span>
            </div>
            {evs.slice(0, 50).map((ev) => (
              <button
                key={ev.eventId}
                onClick={() => onEventClick(ev)}
                className={`w-full text-left px-3 py-1.5 hover:bg-parchment-dark/20 transition-colors text-xs ${
                  selectedEventId === ev.eventId ? 'bg-accent/10' : ''
                }`}
              >
                <div className="font-medium text-ink truncate">
                  {ev.locationName}
                </div>
                <div className="text-ink-light truncate mt-0.5">
                  {ev.personNames.slice(0, 3).join(', ')}
                  {ev.personNames.length > 3 && ` +${ev.personNames.length - 3}`}
                </div>
                <div className="text-ink-light/60 truncate mt-0.5">
                  {ev.description.slice(0, 80)}
                  {ev.description.length > 80 && '...'}
                </div>
              </button>
            ))}
            {evs.length > 50 && (
              <div className="px-3 py-1 text-xs text-ink-light italic">
                +{evs.length - 50} more
              </div>
            )}
          </div>
        ))}

        {events.length === 0 && (
          <div className="p-4 text-sm text-ink-light italic text-center">
            No events recorded for {selectedYear}.
          </div>
        )}
      </div>
    </div>
  );
}
