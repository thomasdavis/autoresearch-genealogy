import Link from "next/link";

export default function WikiHeader() {
  return (
    <header className="wiki-header">
      <div className="wiki-header-inner">
        <Link href="/wiki" className="wiki-logo">
          <div className="wiki-logo-icon">S</div>
          <div className="wiki-logo-text">
            <span className="wiki-logo-title">Sagigi Family Wiki</span>
            <span className="wiki-logo-subtitle">
              Torres Strait Islands Family Encyclopedia
            </span>
          </div>
        </Link>
        <nav className="wiki-nav">
          <Link href="/wiki">Main Page</Link>
          <Link href="/wiki#sagigi-family">Sagigi</Link>
          <Link href="/wiki#doolah-family">Doolah</Link>
          <Link href="/wiki#cowley-family">Cowley</Link>
          <Link href="/wiki#articles">Articles</Link>
        </nav>
      </div>
    </header>
  );
}
