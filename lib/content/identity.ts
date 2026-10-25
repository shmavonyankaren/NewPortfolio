export function newItemId() { return crypto.randomUUID().replaceAll("-", "").slice(0, 24); }
