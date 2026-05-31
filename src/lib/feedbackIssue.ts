import type { Language } from "./i18n";

export interface FeedbackIssueContext {
  appPath: string | null;
  appUrl: string | null;
  demoMode: boolean;
  dirty: boolean;
  fileName: string | null;
  language: Language;
  userAgent: string | null;
}

export const feedbackIssueFieldId = "feedback";
const fallbackBodyParam = "body";

export function buildFeedbackIssueUrl(feedbackUrl: string, context: FeedbackIssueContext): string {
  let url: URL;

  try {
    url = new URL(feedbackUrl);
  } catch {
    return feedbackUrl;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return feedbackUrl;
  }

  if (url.hostname === "github.com" && /\/issues\/?$/.test(url.pathname)) {
    url.pathname = url.pathname.replace(/\/issues\/?$/, "/issues/new");
  }

  const contextText = formatFeedbackContext(context);

  if (!url.searchParams.has("title")) {
    url.searchParams.set("title", "[Feedback]: ");
  }

  // GitHub Issue Forms use the YAML field id as the query parameter for prefills.
  // Keep this aligned with .github/ISSUE_TEMPLATE/feedback.yml. Classic issue
  // composer URLs ignore it, so body carries the same context as a fallback.
  url.searchParams.set(feedbackIssueFieldId, contextText);
  url.searchParams.set(fallbackBodyParam, contextText);

  return url.toString();
}

export function formatFeedbackContext({
  appPath,
  appUrl,
  demoMode,
  dirty,
  fileName,
  language,
  userAgent
}: FeedbackIssueContext): string {
  return [
    "<!-- Write your feedback above. The app added the context below automatically. -->",
    "",
    "---",
    "Context",
    `- App URL: ${appUrl ?? "Unavailable"}`,
    `- App path: ${appPath ?? "Unavailable"}`,
    `- Demo mode: ${demoMode ? "yes" : "no"}`,
    `- Current file: ${fileName ?? "None"}`,
    `- Dirty state: ${dirty ? "unsaved changes" : "clean"}`,
    `- Language: ${language}`,
    `- Browser/user agent: ${userAgent ?? "Unavailable"}`
  ].join("\n");
}
