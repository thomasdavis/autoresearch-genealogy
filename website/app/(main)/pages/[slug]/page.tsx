import { notFound } from "next/navigation";
import Link from "next/link";
import { getPageBySlug, getAllPages } from "../../../../lib/markdown";

export async function generateStaticParams() {
  const pages = await getAllPages();
  return pages.map((page) => ({ slug: page.slug }));
}

export default async function PageViewer({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return notFound();

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main content */}
      <article className="flex-1 min-w-0">
        <div className="mb-4">
          <Link
            href="/pages"
            className="text-sm text-accent hover:text-accent-light"
          >
            &larr; All pages
          </Link>
        </div>
        <h1 className="font-serif text-3xl font-bold text-ink mb-6">
          {page.title}
        </h1>
        <div
          className="prose prose-archival max-w-none font-serif"
          dangerouslySetInnerHTML={{ __html: page.htmlContent }}
        />
      </article>

      {/* Sidebar with metadata */}
      <aside className="lg:w-72 flex-shrink-0">
        <div className="bg-white rounded-lg p-5 shadow-sm border border-parchment-dark sticky top-8">
          <h2 className="font-bold text-sm uppercase tracking-wide text-ink-light mb-3">
            File Metadata
          </h2>
          <dl className="space-y-2.5 text-sm">
            {page.type && (
              <>
                <dt className="text-ink-light text-xs">Type</dt>
                <dd className="font-medium capitalize">{page.type}</dd>
              </>
            )}
            {page.created && (
              <>
                <dt className="text-ink-light text-xs">Created</dt>
                <dd className="font-medium">{page.created}</dd>
              </>
            )}
            {page.updated && (
              <>
                <dt className="text-ink-light text-xs">Updated</dt>
                <dd className="font-medium">{page.updated}</dd>
              </>
            )}
            {page.tags && page.tags.length > 0 && (
              <>
                <dt className="text-ink-light text-xs">Tags</dt>
                <dd className="flex flex-wrap gap-1">
                  {page.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 bg-parchment-dark rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </dd>
              </>
            )}
            {/* Show other frontmatter */}
            {Object.entries(page.frontmatter)
              .filter(
                ([key]) =>
                  !["type", "created", "updated", "tags"].includes(key)
              )
              .map(([key, value]) => (
                <div key={key}>
                  <dt className="text-ink-light text-xs">{key}</dt>
                  <dd className="font-medium text-xs">
                    {typeof value === "string"
                      ? value
                      : JSON.stringify(value)}
                  </dd>
                </div>
              ))}
          </dl>
        </div>
      </aside>
    </div>
  );
}
