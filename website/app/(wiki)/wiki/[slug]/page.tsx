import { notFound } from "next/navigation";
import type { Metadata } from "next";
import WikiHeader from "../../../../components/WikiHeader";
import {
  PersonInfobox,
  ArticleInfobox,
  TableOfContents,
  CategoryBar,
  RelatedArticles,
} from "../../../../components/WikiInfobox";
import {
  getBySlug,
  getAllSlugs,
  getPersonBySlug,
  getArticleBySlug,
} from "../../../../lib/wiki-data";
import Link from "next/link";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getBySlug(slug);
  if (!item) return { title: "Not Found" };
  const title =
    item.type === "person" ? item.data.name : item.data.title;
  return {
    title: `${title} - Sagigi Family Wiki`,
  };
}

function lookupTitle(slug: string): { title: string } | null {
  const person = getPersonBySlug(slug);
  if (person) return { title: person.name };
  const article = getArticleBySlug(slug);
  if (article) return { title: article.title };
  return null;
}

function PersonArticle({
  person,
}: {
  person: import("../../../../lib/wiki-data").PersonData;
}) {
  const allSections = [
    ...person.sections,
    ...(person.sources.length > 0 ? [{ heading: "References" }] : []),
    ...(person.relatedArticles.length > 0 ? [{ heading: "See also" }] : []),
  ];

  return (
    <div className="wiki-article">
      <h1>{person.name}</h1>
      <PersonInfobox person={person} />
      <TableOfContents sections={allSections} />
      <p className="wiki-lead">
        <strong>{person.name}</strong> {person.bio}
      </p>

      {person.sections.map((section, i) => (
        <div key={i}>
          <h2 id={section.heading.toLowerCase().replace(/\s+/g, "-")}>
            {section.heading}
          </h2>
          <p>{section.content}</p>
        </div>
      ))}

      {person.relatedArticles.length > 0 && (
        <RelatedArticles slugs={person.relatedArticles} allData={lookupTitle} />
      )}

      {person.sources.length > 0 && (
        <div className="wiki-sources">
          <h2 id="references">References</h2>
          <ol>
            {person.sources.map((src, i) => (
              <li key={i}>{src}</li>
            ))}
          </ol>
        </div>
      )}

      <CategoryBar categories={person.categories} />
    </div>
  );
}

function ArticlePage({
  article,
}: {
  article: import("../../../../lib/wiki-data").ArticleData;
}) {
  const allSections = [
    ...article.sections,
    ...(article.sources.length > 0 ? [{ heading: "References" }] : []),
    ...(article.relatedArticles.length > 0 ? [{ heading: "See also" }] : []),
  ];

  return (
    <div className="wiki-article">
      <h1>{article.title}</h1>
      <ArticleInfobox article={article} />
      <TableOfContents sections={allSections} />
      <p className="wiki-lead">
        <strong>{article.title}</strong> {article.summary}
      </p>

      {article.sections.map((section, i) => (
        <div key={i}>
          <h2 id={section.heading.toLowerCase().replace(/\s+/g, "-")}>
            {section.heading}
          </h2>
          <p>{section.content}</p>
        </div>
      ))}

      {article.relatedArticles.length > 0 && (
        <RelatedArticles
          slugs={article.relatedArticles}
          allData={lookupTitle}
        />
      )}

      {article.sources.length > 0 && (
        <div className="wiki-sources">
          <h2 id="references">References</h2>
          <ol>
            {article.sources.map((src, i) => (
              <li key={i}>{src}</li>
            ))}
          </ol>
        </div>
      )}

      <CategoryBar categories={article.categories} />
    </div>
  );
}

export default async function WikiArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <>
      <WikiHeader />
      <div className="wiki-page">
        {item.type === "person" ? (
          <PersonArticle person={item.data} />
        ) : (
          <ArticlePage article={item.data} />
        )}
      </div>
    </>
  );
}
