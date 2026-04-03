export default function ConfidenceBadge({
  level,
}: {
  level: "strong" | "moderate" | "speculative";
}) {
  const styles = {
    strong: "bg-strong-bg text-strong",
    moderate: "bg-moderate-bg text-moderate",
    speculative: "bg-speculative-bg text-speculative",
  };

  const labels = {
    strong: "Strong Signal",
    moderate: "Moderate Signal",
    speculative: "Speculative",
  };

  return (
    <span
      className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${styles[level]}`}
    >
      {labels[level]}
    </span>
  );
}
