import { describe, expect, it } from "vitest";
import {
  buildFeedbackIssueUrl,
  feedbackIssueFieldId,
  formatFeedbackContext,
  type FeedbackIssueContext
} from "./feedbackIssue";

const context: FeedbackIssueContext = {
  appPath: "/reader?demo=1#current",
  appUrl: "https://www.htmlxmarkdown.com/reader?demo=1#current",
  demoMode: true,
  dirty: true,
  fileName: "notes.md",
  language: "zh-CN",
  userAgent: "TestBrowser/1.0"
};

describe("buildFeedbackIssueUrl", () => {
  it("prefills the GitHub issue form textarea with app context", () => {
    const url = new URL(
      buildFeedbackIssueUrl("https://github.com/Tangc/htmlxmarkdown/issues/new?template=feedback.yml", context)
    );

    expect(url.origin).toBe("https://github.com");
    expect(url.pathname).toBe("/Tangc/htmlxmarkdown/issues/new");
    expect(url.searchParams.get("template")).toBe("feedback.yml");
    expect(url.searchParams.get("title")).toBe("[Feedback]: ");

    const feedback = url.searchParams.get(feedbackIssueFieldId);
    expect(feedback).toContain("App URL: https://www.htmlxmarkdown.com/reader?demo=1#current");
    expect(feedback).toContain("App path: /reader?demo=1#current");
    expect(feedback).toContain("Demo mode: yes");
    expect(feedback).toContain("Current file: notes.md");
    expect(feedback).toContain("Dirty state: unsaved changes");
    expect(feedback).toContain("Language: zh-CN");
    expect(feedback).toContain("Browser/user agent: TestBrowser/1.0");
  });

  it("adds a classic issue composer body fallback while keeping existing params", () => {
    const url = new URL(
      buildFeedbackIssueUrl(
        "https://github.com/Tangc/htmlxmarkdown/issues/new?labels=feedback&title=Custom",
        context
      )
    );

    expect(url.searchParams.get("labels")).toBe("feedback");
    expect(url.searchParams.get("title")).toBe("Custom");
    expect(url.searchParams.get("body")).toBe(url.searchParams.get(feedbackIssueFieldId));
  });

  it("turns a GitHub issues list URL into a new issue URL", () => {
    const url = new URL(buildFeedbackIssueUrl("https://github.com/Tangc/htmlxmarkdown/issues", context));

    expect(url.pathname).toBe("/Tangc/htmlxmarkdown/issues/new");
    expect(url.searchParams.get(feedbackIssueFieldId)).toContain("Current file: notes.md");
  });

  it("leaves non-URL feedback targets unchanged", () => {
    expect(buildFeedbackIssueUrl("mailto:test@example.com", context)).toBe("mailto:test@example.com");
  });
});

describe("formatFeedbackContext", () => {
  it("uses explicit empty-state labels when optional context is unavailable", () => {
    expect(
      formatFeedbackContext({
        appPath: null,
        appUrl: null,
        demoMode: false,
        dirty: false,
        fileName: null,
        language: "en",
        userAgent: null
      })
    ).toContain("Current file: None");
  });
});
