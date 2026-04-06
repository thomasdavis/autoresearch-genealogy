import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

export default function Home() {
  const articles = getAllArticles();

  return (
    <div className="max-w-[960px] mx-auto">
      <h1 className="text-3xl font-normal border-b border-[#a2a9b1] pb-1 mb-4 font-serif">
        Rosiepedia: EKY Native Title Rosie Encyclopedia
      </h1>

      <div className="wiki-content mb-6">
        <p className="mb-4">
          Welcome to <b>Rosiepedia</b>, an encyclopedia of every woman named
          Rosie listed as an apical ancestor in the{" "}
          <b>Eastern Kuku Yalanji (EKY) native title determination</b>,
          handed down by the Federal Court of Australia in December 2007 in{" "}
          <i>Walker v State of Queensland</i> [2007] FCA 967.
        </p>
        <p className="mb-4">
          The EKY determination covers traditional country of the Eastern
          Kuku Yalanji people in Far North Queensland, stretching from the
          Daintree River to the Annan River and inland to the Great Dividing
          Range. The determination lists 44 apical ancestor entries, of which{" "}
          <b>five involve a woman named Rosie</b>. Each is treated as a
          distinct individual in the anthropological connection report
          prepared for the Federal Court.
        </p>
        <p className="mb-4">
          The prevalence of the name &quot;Rosie&quot; among Aboriginal women in
          colonial Far North Queensland (at least sixteen different women
          named Rosie appear in the Cooktown district records alone) makes
          disambiguation a critical challenge for genealogical researchers.
          These articles document what is known about each individual from
          archival sources, oral histories, and government records.
        </p>
      </div>

      <h2 className="text-xl font-normal border-b border-[#a2a9b1] pb-1 mb-3 font-serif">
        Articles
      </h2>

      <table className="w-full border-collapse text-sm mb-6">
        <thead>
          <tr className="bg-[#eaecf0]">
            <th className="text-left p-2 border border-[#a2a9b1] font-semibold">
              Entry
            </th>
            <th className="text-left p-2 border border-[#a2a9b1] font-semibold">
              Name
            </th>
            <th className="text-left p-2 border border-[#a2a9b1] font-semibold">
              Type
            </th>
            <th className="text-left p-2 border border-[#a2a9b1] font-semibold">
              Region
            </th>
            <th className="text-left p-2 border border-[#a2a9b1] font-semibold">
              Documentation level
            </th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => {
            const region =
              article.infobox.fields.find((f) => f.label === "Region")
                ?.value || "Unknown";
            const docLevel =
              article.references.length >= 5
                ? "Extensive"
                : article.references.length >= 3
                  ? "Moderate"
                  : "Minimal";
            const type = article.infobox.fields.find(
              (f) => f.label === "Siblings" || f.label === "Relationship"
            )
              ? article.infobox.fields.find((f) => f.label === "Siblings")
                ? "Sibling pair"
                : "Couple"
              : "Individual";
            return (
              <tr key={article.slug} className="hover:bg-[#f8f9fa]">
                <td className="p-2 border border-[#a2a9b1]">
                  {article.ekyEntry}
                </td>
                <td className="p-2 border border-[#a2a9b1]">
                  <Link
                    href={`/${article.slug}`}
                    className="text-[#0645ad] font-semibold"
                  >
                    {article.title}
                  </Link>
                </td>
                <td className="p-2 border border-[#a2a9b1]">{type}</td>
                <td className="p-2 border border-[#a2a9b1]">{region}</td>
                <td className="p-2 border border-[#a2a9b1]">{docLevel}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2 className="text-xl font-normal border-b border-[#a2a9b1] pb-1 mb-3 font-serif">
        About this project
      </h2>
      <div className="wiki-content text-sm text-[#555]">
        <p>
          This encyclopedia was compiled from the GOKS (Genealogical
          Ontological Knowledge System) database, which contains over 119,000
          entities, 248,000 claims, and 75,000 relationships extracted from
          733+ documents relating to Aboriginal families of Far North
          Queensland. Sources include Queensland BDM records, CIFHS
          registers, Trove newspaper archives, OH55 oral histories, mission
          records, Port Douglas and Mossman audit records, and Queensland
          State Archives Aboriginal Protection files.
        </p>
      </div>
    </div>
  );
}
