import LocaleShell from "@/components/LocaleShell";
export const metadata = {robots: {index: false, follow: false}};
export default function Layout({children}: {children: React.ReactNode}) {return <LocaleShell locale="en">{children}</LocaleShell>;}
