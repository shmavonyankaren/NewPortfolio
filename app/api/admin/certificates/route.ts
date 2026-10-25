import { Certificate } from "@/lib/models/Certificate";
import { contentAPI } from "@/lib/content/api";

export const GET = contentAPI(Certificate, { ...{ ordered: true, singleton: false }, method: "GET" });
export const POST = contentAPI(Certificate, { ...{ ordered: true, singleton: false }, method: "POST" });
export const DELETE = contentAPI(Certificate, { ...{ ordered: true, singleton: false }, method: "DELETE" });
