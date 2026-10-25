import { Skillset } from "@/lib/models/Skillset";
import { contentAPI } from "@/lib/content/api";

export const GET = contentAPI(Skillset, { ...{ item: true, ordered: true }, method: "GET" });
export const PUT = contentAPI(Skillset, { ...{ item: true, ordered: true }, method: "PUT" });
export const DELETE = contentAPI(Skillset, { ...{ item: true, ordered: true }, method: "DELETE" });
export const PATCH = contentAPI(Skillset, { ...{ item: true, ordered: true }, method: "PATCH" });
