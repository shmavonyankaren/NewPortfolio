/* eslint-disable @typescript-eslint/no-explicit-any */
export type Translations = { de?: Record<string, string> };
export type Localized = { translations?: Translations };
export type OutcomeItem = Localized & { _id: string; name: string };
export const contentFields: Record<string, string[]> = {
  GeneralInfo: ["shortAbout", "fullDescription"], Project: ["title", "shortDescription", "description", "duration"],
  Job: ["position", "description"], Education: ["degree", "field", "description"],
  Skillset: ["title"], Certificate: ["title", "description"], Insight: ["position", "insight"],
  Comment: ["position", "comment"], BlogPost: ["title", "content"], Contact: ["location"],
};
export const nestedFields: Record<string, string[]> = {
  technologies: ["name"], skills: ["name", "description"], responsibilities: ["name"],
  features: ["title", "description"], challenges: ["challenge", "solution"], outcomeItems: ["name"],
};
export const conceptualSkills: Record<string, string> = {
  "Computer Science": "Informatik", "Software Engineering": "Softwaretechnik", "Software Development": "Softwareentwicklung",
  "Distributed Systems": "Verteilte Systeme", "Algorithms": "Algorithmen", "Data Structures": "Datenstrukturen",
  "Databases": "Datenbanken", "Mathematics": "Mathematik", "Problem Solving": "Problemlösung", "Teamwork": "Teamarbeit",
};
export function resolveContent<T>(record: T, locale: string): T {
  if (!record || typeof record !== "object" || locale !== "de") return record;
  if (Array.isArray(record)) return record.map(item => resolveContent(item, locale)) as T;
  const source = record as any;
  const result = { ...source };
  for (const [key, value] of Object.entries(source.translations?.de || {})) {
    if (typeof value === "string" && value.trim()) result[key] = value;
  }
  for (const key of Object.keys(nestedFields)) if (Array.isArray(source[key])) {
    result[key] = source[key].map((item: any) => {
      // Related feature/challenge fields fall back as a unit.
      const fields = nestedFields[key];
      const complete = !["features", "challenges"].includes(key) || fields.every(field => item.translations?.de?.[field]?.trim());
      const localized = complete ? resolveContent(item, locale) : { ...item };
      if (["skills", "technologies"].includes(key) && !item.translations?.de?.name?.trim()) localized.name = conceptualSkills[item.name] || item.name;
      return localized;
    });
  }
  if (source.outcomeItems?.length) result.learningOutcomes = result.outcomeItems.map((item: any) => item.name);
  return result;
}

function plain(value: any): any { return value?.toObject ? value.toObject() : value; }
function translations(oldValue: any, incoming: any) {
  if (incoming === undefined) return oldValue;
  if (!incoming || typeof incoming !== "object" || Array.isArray(incoming) || Object.keys(incoming).some(key => key !== "de")) throw new Error("Only German translations are supported.");
  const de = incoming.de;
  if (de !== undefined && (!de || typeof de !== "object" || Array.isArray(de) || Object.values(de).some(value => typeof value !== "string"))) throw new Error("Translation values must be strings.");
  return { de: { ...plain(oldValue)?.de, ...de } };
}
export function mergeContent(existing: any, incoming: any): any {
  const previous = plain(existing) || {};
  const result = { ...incoming };
  if (incoming.translations !== undefined || previous.translations) result.translations = translations(previous.translations, incoming.translations);
  for (const key of Object.keys(nestedFields)) {
    if (incoming[key] === undefined) continue;
    if (!Array.isArray(incoming[key])) throw new Error(`${key} must be an array.`);
    const oldItems = (previous[key] || []).map(plain);
    const translatedPatch = incoming[key].length > 0 && incoming[key].every((item: any) => item._id && Object.keys(item).every(field => ["_id", "translations"].includes(field)));
    const ids = incoming[key].filter((item: any) => item?._id).map((item: any) => String(item._id));
    if (new Set(ids).size !== ids.length) throw new Error("Nested item IDs must be unique.");
    if (translatedPatch && ids.some((id: string) => !oldItems.some((old: any) => String(old._id) === id))) throw new Error("Translated item no longer exists. Refresh this record.");
    const items = translatedPatch ? oldItems.map((old: any) => ({ ...old, ...incoming[key].find((item: any) => String(item._id) === String(old._id)) })) : incoming[key];
    result[key] = items.map((raw: any) => {
      const item = typeof raw === "string" ? { name: raw } : raw;
      if (!item || typeof item !== "object") throw new Error(`Invalid ${key} item.`);
      const match = item._id ? oldItems.find((old: any) => String(old._id) === String(item._id)) : oldItems.find((old: any) => nestedFields[key].every(field => old[field] === item[field]));
      if (!item._id && !match && oldItems.some((old: any) => Object.values(old.translations?.de || {}).some(Boolean))) throw new Error("This record has translated items. Refresh before editing its structure.");
      return { ...match, ...item, ...(match?._id ? { _id: match._id } : {}), translations: translations(match?.translations, item.translations) };
    });
  }
  // Legacy string arrays remain intact. Stable companion items carry translations.
  if (incoming.outcomeItems !== undefined) result.learningOutcomes = result.outcomeItems.map((item: any) => item.name);
  else if (incoming.learningOutcomes !== undefined) {
    if (!Array.isArray(incoming.learningOutcomes) || incoming.learningOutcomes.some((value: any) => typeof value !== "string")) throw new Error("Learning outcomes must be strings.");
    const oldItems = previous.outcomeItems || [];
    result.outcomeItems = incoming.learningOutcomes.map((name: string) => {
      const match = oldItems.find((item: any) => item.name === name);
      if (!match && oldItems.some((item: any) => Object.values(item.translations?.de || {}).some(Boolean))) throw new Error("Refresh before changing translated learning outcomes.");
      return match || { name };
    });
  }
  return result;
}
