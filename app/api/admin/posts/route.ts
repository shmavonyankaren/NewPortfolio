import BlogPost from "@/lib/models/BlogPost";
import { contentAPI } from "@/lib/content/api";

export const GET = contentAPI(BlogPost, { ...{ ordered: true, singleton: false }, method: "GET" });
export const POST = contentAPI(BlogPost, { ...{ ordered: true, singleton: false }, method: "POST" });
export const DELETE = contentAPI(BlogPost, { ...{ ordered: true, singleton: false }, method: "DELETE" });
