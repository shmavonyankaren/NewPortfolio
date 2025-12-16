"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect, useRef } from "react";

function createWidget() {
  return Sentry.getFeedback()?.createWidget();
}

function useFeedbackWidget(shouldMount: boolean) {
  const widgetRef = useRef<ReturnType<typeof createWidget> | null>(null);

  useEffect(() => {
    if (shouldMount) {
      if (!widgetRef.current) {
        widgetRef.current = createWidget() ?? null;
      }
    } else if (widgetRef.current) {
      widgetRef.current.removeFromDom();
      widgetRef.current = null;
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.removeFromDom();
        widgetRef.current = null;
      }
    };
  }, [shouldMount]);
}

export default function SentryFeedbackWidget() {
  useFeedbackWidget(true);

  return null;
}
