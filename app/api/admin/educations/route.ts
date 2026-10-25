import { Education } from "@/lib/models/Education";
import { contentAPI } from "@/lib/content/api";

export const GET = contentAPI(Education, { ...{ ordered: true, singleton: false }, method: "GET" });
export const POST = contentAPI(Education, { ...{ ordered: true, singleton: false }, method: "POST" });
export const DELETE = contentAPI(Education, { ...{ ordered: true, singleton: false }, method: "DELETE" });
