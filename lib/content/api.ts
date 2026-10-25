/* eslint-disable @typescript-eslint/no-explicit-any */
import { isValidObjectId, type Model } from "mongoose";
import { revalidatePath, revalidateTag } from "next/cache";
import { authorizeMutation } from "../auth/admin";
import { connectDB } from "@/lib/db/connection";
import { clearOrdered, createOrdered, deleteOrdered, listOrdered, reorderOrdered, updateOrdered, OrderConflictError } from "../db/ordering";
import { mergeContent, contentFields, nestedFields } from "./localization";
import { normalizeLearningOutcomes } from "../learning-outcomes";

type Context = { params: Promise<{ id?: string }> };
function invalidate() {
  revalidateTag("portfolio", "max");
  revalidatePath("/en", "layout");
  revalidatePath("/de", "layout");
}
function validateTranslations(data: any, fields: string[]) {
  if (data.translations !== undefined) {
    mergeContent(null, { translations: data.translations });
    if (Object.keys(data.translations.de || {}).some(key => !fields.includes(key))) throw new Error("Unsupported translation field.");
  }
  for (const [key, names] of Object.entries(nestedFields)) if (data[key] !== undefined) {
    if (!Array.isArray(data[key])) throw new Error(`${key} must be an array.`);
    data[key].forEach((item: any) => { if (item && typeof item === "object") validateTranslations(item, names); });
  }
}
export function contentAPI(model: Model<any>, { item = false, singleton = false, ordered = true, method = "GET" } = {}) {
  async function handler(request = new Request("http://localhost", {method}), context?: Context) {
    if (method !== "GET") { const denied = await authorizeMutation(request); if (denied) return denied; }
    try {
      const id = item ? (await context!.params).id : undefined;
      if (item && !isValidObjectId(id)) return Response.json({ error: "Invalid item ID" }, { status: 400 });
      await connectDB();
      if (method === "GET") {
        const result = item ? await model.findById(id) : singleton ? await model.findOne({}) : ordered ? await listOrdered(model) : await model.find();
        if (item && !result) return Response.json({ error: "Not found" }, { status: 404 });
        return Response.json(result || {});
      }
      if (method === "DELETE") {
        if (item) {
          const result = ordered ? await deleteOrdered(model, id!) : await model.findByIdAndDelete(id);
          if (!result) return Response.json({ error: "Not found" }, { status: 404 });
        } else if (ordered) await clearOrdered(model); else await model.deleteMany({});
        invalidate(); return Response.json({ message: "Deleted" });
      }
      const data = await request.json();
      if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Expected a content object.");
      validateTranslations(data, contentFields[model.modelName]);
      if (data.learningOutcomes !== undefined) data.learningOutcomes = normalizeLearningOutcomes(data.learningOutcomes);
      if (method === "PATCH" && (!Number.isInteger(data.order) || data.order < 1)) throw new Error("Order must be a positive integer.");
      const translationItem = (entry: any) => entry?._id && Object.keys(entry).every(key => ["_id", "translations"].includes(key));
      const translatingOnly = Object.keys(data).every(key => key === "translations" || (key in nestedFields && Array.isArray(data[key]) && data[key].every(translationItem)));
      if (method !== "PATCH" && !translatingOnly) {
        for (const field of model.modelName === "Skillset" ? ["image"] : ["Job", "Education"].includes(model.modelName) ? ["logo"] : []) {
          if (typeof data[field] !== "string" || !data[field].trim()) throw new Error(`${field} is required.`);
        }
        for (const [key, fields] of Object.entries({features: ["title", "description"], challenges: ["challenge", "solution"]})) {
          if (data[key]?.some((entry: any) => !translationItem(entry) && fields.some(field => typeof entry[field] !== "string" || !entry[field].trim()))) throw new Error(`Complete all ${key} fields.`);
        }
      }
      let result;
      if (method === "PATCH") result = await reorderOrdered(model, id!, data.order, data.expectedIds);
      else if (singleton || !ordered) {
        const existing = singleton ? await model.findOne({}) : item ? await model.findById(id) : null;
        if (item && !existing) return Response.json({ error: "Not found" }, { status: 404 });
        result = existing || new model();
        const update = mergeContent(existing, data);
        for (const [key, value] of Object.entries(update)) if (!key.startsWith("$") && !key.includes(".") && !["_id", "createdAt", "updatedAt", "__v"].includes(key)) result.set(key, value);
        await result.save();
      } else result = item ? await updateOrdered(model, id!, data) : await createOrdered(model, data);
      if (!result) return Response.json({ error: "Not found" }, { status: 404 });
      invalidate();
      return Response.json(result, { status: method === "POST" ? 201 : 200 });
    } catch (error) {
      console.error("Content request failed", error);
      return Response.json({ error: error instanceof Error ? error.message : "Content request failed" }, { status: error instanceof OrderConflictError ? 409 : 400 });
    }
  }
  return handler;
}
