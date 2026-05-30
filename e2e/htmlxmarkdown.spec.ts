import { expect, test, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";

async function mockFileAccess(page: Page, fileName = "demo.md", source?: string) {
  const markdownSource =
    source ??
    [
      "---",
      "title: Demo",
      "---",
      "",
      "# Overview",
      "Original copy",
      "",
      "## Table",
      "| A | B |",
      "| - | - |",
      "| 1 | 2 |",
      "",
      "<script>window.__htmlxXss = true</script>",
      ""
    ].join("\n");

  await page.addInitScript(
    ({ fileName: mockFileName, source: mockSource }) => {
    let savedText = "";

    const handle = {
      kind: "file",
      name: mockFileName,
      async getFile() {
        return new File([mockSource], mockFileName, { type: "text/markdown" });
      },
      async createWritable() {
        return {
          async write(text: string) {
            savedText = text;
          },
          async close() {}
        };
      }
    };

    Object.defineProperty(window, "showOpenFilePicker", {
      configurable: true,
      value: async () => [handle]
    });
    Object.defineProperty(window, "showSaveFilePicker", {
      configurable: true,
      value: async () => handle
    });
    Object.defineProperty(window, "__getHtmlxSavedText", {
      configurable: true,
      value: () => savedText
    });
    },
    { fileName, source: markdownSource }
  );
}

test("opens, edits, and saves a local Markdown file through mocked file access", async ({ page }) => {
  await mockFileAccess(page);

  await page.goto("/");
  await page.getByRole("button", { name: "Open Markdown" }).click();

  await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
  await expect(page.getByText("Original copy")).toBeVisible();
  await expect(page.getByText("window.__htmlxXss")).toHaveCount(0);
  await expect(page.evaluate(() => Boolean((window as unknown as { __htmlxXss?: boolean }).__htmlxXss))).resolves.toBe(
    false
  );

  await page.getByRole("button", { name: "Edit section Overview" }).click();
  await page.getByLabel("Section Markdown source").fill("# Overview\nNew copy\n\n");
  await page.getByRole("button", { name: "Apply section edit" }).click();
  await expect(page.getByText("New copy")).toBeVisible();
  await expect(page.getByText("Unsaved changes")).toBeVisible();

  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByText("Saved demo.md")).toBeVisible();
  await expect(page.evaluate(() => (window as unknown as { __getHtmlxSavedText: () => string }).__getHtmlxSavedText()))
    .resolves.toContain("# Overview\nNew copy\n\n## Table");
});

test("keeps the reader, TOC, and editor usable across desktop and mobile widths", async ({ page }) => {
  await mockFileAccess(page);

  await page.setViewportSize({ width: 1440, height: 920 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open Markdown" }).click();
  await page.getByRole("button", { name: "Edit section Overview" }).click();

  const desktopBoxes = await page.evaluate(() => {
    const box = (selector: string) => {
      const rect = document.querySelector(selector)?.getBoundingClientRect();
      return rect ? { left: rect.left, right: rect.right } : null;
    };
    return {
      toc: box(".toc-panel"),
      reader: box(".reader-panel"),
      editor: box(".editor-panel")
    };
  });

  expect(desktopBoxes.toc?.right ?? 0).toBeLessThanOrEqual(desktopBoxes.reader?.left ?? 0);
  expect(desktopBoxes.reader?.right ?? 0).toBeLessThanOrEqual(desktopBoxes.editor?.left ?? 0);
  await page.screenshot({ path: "artifacts/htmlxmarkdown-desktop.png", fullPage: true });

  await page.setViewportSize({ width: 390, height: 820 });
  await expect(page.getByLabel("Section Markdown source")).toBeVisible();
  await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).resolves.toBe(true);
  await page.screenshot({ path: "artifacts/htmlxmarkdown-mobile.png", fullPage: true });
});

test("lets users switch the interface to Simplified Chinese", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("button", { name: "Open Markdown" })).toBeVisible();
  await page.getByLabel("Language").selectOption("zh-CN");

  await expect(page.getByRole("button", { name: "打开 Markdown" })).toBeVisible();
  await expect(page.getByText("打开本地 Markdown 文件")).toBeVisible();
});

test("handles the Tangzhan writing workflow skill as a real long Markdown sample", async ({ page }) => {
  const source = await readFile("samples/tangzhan-writing-workflow.SKILL.md", "utf8");
  await mockFileAccess(page, "tangzhan-writing-workflow.SKILL.md", source);

  await page.setViewportSize({ width: 1440, height: 920 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open Markdown" }).click();

  await expect(page.locator(".file-name")).toHaveText("tangzhan-writing-workflow.SKILL.md");
  await expect(page.getByRole("heading", { name: "Tangzhan Writing Workflow" })).toBeVisible();
  await expect(page.locator(".toc-item")).toHaveCount(20);

  await page.getByRole("button", { name: "Edit section 1. Source Intake" }).click();
  await expect(page.getByLabel("Section Markdown source")).toContainText("source_status: success | partial | failed");
  await page.screenshot({ path: "artifacts/tangzhan-skill-sample.png", fullPage: false });

  const replacement = [
    "### 1. Source Intake",
    "",
    "Accept a real source and record whether extraction succeeded.",
    "",
    "This line was edited by the HTMLxMarkdown sample test.",
    ""
  ].join("\n");
  await page.getByLabel("Section Markdown source").fill(replacement);
  await page.getByRole("button", { name: "Apply section edit" }).click();
  await page.getByRole("button", { name: "Save", exact: true }).click();

  const savedText = await page.evaluate(() =>
    (window as unknown as { __getHtmlxSavedText: () => string }).__getHtmlxSavedText()
  );
  const blockStart = source.indexOf("### 1. Source Intake");
  const nextBlockStart = source.indexOf("### 2. Source Structuring");

  expect(blockStart).toBeGreaterThan(-1);
  expect(nextBlockStart).toBeGreaterThan(blockStart);
  expect(savedText.startsWith(source.slice(0, blockStart))).toBe(true);
  expect(savedText.endsWith(source.slice(nextBlockStart))).toBe(true);
  expect(savedText).toContain("This line was edited by the HTMLxMarkdown sample test.");
});
