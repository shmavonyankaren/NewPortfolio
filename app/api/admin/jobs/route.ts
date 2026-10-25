import { Job } from "@/lib/models/Job";
import { contentAPI } from "@/lib/content/api";

export const GET = contentAPI(Job, { ...{ ordered: true, singleton: false }, method: "GET" });
export const POST = contentAPI(Job, { ...{ ordered: true, singleton: false }, method: "POST" });
export const DELETE = contentAPI(Job, { ...{ ordered: true, singleton: false }, method: "DELETE" });
