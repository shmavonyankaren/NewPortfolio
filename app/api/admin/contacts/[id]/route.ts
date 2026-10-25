import { Contact } from "@/lib/models/Contact";
import { contentAPI } from "@/lib/content/api";

export const GET = contentAPI(Contact, { ...{ item: true, ordered: false }, method: "GET" });
export const PUT = contentAPI(Contact, { ...{ item: true, ordered: false }, method: "PUT" });
export const DELETE = contentAPI(Contact, { ...{ item: true, ordered: false }, method: "DELETE" });
