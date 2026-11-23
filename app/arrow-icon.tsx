export default function ArrowIcon({ direction = "external" }: { direction?: "external" | "up" | "down" }) {
  const paths = {
    external: "M4 12 12 4M4 4h8v8",
    up: "M8 13V3M3 8l5-5 5 5",
    down: "M8 3v10M3 8l5 5 5-5",
  };

  return (
    <svg className="arrow-icon" width="1em" height="1em" viewBox="0 0 16 16"
      fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={paths[direction]} />
    </svg>
  );
}
