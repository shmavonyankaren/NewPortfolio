"use client";

import { useId, useState } from "react";
import useDragPreview from "./useDragPreview";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { AdminSaveButton } from "./AdminForm";
import FileUploader from "../FileUploader";

type Field<T> = { key: keyof T & string; label: string; kind?: "textarea" | "image"; required?: boolean };

export default function NestedItemsEditor<T extends object>({ title, singular, items, fields, onChange, onEditingChange }: {
  title: string;
  singular: string;
  items: T[];
  fields: Field<T>[];
  onChange: (items: T[]) => void;
  onEditingChange: (editing: boolean) => void;
}) {
  const scope = useId();
  const [draft, setDraft] = useState<T | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const inputClass = "w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/20 dark:bg-slate-900 dark:text-white";
  const buttonClass = "rounded px-3 py-2 text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed";

  function open(index: number | null) {
    setEditing(index);
    setDraft(index === null ? Object.fromEntries(fields.map(field => [field.key, ""])) as T : { ...items[index] });
    onEditingChange(true);
  }
  function close() {
    setDraft(null);
    setEditing(null);
    onEditingChange(false);
  }
  const valid = draft !== null && fields.every(field => !field.required || String(draft[field.key] ?? "").trim());
  function save() {
    if (!draft || !valid) return;
    // Preserve identifiers and fields outside this editor when updating an item.
    const next = { ...draft };
    for (const field of fields) next[field.key] = String(draft[field.key] ?? "").trim() as T[typeof field.key];
    onChange(editing === null ? [...items, next] : items.map((item, index) => index === editing ? next : item));
    close();
  }
  function move(from: number, to: number) {
    if (draft || from === to || to < 0 || to >= items.length) return;
    const next = [...items];
    next.splice(to, 0, next.splice(from, 1)[0]);
    onChange(next);
    setMessage(singular + " moved to position " + (to + 1) + ". Save the record to keep this order.");
  }
  const { container, active, positions, start, track, finish, cancel } = useDragPreview(items.length, draft !== null, move);

  return <section aria-label={title} className="space-y-3 border-t border-slate-300 pt-4 dark:border-white/10">
    <div className="flex items-center justify-between gap-2">
      <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h4>
      <button type="button" disabled={draft !== null} onClick={() => open(null)} className={buttonClass + " bg-purple-600 hover:bg-purple-700"}>+ Add {singular}</button>
    </div>
    <p id={scope + "-help"} className="text-sm text-slate-500 dark:text-slate-400">Drag a handle to reorder, or focus it and use the arrow keys. Save the record to keep your changes.</p>
    <p role="status" className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
    {draft !== null && <div className="space-y-3 rounded border border-purple-400 bg-slate-50 p-4 dark:bg-white/5">
      <h5 className="font-semibold">{editing === null ? "Add" : "Edit"} {singular}</h5>
      {fields.map((field, index) => <div key={field.key} className="space-y-1">
        <label htmlFor={scope + "-" + field.key} className="block text-sm font-medium">{field.label}{field.required ? " *" : " (Optional)"}</label>
        {field.kind === "image" ? <FileUploader imageUrl={String(draft[field.key] ?? "")} onFieldChange={value => setDraft(current => current && ({ ...current, [field.key]: value }))} />
          : field.kind === "textarea" ? <textarea id={scope + "-" + field.key} autoFocus={index === 0} rows={3} required={field.required} className={inputClass} value={String(draft[field.key] ?? "")} onChange={event => setDraft({ ...draft, [field.key]: event.target.value })} />
          : <input id={scope + "-" + field.key} autoFocus={index === 0} required={field.required} className={inputClass} value={String(draft[field.key] ?? "")} onChange={event => setDraft({ ...draft, [field.key]: event.target.value })} />}
      </div>)}
      <div className="flex gap-2">
        <AdminSaveButton type="button" disabled={!valid} onClick={save} className={buttonClass + " bg-green-600 hover:bg-green-700"}>Save {singular}</AdminSaveButton>
        <button type="button" onClick={close} className={buttonClass + " bg-gray-600 hover:bg-gray-700"}>Cancel</button>
      </div>
    </div>}
    <div ref={container} className="flex flex-col gap-2">
      {items.map((item, index) => <div key={index} data-nested-index={index} data-nested-scope={scope} style={{ order: positions[index] }}
        className={"flex items-start gap-2 rounded border-2 p-3 bg-slate-50 dark:bg-white/5 " + (active === index ? "border-purple-500 shadow-lg ring-2 ring-purple-500/30" : "border-transparent")}>
        <button type="button" disabled={draft !== null || items.length < 2}
          aria-label={"Move " + singular.toLowerCase() + " at position " + (index + 1)} aria-describedby={scope + "-help"}
          className="touch-none cursor-grab rounded p-2 active:cursor-grabbing disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-purple-500"
          onPointerDown={event => start(event, index)} onPointerMove={track} onPointerUp={finish} onPointerCancel={cancel} onLostPointerCapture={cancel}
          onKeyDown={event => {
            if (event.key === "Escape") { cancel(); return; }
            const to = event.key === "ArrowUp" ? index - 1 : event.key === "ArrowDown" ? index + 1 : event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : null;
            if (to !== null) {
              event.preventDefault();
              move(index, to);
              const row = event.currentTarget.parentElement?.parentElement?.children[to];
              row?.querySelector<HTMLButtonElement>("button")?.focus();
            }
          }}><GripVertical size={18} /></button>
        <div className="min-w-0 flex-1 space-y-1 break-words">
          {active === index && <p role="status" className="text-xs font-semibold text-purple-600 dark:text-purple-300">Release to place at position {positions[index] + 1}</p>}
          {fields.map(field => item[field.key] ? <p key={field.key} className="whitespace-pre-wrap text-sm text-slate-900 dark:text-white">
            {field.kind === "image" ? "Icon uploaded" : <>{fields.filter(f => f.kind !== "image").length > 1 && <span className="font-semibold">{field.label}: </span>}{String(item[field.key])}</>}
          </p> : null)}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={draft !== null} onClick={() => open(index)} aria-label={"Edit " + singular.toLowerCase() + " at position " + (index + 1)} className={buttonClass + " flex items-center gap-1 bg-blue-600 hover:bg-blue-700"}><Pencil size={16} />Edit</button>
          <button type="button" disabled={draft !== null} onClick={() => onChange(items.filter((_, i) => i !== index))} aria-label={"Delete " + singular.toLowerCase() + " at position " + (index + 1)} className={buttonClass + " bg-red-600 hover:bg-red-700"}><Trash2 size={16} /></button>
        </div>
      </div>)}
    </div>
  </section>;
}
