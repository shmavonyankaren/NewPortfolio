import { Schema } from "mongoose";
import { contentFields, nestedFields } from "../content/localization";

function translationSchema(fields: string[]) {
  return new Schema({ de: { type: new Schema(Object.fromEntries(fields.map(field => [field, { type: String }])), { _id: false, strict: "throw" }), default: undefined } }, { _id: false, strict: "throw" });
}
export function addLocalization(schema: Schema, model: string) {
  schema.add({ translations: { type: translationSchema(contentFields[model]), default: undefined } });
  if (model === "Education") schema.add({ outcomeItems: { type: [new Schema({ name: { type: String, required: true } })], default: undefined } });
  for (const [key, fields] of Object.entries(nestedFields)) {
    const path = schema.path(key) as Schema.Types.DocumentArray | undefined;
    if (path?.schema) path.schema.add({ translations: { type: translationSchema(fields), default: undefined } });
  }
}
