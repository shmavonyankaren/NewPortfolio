import { Certificate } from "@/lib/models/Certificate";
import { contentAPI } from "@/lib/content/api";

export const GET = contentAPI(Certificate, { ...{ item: true, ordered: true }, method: "GET" });
export const PUT = contentAPI(Certificate, { ...{ item: true, ordered: true }, method: "PUT" });
export const DELETE = contentAPI(Certificate, { ...{ item: true, ordered: true }, method: "DELETE" });
export const PATCH = contentAPI(Certificate, { ...{ item: true, ordered: true }, method: "PATCH" });
