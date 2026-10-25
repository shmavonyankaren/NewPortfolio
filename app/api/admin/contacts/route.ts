import { Contact } from "@/lib/models/Contact";
import { contentAPI } from "@/lib/content/api";

export const GET = contentAPI(Contact, { ...{ ordered: false, singleton: false }, method: "GET" });
export const POST = contentAPI(Contact, { ...{ ordered: false, singleton: false }, method: "POST" });
export const DELETE = contentAPI(Contact, { ...{ ordered: false, singleton: false }, method: "DELETE" });
