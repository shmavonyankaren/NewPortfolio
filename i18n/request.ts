import { getRequestConfig } from "next-intl/server";
export default getRequestConfig(async ({ requestLocale }) => {
 const requested = await requestLocale;
 const locale = requested === "de" ? "de" : "en";
 const english = (await import("../messages/en.json")).default;
 const selected = locale === "de" ? (await import("../messages/de.json")).default : english;
 const messages = {
  Public: {...english.Public, ...selected.Public},
  Navigation: {...english.Navigation, ...selected.Navigation},
  Feedback: {...english.Feedback, ...selected.Feedback},
 };
 return { locale, messages, timeZone: "UTC" };
});
