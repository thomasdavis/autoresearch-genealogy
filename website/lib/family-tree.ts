import { getRawContent } from "./markdown";
import type { TreePerson, TimelineEvent, Person, FamilyGroup } from "./types";

function parseDateStr(
  dateStr: string | undefined
): { date: string; year: number } | null {
  if (!dateStr) return null;
  // Handle formats like "3/9/1883", "26 Aug 1913", "10 Mar 1977", "1989", "abt 1790", "24 Jul 1918"
  const cleaned = dateStr.replace(/^abt\s+/i, "~").trim();

  // Try to extract a 4-digit year
  const yearMatch = cleaned.match(/(\d{4})/);
  if (yearMatch) {
    return { date: cleaned, year: parseInt(yearMatch[1]) };
  }
  return null;
}

function parsePersonFromLine(line: string): Omit<TreePerson, "children"> | null {
  // Match patterns like "Name (b. date; d. date, place)" or "Name (b. date)"
  // Also handle lines with just names or partial info
  const trimmed = line.replace(/^[|`\-\s]+/, "").trim();
  if (!trimmed) return null;

  // Match: Name (details)
  const match = trimmed.match(/^(.+?)\s*\((.+)\)\s*$/);
  if (!match) {
    // Just a name
    return {
      name: trimmed.replace(/[?]$/, "").trim(),
      confidence: trimmed.includes("?") ? "speculative" : "moderate",
      depth: 0,
    };
  }

  const name = match[1].trim();
  const details = match[2];

  let birthDate: string | undefined;
  let birthPlace: string | undefined;
  let deathDate: string | undefined;
  let deathPlace: string | undefined;
  let notes: string | undefined;
  let confidence: "strong" | "moderate" | "speculative" = "moderate";

  // Parse birth
  const birthMatch = details.match(
    /b\.\s*([^;)]+?)(?:\s*[;)]|$)/
  );
  if (birthMatch) {
    const birthStr = birthMatch[1].trim();
    // Split on comma to separate date from place
    const parts = birthStr.split(",").map((s) => s.trim());
    if (parts.length > 1) {
      birthDate = parts[0];
      birthPlace = parts.slice(1).join(", ");
    } else {
      birthDate = parts[0];
    }
  }

  // Parse death
  const deathMatch = details.match(
    /d\.\s*([^;)]+?)(?:\s*[;)]|$)/
  );
  if (deathMatch) {
    const deathStr = deathMatch[1].trim();
    const parts = deathStr.split(",").map((s) => s.trim());
    if (parts.length > 1) {
      deathDate = parts[0];
      deathPlace = parts.slice(1).join(", ");
    } else {
      deathDate = parts[0];
    }
  }

  // Determine confidence
  if (name.includes("?") || details.includes("uncertain") || details.includes("unverified") || details.includes("no confirmed")) {
    confidence = "speculative";
  } else if (birthDate && deathDate) {
    confidence = "strong";
  } else if (birthDate || deathDate) {
    confidence = "moderate";
  }

  // Check for notes
  if (details.includes("likely") || details.includes("possible")) {
    notes = details;
    confidence = "speculative";
  }

  return {
    name: name.replace(/[?]$/, "").trim(),
    birthDate,
    birthPlace,
    deathDate,
    deathPlace,
    confidence,
    notes,
    depth: 0,
  };
}

export function parseDirectLineTree(): TreePerson | null {
  const raw = getRawContent("Family_Tree.md");
  const treeMatch = raw.match(/```text\n([\s\S]*?)```/);
  if (!treeMatch) return null;

  const lines = treeMatch[1].split("\n").filter((l) => l.trim());
  if (lines.length === 0) return null;

  // Parse root
  const rootPerson = parsePersonFromLine(lines[0]);
  if (!rootPerson) return null;

  const root: TreePerson = { ...rootPerson, children: [] };
  const stack: { person: TreePerson; indent: number }[] = [
    { person: root, indent: -1 },
  ];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const indent = line.search(/[^ |`]/);
    const parsed = parsePersonFromLine(line);
    if (!parsed) continue;

    const person: TreePerson = { ...parsed, children: [] };

    // Find parent in stack
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    const parent = stack[stack.length - 1].person;
    parent.children.push(person);
    person.depth = stack.length;
    stack.push({ person, indent });
  }

  return root;
}

export function extractAllPersons(): Person[] {
  const raw = getRawContent("Family_Tree.md");
  const persons: Map<string, Person> = new Map();

  // Extract from all sections - match person patterns
  // Strategy: find all "(b. ...)" blocks and take the name before them
  // Use a broad regex that captures everything before "(b."
  const allMatches = raw.matchAll(
    /([A-Z][A-Za-z \u2019'/.()]+?)\s*\(b\.\s*([^;)]+?)(?:;\s*d\.\s*([^)]+?))?\)/g
  );
  for (const match of allMatches) {
      const rawName = match[1].trim();
      // Clean up: remove leading non-alpha chars, trailing punctuation
      const name = rawName
        .replace(/^[^A-Za-z]+/, "")
        .replace(/[,;:\s]+$/, "")
        .trim();
      if (name.length < 3) continue;
      if (/^(GED|Source|Additional|Possible|User|OCR|PDF|This)/.test(name)) continue;
      // Skip if it looks like a sentence fragment rather than a name
      if (name.split(" ").length > 6) continue;

      const birthStr = match[2]?.trim();
      const deathStr = match[3]?.trim();

      let birthDate: string | undefined;
      let birthPlace: string | undefined;
      let deathDate: string | undefined;
      let deathPlace: string | undefined;

      if (birthStr) {
        const parts = birthStr.split(",").map((s) => s.trim());
        birthDate = parts[0] || undefined;
        birthPlace = parts.length > 1 ? parts.slice(1).join(", ") : undefined;
      }

      if (deathStr) {
        const parts = deathStr.split(",").map((s) => s.trim());
        deathDate = parts[0] || undefined;
        deathPlace = parts.length > 1 ? parts.slice(1).join(", ") : undefined;
      }

      let confidence: "strong" | "moderate" | "speculative" = "moderate";
      if (birthDate && deathDate) confidence = "strong";
      if (name.includes("?") || name.includes("possible")) confidence = "speculative";

      if (!persons.has(name)) {
        persons.set(name, {
          name,
          birthDate,
          birthPlace,
          deathDate,
          deathPlace,
          confidence,
          relationships: [],
        });
      }
  }

  return Array.from(persons.values()).sort((a, b) => {
    const ya = a.birthDate ? parseDateStr(a.birthDate)?.year || 9999 : 9999;
    const yb = b.birthDate ? parseDateStr(b.birthDate)?.year || 9999 : 9999;
    return ya - yb;
  });
}

export function extractTimelineEvents(): TimelineEvent[] {
  const raw = getRawContent("Family_Tree.md");
  const events: TimelineEvent[] = [];

  // Extract births
  const birthPattern =
    /([A-Z][a-zA-Z\s/'()]+?)\s*\(b\.\s*([^;,)]+)/g;
  let match;
  while ((match = birthPattern.exec(raw)) !== null) {
    const person = match[1].trim();
    const dateStr = match[2].trim();
    const parsed = parseDateStr(dateStr);
    if (parsed && person.length > 2) {
      events.push({
        date: parsed.date,
        year: parsed.year,
        decade: Math.floor(parsed.year / 10) * 10,
        description: `${person} born`,
        person,
        type: "birth",
      });
    }
  }

  // Extract deaths
  const deathPattern =
    /([A-Z][a-zA-Z\s/'()]+?)\s*\([^)]*d\.\s*([^;,)]+)/g;
  while ((match = deathPattern.exec(raw)) !== null) {
    const person = match[1].trim();
    const dateStr = match[2].trim();
    const parsed = parseDateStr(dateStr);
    if (parsed && person.length > 2) {
      events.push({
        date: parsed.date,
        year: parsed.year,
        decade: Math.floor(parsed.year / 10) * 10,
        description: `${person} died`,
        person,
        type: "death",
      });
    }
  }

  // Extract marriages
  const marriagePattern = /[Mm]arried?\s+(\d{1,2}\s+\w+\s+\d{4}|\d{4})/g;
  while ((match = marriagePattern.exec(raw)) !== null) {
    const dateStr = match[1].trim();
    const parsed = parseDateStr(dateStr);
    if (parsed) {
      // Get surrounding context for the people
      const start = Math.max(0, match.index - 200);
      const context = raw.substring(start, match.index + match[0].length + 100);
      events.push({
        date: parsed.date,
        year: parsed.year,
        decade: Math.floor(parsed.year / 10) * 10,
        description: `Marriage: ${context.substring(Math.max(0, context.lastIndexOf("\n", context.length - match[0].length - 100)), context.indexOf("\n", context.length - 100)).trim().substring(0, 120)}`,
        type: "marriage",
      });
    }
  }

  // Deduplicate by person + type + year
  const seen = new Set<string>();
  const deduped = events.filter((e) => {
    const key = `${e.person || ""}-${e.type}-${e.year}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return deduped.sort((a, b) => a.year - b.year);
}

export function parseFamilyGroups(): FamilyGroup[] {
  const raw = getRawContent("Family_Tree.md");
  const groups: FamilyGroup[] = [];

  // Split by ### headers in Family Groups section
  const familyGroupsMatch = raw.match(
    /## Family Groups\n([\s\S]*?)(?=\n## [^#]|$)/
  );
  if (!familyGroupsMatch) return groups;

  const sections = familyGroupsMatch[1].split(/\n### /);

  for (const section of sections) {
    if (!section.trim()) continue;
    const lines = section.split("\n");
    const title = lines[0].trim();
    if (!title) continue;

    const members: string[] = [];
    const notes: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      if (line.startsWith("- ")) {
        const content = line.substring(2);
        if (
          content.startsWith("Additional") ||
          content.startsWith("Source-backed") ||
          content.startsWith("Possible") ||
          content.startsWith("GED")
        ) {
          notes.push(content);
        } else {
          members.push(content);
        }
      }
    }

    groups.push({
      title,
      description: `Family group: ${title}`,
      members,
      notes,
    });
  }

  return groups;
}
