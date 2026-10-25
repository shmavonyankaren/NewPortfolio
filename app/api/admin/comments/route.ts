import { Insight } from "@/lib/models/Insight";
import { contentAPI } from "@/lib/content/api";

export const GET = contentAPI(Insight, { ...{ ordered: true, singleton: false }, method: "GET" });
export const POST = contentAPI(Insight, { ...{ ordered: true, singleton: false }, method: "POST" });
export const DELETE = contentAPI(Insight, { ...{ ordered: true, singleton: false }, method: "DELETE" });
