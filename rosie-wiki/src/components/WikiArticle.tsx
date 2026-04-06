import type { Article } from "@/lib/articles";
import WikiInfobox from "./WikiInfobox";
import WikiTableOfContents from "./WikiTableOfContents";

interface WikiArticleProps {
  article: Article;
}

export default function WikiArticle({ article }: WikiArticleProps) {
  const tocItems = article.sections.map((s) => ({
    id: s.id,
    title: s.title,
    subsections: s.subsections?.map((sub) => ({
      id: sub.id,
      title: sub.title,
    })),
  }));

  // Add standard sections to TOC
  if (article.seeAlso.length > 0) {
    tocItems.push({ id: "see-also", title: "See also", subsections: [] });
  }
  tocItems.push({ id: "references", title: "References", subsections: [] });
  if (article.categories.length > 0) {
    tocItems.push({ id: "categories", title: "Categories", subsections: [] });
  }

  return (
    <article className="max-w-[960px] mx-auto">
      {/* Title */}
      <h1 className="text-3xl font-normal border-b border-[#a2a9b1] pb-1 mb-1 font-serif">
        {article.title}
      </h1>
      {article.subtitle && (
        <div className="text-sm text-[#72777d] mb-4 italic">
          {article.subtitle}
        </div>
      )}

      {/* Hatnote */}
      {article.hatnote && (
        <div
          className="text-sm italic text-[#555] mb-4 pl-2"
          dangerouslySetInnerHTML={{ __html: article.hatnote }}
        />
      )}

      {/* Notice box */}
      {article.noticeBox && (
        <div
          className={`border rounded-sm p-3 mb-4 text-sm ${
            article.noticeBox.type === "stub"
              ? "bg-[#f8f4e8] border-[#e0d5b3]"
              : article.noticeBox.type === "sources"
                ? "bg-[#fff9e6] border-[#f0c36d]"
                : "bg-[#fef6e7] border-[#f0c36d]"
          }`}
        >
          {article.noticeBox.text}
        </div>
      )}

      {/* Infobox */}
      <WikiInfobox {...article.infobox} />

      {/* Introduction */}
      <div
        className="wiki-content mb-6"
        dangerouslySetInnerHTML={{ __html: article.introduction }}
      />

      {/* Table of Contents */}
      <WikiTableOfContents items={tocItems} />

      {/* Clear float after TOC */}
      <div className="clear-both" />

      {/* Sections */}
      {article.sections.map((section) => (
        <div key={section.id} className="mb-6">
          <h2
            id={section.id}
            className="text-xl font-normal border-b border-[#a2a9b1] pb-1 mb-3 mt-6 font-serif"
          >
            {section.title}
          </h2>
          <div
            className="wiki-content"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
          {section.subsections?.map((sub) => (
            <div key={sub.id} className="ml-0 mt-4">
              <h3
                id={sub.id}
                className="text-lg font-normal mb-2 font-serif"
              >
                {sub.title}
              </h3>
              <div
                className="wiki-content"
                dangerouslySetInnerHTML={{ __html: sub.content }}
              />
            </div>
          ))}
        </div>
      ))}

      {/* See also */}
      {article.seeAlso.length > 0 && (
        <div className="mb-6">
          <h2
            id="see-also"
            className="text-xl font-normal border-b border-[#a2a9b1] pb-1 mb-3 mt-6 font-serif"
          >
            See also
          </h2>
          <ul className="list-disc pl-8">
            {article.seeAlso.map((item) => (
              <li key={item.slug}>
                <a href={`/${item.slug}`} className="text-[#0645ad]">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* References */}
      <div className="mb-6">
        <h2
          id="references"
          className="text-xl font-normal border-b border-[#a2a9b1] pb-1 mb-3 mt-6 font-serif"
        >
          References
        </h2>
        <ol className="list-decimal pl-8 text-sm">
          {article.references.map((ref, i) => (
            <li key={ref.id} id={ref.id} className="mb-1 text-[#555]">
              {ref.text}
            </li>
          ))}
        </ol>
      </div>

      {/* Categories */}
      {article.categories.length > 0 && (
        <div
          id="categories"
          className="mt-8 pt-3 border-t border-[#a2a9b1] text-sm"
        >
          <span className="font-semibold mr-2">Categories:</span>
          {article.categories.map((cat, i) => (
            <span key={i}>
              <span className="inline-block bg-[#f0f0f0] border border-[#ddd] px-2 py-0.5 mx-0.5 mb-1 text-[#0645ad] text-xs">
                {cat}
              </span>
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
