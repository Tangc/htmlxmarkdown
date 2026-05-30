import { describe, expect, it } from "vitest";
import { parseMarkdownBlocks, replaceBlockSource } from "./markdownBlocks";

describe("parseMarkdownBlocks", () => {
  it("extracts frontmatter, intro text, and nested heading sections with stable source ranges", () => {
    const markdown = [
      "---",
      "title: Demo",
      "---",
      "",
      "Intro paragraph.",
      "",
      "# First",
      "Body",
      "",
      "## Child",
      "- item",
      "",
      "# Second",
      "Tail",
      ""
    ].join("\n");

    const blocks = parseMarkdownBlocks(markdown);

    expect(blocks.map((block) => [block.type, block.title, block.depth, block.source])).toEqual([
      ["frontmatter", "Frontmatter", 0, "---\ntitle: Demo\n---\n\n"],
      ["intro", "Introduction", 0, "Intro paragraph.\n\n"],
      ["heading", "First", 1, "# First\nBody\n\n"],
      ["heading", "Child", 2, "## Child\n- item\n\n"],
      ["heading", "Second", 1, "# Second\nTail\n"]
    ]);
  });

  it("does not treat headings inside fenced code blocks as sections", () => {
    const markdown = [
      "# Real",
      "",
      "```md",
      "# Not a heading",
      "```",
      "",
      "## Child",
      "Body"
    ].join("\n");

    const blocks = parseMarkdownBlocks(markdown);

    expect(blocks.map((block) => block.title)).toEqual(["Real", "Child"]);
    expect(blocks[0].source).toContain("# Not a heading");
  });

  it("keeps GFM tables and task lists inside their owning section", () => {
    const markdown = [
      "# Checklist",
      "",
      "- [ ] item",
      "",
      "| A | B |",
      "| - | - |",
      "| 1 | 2 |",
      "",
      "# Next",
      "Text"
    ].join("\n");

    const blocks = parseMarkdownBlocks(markdown);

    expect(blocks).toHaveLength(2);
    expect(blocks[0].source).toContain("- [ ] item");
    expect(blocks[0].source).toContain("| 1 | 2 |");
  });

  it("returns one editable document block when a document has no headings", () => {
    const markdown = "Plain **markdown**\n\n- item\n";

    expect(parseMarkdownBlocks(markdown)).toEqual([
      {
        id: "document-0-27",
        type: "document",
        title: "Document",
        depth: 0,
        start: 0,
        end: 27,
        source: markdown
      }
    ]);
  });
});

describe("replaceBlockSource", () => {
  it("replaces only the selected range and preserves untouched bytes", () => {
    const markdown = "# A\nold\n\n# B\nsame\n";
    const [firstBlock] = parseMarkdownBlocks(markdown);

    const next = replaceBlockSource(markdown, firstBlock, "# A\nnew\n\n");

    expect(next).toBe("# A\nnew\n\n# B\nsame\n");
  });
});
