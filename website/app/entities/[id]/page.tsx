import { getEntity } from "../../../lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

function ConfidenceTag({ confidence }: { confidence: string }) {
  const style = confidence === 'strong'
    ? 'bg-green-50 border-green-200 text-green-700'
    : confidence === 'moderate'
    ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
    : 'bg-red-50 border-red-200 text-red-700';
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap ${style}`}>
      {confidence}
    </span>
  );
}

function Section({ title, count, children }: { title: string; count?: number; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-serif text-xl sm:text-2xl font-bold mb-3 border-b border-parchment-dark pb-2 flex items-center gap-2">
        {title}
        {count !== undefined && (
          <span className="text-sm font-normal text-ink-light">({count})</span>
        )}
      </h2>
      {children}
    </section>
  );
}

export default async function EntityPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const entity = await getEntity(id);

  if (!entity) {
    notFound();
  }

  const metadata = typeof entity.metadata === 'string' ? (() => { try { return JSON.parse(entity.metadata); } catch { return {}; } })() : entity.metadata;

  return (
    <div className="container mx-auto py-4 sm:py-10 px-3 sm:px-4 max-w-6xl">
      <header className="mb-6 sm:mb-10">
        <div className="flex items-center gap-2 text-accent mb-2 text-xs sm:text-sm flex-wrap">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/graph" className="hover:underline">Knowledge Graph</Link>
          <span>/</span>
          <span className="text-ink-light uppercase tracking-wider">{entity.type}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink mb-2 break-words">
          {entity.canonical_name}
        </h1>
        <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
          <span className="px-3 py-1 bg-parchment-dark rounded-full text-xs font-bold uppercase tracking-wider text-ink-light">
            {entity.type}
          </span>
          <span className="text-xs sm:text-sm text-ink-light italic break-all">
            ID: {entity.id}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-2">

          {/* Aliases */}
          {entity.aliases && entity.aliases.length > 0 && (
            <Section title="Known Names" count={entity.aliases.length}>
              <div className="bg-white rounded-lg border border-parchment-dark p-4 shadow-sm">
                <div className="flex flex-wrap gap-2">
                  {entity.aliases.map((a: any, i: number) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-parchment/50 rounded text-sm border border-parchment-dark/30">
                      {a.name_form}
                      {a.year && <span className="text-[10px] text-ink-light">({a.year})</span>}
                      {a.location && <span className="text-[10px] text-ink-light italic">{a.location}</span>}
                    </span>
                  ))}
                </div>
              </div>
            </Section>
          )}

          {/* Claims */}
          <Section title="Claims and Facts" count={entity.claims?.length}>
            <div className="bg-white rounded-lg border border-parchment-dark overflow-hidden divide-y divide-parchment-dark shadow-sm">
              {entity.claims && entity.claims.length > 0 ? (
                entity.claims.map((claim: any) => (
                  <div key={claim.id} className="p-4 sm:p-5">
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-accent">
                        {claim.predicate.replace(/_/g, ' ')}
                      </span>
                      <ConfidenceTag confidence={claim.confidence} />
                    </div>
                    <div className="text-base sm:text-lg mb-2 break-words">
                      {claim.object_entity_id ? (
                        <Link href={`/entities/${claim.object_entity_id}`} className="text-accent hover:underline">
                          {claim.object_value}
                        </Link>
                      ) : (
                        <span>{claim.object_value}</span>
                      )}
                    </div>
                    {claim.text_span && (
                      <blockquote className="text-xs sm:text-sm text-ink-light italic bg-parchment/30 p-2 sm:p-3 rounded border-l-2 border-parchment-dark break-words">
                        &ldquo;{claim.text_span}&rdquo;
                      </blockquote>
                    )}
                    {claim.source_id && (
                      <div className="text-[10px] text-ink-light mt-1 uppercase tracking-wider">
                        Source: {claim.source_id}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-5 text-ink-light italic text-center">No explicit claims recorded.</div>
              )}
            </div>
          </Section>

          {/* Reverse Claims (claims about this entity from others) */}
          {entity.reverseClaims && entity.reverseClaims.length > 0 && (
            <Section title="Referenced By" count={entity.reverseClaims.length}>
              <div className="bg-white rounded-lg border border-parchment-dark overflow-hidden divide-y divide-parchment-dark shadow-sm">
                {entity.reverseClaims.map((rc: any) => (
                  <div key={rc.id} className="p-4">
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <div className="text-xs">
                        <Link href={`/entities/${rc.subject_id}`} className="text-accent hover:underline font-bold">
                          {rc.subject_name}
                        </Link>
                        <span className="text-ink-light"> ({rc.subject_type})</span>
                      </div>
                      <ConfidenceTag confidence={rc.confidence} />
                    </div>
                    <div className="text-sm">
                      <span className="text-ink-light uppercase text-xs tracking-wider">{rc.predicate.replace(/_/g, ' ')}</span>
                      {rc.object_value && <span className="ml-2">{rc.object_value}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Events */}
          <Section title="Events" count={entity.events?.length}>
            <div className="space-y-3">
              {entity.events && entity.events.length > 0 ? (
                entity.events.map((event: any) => (
                  <div key={event.id} className="bg-white p-4 sm:p-5 rounded-lg border border-parchment-dark shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center flex-shrink-0 pt-1">
                        <div className="w-3 h-3 rounded-full bg-accent"></div>
                        <div className="w-px h-full bg-parchment-dark mt-1"></div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-accent mb-1">{event.date_value || 'Undated'}</div>
                        <div className="text-base sm:text-lg font-bold mb-1 capitalize">{event.type.replace(/_/g, ' ')}</div>
                        <p className="text-ink-light text-sm break-words">{event.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-5 text-ink-light italic bg-white rounded-lg border border-parchment-dark text-center">No events recorded.</div>
              )}
            </div>
          </Section>

          {/* Discrepancies */}
          {entity.discrepancies && entity.discrepancies.length > 0 && (
            <Section title="Discrepancies" count={entity.discrepancies.length}>
              <div className="space-y-3">
                {entity.discrepancies.map((d: any) => (
                  <div key={d.id} className="bg-red-50/50 p-4 rounded-lg border border-red-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-red-700">
                        {d.predicate?.replace(/_/g, ' ') || d.claim_a_predicate?.replace(/_/g, ' ')}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        d.status === 'open' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'
                      }`}>
                        {d.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="p-2 bg-white rounded border border-red-100">
                        <div className="text-[10px] text-ink-light uppercase mb-1">Claim A [{d.claim_a_confidence}]</div>
                        <div>{d.claim_a_value}</div>
                      </div>
                      <div className="p-2 bg-white rounded border border-red-100">
                        <div className="text-[10px] text-ink-light uppercase mb-1">Claim B [{d.claim_b_confidence}]</div>
                        <div>{d.claim_b_value}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Connections */}
          <Section title="Connections" count={entity.relationships?.length}>
            <div className="bg-white rounded-lg border border-parchment-dark overflow-hidden divide-y divide-parchment-dark shadow-sm max-h-[60vh] overflow-y-auto">
              {entity.relationships && entity.relationships.length > 0 ? (
                entity.relationships.map((rel: any, i: number) => (
                  <Link
                    key={`${rel.id}-${i}`}
                    href={`/entities/${rel.other_id}`}
                    className="block p-3 sm:p-4 hover:bg-parchment/30 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="text-[10px] font-bold text-ink-light uppercase tracking-tighter">
                        {rel.type.replace(/_/g, ' ')}
                      </div>
                      <ConfidenceTag confidence={rel.confidence} />
                    </div>
                    <div className="font-bold text-accent text-sm truncate">
                      {rel.other_name}
                    </div>
                    {rel.other_type && (
                      <div className="text-[10px] text-ink-light mt-0.5 capitalize">{rel.other_type}</div>
                    )}
                  </Link>
                ))
              ) : (
                <div className="p-4 text-ink-light italic text-sm">No direct relationships.</div>
              )}
            </div>
          </Section>

          {/* Sources */}
          {entity.sources && entity.sources.length > 0 && (
            <Section title="Sources" count={entity.sources.length}>
              <div className="bg-white rounded-lg border border-parchment-dark overflow-hidden divide-y divide-parchment-dark shadow-sm">
                {entity.sources.map((src: any) => (
                  <div key={src.id} className="p-3">
                    <div className="font-bold text-sm break-words">{src.name}</div>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {src.tier && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-parchment/50 border border-parchment-dark/30 uppercase">{src.tier}</span>
                      )}
                      {src.repository && (
                        <span className="text-[10px] text-ink-light">{src.repository}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Metadata */}
          {metadata && Object.keys(metadata).length > 0 && (
            <Section title="Metadata">
              <div className="bg-white p-4 rounded-lg border border-parchment-dark shadow-sm">
                <div className="text-xs space-y-2 overflow-auto max-h-96">
                  {Object.entries(metadata).map(([key, value]: [string, any]) => (
                    <div key={key}>
                      <div className="font-bold uppercase tracking-widest text-[9px] text-ink-light mb-0.5">{key}</div>
                      <pre className="bg-parchment/30 p-2 border border-parchment-dark/30 rounded overflow-auto text-[11px] break-words whitespace-pre-wrap">
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          )}

          {/* Quick Actions */}
          <div className="bg-parchment/30 p-4 rounded-lg border border-parchment-dark">
            <h3 className="font-bold text-sm mb-2">Actions</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/graph"
                className="text-xs text-center px-3 py-2 bg-accent text-white rounded hover:bg-accent-light transition-colors"
              >
                Back to Graph
              </Link>
              <button
                onClick={undefined}
                className="text-xs text-center px-3 py-2 border border-parchment-dark rounded text-ink-light hover:bg-parchment-dark/20 transition-colors cursor-pointer"
              >
                Copy Entity ID
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
