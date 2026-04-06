import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

export default function WikiSidebar() {
  const articles = getAllArticles();

  return (
    <aside className="w-[200px] shrink-0 bg-[#f6f6f6] border-r border-[#a2a9b1] text-sm hidden md:block">
      <div className="p-3">
        <div className="font-bold text-xs text-[#555] uppercase tracking-wider mb-2">
          Navigation
        </div>
        <ul className="space-y-1">
          <li>
            <Link href="/" className="text-[#0645ad] hover:underline block py-0.5">
              Main page
            </Link>
          </li>
        </ul>

        <div className="font-bold text-xs text-[#555] uppercase tracking-wider mb-2 mt-4">
          EKY Rosie Articles
        </div>
        <ul className="space-y-1">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/${article.slug}`}
                className="text-[#0645ad] hover:underline block py-0.5 leading-tight"
              >
                {article.title}
              </Link>
            </li>
          ))}
        </ul>

        <div className="font-bold text-xs text-[#555] uppercase tracking-wider mb-2 mt-4">
          Context
        </div>
        <ul className="space-y-1 text-xs text-[#555]">
          <li>Eastern Kuku Yalanji</li>
          <li>Walker v Queensland [2007]</li>
          <li>44 apical ancestors</li>
          <li>5 Rosie entries</li>
        </ul>
      </div>
    </aside>
  );
}
