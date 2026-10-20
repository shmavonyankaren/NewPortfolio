"use client";

import { Children, useId, useRef, useState, type ReactNode } from "react";
import useDragPreview from "./useDragPreview";
import { GripVertical } from "lucide-react";

type Item = { _id?: string };
export default function ReorderableList({ items, endpoint, disabled, onReordered, children, editingId, editForm }: {
  items: Item[];
  editingId?: string | null;
  editForm?: ReactNode;
  endpoint: string;
  disabled: boolean;
  onReordered: () => Promise<void>;
  children: ReactNode;
}) {
  const scope = useId();
  const busy = useRef(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const locked = disabled || saving;
  const cards = Children.toArray(children);

  const preview = useDragPreview(items.length, locked, (from, to) => {
    const id = items[from]?._id;
    if (id) void move(id, to);
  });

  async function move(id: string, index: number) {
    const previous = items.findIndex(item => item._id === id);
    if (busy.current || disabled || previous < 0 || index < 0 || index >= items.length || previous === index) return;
    busy.current = true;
    setSaving(true);
    setError("");
    setMessage("Saving order...");
    try {
      const response = await fetch(endpoint + "/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: index + 1, expectedIds: items.map(item => item._id) }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 409) await onReordered();
        throw new Error(result.error || "Could not save the new order.");
      }
      await onReordered();
      setMessage("Order saved. Moved to position " + (index + 1) + ".");
    } catch (error) {
      setMessage("");
      setError(error instanceof Error ? error.message : "Could not save the new order.");
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3" aria-busy={saving}>
      <p id={scope + "-help"} className="text-sm text-slate-500 dark:text-slate-400">
        Drag a card using its handle to change the order. You can also focus a handle and use the arrow keys.
      </p>
      <p role="status" aria-live="polite" className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
      {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <div ref={preview.container} className="flex flex-col gap-4">
        {items.map((item, index) => (
          <div key={item._id ?? index} data-reorder-id={item._id} data-reorder-scope={scope} style={{ order: preview.positions[index] }}
            className={"relative rounded-lg border-2 transition-colors " +
              (preview.active === index ? "border-purple-500 bg-purple-500/10 shadow-lg ring-2 ring-purple-500/30" : "border-transparent")}>
            <div className="flex items-center gap-2 pb-1 text-xs text-slate-500 dark:text-slate-400">
              <button type="button" disabled={locked || !item._id || items.length < 2}
                aria-label={"Move item at position " + (index + 1)}
                aria-describedby={scope + "-help"}
                className="touch-none rounded p-2 cursor-grab active:cursor-grabbing disabled:cursor-default disabled:opacity-40 hover:bg-purple-500/10 focus-visible:outline-2 focus-visible:outline-purple-500"
                onPointerDown={event => { setError(""); preview.start(event, index); }}
                onPointerMove={preview.track} onPointerUp={preview.finish} onPointerCancel={preview.cancel} onLostPointerCapture={preview.cancel}
                onKeyDown={event => {
                  if (event.key === "Escape") { preview.cancel(); return; }
                  const destination = event.key === "ArrowUp" ? index - 1 : event.key === "ArrowDown" ? index + 1 :
                    event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : null;
                  if (destination !== null && item._id) { event.preventDefault(); void move(item._id, destination); }
                }}>
                <GripVertical size={18} aria-hidden="true" />
              </button>
              <span>Position {preview.positions[index] + 1}</span>
              {preview.active === index && <span role="status" className="text-purple-600 dark:text-purple-300">Release to place at position {preview.positions[index] + 1}</span>}
            </div>
            <fieldset disabled={saving} className={"min-w-0 " + (saving ? "pointer-events-none opacity-60" : "")}>
              {item._id === editingId ? editForm : cards[index]}
            </fieldset>
          </div>
        ))}
      </div>
    </div>
  );
}
