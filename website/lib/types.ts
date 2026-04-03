export interface VaultPage {
  slug: string;
  title: string;
  content: string;
  htmlContent: string;
  frontmatter: Record<string, unknown>;
  type?: string;
  created?: string;
  updated?: string;
  tags?: string[];
}

export interface TreePerson {
  name: string;
  birthDate?: string;
  birthPlace?: string;
  deathDate?: string;
  deathPlace?: string;
  depth: number;
  confidence: "strong" | "moderate" | "speculative";
  notes?: string;
  children: TreePerson[];
}

export interface FamilyGroup {
  title: string;
  description: string;
  members: string[];
  notes: string[];
}

export interface TimelineEvent {
  date: string;
  year: number;
  decade: number;
  description: string;
  person?: string;
  type: "birth" | "death" | "marriage" | "event";
}

export interface OpenQuestion {
  id: number;
  title: string;
  priority: "high" | "medium" | "low";
  content: string;
  evidenceUpdates: string[];
  solvability?: string;
  payoff?: string;
}

export interface Person {
  name: string;
  birthDate?: string;
  birthPlace?: string;
  deathDate?: string;
  deathPlace?: string;
  confidence: "strong" | "moderate" | "speculative";
  relationships: string[];
}

export interface GoksEntity {
  id: string;
  type: string;
  canonical_name: string;
  metadata?: any;
}

export interface GoksClaim {
  id: string;
  subject_id: string;
  predicate: string;
  object_value: string;
  object_entity_id?: string;
  source_id: string;
  confidence: string;
  text_span?: string;
}

export interface GoksRelationship {
  id: string;
  type: string;
  entity_a_id: string;
  entity_b_id: string;
  other_name?: string;
  confidence: string;
}

export interface GoksEvent {
  id: string;
  type: string;
  date_value?: string;
  description?: string;
}
