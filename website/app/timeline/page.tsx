import { extractTimelineEvents } from "../../lib/family-tree";

export default function TimelinePage() {
  const events = extractTimelineEvents();

  // Group by decade
  const byDecade: Record<number, typeof events> = {};
  for (const event of events) {
    if (!byDecade[event.decade]) byDecade[event.decade] = [];
    byDecade[event.decade].push(event);
  }

  const decades = Object.keys(byDecade)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-ink mb-2">
          Timeline
        </h1>
        <p className="text-ink-light">
          {events.length} events extracted from family records, grouped by
          decade.
        </p>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-strong-bg border-2 border-strong" />
            <span className="text-xs text-ink-light">Birth</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-speculative-bg border-2 border-speculative" />
            <span className="text-xs text-ink-light">Death</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-moderate-bg border-2 border-moderate" />
            <span className="text-xs text-ink-light">Marriage</span>
          </div>
        </div>
      </header>

      <div className="space-y-10">
        {decades.map((decade) => (
          <section key={decade}>
            <h2 className="font-serif text-2xl font-bold text-ink mb-4 sticky top-0 bg-parchment py-2 z-10">
              {decade}s
            </h2>
            <div className="relative pl-12">
              <div className="timeline-line" />
              {byDecade[decade].map((event, i) => (
                <div key={i} className="relative mb-4 pl-6">
                  <div
                    className={`timeline-dot ${
                      event.type === "birth"
                        ? "timeline-dot-birth"
                        : event.type === "death"
                        ? "timeline-dot-death"
                        : "timeline-dot-marriage"
                    }`}
                  />
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-parchment-dark">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-ink-light">
                        {event.year}
                      </span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          event.type === "birth"
                            ? "bg-strong-bg text-strong"
                            : event.type === "death"
                            ? "bg-speculative-bg text-speculative"
                            : "bg-moderate-bg text-moderate"
                        }`}
                      >
                        {event.type}
                      </span>
                    </div>
                    <p className="text-sm">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
