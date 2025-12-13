"use client";

// import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
interface GlobalErrorProps {
  error: React.ComponentType;
}

export default function GlobalError({ error: Error }: GlobalErrorProps) {
  //   useEffect(() => {
  //     // Sentry.captureException(error);
  //   }, []);

  return (
    <html>
      <body>
        <Error />
      </body>
    </html>
  );
}
