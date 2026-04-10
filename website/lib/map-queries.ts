import { getDb } from './db';
import { getCoords, type GeocodedLocation } from './geocoding';
import { parseYearFromDate } from './date-utils';

// === Types ===

export interface MapEvent {
  eventId: string;
  type: string;
  year: number;
  locationName: string;
  lat: number;
  lng: number;
  locationPrecision: GeocodedLocation['precision'];
  description: string;
  personIds: string[];
  personNames: string[];
}

export interface LocationSummary {
  locationName: string;
  lat: number;
  lng: number;
  precision: GeocodedLocation['precision'];
  eventCount: number;
  minYear: number;
  maxYear: number;
}

export interface MapDataBundle {
  events: MapEvent[];
  yearRange: [number, number];
  locations: LocationSummary[];
  eventCountsByYear: Record<number, number>;
}

/**
 * Fetch all geocodable, date-parseable events with their participants.
 * Called once in the server component; entire result sent to client as JSON.
 */
export function getMapData(): MapDataBundle {
  let db;
  try {
    db = getDb();
  } catch {
    return { events: [], locations: [], people: [], yearRange: [1800, 2025] };
  }

  const rows = db.prepare(`
    SELECT
      e.id        AS event_id,
      e.type      AS event_type,
      e.date_value,
      e.description,
      l.canonical_name AS location_name,
      p.entity_id AS person_id,
      pe.canonical_name AS person_name
    FROM events e
    JOIN entities l ON e.location_id = l.id
    JOIN participants p ON e.id = p.event_id
    JOIN entities pe ON p.entity_id = pe.id
    WHERE e.location_id IS NOT NULL
      AND e.date_value IS NOT NULL
      AND pe.type = 'person'
    ORDER BY e.id
  `).all() as Array<{
    event_id: string;
    event_type: string;
    date_value: string;
    description: string;
    location_name: string;
    person_id: string;
    person_name: string;
  }>;

  // Group rows by event_id (multiple participants per event)
  const eventMap = new Map<string, {
    eventId: string;
    type: string;
    dateValue: string;
    description: string;
    locationName: string;
    personIds: string[];
    personNames: string[];
  }>();

  for (const row of rows) {
    let entry = eventMap.get(row.event_id);
    if (!entry) {
      entry = {
        eventId: row.event_id,
        type: row.event_type,
        dateValue: row.date_value,
        description: row.description,
        locationName: row.location_name,
        personIds: [],
        personNames: [],
      };
      eventMap.set(row.event_id, entry);
    }
    if (!entry.personIds.includes(row.person_id)) {
      entry.personIds.push(row.person_id);
      entry.personNames.push(row.person_name);
    }
  }

  // Geocode and parse years
  const events: MapEvent[] = [];
  const eventCountsByYear: Record<number, number> = {};
  let minYear = Infinity;
  let maxYear = -Infinity;

  // Location aggregation
  const locAgg = new Map<string, {
    lat: number;
    lng: number;
    precision: GeocodedLocation['precision'];
    count: number;
    minYear: number;
    maxYear: number;
  }>();

  for (const entry of eventMap.values()) {
    const coords = getCoords(entry.locationName);
    if (!coords) continue;

    const year = parseYearFromDate(entry.dateValue);
    if (!year) continue;

    events.push({
      eventId: entry.eventId,
      type: entry.type,
      year,
      locationName: entry.locationName,
      lat: coords.lat,
      lng: coords.lng,
      locationPrecision: coords.precision,
      description: entry.description,
      personIds: entry.personIds,
      personNames: entry.personNames,
    });

    eventCountsByYear[year] = (eventCountsByYear[year] || 0) + 1;
    if (year < minYear) minYear = year;
    if (year > maxYear) maxYear = year;

    // Aggregate by location name
    const loc = locAgg.get(entry.locationName);
    if (loc) {
      loc.count++;
      if (year < loc.minYear) loc.minYear = year;
      if (year > loc.maxYear) loc.maxYear = year;
    } else {
      locAgg.set(entry.locationName, {
        lat: coords.lat,
        lng: coords.lng,
        precision: coords.precision,
        count: 1,
        minYear: year,
        maxYear: year,
      });
    }
  }

  const locations: LocationSummary[] = Array.from(locAgg.entries()).map(
    ([name, agg]) => ({
      locationName: name,
      lat: agg.lat,
      lng: agg.lng,
      precision: agg.precision,
      eventCount: agg.count,
      minYear: agg.minYear,
      maxYear: agg.maxYear,
    })
  );

  return {
    events,
    yearRange: [minYear === Infinity ? 1860 : minYear, maxYear === -Infinity ? 2020 : maxYear],
    locations,
    eventCountsByYear,
  };
}
