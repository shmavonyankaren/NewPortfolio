import { Education } from "@/lib/models/Education";
import { contentAPI } from "@/lib/content/api";

export const GET = contentAPI(Education, { ...{ item: true, ordered: true }, method: "GET" });
export const PUT = contentAPI(Education, { ...{ item: true, ordered: true }, method: "PUT" });
export const DELETE = contentAPI(Education, { ...{ item: true, ordered: true }, method: "DELETE" });
export const PATCH = contentAPI(Education, { ...{ item: true, ordered: true }, method: "PATCH" });
