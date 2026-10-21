"use client";

import { useId, useState } from "react";

export default function DetailBulletList({ title, items = [], onToggle }: {
  title: string;
  items?: string[];
  onToggle?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const details = items.filter(item => item.trim());
  if (!details.length) return null;
  return <section className="mt-5 space-y-3" aria-labelledby={id + "-heading"}>
    <h4 id={id + "-heading"} className="text-xs font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-300">{title}</h4>
    <ul id={id} className="list-disc pl-5 space-y-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 break-words">
      {(expanded ? details : details.slice(0, 4)).map((item, index) => <li key={index}>{item}</li>)}
    </ul>
    {details.length > 4 && <button type="button" aria-expanded={expanded} aria-controls={id}
      className="rounded text-sm font-semibold text-purple-700 dark:text-purple-300 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-500"
      onClick={() => { setExpanded(value => !value); if (onToggle) requestAnimationFrame(onToggle); }}>
      {expanded ? "Show less" : "Show more"}<span className="sr-only"> {title.toLowerCase()}</span>
    </button>}
  </section>;
}
