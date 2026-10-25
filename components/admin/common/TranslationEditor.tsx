"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { contentFields, nestedFields } from "@/lib/content/localization";

export function TranslationEditor({ model, record, onChange }: { model: string; record: any; onChange: (value: any) => void }) {
  const fields = contentFields[model] || [];
  const label = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/^./, char => char.toUpperCase());
  function input(item: any, field: string, change: (value: any) => void, id: string) {
    const value = item.translations?.de?.[field] || "";
    return <div key={id} className="space-y-1">
      <label htmlFor={id} className="block font-medium">{label(field)} <span className="text-xs font-normal">{value.trim() ? "German translation" : "Missing German — English fallback"}</span></label>
      <textarea id={id} lang="de" rows={field === "content" || field.toLowerCase().includes("description") ? 5 : 2} value={value}
        onChange={event => change({ ...item, translations: { ...item.translations, de: { ...item.translations?.de, [field]: event.target.value } } })}
        className="w-full rounded border border-slate-300 bg-white p-3 text-slate-900 dark:bg-slate-900 dark:text-white dark:border-white/20" />
      <p className="whitespace-pre-wrap break-words text-sm text-slate-500 dark:text-slate-400"><span className="font-medium">English fallback: </span>{item[field] || "No English content yet"}</p>
    </div>;
  }
  return <section aria-label="German content" className="space-y-5">
    <p className="text-sm text-slate-600 dark:text-slate-300">German is optional. Empty translations use English. Images, identities, dates, URLs and order are shared; edit them in the English tab. Add, remove and reorder nested items there as well.</p>
    {fields.map(field => input(record, field, onChange, model + "-de-" + field))}
    {Object.entries(nestedFields).filter(([key]) => key !== "technologies" && record[key]?.length).map(([key, names]) => <fieldset key={key} className="space-y-4 border-t border-slate-300 pt-4 dark:border-white/20">
      <legend className="font-semibold">{label(key === "outcomeItems" ? "learningOutcomes" : key)}</legend>
      {record[key].map((item: any, index: number) => <div key={item._id || index} className="space-y-3 rounded border border-slate-200 p-3 dark:border-white/10">
        <p className="text-sm font-semibold">{label(key)} {index + 1}</p>
        {names.filter(field => field in item).map(field => input(item, field, value => onChange({ ...record, [key]: record[key].map((old: any, i: number) => i === index ? value : old) }), `${model}-${key}-${item._id || index}-${field}`))}
      </div>)}
    </fieldset>)}
  </section>;
}
