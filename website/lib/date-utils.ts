/**
 * Parse a year from the heterogeneous date formats in research.db.
 *
 * Observed formats: "13 August 1909", "1.5.1916", ". 7.1935", "'73",
 * "c. 1869", "~YYYY", "1890", "20/08/1939", "1921-10-05", "the seventies"
 */
export function parseYearFromDate(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const s = raw.trim();
  if (!s) return null;

  // 'YY shorthand (e.g. '73 -> 1973)
  const mShort = s.match(/^'(\d{2})$/);
  if (mShort) {
    const yy = parseInt(mShort[1]);
    return yy > 30 ? 1900 + yy : 2000 + yy;
  }

  // Decade words
  if (/seventies/i.test(s)) return 1975;
  if (/sixties/i.test(s)) return 1965;
  if (/eighties/i.test(s)) return 1985;
  if (/fifties/i.test(s)) return 1955;
  if (/forties/i.test(s)) return 1945;
  if (/nineties/i.test(s)) return 1995;
  if (/thirties/i.test(s)) return 1935;
  if (/twenties/i.test(s)) return 1925;

  // "1880s" style
  const mDecade = s.match(/\b(1[89]\d)0s\b/);
  if (mDecade) return parseInt(mDecade[1] + '5');

  // 4-digit year anywhere in the string (1800-2026)
  const m4 = s.match(/\b(1[89]\d{2}|20[0-2]\d)\b/);
  if (m4) return parseInt(m4[1]);

  return null;
}
