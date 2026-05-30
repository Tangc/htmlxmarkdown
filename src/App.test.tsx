import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { createMarkdownDocument } from "./domain/markdownDocument";

describe("App", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows a clear unsupported-browser state when file access is unavailable", () => {
    render(<App fileAccessSupported={false} />);

    expect(screen.getByText("Chromium file access required")).toBeInTheDocument();
    expect(screen.getByText(/Chrome or Edge/)).toBeInTheDocument();
  });

  it("renders the tool empty state and feedback link", () => {
    render(<App fileAccessSupported feedbackUrl="https://github.com/example/htmlxmarkdown/issues" />);

    expect(screen.getByRole("button", { name: /open markdown/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /feedback/i })).toHaveAttribute(
      "href",
      "https://github.com/example/htmlxmarkdown/issues"
    );
  });

  it("uses the GitHub new issue form as the default feedback target", () => {
    render(<App fileAccessSupported />);

    expect(screen.getByRole("link", { name: /feedback/i })).toHaveAttribute(
      "href",
      "https://github.com/Tangc/htmlxmarkdown/issues/new?template=feedback.yml"
    );
  });

  it("shows the same usage guide on first visit and from the toolbar", () => {
    const { unmount } = render(<App fileAccessSupported />);

    expect(screen.getByRole("dialog", { name: "How to use HTMLxMarkdown" })).toBeInTheDocument();
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
    render(<App fileAccessSupported />);

    fireEvent.click(screen.getByRole("button", { name: "Test sample" }));

    expect(screen.getByText("sample-complex-markdown.md")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Agent Review Playbook" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Nested Decisions" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.getByText("No file open")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Open a local Markdown file" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Agent Review Playbook" })).not.toBeInTheDocument();
  });

  it("defaults to Simplified Chinese when the system language is Chinese", () => {
    render(<App fileAccessSupported preferredLanguages={["zh-CN"]} />);

    expect(screen.getByRole("button", { name: "打开 Markdown" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "语言" })).toHaveValue("zh-CN");
    expect(screen.getByText("打开本地 Markdown 文件")).toBeInTheDocument();
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
