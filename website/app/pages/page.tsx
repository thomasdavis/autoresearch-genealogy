import Link from "next/link";
import { getAllPages } from "../../lib/markdown";

export default async function AllPagesPage() {
  const pages = await getAllPages();

  // Group by type
  const grouped: Record<string, typeof pages> = {};
  for (const page of pages) {
    const type = page.type || "uncategorized";
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(page);
  }

  const typeOrder = ["reference", "research", "analysis", "uncategorized"];
  const sortedTypes = Object.keys(grouped).sort((a, b) => {
    const ai = typeOrder.indexOf(a);
    const bi = typeOrder.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-ink mb-2">
          All Research Files
        </h1>
        <p className="text-ink-light">
          {pages.length} files from the research vault, grouped by type.
        </p>
      </header>

      {sortedTypes.map((type) => (
        <section key={type} className="mb-8">
          <h2 className="font-serif text-xl font-bold text-ink mb-3 capitalize">
            {type}
          </h2>
          <div className="bg-white rounded-lg shadow-sm border border-parchment-dark divide-y divide-parchment-dark">
            {grouped[type].map((page) => (
              <Link
                key={page.slug}
                href={`/pages/${page.slug}`}
                className="flex items-center justify-between p-4 hover:bg-parchment/50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{page.title}</div>
                  {page.tags && page.tags.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {page.tags.map((tag) => (
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
                <div className="text-xs text-ink-light ml-4 flex-shrink-0">
                  {page.created}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
