import { getMapData } from '../../../lib/map-queries';
import TemporalMapRenderer from '../../../components/TemporalMapRenderer';
import Link from 'next/link';

export default async function TemporalMapPage() {
  const mapData = getMapData();

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] py-2 px-2 sm:px-4">
      <header className="mb-2 sm:mb-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-accent mb-1 text-xs sm:text-sm">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/map" className="hover:underline">Map</Link>
          <span>/</span>
          <span className="text-ink-light uppercase tracking-wider">Temporal Map</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-ink">
              Temporal Map
            </h1>
            <p className="text-ink-light text-xs sm:text-sm max-w-2xl leading-relaxed hidden sm:block">
              {mapData.events.length.toLocaleString()} events across{' '}
              {mapData.locations.length} locations,{' '}
              {mapData.yearRange[0]}&ndash;{mapData.yearRange[1]}.
              Drag the timeline to explore. Click a person dot to see their movement.
            </p>
          </div>
          <div className="flex gap-3 sm:gap-6 text-center flex-shrink-0">
            <div>
              <div className="text-lg sm:text-2xl font-bold text-accent">
                {mapData.events.length.toLocaleString()}
              </div>
              <div className="text-[9px] sm:text-[10px] text-ink-light uppercase tracking-widest font-bold">
                Events
              </div>
            </div>
            <div>
              <div className="text-lg sm:text-2xl font-bold text-accent">
                {mapData.locations.length}
              </div>
              <div className="text-[9px] sm:text-[10px] text-ink-light uppercase tracking-widest font-bold">
                Locations
              </div>
            </div>
            <div>
              <div className="text-lg sm:text-2xl font-bold text-accent">
                {mapData.yearRange[1] - mapData.yearRange[0]}
              </div>
              <div className="text-[9px] sm:text-[10px] text-ink-light uppercase tracking-widest font-bold">
                Year Span
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0">
        <TemporalMapRenderer data={mapData} />
      </div>
    </div>
  );
}
