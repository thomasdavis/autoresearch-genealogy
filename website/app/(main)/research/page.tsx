import { getPageBySlug } from "../../../lib/markdown";
import Link from "next/link";

interface ResearchEntry {
  date: string;
  content: string;
}

function parseResearchLog(content: string): ResearchEntry[] {
  const entries: ResearchEntry[] = [];
  const lines = content.split("\n");
  let currentDate = "";
  let currentContent: string[] = [];

  for (const line of lines) {
    // Match date headers like "## 2026-03-22" or "## March 22, 2026" etc
    const dateMatch = line.match(/^##\s+(.+)/);
    if (dateMatch) {
      if (currentDate && currentContent.length > 0) {
        entries.push({
          date: currentDate,
          content: currentContent.join("\n"),
        });
      }
      currentDate = dateMatch[1].trim();
      currentContent = [];
      continue;
    }

    if (currentDate && line.trim()) {
      currentContent.push(line);
    }
  }

  if (currentDate && currentContent.length > 0) {
    entries.push({
      date: currentDate,
      content: currentContent.join("\n"),
    });
  }

  return entries;
}

export default async function ResearchPage() {
  const page = await getPageBySlug("Research_Log");

  if (!page) {
    return (
      <div>
        <h1 className="font-serif text-3xl font-bold">Research Log</h1>
        <p className="text-ink-light mt-2">Could not load Research_Log.md</p>
      </div>
    );
  }

  const entries = parseResearchLog(page.content);

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-ink mb-2">
          Research Log
        </h1>
        <p className="text-ink-light">
          Chronological record of research sessions, searches performed, and
          findings.
        </p>
        <div className="mt-2">
          <Link
            href="/pages/Research_Log"
            className="text-sm text-accent hover:text-accent-light"
          >
            View full document &rarr;
          </Link>
        </div>
      </header>

      {entries.length > 0 ? (
        <div className="space-y-4">
          {entries.map((entry, i) => (
            <details
              key={i}
              className="bg-white rounded-lg shadow-sm border border-parchment-dark"
              open={i < 3}
            >
              <summary className="p-4 cursor-pointer hover:bg-parchment/50 transition-colors font-serif font-bold">
                {entry.date}
              </summary>
              <div className="px-4 pb-4 border-t border-parchment-dark pt-3">
                <pre className="text-sm text-ink-light whitespace-pre-wrap font-serif leading-relaxed">
                  {entry.content.length > 2000
                    ? entry.content.substring(0, 2000) + "\n\n[Truncated, see full document]"
                    : entry.content}
                </pre>
              </div>
            </details>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-parchment-dark">
          <div
            className="prose prose-archival max-w-none font-serif"
            dangerouslySetInnerHTML={{ __html: page.htmlContent }}
          />
        </div>
      )}
    </div>
  );
}
