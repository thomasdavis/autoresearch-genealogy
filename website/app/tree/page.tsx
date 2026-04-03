import { parseDirectLineTree, parseFamilyGroups } from "../../lib/family-tree";
import ConfidenceBadge from "../../components/ConfidenceBadge";
import type { TreePerson } from "../../lib/types";

function TreeNode({ person, isRoot }: { person: TreePerson; isRoot?: boolean }) {
  return (
    <div className={isRoot ? "" : "tree-node"}>
      <div className="bg-white rounded-lg p-3 mb-2 border border-parchment-dark shadow-sm inline-block max-w-lg">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-serif font-bold text-ink">{person.name}</span>
          <ConfidenceBadge level={person.confidence} />
        </div>
        <div className="text-sm text-ink-light mt-1 space-y-0.5">
          {person.birthDate && (
            <div>
              b. {person.birthDate}
              {person.birthPlace && `, ${person.birthPlace}`}
            </div>
          )}
          {person.deathDate && (
            <div>
              d. {person.deathDate}
              {person.deathPlace && `, ${person.deathPlace}`}
            </div>
          )}
          {!person.birthDate && !person.deathDate && person.notes && (
            <div className="text-xs italic">{person.notes.substring(0, 100)}</div>
          )}
        </div>
      </div>
      {person.children.length > 0 && (
        <div className="ml-2">
          {person.children.map((child, i) => (
            <TreeNode key={`${child.name}-${i}`} person={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TreePage() {
  const tree = parseDirectLineTree();
  const groups = parseFamilyGroups();

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-ink mb-2">
          Family Tree
        </h1>
        <p className="text-ink-light">
          Direct line from Thomas Alwyn Davis back through the generations.
          Color-coded by confidence level.
        </p>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-strong-bg border border-strong" />
            <span className="text-xs text-ink-light">Strong Signal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-moderate-bg border border-moderate" />
            <span className="text-xs text-ink-light">Moderate Signal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-speculative-bg border border-speculative" />
            <span className="text-xs text-ink-light">Speculative</span>
          </div>
        </div>
      </header>

      {tree ? (
        <div className="overflow-x-auto pb-8">
          <TreeNode person={tree} isRoot />
        </div>
      ) : (
        <p className="text-ink-light italic">
          Could not parse the family tree structure.
        </p>
      )}

      {/* Family Groups */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-bold text-ink mb-6">
          Family Groups
        </h2>
        <div className="space-y-6">
          {groups.map((group) => (
            <div
              key={group.title}
              className="bg-white rounded-lg p-5 shadow-sm border border-parchment-dark"
            >
              <h3 className="font-serif text-lg font-bold mb-3">
                {group.title}
              </h3>
              {group.members.length > 0 && (
                <ul className="space-y-1.5 mb-3">
                  {group.members.map((member, i) => (
                    <li key={i} className="text-sm text-ink-light">
                      {member.length > 300
                        ? member.substring(0, 300) + "..."
                        : member}
                    </li>
                  ))}
                </ul>
              )}
              {group.notes.length > 0 && (
                <details className="mt-2">
                  <summary className="text-xs text-accent cursor-pointer">
                    {group.notes.length} additional note
                    {group.notes.length !== 1 ? "s" : ""}
                  </summary>
                  <ul className="mt-2 space-y-1">
                    {group.notes.map((note, i) => (
                      <li key={i} className="text-xs text-ink-light">
                        {note.length > 300
                          ? note.substring(0, 300) + "..."
                          : note}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
