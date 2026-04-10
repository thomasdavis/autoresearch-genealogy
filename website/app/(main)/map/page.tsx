const locations = [
  {
    name: "Mossman",
    lat: -16.4597,
    lng: 145.3731,
    description: "Primary Davis family location. George Edgar Davis lived and died here (d. 10 Mar 1977).",
    importance: "primary",
  },
  {
    name: "Port Douglas",
    lat: -16.4836,
    lng: 145.4647,
    description: "Nearby coastal town. Multiple Rosie references in 1915 war census. Port Douglas Hospital death of a Rosie in 1916.",
    importance: "primary",
  },
  {
    name: "Cairns",
    lat: -16.9186,
    lng: 145.7781,
    description: "Regional hub. Lisa Jane Davis born here (1964). Janice Davis born here (1947). Multiple family members connected.",
    importance: "primary",
  },
  {
    name: "Yarrabah",
    lat: -16.9267,
    lng: 145.8717,
    description: "Aboriginal mission. Edgar and Caroline married here (9 Oct 1909). Edgar Leonard baptised here (1910). Julia Nunn married Victor Leftwich here (1912).",
    importance: "primary",
  },
  {
    name: "Cooktown",
    lat: -15.4724,
    lng: 145.2481,
    description: "Oral history places Edgar's mother from around Cooktown during the Palmer River gold-strike era.",
    importance: "secondary",
  },
  {
    name: "Mount Carbine",
    lat: -16.5331,
    lng: 145.1317,
    description: "Caroline Rose Brown born here (10/6/1887). Rosie Hippie recorded in Mt Carbine population (1948).",
    importance: "secondary",
  },
  {
    name: "Croydon",
    lat: -18.2035,
    lng: 142.2414,
    description: "Goldfield area researched for George Davis connections.",
    importance: "tertiary",
  },
  {
    name: "Bloomfield",
    lat: -15.9333,
    lng: 145.3333,
    description: "Oral history corridor. Davis Hill, Nunnville, and Hislop connections in this area.",
    importance: "secondary",
  },
  {
    name: "Rossville",
    lat: -15.7,
    lng: 145.25,
    description: "Julia (age 9) and Nellie (age 4.5) recorded as orphans sent from here to Yarrabah in 1905.",
    importance: "secondary",
  },
  {
    name: "Mona Mona",
    lat: -16.8167,
    lng: 145.6167,
    description: "Mission station. Separate Davis sibling group (Pansy, Hazel, Edgar, Kathleen) removed here from Edmonton in 1921.",
    importance: "secondary",
  },
  {
    name: "Palm Island",
    lat: -18.7333,
    lng: 146.5833,
    description: "Settlement. Brackenridge family (Arthur and Fred's households) documented here in 1939 medical census.",
    importance: "secondary",
  },
  {
    name: "Ingham",
    lat: -18.6514,
    lng: 146.1619,
    description: "Arthur Braikenridge and Florence settled here. Boxer George Bracken (Braikenridge) grew up here.",
    importance: "tertiary",
  },
  {
    name: "Mareeba",
    lat: -17.0014,
    lng: 145.4222,
    description: "Charles Joseph Davis died here (2006). Rosie Hippie's 1942 application says she was born in Mareeba.",
    importance: "secondary",
  },
  {
    name: "Mount Molloy",
    lat: -16.6833,
    lng: 145.3333,
    description: "Police letterbooks from here record Rosie Hippie and Paddy Julian. Key administrative records.",
    importance: "tertiary",
  },
];

export default function MapPage() {
  // SVG-based simple map of Far North Queensland
  const minLat = -19.5;
  const maxLat = -15.0;
  const minLng = 141.5;
  const maxLng = 147.0;

  const mapWidth = 800;
  const mapHeight = 700;

  function toX(lng: number) {
    return ((lng - minLng) / (maxLng - minLng)) * mapWidth;
  }
  function toY(lat: number) {
    return ((maxLat - lat) / (maxLat - minLat)) * mapHeight;
  }

  const importanceColors = {
    primary: "#8b4513",
    secondary: "#a0522d",
    tertiary: "#c4a57b",
  };

  const importanceSizes = {
    primary: 8,
    secondary: 6,
    tertiary: 5,
  };

  // Simple coastline approximation for FNQ
  const coastline = [
    { lat: -15.0, lng: 145.3 },
    { lat: -15.5, lng: 145.3 },
    { lat: -16.0, lng: 145.45 },
    { lat: -16.4, lng: 145.4 },
    { lat: -16.5, lng: 145.47 },
    { lat: -16.9, lng: 145.75 },
    { lat: -17.0, lng: 145.78 },
    { lat: -17.5, lng: 146.0 },
    { lat: -18.0, lng: 146.2 },
    { lat: -18.5, lng: 146.4 },
    { lat: -18.7, lng: 146.5 },
    { lat: -19.0, lng: 146.7 },
    { lat: -19.5, lng: 147.0 },
  ];

  const coastPath = coastline
    .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(p.lng)} ${toY(p.lat)}`)
    .join(" ");

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-ink mb-2">
          Research Map
        </h1>
        <p className="text-ink-light">
          Key locations in the Davis family research across Far North
          Queensland.
        </p>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: importanceColors.primary }}
            />
            <span className="text-xs text-ink-light">Primary location</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: importanceColors.secondary }}
            />
            <span className="text-xs text-ink-light">Secondary</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: importanceColors.tertiary }}
            />
            <span className="text-xs text-ink-light">Tertiary</span>
          </div>
        </div>
      </header>

      <div className="bg-white rounded-lg shadow-sm border border-parchment-dark p-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="w-full max-w-3xl mx-auto"
          style={{ minHeight: "500px" }}
        >
          {/* Background */}
          <rect width={mapWidth} height={mapHeight} fill="#e8e0d0" rx="8" />

          {/* Ocean hint */}
          <path
            d={`${coastPath} L ${mapWidth} ${mapHeight} L ${mapWidth} 0 Z`}
            fill="#c5d5e4"
            opacity="0.4"
          />

          {/* Coastline */}
          <path d={coastPath} fill="none" stroke="#8b7355" strokeWidth="1.5" />

          {/* Location pins and labels */}
          {locations.map((loc) => {
            const x = toX(loc.lng);
            const y = toY(loc.lat);
            const color =
              importanceColors[loc.importance as keyof typeof importanceColors];
            const size =
              importanceSizes[loc.importance as keyof typeof importanceSizes];

            return (
              <g key={loc.name}>
                {/* Pin */}
                <circle
                  cx={x}
                  cy={y}
                  r={size}
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                />
                {/* Label */}
                <text
                  x={x + size + 4}
                  y={y + 4}
                  fontSize="12"
                  fill="#2c2416"
                  fontFamily="Georgia, serif"
                  fontWeight={loc.importance === "primary" ? "bold" : "normal"}
                >
                  {loc.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Location details */}
      <div className="mt-8 grid md:grid-cols-2 gap-4">
        {locations.map((loc) => (
          <div
            key={loc.name}
            className={`bg-white rounded-lg p-4 shadow-sm border border-parchment-dark ${
              loc.importance === "primary" ? "border-l-4 border-l-accent" : ""
            }`}
          >
            <h3 className="font-serif font-bold">{loc.name}</h3>
            <p className="text-xs text-ink-light mt-0.5">
              {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
            </p>
            <p className="text-sm text-ink-light mt-1">{loc.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
