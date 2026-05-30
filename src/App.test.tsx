import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";
import { createMarkdownDocument } from "./domain/markdownDocument";

describe("App", () => {
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
