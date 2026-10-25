import { Skillset } from "@/lib/models/Skillset";
import { contentAPI } from "@/lib/content/api";

export const GET = contentAPI(Skillset, { ...{ ordered: true, singleton: false }, method: "GET" });
export const POST = contentAPI(Skillset, { ...{ ordered: true, singleton: false }, method: "POST" });
export const DELETE = contentAPI(Skillset, { ...{ ordered: true, singleton: false }, method: "DELETE" });
