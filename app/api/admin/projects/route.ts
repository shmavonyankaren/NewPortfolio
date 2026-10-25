import { Project } from "@/lib/models/Project";
import { contentAPI } from "@/lib/content/api";

export const GET = contentAPI(Project, { ...{ ordered: true, singleton: false }, method: "GET" });
export const POST = contentAPI(Project, { ...{ ordered: true, singleton: false }, method: "POST" });
export const DELETE = contentAPI(Project, { ...{ ordered: true, singleton: false }, method: "DELETE" });
