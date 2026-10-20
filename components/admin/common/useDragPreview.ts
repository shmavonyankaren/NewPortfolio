"use client";

import { useRef, useState, type PointerEvent } from "react";

// Measure the original slots once so moving rows cannot make the target oscillate.
// CSS order preserves the captured handle's DOM node throughout the drag.
export default function useDragPreview(count: number, disabled: boolean, onDrop: (from: number, to: number) => void) {
  const container = useRef<HTMLDivElement>(null);
  const drag = useRef<{ from: number; to: number; boundaries: number[] } | null>(null);
  const [preview, setPreview] = useState<{ from: number; to: number } | null>(null);
  const indices = Array.from({ length: count }, (_, index) => index);
  if (preview) indices.splice(preview.to, 0, indices.splice(preview.from, 1)[0]);

  function cancel() { drag.current = null; setPreview(null); }
  function start(event: PointerEvent<HTMLButtonElement>, from: number) {
    if (disabled || count < 2 || event.button !== 0 || !container.current) return;
    const rows = Array.from(container.current.children).map(row => row.getBoundingClientRect());
    const boundaries = rows.slice(1).map((row, index) => (rows[index].bottom + row.top) / 2 + window.scrollY);
    event.preventDefault();
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { from, to: from, boundaries };
    setPreview({ from, to: from });
  }
  function track(event: PointerEvent<HTMLButtonElement>) {
    const current = drag.current;
    if (!current) return;
    if (disabled) { cancel(); return; }
    const y = event.clientY + window.scrollY;
    const boundary = current.boundaries.findIndex(value => y < value);
    const to = boundary < 0 ? count - 1 : boundary;
    if (current.to !== to) {
      current.to = to;
      setPreview({ from: current.from, to });
    }
    if (event.clientY < 80) window.scrollBy(0, -18);
    else if (event.clientY > window.innerHeight - 80) window.scrollBy(0, 18);
  }
  function finish(event: PointerEvent<HTMLButtonElement>) {
    const current = drag.current;
    cancel();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (current && !disabled) onDrop(current.from, current.to);
  }
  return { container, active: preview?.from ?? null, destination: preview?.to ?? null,
    positions: Array.from({ length: count }, (_, index) => indices.indexOf(index)), start, track, finish, cancel };
}
