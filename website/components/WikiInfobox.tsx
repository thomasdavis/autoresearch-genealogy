import Link from "next/link";
import type { PersonData, ArticleData } from "../lib/wiki-data";

export function PersonInfobox({ person }: { person: PersonData }) {
  return (
    <div className="wiki-infobox">
      <div className="wiki-infobox-header">{person.name}</div>
      <table>
        <tbody>
          {person.born && (
            <tr>
              <th>Born</th>
              <td>
                {person.born}
                {person.birthPlace && (
                  <>
                    <br />
                    {person.birthPlace}
                  </>
                )}
              </td>
            </tr>
          )}
          {person.died && (
            <tr>
              <th>Died</th>
              <td>
                {person.died}
                {person.deathPlace && (
                  <>
                    <br />
                    {person.deathPlace}
                  </>
                )}
              </td>
            </tr>
          )}
          {person.nationality && (
            <tr>
              <th>Nationality</th>
              <td>{person.nationality}</td>
            </tr>
          )}
          {person.ethnicity && (
            <tr>
              <th>Ethnicity</th>
              <td>{person.ethnicity}</td>
            </tr>
          )}
          {person.clan && (
            <tr>
              <th>Clan</th>
              <td>{person.clan}</td>
            </tr>
          )}
          {person.island && (
            <tr>
              <th>Island</th>
              <td>{person.island}</td>
            </tr>
          )}
          {person.occupation && person.occupation.length > 0 && (
            <tr>
              <th>Occupation</th>
              <td>{person.occupation.join(", ")}</td>
            </tr>
          )}
          {person.knownFor && (
            <tr>
              <th>Known for</th>
              <td>{person.knownFor}</td>
            </tr>
          )}
          {person.education && (
            <tr>
              <th>Education</th>
              <td>{person.education}</td>
            </tr>
          )}
          {person.militaryService && (
            <tr>
              <th>Military service</th>
              <td>{person.militaryService}</td>
            </tr>
          )}
          {person.spouse && (
            <tr>
              <th>Spouse</th>
              <td>{person.spouse}</td>
            </tr>
          )}
          {person.parents &&
            (person.parents.father || person.parents.mother) && (
              <tr>
                <th>Parents</th>
                <td>
                  {person.parents.father && <div>{person.parents.father}</div>}
                  {person.parents.mother && <div>{person.parents.mother}</div>}
                </td>
              </tr>
            )}
          {person.children && person.children.length > 0 && (
            <tr>
              <th>Children</th>
              <td>{person.children.join(", ")}</td>
            </tr>
          )}
          {person.awards && person.awards.length > 0 && (
            <tr>
              <th>Awards</th>
              <td>{person.awards.join(", ")}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function ArticleInfobox({
  article,
}: {
  article: ArticleData;
}) {
  if (!article.infobox) return null;
  return (
    <div className="wiki-infobox">
      <div className="wiki-infobox-header">{article.title}</div>
      <table>
        <tbody>
          {Object.entries(article.infobox).map(([key, value]) => (
            <tr key={key}>
              <th>{key}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TableOfContents({
  sections,
}: {
  sections: { heading: string }[];
}) {
  if (sections.length === 0) return null;
  return (
    <div className="wiki-toc">
      <div className="wiki-toc-title">Contents</div>
      <ol>
        {sections.map((s, i) => (
          <li key={i}>
            <a href={`#${s.heading.toLowerCase().replace(/\s+/g, "-")}`}>
              {s.heading}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function CategoryBar({ categories }: { categories: string[] }) {
  return (
    <div className="wiki-categories">
      <strong>Categories: </strong>
      {categories.map((cat, i) => (
        <span key={i}>
          {i > 0 && " | "}
          <span className="wiki-category">{cat}</span>
        </span>
      ))}
    </div>
  );
}

export function RelatedArticles({
  slugs,
  allData,
}: {
  slugs: string[];
  allData: (slug: string) => { title: string } | null;
}) {
  const valid = slugs
    .map((s) => ({ slug: s, data: allData(s) }))
    .filter((x) => x.data !== null);
  if (valid.length === 0) return null;
  return (
    <div className="wiki-related">
      <h2 id="see-also">See also</h2>
      <ul>
        {valid.map((item) => (
          <li key={item.slug}>
            <Link href={`/wiki/${item.slug}`}>{item.data!.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
