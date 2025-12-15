"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
interface GlobalErrorProps {
  error: Error;
}

export default function GlobalError({ error }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <pre>{error.message}</pre>
      </body>
    </html>
  );
}
