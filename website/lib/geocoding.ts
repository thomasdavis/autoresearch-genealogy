export interface GeocodedLocation {
  lat: number;
  lng: number;
  precision: 'exact' | 'approximate' | 'region';
}

/**
 * Static coordinate table for top locations in research.db.
 * Covers ~90% of all dated events. Keyed by canonical_name from the entities table.
 */
const COORDS: Record<string, GeocodedLocation> = {
  // === Primary FNQ locations (from existing SVG map + research) ===
  'Mossman':              { lat: -16.4597, lng: 145.3731, precision: 'exact' },
  'Port Douglas':         { lat: -16.4836, lng: 145.4647, precision: 'exact' },
  'Cairns':               { lat: -16.9186, lng: 145.7781, precision: 'exact' },
  'Yarrabah':             { lat: -16.9267, lng: 145.8717, precision: 'exact' },
  'Cooktown':             { lat: -15.4724, lng: 145.2481, precision: 'exact' },
  'Mt Carbine':           { lat: -16.5331, lng: 145.1317, precision: 'exact' },
  'Mount Carbine':        { lat: -16.5331, lng: 145.1317, precision: 'exact' },
  'Croydon':              { lat: -18.2035, lng: 142.2414, precision: 'exact' },
  'Bloomfield':           { lat: -15.9333, lng: 145.3333, precision: 'exact' },
  'Rossville':            { lat: -15.7000, lng: 145.2500, precision: 'exact' },
  'Mona Mona':            { lat: -16.8167, lng: 145.6167, precision: 'exact' },
  'Palm Island':          { lat: -18.7333, lng: 146.5833, precision: 'exact' },
  'Ingham':               { lat: -18.6514, lng: 146.1619, precision: 'exact' },
  'Mareeba':              { lat: -17.0014, lng: 145.4222, precision: 'exact' },
  'Mount Molloy':         { lat: -16.6833, lng: 145.3333, precision: 'exact' },

  // === Major Queensland locations ===
  'Barambah':             { lat: -26.2833, lng: 151.9500, precision: 'exact' },
  'Cherbourg':            { lat: -26.2833, lng: 151.9500, precision: 'exact' },
  'Taroom':               { lat: -25.6333, lng: 149.7833, precision: 'exact' },
  'Peel Island':          { lat: -27.4933, lng: 153.3517, precision: 'exact' },
  'Peel Island Lazaret':  { lat: -27.4933, lng: 153.3517, precision: 'exact' },
  'Brisbane':             { lat: -27.4698, lng: 153.0251, precision: 'exact' },
  'Townsville':           { lat: -19.2590, lng: 146.8169, precision: 'exact' },
  'Rockhampton':          { lat: -23.3791, lng: 150.5100, precision: 'exact' },
  'Hull River':           { lat: -17.9500, lng: 146.1167, precision: 'exact' },
  'Daintree':             { lat: -16.2500, lng: 145.3167, precision: 'exact' },
  'Upper Daintree':       { lat: -16.3000, lng: 145.3500, precision: 'approximate' },
  'Normanton':            { lat: -17.6714, lng: 141.0764, precision: 'exact' },
  'Woorabinda':           { lat: -24.1306, lng: 149.4486, precision: 'exact' },
  'Cloncurry':            { lat: -20.7069, lng: 140.5031, precision: 'exact' },
  'Edmonton':             { lat: -17.0167, lng: 145.7333, precision: 'exact' },
  'Mackay':               { lat: -21.1411, lng: 149.1861, precision: 'exact' },
  'Charters Towers':      { lat: -20.0667, lng: 146.2667, precision: 'exact' },
  'Burketown':            { lat: -17.7478, lng: 139.5464, precision: 'exact' },
  'Mount Garnet':         { lat: -17.6833, lng: 145.1167, precision: 'exact' },
  'Thursday Island':      { lat: -10.5828, lng: 142.2189, precision: 'exact' },
  'Doomadgee':            { lat: -17.9403, lng: 138.8225, precision: 'exact' },
  'Innisfail':            { lat: -17.5236, lng: 146.0292, precision: 'exact' },
  'Babinda':              { lat: -17.3450, lng: 145.9250, precision: 'exact' },
  'Ayr':                  { lat: -19.5742, lng: 147.4058, precision: 'exact' },
  'Mitchell':             { lat: -26.4889, lng: 147.9769, precision: 'exact' },
  'Maryborough':          { lat: -25.5406, lng: 152.7019, precision: 'exact' },
  'Coen':                 { lat: -13.9439, lng: 143.1972, precision: 'exact' },
  'Atherton':             { lat: -17.2686, lng: 145.4744, precision: 'exact' },
  'Childers':             { lat: -25.2389, lng: 152.2781, precision: 'exact' },
  'Nebo':                 { lat: -21.6833, lng: 148.6833, precision: 'exact' },
  'Gayndah':              { lat: -25.6269, lng: 151.6108, precision: 'exact' },
  'Augathella':           { lat: -25.8000, lng: 146.5833, precision: 'exact' },
  'Toowoomba':            { lat: -27.5600, lng: 151.9500, precision: 'exact' },
  'Charleville':          { lat: -26.4069, lng: 146.2414, precision: 'exact' },
  'Georgetown':           { lat: -18.2917, lng: 143.5500, precision: 'exact' },
  'Chillagoe':            { lat: -17.1500, lng: 144.5167, precision: 'exact' },
  'Laura':                { lat: -15.5581, lng: 144.4461, precision: 'exact' },
  'Winton':               { lat: -22.3917, lng: 143.0333, precision: 'exact' },
  'Springsure':           { lat: -24.1167, lng: 148.0833, precision: 'exact' },
  'Hughenden':            { lat: -20.8444, lng: 144.2000, precision: 'exact' },
  'Cedar Bay':            { lat: -15.8000, lng: 145.3500, precision: 'exact' },

  // === Specific places within known locations ===
  'Mossman Gorge':        { lat: -16.4700, lng: 145.3400, precision: 'exact' },
  'Mossman Cemetery':     { lat: -16.4550, lng: 145.3700, precision: 'approximate' },
  'Mowbray':              { lat: -16.5200, lng: 145.4100, precision: 'approximate' },
  'Mowbray Vale':         { lat: -16.5200, lng: 145.4100, precision: 'approximate' },
  'Douglas Shire':        { lat: -16.4800, lng: 145.4200, precision: 'region' },
  'Port Stewart':         { lat: -14.2833, lng: 143.8167, precision: 'exact' },
  'Cooktown Hospital':    { lat: -15.4700, lng: 145.2500, precision: 'approximate' },
  'Port Douglas Hospital':{ lat: -16.4850, lng: 145.4650, precision: 'approximate' },
  'Cairns Hospital':      { lat: -16.9200, lng: 145.7750, precision: 'approximate' },
  'Cairns district':      { lat: -16.9186, lng: 145.7781, precision: 'region' },
  'Charters Towers Hospital': { lat: -20.0700, lng: 146.2700, precision: 'approximate' },
  'Rockhampton Hospital': { lat: -23.3800, lng: 150.5100, precision: 'approximate' },
  'Townsville Hospital':  { lat: -19.2600, lng: 146.8100, precision: 'approximate' },
  'Hughenden Hospital':   { lat: -20.8500, lng: 144.2000, precision: 'approximate' },
  'Yarrabah Mission':     { lat: -16.9267, lng: 145.8717, precision: 'exact' },
  'Yarrabah Mission Station': { lat: -16.9267, lng: 145.8717, precision: 'exact' },
  'Mona Mona Mission':    { lat: -16.8167, lng: 145.6167, precision: 'exact' },
  'Saltwater Creek, Port Douglas': { lat: -16.5000, lng: 145.4500, precision: 'approximate' },
  'Bridge Creek Camp':    { lat: -16.4500, lng: 145.3600, precision: 'approximate' },

  // === Torres Strait Islands ===
  'Badu Island':          { lat: -10.1200, lng: 142.1500, precision: 'exact' },
  'Yam Island':           { lat: -9.9000,  lng: 142.7700, precision: 'exact' },
  'Boigu Island':         { lat: -9.2300,  lng: 142.2200, precision: 'exact' },

  // === Broad regions (centroid) ===
  'Queensland':           { lat: -22.5751, lng: 144.0848, precision: 'region' },
  'North Queensland':     { lat: -19.0000, lng: 146.0000, precision: 'region' },
  'Australia':            { lat: -25.2744, lng: 133.7751, precision: 'region' },
  'Scotland':             { lat: 56.4907,  lng: -4.2026,  precision: 'region' },
};

/**
 * Resolve coordinates for a location name.
 * Tries exact match first, then substring match against known places.
 */
export function getCoords(locationName: string): GeocodedLocation | null {
  // Exact match
  if (COORDS[locationName]) return COORDS[locationName];

  // Substring fallback: longest known name that appears in the input
  let bestMatch: { name: string; coords: GeocodedLocation } | null = null;
  for (const [known, coords] of Object.entries(COORDS)) {
    if (coords.precision === 'region') continue; // skip broad regions for substring
    if (locationName.includes(known)) {
      if (!bestMatch || known.length > bestMatch.name.length) {
        bestMatch = { name: known, coords };
      }
    }
  }
  if (bestMatch) {
    return { ...bestMatch.coords, precision: 'approximate' };
  }

  return null;
}
