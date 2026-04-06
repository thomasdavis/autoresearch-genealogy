import { notFound } from "next/navigation";
import { getArticleBySlug, getAllSlugs } from "@/lib/articles";
import WikiArticle from "@/components/WikiArticle";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Use a sync approach for static generation
  return params.then(({ slug }) => {
    const article = getArticleBySlug(slug);
    if (!article) return { title: "Not Found" };
    return {
      title: `${article.title} - Rosiepedia`,
      description: `${article.title} - EKY Apical Ancestor Entry ${article.ekyEntry}`,
    };
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <WikiArticle article={article} />;
}
