import { getPageBySlug } from "../../../lib/markdown";

interface ParsedQuestion {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  content: string[];
  evidenceUpdates: string[];
}

function parseOpenQuestions(content: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  let currentPriority: "high" | "medium" | "low" = "high";

  const lines = content.split("\n");
  let currentQuestion: ParsedQuestion | null = null;
  let questionCount = 0;

  for (const line of lines) {
    // Detect priority sections
    if (line.includes("High Priority")) {
      currentPriority = "high";
      continue;
    }
    if (line.includes("Medium Priority")) {
      currentPriority = "medium";
      continue;
    }
    if (line.includes("Low Priority") || line.includes("Future Research")) {
      currentPriority = "low";
      continue;
    }

    // Detect question headers (### N. Title)
    const questionMatch = line.match(/^### (\d+)\.\s+(.+)/);
    if (questionMatch) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      questionCount++;
      currentQuestion = {
        id: questionMatch[1],
        title: questionMatch[2],
        priority: currentPriority,
        content: [],
        evidenceUpdates: [],
      };
      continue;
    }

    if (!currentQuestion) continue;

    // Detect evidence updates
    if (line.trim().startsWith("- **Evidence update**")) {
      currentQuestion.evidenceUpdates.push(
        line.trim().replace(/^- \*\*Evidence update\*\*:\s*/, "")
      );
    } else if (line.trim().startsWith("- ")) {
      currentQuestion.content.push(line.trim().substring(2));
    }
  }

  if (currentQuestion) {
    questions.push(currentQuestion);
  }

  return questions;
}

export default async function QuestionsPage() {
  const page = await getPageBySlug("Open_Questions");
  if (!page) {
    return (
      <div>
        <h1 className="font-serif text-3xl font-bold">Open Questions</h1>
        <p className="text-ink-light mt-2">Could not load Open_Questions.md</p>
      </div>
    );
  }

  const questions = parseOpenQuestions(page.content);

  const priorityStyles = {
    high: {
      border: "border-l-4 border-l-speculative",
      badge: "bg-speculative-bg text-speculative",
      label: "High Priority",
    },
    medium: {
      border: "border-l-4 border-l-moderate",
      badge: "bg-moderate-bg text-moderate",
      label: "Medium Priority",
    },
    low: {
      border: "border-l-4 border-l-strong",
      badge: "bg-strong-bg text-strong",
      label: "Low Priority",
    },
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-ink mb-2">
          Open Questions
        </h1>
        <p className="text-ink-light">
          {questions.length} unresolved research questions, organized by
          priority.
        </p>
      </header>

      <div className="space-y-5">
        {questions.map((q) => {
          const style = priorityStyles[q.priority];
          return (
            <div
              key={q.id}
              className={`bg-white rounded-lg shadow-sm border border-parchment-dark ${style.border} p-5`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h2 className="font-serif text-lg font-bold">
                  {q.id}. {q.title}
                </h2>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded flex-shrink-0 ${style.badge}`}
                >
                  {style.label}
                </span>
              </div>

              {q.content.length > 0 && (
                <ul className="space-y-1.5 mb-3">
                  {q.content.slice(0, 6).map((item, i) => (
                    <li key={i} className="text-sm text-ink-light">
                      {item.length > 250
                        ? item.substring(0, 250) + "..."
                        : item}
                    </li>
                  ))}
                </ul>
              )}

              {q.evidenceUpdates.length > 0 && (
                <details>
                  <summary className="text-sm text-accent cursor-pointer font-medium">
                    {q.evidenceUpdates.length} evidence update
                    {q.evidenceUpdates.length !== 1 ? "s" : ""}
                  </summary>
                  <ul className="mt-2 space-y-2 pl-3 border-l-2 border-parchment-dark">
                    {q.evidenceUpdates.map((update, i) => (
                      <li key={i} className="text-xs text-ink-light">
                        {update.length > 400
                          ? update.substring(0, 400) + "..."
                          : update}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
