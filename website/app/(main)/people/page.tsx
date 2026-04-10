import { extractAllPersons } from "../../../lib/family-tree";
import ConfidenceBadge from "../../../components/ConfidenceBadge";

export default function PeoplePage() {
  const persons = extractAllPersons();

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-ink mb-2">People</h1>
        <p className="text-ink-light">
          {persons.length} named individuals from the family tree, sorted by
          birth date.
        </p>
      </header>

      <div className="bg-white rounded-lg shadow-sm border border-parchment-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-parchment-dark bg-parchment/50">
                <th className="text-left p-3 font-medium text-ink-light">
                  Name
                </th>
                <th className="text-left p-3 font-medium text-ink-light">
                  Born
                </th>
                <th className="text-left p-3 font-medium text-ink-light hidden md:table-cell">
                  Birth Place
                </th>
                <th className="text-left p-3 font-medium text-ink-light">
                  Died
                </th>
                <th className="text-left p-3 font-medium text-ink-light hidden md:table-cell">
                  Death Place
                </th>
                <th className="text-left p-3 font-medium text-ink-light">
                  Confidence
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-parchment-dark">
              {persons.map((person, i) => (
                <tr key={i} className="hover:bg-parchment/30 transition-colors">
                  <td className="p-3 font-serif font-medium">{person.name}</td>
                  <td className="p-3 font-mono text-xs">{person.birthDate || ""}</td>
                  <td className="p-3 text-xs text-ink-light hidden md:table-cell">
                    {person.birthPlace || ""}
                  </td>
                  <td className="p-3 font-mono text-xs">{person.deathDate || ""}</td>
                  <td className="p-3 text-xs text-ink-light hidden md:table-cell">
                    {person.deathPlace || ""}
                  </td>
                  <td className="p-3">
                    <ConfidenceBadge level={person.confidence} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
