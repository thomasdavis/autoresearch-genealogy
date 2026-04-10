'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface TimeSliderProps {
  yearRange: [number, number];
  selectedYear: number;
  onYearChange: (year: number) => void;
  eventCountsByYear: Record<number, number>;
}

export default function MapTimeSlider({
  yearRange,
  selectedYear,
  onYearChange,
  eventCountsByYear,
}: TimeSliderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(false);
  const playRef = useRef(false);

  const [minYear, maxYear] = yearRange;
  const totalYears = maxYear - minYear + 1;

  // Find max count for histogram scaling
  const maxCount = Object.values(eventCountsByYear).reduce(
    (a, b) => Math.max(a, b),
    1
  );

  // Draw histogram backdrop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const barWidth = Math.max(1, w / totalYears);

    ctx.clearRect(0, 0, w, h);

    for (let yr = minYear; yr <= maxYear; yr++) {
      const count = eventCountsByYear[yr] || 0;
      const barHeight = (count / maxCount) * (h - 4);
      const x = ((yr - minYear) / totalYears) * w;

      const isSelected = yr === selectedYear;
      ctx.fillStyle = isSelected
        ? 'rgba(139, 69, 19, 0.8)'
        : 'rgba(139, 69, 19, 0.25)';
      ctx.fillRect(x, h - barHeight, barWidth, barHeight);
    }
  }, [selectedYear, eventCountsByYear, minYear, maxYear, totalYears, maxCount]);

  // Play auto-advance
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      onYearChange(selectedYear >= maxYear ? minYear : selectedYear + 1);
    }, 800);
    return () => clearInterval(interval);
  }, [playing, selectedYear, maxYear, minYear, onYearChange]);

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onYearChange(parseInt(e.target.value));
    },
    [onYearChange]
  );

  const stepYear = useCallback(
    (delta: number) => {
      const next = Math.max(minYear, Math.min(maxYear, selectedYear + delta));
      onYearChange(next);
    },
    [selectedYear, minYear, maxYear, onYearChange]
  );

  return (
    <div className="bg-white/95 backdrop-blur border-t border-parchment-dark px-4 py-2 flex items-center gap-3">
      {/* Play/pause */}
      <button
        onClick={() => setPlaying((p) => !p)}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-parchment-dark/30 text-ink-light"
        title={playing ? 'Pause' : 'Play'}
      >
        {playing ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>

      {/* Step back */}
      <button
        onClick={() => stepYear(-1)}
        className="w-6 h-6 flex items-center justify-center rounded hover:bg-parchment-dark/30 text-ink-light"
        title="Previous year"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <polyline points="15,18 9,12 15,6" />
        </svg>
      </button>

      {/* Year display */}
      <span className="font-mono text-lg font-bold text-ink min-w-[4ch] text-center tabular-nums">
        {selectedYear}
      </span>

      {/* Step forward */}
      <button
        onClick={() => stepYear(1)}
        className="w-6 h-6 flex items-center justify-center rounded hover:bg-parchment-dark/30 text-ink-light"
        title="Next year"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <polyline points="9,6 15,12 9,18" />
        </svg>
      </button>

      {/* Slider with histogram */}
      <div className="flex-1 relative h-10">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={selectedYear}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 1 }}
        />
        {/* Visual thumb */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-accent pointer-events-none"
          style={{
            left: `${((selectedYear - minYear) / totalYears) * 100}%`,
          }}
        />
      </div>

      {/* Year range labels */}
      <span className="text-xs text-ink-light tabular-nums">{minYear}</span>
      <span className="text-xs text-ink-light">-</span>
      <span className="text-xs text-ink-light tabular-nums">{maxYear}</span>

      {/* Event count for current year */}
      <span className="text-xs text-ink-light ml-2 whitespace-nowrap">
        {eventCountsByYear[selectedYear] || 0} events
      </span>
    </div>
  );
}
