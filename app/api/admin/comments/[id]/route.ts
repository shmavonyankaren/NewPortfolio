import { Insight } from "@/lib/models/Insight";
import { contentAPI } from "@/lib/content/api";

export const GET = contentAPI(Insight, { ...{ item: true, ordered: true }, method: "GET" });
export const PUT = contentAPI(Insight, { ...{ item: true, ordered: true }, method: "PUT" });
export const DELETE = contentAPI(Insight, { ...{ item: true, ordered: true }, method: "DELETE" });
export const PATCH = contentAPI(Insight, { ...{ item: true, ordered: true }, method: "PATCH" });
