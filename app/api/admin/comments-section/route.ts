import Comment from "@/lib/models/Comment";
import { contentAPI } from "@/lib/content/api";

export const GET = contentAPI(Comment, { ...{ ordered: true, singleton: false }, method: "GET" });
export const POST = contentAPI(Comment, { ...{ ordered: true, singleton: false }, method: "POST" });
export const DELETE = contentAPI(Comment, { ...{ ordered: true, singleton: false }, method: "DELETE" });
