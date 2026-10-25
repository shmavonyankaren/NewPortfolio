import Comment from "@/lib/models/Comment";
import { contentAPI } from "@/lib/content/api";

export const GET = contentAPI(Comment, { ...{ item: true, ordered: true }, method: "GET" });
export const PUT = contentAPI(Comment, { ...{ item: true, ordered: true }, method: "PUT" });
export const DELETE = contentAPI(Comment, { ...{ item: true, ordered: true }, method: "DELETE" });
export const PATCH = contentAPI(Comment, { ...{ item: true, ordered: true }, method: "PATCH" });
