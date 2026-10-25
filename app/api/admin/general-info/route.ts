import GeneralInfo from "@/lib/models/GeneralInfo";
import { contentAPI } from "@/lib/content/api";

export const GET = contentAPI(GeneralInfo, { ...{ ordered: false, singleton: true }, method: "GET" });
export const POST = contentAPI(GeneralInfo, { ...{ ordered: false, singleton: true }, method: "POST" });
export const DELETE = contentAPI(GeneralInfo, { ...{ ordered: false, singleton: true }, method: "DELETE" });
export const PUT = contentAPI(GeneralInfo, { ...{ ordered: false, singleton: true }, method: "PUT" });
