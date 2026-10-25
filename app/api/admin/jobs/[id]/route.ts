import { Job } from "@/lib/models/Job";
import { contentAPI } from "@/lib/content/api";

export const GET = contentAPI(Job, { ...{ item: true, ordered: true }, method: "GET" });
export const PUT = contentAPI(Job, { ...{ item: true, ordered: true }, method: "PUT" });
export const DELETE = contentAPI(Job, { ...{ item: true, ordered: true }, method: "DELETE" });
export const PATCH = contentAPI(Job, { ...{ item: true, ordered: true }, method: "PATCH" });
