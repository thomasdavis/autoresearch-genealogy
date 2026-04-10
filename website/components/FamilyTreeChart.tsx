"use client";

import Link from "next/link";
import type { PersonData, FamilyLink } from "../lib/wiki-data";

type Props = {
  people: PersonData[];
  links: FamilyLink[];
};

type TreeNode = {
  person: PersonData;
  children: TreeNode[];
};

function getFamily(person: PersonData): "sagigi" | "doolah" | "cowley" | "other" {
  if (person.categories.some((c) => c.includes("Sagigi"))) return "sagigi";
  if (person.categories.some((c) => c.includes("Doolah"))) return "doolah";
  if (person.categories.some((c) => c.includes("Cowley"))) return "cowley";
  return "other";
}

const familyColors: Record<string, string> = {
  sagigi: "#1a5276",
  doolah: "#7b241c",
  cowley: "#1e8449",
  other: "#6c3483",
};

const familyBgs: Record<string, string> = {
  sagigi: "#d4e6f1",
  doolah: "#f2d7d5",
  cowley: "#d5f5e3",
  other: "#e8daef",
};

function PersonCard({ person }: { person: PersonData }) {
  const family = getFamily(person);
  return (
    <Link
      href={`/wiki/${person.slug}`}
      className="tree-card"
      style={{
        borderColor: familyColors[family],
        backgroundColor: familyBgs[family],
      }}
    >
      <div className="tree-card-name" style={{ color: familyColors[family] }}>
        {person.name}
      </div>
      {(person.born || person.died) && (
        <div className="tree-card-dates">
          {person.born && <span>{person.born}</span>}
          {person.born && person.died && <span> - </span>}
          {person.died && <span>{person.died}</span>}
        </div>
      )}
      {person.island && (
        <div className="tree-card-island">{person.island}</div>
      )}
    </Link>
  );
}

function TreeBranch({ node }: { node: TreeNode }) {
  return (
    <div className="tree-branch">
      <PersonCard person={node.person} />
      {node.children.length > 0 && (
        <div className="tree-children">
          <div className="tree-connector" />
          <div className="tree-children-row">
            {node.children.map((child) => (
              <TreeBranch key={child.person.slug} node={child} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FamilyTreeChart({ people, links }: Props) {
  const personMap = new Map(people.map((p) => [p.slug, p]));
  const childMap = new Map<string, string[]>();
  const allChildren = new Set<string>();

  for (const link of links) {
    const existing = childMap.get(link.parent) || [];
    existing.push(link.child);
    childMap.set(link.parent, existing);
    allChildren.add(link.child);
  }

  function buildNode(slug: string): TreeNode | null {
    const person = personMap.get(slug);
    if (!person) return null;
    const childSlugs = childMap.get(slug) || [];
    return {
      person,
      children: childSlugs
        .map(buildNode)
        .filter((n): n is TreeNode => n !== null),
    };
  }

  // Find roots (parents that are not children of anyone)
  const roots = [...childMap.keys()].filter((s) => !allChildren.has(s));
  const trees = roots.map(buildNode).filter((n): n is TreeNode => n !== null);

  // Also find orphan people (not in any link)
  const linkedSlugs = new Set([
    ...childMap.keys(),
    ...allChildren,
  ]);
  const orphans = people.filter((p) => !linkedSlugs.has(p.slug));

  return (
    <div className="family-tree-container">
      <div className="tree-legend">
        <span style={{ color: familyColors.sagigi }}>
          <span className="tree-legend-dot" style={{ background: familyBgs.sagigi, borderColor: familyColors.sagigi }} />
          Sagigi
        </span>
        <span style={{ color: familyColors.doolah }}>
          <span className="tree-legend-dot" style={{ background: familyBgs.doolah, borderColor: familyColors.doolah }} />
          Doolah
        </span>
        <span style={{ color: familyColors.cowley }}>
          <span className="tree-legend-dot" style={{ background: familyBgs.cowley, borderColor: familyColors.cowley }} />
          Cowley
        </span>
        <span style={{ color: familyColors.other }}>
          <span className="tree-legend-dot" style={{ background: familyBgs.other, borderColor: familyColors.other }} />
          Other
        </span>
      </div>
      <div className="tree-roots">
        {trees.map((tree) => (
          <TreeBranch key={tree.person.slug} node={tree} />
        ))}
      </div>
      {orphans.length > 0 && (
        <div className="tree-orphans">
          <h3>Other family members</h3>
          <div className="tree-orphans-grid">
            {orphans.map((p) => (
              <PersonCard key={p.slug} person={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
