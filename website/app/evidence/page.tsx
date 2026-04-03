import { getPageBySlug } from "../../lib/markdown";
import Link from "next/link";

export default async function EvidencePage() {
  const hardEvidence = await getPageBySlug("Davis_Rosie_Hard_Evidence_2026-03-20");
  const discrepancy = await getPageBySlug("Discrepancy_Resolution_2026-03-22");
  const synthesis = await getPageBySlug("Evidence_Synthesis_2026-03-22");
  const pairingMatrix = await getPageBySlug("Davis_Rosie_Pairing_Matrix_2026-03-20");

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-ink mb-2">
          Evidence Dashboard
        </h1>
        <p className="text-ink-light">
          Hard evidence, discrepancy resolution, and evidence synthesis for the
          Davis / Rosie research line.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-5 mb-8">
        <Link
          href="/pages/Davis_Rosie_Hard_Evidence_2026-03-20"
          className="bg-white rounded-lg p-5 shadow-sm border border-parchment-dark hover:shadow-md transition-shadow border-l-4 border-l-strong"
        >
          <h2 className="font-serif text-lg font-bold mb-2">Hard Evidence</h2>
          <p className="text-sm text-ink-light">
            Primary records, strong supporting records, and the boundary between
            proved and unproved claims.
          </p>
        </Link>

        <Link
          href="/pages/Discrepancy_Resolution_2026-03-22"
          className="bg-white rounded-lg p-5 shadow-sm border border-parchment-dark hover:shadow-md transition-shadow border-l-4 border-l-moderate"
        >
          <h2 className="font-serif text-lg font-bold mb-2">
            Discrepancy Resolution
          </h2>
          <p className="text-sm text-ink-light">
            Source-tier analysis resolving conflicts between GED data, user
            knowledge, and primary records.
          </p>
        </Link>

        {synthesis && (
          <Link
            href="/pages/Evidence_Synthesis_2026-03-22"
            className="bg-white rounded-lg p-5 shadow-sm border border-parchment-dark hover:shadow-md transition-shadow border-l-4 border-l-accent"
          >
            <h2 className="font-serif text-lg font-bold mb-2">
              Evidence Synthesis
            </h2>
            <p className="text-sm text-ink-light">
              Combined analysis bringing together all evidence threads.
            </p>
          </Link>
        )}

        {pairingMatrix && (
          <Link
            href="/pages/Davis_Rosie_Pairing_Matrix_2026-03-20"
            className="bg-white rounded-lg p-5 shadow-sm border border-parchment-dark hover:shadow-md transition-shadow border-l-4 border-l-speculative"
          >
            <h2 className="font-serif text-lg font-bold mb-2">
              Pairing Matrix
            </h2>
            <p className="text-sm text-ink-light">
              Systematic comparison of candidate Rosie identities against known
              evidence.
            </p>
          </Link>
        )}
      </div>

      {/* Hard Evidence Summary */}
      {hardEvidence && (
        <section className="mb-8">
          <h2 className="font-serif text-2xl font-bold text-ink mb-4">
            Hard Evidence Summary
          </h2>
          <div className="bg-white rounded-lg shadow-sm border border-parchment-dark p-6">
            <div
              className="prose prose-archival max-w-none font-serif prose-sm"
              dangerouslySetInnerHTML={{ __html: hardEvidence.htmlContent }}
            />
          </div>
        </section>
      )}

      {/* Discrepancy Resolution Summary */}
      {discrepancy && (
        <section>
          <h2 className="font-serif text-2xl font-bold text-ink mb-4">
            Discrepancy Resolution
          </h2>
          <div className="bg-white rounded-lg shadow-sm border border-parchment-dark p-6">
            <div
              className="prose prose-archival max-w-none font-serif prose-sm"
              dangerouslySetInnerHTML={{ __html: discrepancy.htmlContent }}
            />
          </div>
        </section>
      )}
    </div>
  );
}
