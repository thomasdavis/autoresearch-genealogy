import Link from "next/link";
import { getAllPages } from "../../lib/markdown";
import { extractAllPersons, extractTimelineEvents } from "../../lib/family-tree";

export default async function HomePage() {
  const pages = await getAllPages();
  const persons = extractAllPersons();
  const events = extractTimelineEvents();

  const researchFiles = pages.filter(
    (p) =>
      p.slug.includes("Search") ||
      p.slug.includes("Research") ||
      p.slug.includes("Evidence")
  );
  const recentPages = pages.slice(0, 5);

  return (
    <div>
      <header className="mb-10">
        <h1 className="font-serif text-4xl font-bold text-ink mb-2">
          Davis Family Research
        </h1>
        <p className="text-ink-light text-lg">
          Genealogical research into the Davis family of Mossman, North
          Queensland, tracing the line of Thomas Alwyn Davis back through
          generations to George Edgar Davis, Rosie, and the wider Aboriginal and
          settler networks of Far North Queensland.
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-lg p-5 shadow-sm border border-parchment-dark">
          <div className="text-3xl font-bold text-accent">{persons.length}</div>
          <div className="text-sm text-ink-light mt-1">Named Individuals</div>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-parchment-dark">
          <div className="text-3xl font-bold text-accent">{pages.length}</div>
          <div className="text-sm text-ink-light mt-1">Research Files</div>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-parchment-dark">
          <div className="text-3xl font-bold text-accent">{events.length}</div>
          <div className="text-sm text-ink-light mt-1">Timeline Events</div>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-parchment-dark">
          <div className="text-3xl font-bold text-accent">
            {researchFiles.length}
          </div>
          <div className="text-sm text-ink-light mt-1">Search Reports</div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <Link
          href="/tree"
          className="bg-white rounded-lg p-6 shadow-sm border border-parchment-dark hover:shadow-md transition-shadow group"
        >
          <h2 className="font-serif text-xl font-bold mb-2 group-hover:text-accent">
            Family Tree
          </h2>
          <p className="text-sm text-ink-light">
            Visual hierarchy from Thomas Alwyn Davis back through Lisa Jane,
            Janice, Charles Joseph, and George Edgar Davis to the earliest known
            ancestors.
          </p>
        </Link>

        <Link
          href="/people"
          className="bg-white rounded-lg p-6 shadow-sm border border-parchment-dark hover:shadow-md transition-shadow group"
        >
          <h2 className="font-serif text-xl font-bold mb-2 group-hover:text-accent">
            People
          </h2>
          <p className="text-sm text-ink-light">
            All {persons.length} named individuals with dates, locations, and
            confidence levels.
          </p>
        </Link>

        <Link
          href="/timeline"
          className="bg-white rounded-lg p-6 shadow-sm border border-parchment-dark hover:shadow-md transition-shadow group"
        >
          <h2 className="font-serif text-xl font-bold mb-2 group-hover:text-accent">
            Timeline
          </h2>
          <p className="text-sm text-ink-light">
            Chronological view of births, deaths, and marriages from the 1790s
            to the present, grouped by decade.
          </p>
        </Link>

        <Link
          href="/questions"
          className="bg-white rounded-lg p-6 shadow-sm border border-parchment-dark hover:shadow-md transition-shadow group"
        >
          <h2 className="font-serif text-xl font-bold mb-2 group-hover:text-accent">
            Open Questions
          </h2>
          <p className="text-sm text-ink-light">
            Unresolved research gaps organized by priority, with evidence
            updates tracking progress on each question.
          </p>
        </Link>

        <Link
          href="/evidence"
          className="bg-white rounded-lg p-6 shadow-sm border border-parchment-dark hover:shadow-md transition-shadow group"
        >
          <h2 className="font-serif text-xl font-bold mb-2 group-hover:text-accent">
            Evidence
          </h2>
          <p className="text-sm text-ink-light">
            Hard evidence dashboard separating primary records from supporting
            material and speculation.
          </p>
        </Link>

        <Link
          href="/map"
          className="bg-white rounded-lg p-6 shadow-sm border border-parchment-dark hover:shadow-md transition-shadow group"
        >
          <h2 className="font-serif text-xl font-bold mb-2 group-hover:text-accent">
            Map
          </h2>
          <p className="text-sm text-ink-light">
            Key locations across Far North Queensland: Mossman, Port Douglas,
            Cairns, Cooktown, Yarrabah, and more.
          </p>
        </Link>

        <Link
          href="/graph"
          className="bg-white rounded-lg p-6 shadow-sm border border-parchment-dark hover:shadow-md transition-shadow group"
        >
          <h2 className="font-serif text-xl font-bold mb-2 group-hover:text-accent">
            Knowledge Graph
          </h2>
          <p className="text-sm text-ink-light">
            Interactive visualization of the GOKS ontological knowledge system, 
            showing all entities and their connections.
          </p>
        </Link>
      </div>

      {/* Recent Research */}
      <section>
        <h2 className="font-serif text-2xl font-bold mb-4">
          Recent Research Files
        </h2>
        <div className="bg-white rounded-lg shadow-sm border border-parchment-dark divide-y divide-parchment-dark">
          {recentPages.map((page) => (
            <Link
              key={page.slug}
              href={`/pages/${page.slug}`}
              className="flex items-center justify-between p-4 hover:bg-parchment/50 transition-colors"
            >
              <div>
                <div className="font-medium">{page.title}</div>
                {page.tags && page.tags.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {page.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 bg-parchment-dark rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-xs text-ink-light">{page.created}</span>
            </Link>
          ))}
        </div>
        <div className="mt-3">
          <Link
            href="/pages"
            className="text-accent hover:text-accent-light text-sm font-medium"
          >
            View all {pages.length} pages &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
