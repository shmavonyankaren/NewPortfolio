"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";

type Widget = ReturnType<NonNullable<ReturnType<typeof Sentry.getFeedback>>["createWidget"]>;

function useFeedbackWidget(shouldMount: boolean) {
  const locale = useLocale();
  const t = useTranslations("Feedback");
  const widgetRef = useRef<Widget | null>(null);

  useEffect(() => {
    if (shouldMount) {
      if (!widgetRef.current) {
        widgetRef.current = Sentry.getFeedback()?.createWidget({
          triggerLabel: t("triggerLabel"), triggerAriaLabel: t("triggerLabel"), formTitle: t("triggerLabel"),
          cancelButtonLabel: t("cancel"), submitButtonLabel: t("submit"), confirmButtonLabel: t("confirm"),
          emailLabel: t("email"), emailPlaceholder: t("emailPlaceholder"), nameLabel: t("name"), namePlaceholder: t("namePlaceholder"),
          messageLabel: t("message"), messagePlaceholder: t("messagePlaceholder"), successMessageText: t("success"), isRequiredLabel: t("required"),
          addScreenshotButtonLabel: t("addScreenshot"), removeScreenshotButtonLabel: t("removeScreenshot"), highlightToolText: t("highlight"), hideToolText: t("hide"), removeHighlightText: t("removeHighlight"),
        }) ?? null;
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
  }, [shouldMount, locale, t]);
}

export default function SentryFeedbackWidget() {
  useFeedbackWidget(true);

  return null;
}
