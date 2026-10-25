"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
interface GlobalErrorProps {
  error: Error;
}

export default function GlobalError({ error }: GlobalErrorProps) {
  const german = usePathname()?.startsWith("/de") ?? false;
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang={german ? "de" : "en"}>
      <body>
        <h2>{german ? "Ein Fehler ist aufgetreten." : "Something went wrong."}</h2>
        <a href={german ? "/de" : "/en"}>{german ? "Zur Startseite" : "Go home"}</a>
      </body>
    </html>
  );
}
