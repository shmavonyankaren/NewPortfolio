// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { sub } from "motion/react-client";

Sentry.init({
  dsn: "https://b6a2da25e7c092cd41997c3e0ad42d43@o4510539863556096.ingest.de.sentry.io/4510539867422800",

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration(),
    Sentry.feedbackIntegration({
      autoInject: false,
      showBranding: false,
      isEmailRequired: true,
      // formTitle: "Report a Bug",
      // submitButtonLabel: "Send Report",
      messagePlaceholder:
        "What happened? Describe the issue you encountered...",

      // Fully customize the dark theme to match your app
      themeDark: {
        background: "linear-gradient(to right, #161a31, #06091f)", // Main app gradient background
        // backgroundHover: "#0b0433", // Slightly lighter on hover
        outline: "auto rgba(0, 0, 0, 0.1)", // Subtle white outline
        foreground: "#ffffff", // White text

        // Submit button - purple accent to match app

        // accentBackground: "#8b5cf6", // Purple accent
        // accentForeground: "#ffffff", // White text on button

        // Success/error states
        successColor: "#2da98c",
        errorColor: "#f55459",

        // Border and shadow
        // border: "1px solid rgba(255, 255, 255, 0.1)", // Subtle white border
        boxShadow: "5px 4px 24px 5px rgba(0, 0, 0, 0.2)", // Matching card shadows

        // Input styling
        // inputBackground: "#0b0433",
        // inputForeground: "#ffffff",
        // inputBorder: "1px solid rgba(255, 255, 255, 0.2)",
        // inputOutlineFocus: "1px solid #8b5cf6", // Purple focus outline
      },
    }),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
