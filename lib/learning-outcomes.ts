/** Validate without coercing malformed input or changing the entered order. */
export function normalizeLearningOutcomes(value: unknown): string[] {
  if (!Array.isArray(value) || !value.every(item => typeof item === "string")) {
    throw new Error("Learning outcomes must be an array of strings.");
  }
  return value.map(item => item.trim()).filter(Boolean);
}
