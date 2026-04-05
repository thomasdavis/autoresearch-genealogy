type Event = {
  year: string;
  title: string;
  detail: string;
  source: string;
  confidence: "strong" | "moderate" | "speculative";
};

const rosie1904: Event[] = [
  { year: "c.1869", title: "Born", detail: "Near McIvor River / Mareeba, parents Mick + Nellie, Kunjandji clan, Eastern Kuku Yalanji", source: "1942 indigence (age 73) + 1964 death cert (age 95)", confidence: "moderate" },
  { year: "c.1883-1890", title: "Edgar born", detail: "Fathered by Owen Reynolds (DNA proven). Birth cert lists father as 'George Brackenridge', mother 'Rosie age 16'", source: "1906/O/924 delayed birth registration + DNA", confidence: "strong" },
  { year: "c.1892", title: "Joseph born", detail: "Fathered by George Brackenridge", source: "1906/O/924", confidence: "strong" },
  { year: "c.1894", title: "Frederick born", detail: "Fathered by George Brackenridge", source: "1906/O/924", confidence: "strong" },
  { year: "1896", title: "Hospital admission Cooktown", detail: "Admitted 31 January 1896", source: "Cooktown Hospital Register HOS 13/28", confidence: "moderate" },
  { year: "c.1897", title: "Arthur born", detail: "Fathered by George Brackenridge", source: "1906/O/924", confidence: "strong" },
  { year: "1899", title: "Frederick baptised Yarrabah", detail: "Mother listed as 'Rosie Brackenridge, abode Mossman'", source: "Yarrabah baptism register", confidence: "strong" },
  { year: "c.1900", title: "Nellie born", detail: "Fathered by Owen Reynolds (DNA proven: Hezron Murgha 98 cM with Kathryn Rawlinson)", source: "DNA evidence", confidence: "strong" },
  { year: "pre-1901", title: "Married Jimmy Homalee (SSI)", detail: "South Sea Islander from Santo. Gave Rosie surname 'Homalee/Homarlee'", source: "Protector records", confidence: "strong" },
  { year: "1901", title: "Protector report", detail: "'Legally married to a kanaka at Mossman' with children at Yarrabah", source: "Chief Protector annual report", confidence: "strong" },
  { year: "30 Mar 1904", title: "DIED", detail: "Died at Cairns Base Hospital, age 35. Buried Pioneer Cemetery, Cairns (unmarked).", source: "Sanita-Ann Shale family tree + Thompson genealogy", confidence: "moderate" },
];

const unknown: Event[] = [
  { year: "pre-1905", title: "SSI husband dies", detail: "'Late husband was a S.S.I.' Could be Jimmy Homalee or George Brackenridge", source: "1905 Chief Protector report", confidence: "strong" },
  { year: "1905", title: "At Saltwater Creek with 'a son'", detail: "'Rosie Homalee of Saltwater Ck, Port Douglas' - widow of SSI, with a son, left money by late husband", source: "Chief Protector report", confidence: "strong" },
  { year: "1907", title: "Hospital admission Cooktown", detail: "Admitted 21 December 1907, discharged 30 December 1907", source: "Cooktown Hospital Register", confidence: "moderate" },
  { year: "1908", title: "Vera Yinigie born", detail: "Mother 'Rosie Mosman', father 'Sydney', at Yarrabah. May be a different Rosie.", source: "Yarrabah baptism register", confidence: "speculative" },
  { year: "1909", title: "Hospital admission Cooktown", detail: "13 August to 10 September 1909", source: "Hospital Register", confidence: "moderate" },
  { year: "1910 Jan", title: "Hospital admission Cooktown", detail: "31 January to 5 February 1910", source: "Hospital Register", confidence: "moderate" },
  { year: "5 Feb 1910", title: "A 'Rosie' dies Cooktown Hospital", detail: "Age 25, housemaid, single, Roman Catholic. PROBABLY different Rosie (age wrong for our Rosie)", source: "Hospital Register", confidence: "speculative" },
  { year: "1910", title: "Robert Eldon born", detail: "Mother 'Rosie Shoreman (Mossman) 1/4C'. Different surname suggests different Rosie.", source: "Yarrabah register", confidence: "speculative" },
  { year: "1914", title: "Half-caste daughter removed", detail: "'Half-caste daughter of Rosie' removed from Port Douglas to Yarrabah", source: "CIFHS Removals", confidence: "moderate" },
  { year: "1915", title: "War Census Port Douglas", detail: "'Rosie Honalle' listed with George, Fred Braikenridge, Nellie, Mary, Mick on page 138", source: "QSA War Census", confidence: "strong" },
  { year: "17 Mar 1916", title: "A 'Rosie' dies Port Douglas Hospital", detail: "Classified 'F' (Full Blood). If this is our Rosie, she can't be the 1964 Rosie.", source: "Aboriginal deaths register", confidence: "moderate" },
];

const rosie1964: Event[] = [
  { year: "c.1869", title: "Born", detail: "Near Mareeba / McIvor River. Father 'Mick', mother 'Nellie'. Brother Tommy Gray.", source: "1942 indigence application + 1964 death cert", confidence: "strong" },
  { year: "post-1905", title: "Partners with Willie Api/Epi", detail: "South Sea Islander from Epi Island. Gave surname 'Hippie/Hippi/Epi'", source: "Police report, indigence file", confidence: "strong" },
  { year: "1940", title: "Willie Api dies", detail: "Rosie becomes widow for second (or third) time", source: "Records", confidence: "moderate" },
  { year: "1942", title: "Indigence application", detail: "'Rosie Hippie' = 'Rosie Homarlee Epi', age ~73, born Mareeba. Brother Tommy Gray at Mona Mona. Address: Saltwater/Miallo near Mossman. 'No sons or daughters'. Living on Frank Coulthard's land.", source: "QSA indigence file ITM18062", confidence: "strong" },
  { year: "1948", title: "Mt Carbine population list", detail: "'Rosie Hippy F/B or H/C Kanaka, about 60 years old' (age clearly wrong if born 1869)", source: "Government list", confidence: "strong" },
  { year: "1949", title: "Exemption record", detail: "Age listed as 57 (clearly wrong if born 1869 - should be ~80)", source: "Government record", confidence: "strong" },
  { year: "1949", title: "Married Paddy Julian", detail: "Marriage cert 1949/C/1596. Rosie Hippie married Paddy Julian.", source: "QLD BDM", confidence: "strong" },
  { year: "21 Aug 1964", title: "DIED", detail: "Died at Mossman as 'Rosie Julian', age 95. Father: Mick. Mother: Nellie. Informants: W. Duncan (no relation), D.M. Guivarra (adopted daughter).", source: "Death cert 1964/C/3548", confidence: "strong" },
];

const confidenceColors = {
  strong: "border-emerald-500 bg-emerald-50",
  moderate: "border-amber-500 bg-amber-50",
  speculative: "border-red-400 bg-red-50",
};

const confidenceDot = {
  strong: "bg-emerald-500",
  moderate: "bg-amber-500",
  speculative: "bg-red-400",
};

function TimelineColumn({ events, title, color }: { events: Event[]; title: string; color: string }) {
  return (
    <div className="flex-1 min-w-0">
      <h2 className={`text-lg font-bold mb-4 px-3 py-2 rounded-lg ${color} text-center sticky top-0 z-10`}>
        {title}
      </h2>
      <div className="space-y-3 px-1">
        {events.map((ev, i) => (
          <div
            key={i}
            className={`rounded-lg border-l-4 p-3 ${confidenceColors[ev.confidence]} text-sm`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${confidenceDot[ev.confidence]}`} />
              <span className="font-mono text-xs text-gray-500">{ev.year}</span>
            </div>
            <div className="font-semibold text-gray-900">{ev.title}</div>
            <div className="text-gray-700 mt-1 text-xs leading-relaxed">{ev.detail}</div>
            <div className="text-gray-400 mt-1 text-[10px] italic">{ev.source}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RosieTimelinePage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
          Rosie: Two-Timeline Analysis
        </h1>
        <p className="text-gray-600 text-sm">
          Sorting source documents into three columns: events confirmed for the Rosie who died c.1904,
          events we cannot assign to either Rosie, and events confirmed for the Rosie who died 1964.
          The central question: are these the same woman or two different women?
        </p>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-gray-500">Strong evidence</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-xs text-gray-500">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="text-xs text-gray-500">Speculative / likely different Rosie</span>
          </div>
        </div>
      </header>

      <div className="flex gap-4">
        <TimelineColumn
          events={rosie1904}
          title="Rosie #1 (d. c.1904)"
          color="bg-blue-100 text-blue-900"
        />
        <TimelineColumn
          events={unknown}
          title="Unassigned Sources"
          color="bg-gray-200 text-gray-800"
        />
        <TimelineColumn
          events={rosie1964}
          title="Rosie #2 (d. 1964)"
          color="bg-purple-100 text-purple-900"
        />
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
        <h3 className="font-bold text-yellow-900 mb-2">Key Question</h3>
        <p className="text-sm text-yellow-800">
          The 1915 War Census lists &quot;Rosie Honalle&quot; with Fred Braikenridge (Edgar&apos;s brother) at Port Douglas.
          If Rosie #1 died in 1904, why would Fred still be listed with a &quot;Rosie&quot; in 1915?
          Either: (a) Rosie #1 didn&apos;t die in 1904, or (b) a different Rosie took on the family role,
          or (c) Fred was listed near an unrelated Rosie by coincidence.
        </p>
        <p className="text-sm text-yellow-800 mt-2">
          The 1964 death certificate lists father &quot;Mick&quot; and mother &quot;Nellie&quot; - if this is a different
          woman from Edgar&apos;s mother, it would be a remarkable coincidence that she also has Aboriginal parents
          with no European surnames and lived in the exact same area.
        </p>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-300 rounded-lg">
        <h3 className="font-bold text-blue-900 mb-2">Children Summary</h3>
        <table className="w-full text-sm mt-2">
          <thead>
            <tr className="text-left text-xs text-blue-700">
              <th className="pb-1">Child</th>
              <th className="pb-1">Born</th>
              <th className="pb-1">Father</th>
              <th className="pb-1">Rosie&apos;s Age (if b.1869)</th>
              <th className="pb-1">Rosie&apos;s Age (if b.1874)</th>
            </tr>
          </thead>
          <tbody className="text-blue-900">
            <tr className="border-t border-blue-200"><td>Edgar</td><td>c.1883-1890</td><td>Owen Reynolds (DNA)</td><td>14-21</td><td>9-16</td></tr>
            <tr className="border-t border-blue-200"><td>Joseph</td><td>c.1892</td><td>George Brackenridge</td><td>23</td><td>18</td></tr>
            <tr className="border-t border-blue-200"><td>Frederick</td><td>c.1894</td><td>George Brackenridge</td><td>25</td><td>20</td></tr>
            <tr className="border-t border-blue-200"><td>Arthur</td><td>c.1897</td><td>George Brackenridge</td><td>28</td><td>23</td></tr>
            <tr className="border-t border-blue-200"><td>Nellie</td><td>c.1900</td><td>Owen Reynolds (DNA)</td><td>31</td><td>26</td></tr>
            <tr className="border-t border-blue-200"><td>&quot;a son&quot;</td><td>alive 1905</td><td>Late SSI husband</td><td>36</td><td>31</td></tr>
            <tr className="border-t border-blue-200 text-blue-400"><td>half-caste daughter</td><td>pre-1914</td><td>unknown</td><td>~45</td><td>~40</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
