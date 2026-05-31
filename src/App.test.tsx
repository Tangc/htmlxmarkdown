import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { createMarkdownDocument } from "./domain/markdownDocument";

const englishTrustNote = "Local files stay in your browser. HTMLxMarkdown does not upload them to a backend.";
const chineseTrustNote = "本地文件只会留在浏览器里，HTMLxMarkdown 不会上传到后端。";

function getFeedbackIssueUrl() {
  const href = screen.getByRole("link", { name: /feedback|反馈/i }).getAttribute("href");
  if (!href) throw new Error("Feedback link has no href");
  return new URL(href);
}

describe("App", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
    window.localStorage.clear();
    delete window.gtag;
    delete window.dataLayer;
  });

  it("shows a clear unsupported-browser state when file access is unavailable", () => {
    render(<App fileAccessSupported={false} />);

    expect(screen.getByText("Chromium file access required")).toBeInTheDocument();
    expect(screen.getByText(/Chrome or Edge/)).toBeInTheDocument();
  });

  it("renders the tool empty state and feedback link", () => {
    render(<App fileAccessSupported feedbackUrl="https://github.com/example/htmlxmarkdown/issues" />);

    expect(screen.getByRole("button", { name: /open markdown/i })).toBeInTheDocument();
    expect(screen.getAllByText(englishTrustNote)).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "Demo video" })[0]).toHaveAttribute(
      "href",
      "/htmlxmarkdown-demo.mp4"
    );
    const feedbackUrl = getFeedbackIssueUrl();
    expect(feedbackUrl.origin).toBe("https://github.com");
    expect(feedbackUrl.pathname).toBe("/example/htmlxmarkdown/issues/new");
    expect(feedbackUrl.searchParams.get("feedback")).toContain("Current file: None");
  });

  it("uses the GitHub new issue form as the default feedback target", () => {
    render(<App fileAccessSupported />);

    const feedbackUrl = getFeedbackIssueUrl();
    expect(feedbackUrl.origin).toBe("https://github.com");
    expect(feedbackUrl.pathname).toBe("/Tangc/htmlxmarkdown/issues/new");
    expect(feedbackUrl.searchParams.get("template")).toBe("feedback.yml");
    expect(feedbackUrl.searchParams.get("feedback")).toContain("App path: /");
  });

  it("prefills feedback with the current document context", () => {
    window.history.replaceState(null, "", "/workspace?source=test#reader");
    const document = createMarkdownDocument("draft.md", "# Changed\n", { originalText: "# Original\n" });

    render(<App fileAccessSupported initialDocument={document} preferredLanguages={["zh-CN"]} />);

    const feedbackUrl = getFeedbackIssueUrl();
    const feedback = feedbackUrl.searchParams.get("feedback");
    expect(feedback).toContain("App URL: http://localhost:3000/workspace?source=test#reader");
    expect(feedback).toContain("App path: /workspace?source=test#reader");
    expect(feedback).toContain("Demo mode: no");
    expect(feedback).toContain("Current file: draft.md");
    expect(feedback).toContain("Dirty state: unsaved changes");
    expect(feedback).toContain("Language: zh-CN");
    expect(feedback).toContain(`Browser/user agent: ${window.navigator.userAgent}`);
    expect(feedbackUrl.searchParams.get("body")).toBe(feedback);
  });

  it("shows the same usage guide on first visit and from the toolbar", () => {
    const { unmount } = render(<App fileAccessSupported />);

    expect(screen.getByRole("dialog", { name: "How to use HTMLxMarkdown" })).toBeInTheDocument();
    expect(screen.getByText(/Inspired by Anthropic Claude Code engineer/)).toBeInTheDocument();
    expect(screen.getAllByText(englishTrustNote)).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "Demo video" })[0]).toHaveAttribute(
      "href",
      "/htmlxmarkdown-demo.mp4"
    );
    expect(screen.getByRole("link", { name: "Background: HTML is the new Markdown" })).toHaveAttribute(
      "href",
      "https://www.lennysnewsletter.com/p/html-is-the-new-markdown-how-anthropic"
    );
    fireEvent.click(screen.getByRole("button", { name: "Got it" }));
    expect(window.localStorage.getItem("htmlxmarkdown.guideSeen.v1")).toBe("true");

    unmount();
    render(<App fileAccessSupported />);
    expect(screen.queryByRole("dialog", { name: "How to use HTMLxMarkdown" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Usage" }));
    expect(screen.getByRole("dialog", { name: "How to use HTMLxMarkdown" })).toBeInTheDocument();
  });

  it("opens a complex sample document and restores the unopened state", () => {
    window.localStorage.setItem("htmlxmarkdown.guideSeen.v1", "true");
    window.gtag = vi.fn();
    render(<App fileAccessSupported />);

    fireEvent.click(screen.getByRole("button", { name: "Test sample" }));

    expect(screen.getByText("guizang-ppt-skill.SKILL.md")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Magazine Web Ppt" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "这个 Skill 做什么" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "核心设计原则（哲学）" })).toBeInTheDocument();
    expect(window.location.search).toBe("?demo=1");
    expect(getFeedbackIssueUrl().searchParams.get("feedback")).toContain("Demo mode: yes");
    expect(window.gtag).toHaveBeenCalledWith("event", "demo_opened", { source: "button" });
    expect(window.gtag).not.toHaveBeenCalledWith("event", "demo_opened", { source: "url" });

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.getByText("No file open")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Open a local Markdown file" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Magazine Web Ppt" })).not.toBeInTheDocument();
    expect(window.location.search).toBe("");
  });

  it("opens the complex sample immediately from the demo URL and clears only that URL state on reset", () => {
    window.history.replaceState(null, "", "/?source=share&demo=1#reader");
    window.gtag = vi.fn();

    render(<App fileAccessSupported={false} />);

    expect(screen.getByText("guizang-ppt-skill.SKILL.md")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Magazine Web Ppt" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog", { name: "How to use HTMLxMarkdown" })).not.toBeInTheDocument();
    expect(screen.queryByText("Chromium file access required")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.getByRole("heading", { name: "Chromium file access required" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Magazine Web Ppt" })).not.toBeInTheDocument();
    expect(window.location.pathname).toBe("/");
    expect(window.location.search).toBe("?source=share");
    expect(window.location.hash).toBe("#reader");
    expect(window.gtag).toHaveBeenCalledWith("event", "demo_opened", { source: "url" });
  });

  it("defaults to Simplified Chinese when the system language is Chinese", () => {
    render(<App fileAccessSupported preferredLanguages={["zh-CN"]} />);

    expect(screen.getByRole("button", { name: "打开 Markdown" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "语言" })).toHaveValue("zh-CN");
    expect(screen.getByText("打开本地 Markdown 文件")).toBeInTheDocument();
    expect(screen.getAllByText(chineseTrustNote)).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "演示视频" })[0]).toHaveAttribute("href", "/htmlxmarkdown-demo.mp4");
  });

  it("defaults to English for unknown system languages and can switch to Simplified Chinese", () => {
    render(<App fileAccessSupported preferredLanguages={["fr-FR"]} />);

    expect(screen.getByRole("button", { name: /open markdown/i })).toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox", { name: "Language" }), {
      target: { value: "zh-CN" }
    });

    expect(screen.getByRole("button", { name: "打开 Markdown" })).toBeInTheDocument();
  });

  it("opens a section editor and applies source edits back to rendered Markdown", () => {
    const document = createMarkdownDocument("demo.md", "# Title\nOld copy\n");

    render(<App fileAccessSupported initialDocument={document} />);
    fireEvent.click(screen.getByRole("button", { name: /edit section title/i }));
    fireEvent.change(screen.getByLabelText("Section Markdown source"), {
      target: { value: "# Title\nNew copy\n" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Apply section edit" }));

    expect(screen.getByText("New copy")).toBeInTheDocument();
    expect(screen.queryByText("Old copy")).not.toBeInTheDocument();
    expect(screen.getByText("Unsaved changes")).toBeInTheDocument();
  });

  it("does not execute raw script tags in Markdown content", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => undefined);
    const document = createMarkdownDocument("unsafe.md", "# Unsafe\n<script>alert('xss')</script>\n");

    render(<App fileAccessSupported initialDocument={document} />);

    expect(alertSpy).not.toHaveBeenCalled();
    expect(screen.queryByText("alert('xss')")).not.toBeInTheDocument();
    alertSpy.mockRestore();
  });
});
