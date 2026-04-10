import Database from 'better-sqlite3';
import path from 'path';

// research.db is at the root of the repo
const DB_PATH = path.resolve(process.cwd(), '..', 'research.db');

let db: any = null;

export function getDb() {
  if (!db) {
    db = new Database(DB_PATH, { verbose: console.log });
  }
  return db;
}

export interface EntityNode {
  id: string;
  name: string;
  type: string;
  metadata?: any;
}

export interface RelationshipEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  confidence: string;
}

export interface GraphData {
  nodes: EntityNode[];
  links: RelationshipEdge[];
}

export function getGraphData(): GraphData {
  let sqlite;
  try {
    sqlite = getDb();
  } catch {
    return { nodes: [], links: [] };
  }
  
  const entities = sqlite.prepare('SELECT id, canonical_name as name, type, metadata FROM entities').all() as EntityNode[];
  const relationships = sqlite.prepare('SELECT id, entity_a_id as source, entity_b_id as target, type, confidence FROM relationships').all() as RelationshipEdge[];
  
  // Also include claims that link to an object_entity_id as relationships
  const claims = sqlite.prepare('SELECT id, subject_id as source, object_entity_id as target, predicate as type, confidence FROM claims WHERE object_entity_id IS NOT NULL').all() as RelationshipEdge[];
  
  const edges = [...relationships, ...claims];
  
  return {
    nodes: entities,
    links: edges,
  };
}

export function getEntity(id: string) {
  let sqlite;
  try {
    sqlite = getDb();
  } catch {
    return null;
  }
  const entity = sqlite.prepare('SELECT * FROM entities WHERE id = ?').get(id);
  if (!entity) return null;

  const claims = sqlite.prepare('SELECT * FROM claims WHERE subject_id = ? ORDER BY confidence DESC, predicate ASC').all(id);
  const relationships = sqlite.prepare(`
    SELECT r.*, e.canonical_name as other_name, e.type as other_type, e.id as other_id
    FROM relationships r
    JOIN entities e ON (CASE WHEN r.entity_a_id = ? THEN r.entity_b_id ELSE r.entity_a_id END) = e.id
    WHERE r.entity_a_id = ? OR r.entity_b_id = ?
    ORDER BY r.confidence DESC, r.type ASC
  `).all(id, id, id);

  const events = sqlite.prepare(`
    SELECT e.* FROM events e
    JOIN participants p ON e.id = p.event_id
    WHERE p.entity_id = ?
    ORDER BY e.date_value ASC
  `).all(id);

  const aliases = sqlite.prepare(`
    SELECT * FROM aliases WHERE entity_id = ? ORDER BY year ASC
  `).all(id);

  // Claims where this entity is the object (reverse claims)
  const reverseClaims = sqlite.prepare(`
    SELECT c.*, e.canonical_name as subject_name, e.type as subject_type
    FROM claims c
    JOIN entities e ON c.subject_id = e.id
    WHERE c.object_entity_id = ?
    ORDER BY c.confidence DESC
  `).all(id);

  // Discrepancies involving this entity
  const discrepancies = sqlite.prepare(`
    SELECT d.*,
      ca.predicate as claim_a_predicate, ca.object_value as claim_a_value, ca.confidence as claim_a_confidence,
      cb.predicate as claim_b_predicate, cb.object_value as claim_b_value, cb.confidence as claim_b_confidence
    FROM discrepancies d
    JOIN claims ca ON d.claim_a_id = ca.id
    JOIN claims cb ON d.claim_b_id = cb.id
    WHERE d.subject_id = ?
  `).all(id);

  // Sources that mention this entity (via claims)
  const sources = sqlite.prepare(`
    SELECT DISTINCT s.* FROM sources s
    JOIN claims c ON c.source_id = s.id
    WHERE c.subject_id = ?
    ORDER BY s.tier ASC, s.name ASC
  `).all(id);

  return {
    ...entity,
    claims,
    relationships,
    events,
    aliases,
    reverseClaims,
    discrepancies,
    sources,
  };
}
