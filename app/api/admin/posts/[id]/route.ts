import BlogPost from "@/lib/models/BlogPost";
import { contentAPI } from "@/lib/content/api";

export const GET = contentAPI(BlogPost, { ...{ item: true, ordered: true }, method: "GET" });
export const PUT = contentAPI(BlogPost, { ...{ item: true, ordered: true }, method: "PUT" });
export const DELETE = contentAPI(BlogPost, { ...{ item: true, ordered: true }, method: "DELETE" });
export const PATCH = contentAPI(BlogPost, { ...{ item: true, ordered: true }, method: "PATCH" });
