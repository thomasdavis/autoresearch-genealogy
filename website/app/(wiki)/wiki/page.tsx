import Link from "next/link";
import WikiHeader from "../../../components/WikiHeader";
import FamilyTreeChart from "../../../components/FamilyTreeChart";
import { people, articles, familyLinks } from "../../../lib/wiki-data";

export default function WikiHome() {
  const sagigi = people.filter((p) =>
    p.categories.some((c) => c.includes("Sagigi"))
  );
  const doolah = people.filter((p) =>
    p.categories.some((c) => c.includes("Doolah"))
  );
  const cowley = people.filter((p) =>
    p.categories.some((c) => c.includes("Cowley"))
  );
  const binJuda = people.filter((p) =>
    p.categories.some((c) => c.includes("Bin Juda"))
  );

  return (
    <>
      <WikiHeader />
      <div className="wiki-page">
        <div className="wiki-article">
          <h1>Sagigi Family Wiki</h1>

          <div className="wiki-home-welcome">
            <h2>Welcome</h2>
            <p>
              This encyclopedia documents the extended family network of the{" "}
              <strong>Sagigi</strong>, <strong>Doolah</strong>, and{" "}
              <strong>Cowley</strong> families of the Torres Strait Islands,
              Queensland, Australia. The Sagigi family is traditionally from{" "}
              <Link href="/wiki/badu-island">Badu Island</Link> in the western
              Torres Strait. The Doolah family is from{" "}
              <Link href="/wiki/erub-darnley-island">Erub (Darnley Island)</Link>{" "}
              and <Link href="/wiki/mer-murray-island">Mer (Murray Island)</Link>{" "}
              in the eastern Torres Strait. These families are connected through
              marriage and the shared history of the Torres Strait Islander
              peoples.
            </p>
          </div>

          <div className="wiki-stats-row">
            <div className="wiki-stat">
              <div className="wiki-stat-number">{people.length}</div>
              <div className="wiki-stat-label">People</div>
            </div>
            <div className="wiki-stat">
              <div className="wiki-stat-number">{articles.length}</div>
              <div className="wiki-stat-label">Articles</div>
            </div>
            <div className="wiki-stat">
              <div className="wiki-stat-number">3</div>
              <div className="wiki-stat-label">Family Lines</div>
            </div>
            <div className="wiki-stat">
              <div className="wiki-stat-number">
                {new Set(people.map((p) => p.island).filter(Boolean)).size}
              </div>
              <div className="wiki-stat-label">Islands</div>
            </div>
          </div>

          <h2>Family Tree</h2>
          <p>
            Click on any person to read their full article. Colours indicate
            family line.
          </p>
          <FamilyTreeChart people={people} links={familyLinks} />

          <h2 id="sagigi-family">Sagigi Family</h2>
          <p>
            The Sagigi family is one of the prominent families of{" "}
            <Link href="/wiki/badu-island">Badu Island</Link> in the western
            Torres Strait. They are{" "}
            <Link href="/wiki/badulgal">Badulgal</Link> people who speak{" "}
            Kala Lagaw Ya. The family has connections to{" "}
            <Link href="/wiki/mer-murray-island">Murray Island</Link> through
            inter-island marriage.
          </p>
          <div className="wiki-article-list">
            {sagigi.map((p) => (
              <Link key={p.slug} href={`/wiki/${p.slug}`}>
                {p.name}
                {p.born ? ` (b. ${p.born})` : ""}
              </Link>
            ))}
          </div>

          <h2 id="doolah-family">Doolah Family</h2>
          <p>
            The Doolah family is from{" "}
            <Link href="/wiki/erub-darnley-island">Erub (Darnley Island)</Link>{" "}
            and <Link href="/wiki/mer-murray-island">Mer (Murray Island)</Link>{" "}
            in the eastern Torres Strait. They are of the{" "}
            <Link href="/wiki/meriam">Meriam</Link> people, specifically the
            Samsep-Meriam clan from Warwe village on Mer.
          </p>
          <div className="wiki-article-list">
            {doolah.map((p) => (
              <Link key={p.slug} href={`/wiki/${p.slug}`}>
                {p.name}
                {p.born ? ` (b. ${p.born})` : ""}
              </Link>
            ))}
          </div>

          <h2 id="cowley-family">Cowley Family</h2>
          <p>
            The Cowley family was present in the Torres Strait, with records
            linking them to{" "}
            <Link href="/wiki/thursday-island">Thursday Island</Link> and{" "}
            <Link href="/wiki/erub-darnley-island">Erub (Darnley Island)</Link>.
          </p>
          <div className="wiki-article-list">
            {cowley.map((p) => (
              <Link key={p.slug} href={`/wiki/${p.slug}`}>
                {p.name}
                {p.born ? ` (b. ${p.born})` : ""}
              </Link>
            ))}
          </div>

          {binJuda.length > 0 && (
            <>
              <h2>Bin Juda Family</h2>
              <p>
                The Bin Juda family is connected to the Doolahs through the
                marriage of Mareja Doolah and Bora Bin Juda.
              </p>
              <div className="wiki-article-list">
                {binJuda
                  .filter(
                    (p) => !doolah.some((d) => d.slug === p.slug)
                  )
                  .map((p) => (
                    <Link key={p.slug} href={`/wiki/${p.slug}`}>
                      {p.name}
                    </Link>
                  ))}
              </div>
            </>
          )}

          <h2 id="articles">Articles</h2>

          <div className="wiki-home-columns">
            <div className="wiki-home-section">
              <h3>Peoples and Clans</h3>
              <ul>
                {articles
                  .filter((a) => a.type === "tribe")
                  .map((a) => (
                    <li key={a.slug}>
                      <Link href={`/wiki/${a.slug}`}>{a.title}</Link>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="wiki-home-section">
              <h3>Places</h3>
              <ul>
                {articles
                  .filter((a) => a.type === "location")
                  .map((a) => (
                    <li key={a.slug}>
                      <Link href={`/wiki/${a.slug}`}>{a.title}</Link>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="wiki-home-section">
              <h3>Organizations</h3>
              <ul>
                {articles
                  .filter((a) => a.type === "organization")
                  .map((a) => (
                    <li key={a.slug}>
                      <Link href={`/wiki/${a.slug}`}>{a.title}</Link>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="wiki-home-section">
              <h3>Events and History</h3>
              <ul>
                {articles
                  .filter((a) => a.type === "event" || a.type === "culture")
                  .map((a) => (
                    <li key={a.slug}>
                      <Link href={`/wiki/${a.slug}`}>{a.title}</Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
