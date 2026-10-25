import { Project } from "@/lib/models/Project";
import { contentAPI } from "@/lib/content/api";

export const GET = contentAPI(Project, { ...{ item: true, ordered: true }, method: "GET" });
export const PUT = contentAPI(Project, { ...{ item: true, ordered: true }, method: "PUT" });
export const DELETE = contentAPI(Project, { ...{ item: true, ordered: true }, method: "DELETE" });
export const PATCH = contentAPI(Project, { ...{ item: true, ordered: true }, method: "PATCH" });
