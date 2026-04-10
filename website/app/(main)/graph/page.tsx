import { getGraphData, type EntityNode } from "../../../lib/db";
import GraphRenderer from "../../../components/GraphRenderer";
import Link from "next/link";

export default async function GraphPage() {
  const data = await getGraphData();

  const personCount = data.nodes.filter((n: EntityNode) => n.type === 'person').length;
  const locationCount = data.nodes.filter((n: EntityNode) => n.type === 'location').length;
  const documentCount = data.nodes.filter((n: EntityNode) => n.type === 'document').length;

  return (
    <div className="flex flex-col h-[calc(100vh-1rem)] py-2 px-2 sm:px-4">
      <header className="mb-2 sm:mb-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-accent mb-1 text-xs sm:text-sm">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span className="text-ink-light uppercase tracking-wider">Knowledge Graph</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-ink">
              GOKS Knowledge Graph
            </h1>
            <p className="text-ink-light text-xs sm:text-sm max-w-2xl leading-relaxed hidden sm:block">
              Interactive visualization of {data.nodes.length.toLocaleString()} entities and {data.links.length.toLocaleString()} connections.
              Click a node to focus, right-click for options, double-click for details.
            </p>
          </div>
          <div className="flex gap-3 sm:gap-6 text-center flex-shrink-0">
            <div>
              <div className="text-lg sm:text-2xl font-bold text-accent">{personCount.toLocaleString()}</div>
              <div className="text-[9px] sm:text-[10px] text-ink-light uppercase tracking-widest font-bold">People</div>
            </div>
            <div>
              <div className="text-lg sm:text-2xl font-bold text-accent">{locationCount.toLocaleString()}</div>
              <div className="text-[9px] sm:text-[10px] text-ink-light uppercase tracking-widest font-bold">Places</div>
            </div>
            <div>
              <div className="text-lg sm:text-2xl font-bold text-accent">{documentCount.toLocaleString()}</div>
              <div className="text-[9px] sm:text-[10px] text-ink-light uppercase tracking-widest font-bold">Documents</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0">
        <GraphRenderer data={data} />
      </div>
    </div>
  );
}
