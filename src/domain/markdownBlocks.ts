import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export type MarkdownBlockType = "frontmatter" | "intro" | "heading" | "document";

export interface MarkdownBlock {
  id: string;
  type: MarkdownBlockType;
  title: string;
  depth: number;
  start: number;
  end: number;
  source: string;
  draftSource?: string;
}

interface MarkdownLine {
  start: number;
  end: number;
  text: string;
}

interface HeadingMarker {
  start: number;
  depth: number;
  title: string;
}

interface MarkdownAstNode {
  type: string;
  depth?: number;
  value?: string;
  children?: MarkdownAstNode[];
  position?: {
    start?: {
      offset?: number;
    };
  };
}

const markdownProcessor = unified().use(remarkParse).use(remarkGfm);

export function parseMarkdownBlocks(markdown: string): MarkdownBlock[] {
  const lines = splitLines(markdown);
  const blocks: MarkdownBlock[] = [];
  const frontmatter = findFrontmatter(markdown, lines);
  const contentStart = frontmatter?.end ?? 0;

  if (frontmatter) {
    blocks.push(createBlock("frontmatter", "Frontmatter", 0, frontmatter.start, frontmatter.end, markdown));
  }

  const headings = findHeadings(markdown, contentStart);

  if (headings.length === 0) {
    if (contentStart < markdown.length) {
      blocks.push(createBlock("document", "Document", 0, contentStart, markdown.length, markdown));
    }
    return blocks.length > 0 ? blocks : [createBlock("document", "Document", 0, 0, markdown.length, markdown)];
  }

  const introEnd = headings[0].start;
  if (contentStart < introEnd && markdown.slice(contentStart, introEnd).trim().length > 0) {
    blocks.push(createBlock("intro", "Introduction", 0, contentStart, introEnd, markdown));
  }

  headings.forEach((heading, index) => {
    const end = headings[index + 1]?.start ?? markdown.length;
    blocks.push(createBlock("heading", heading.title, heading.depth, heading.start, end, markdown));
  });

  return blocks;
}

export function replaceBlockSource(markdown: string, block: MarkdownBlock, nextSource: string): string {
  return `${markdown.slice(0, block.start)}${nextSource}${markdown.slice(block.end)}`;
}

function createBlock(
  type: MarkdownBlockType,
  title: string,
  depth: number,
  start: number,
  end: number,
  markdown: string
): MarkdownBlock {
  return {
    id: `${type}-${start}-${end}`,
    type,
    title,
    depth,
    start,
    end,
    source: markdown.slice(start, end)
  };
}

function splitLines(markdown: string): MarkdownLine[] {
  const lines: MarkdownLine[] = [];
  let start = 0;

  while (start < markdown.length) {
    let newlineIndex = markdown.indexOf("\n", start);
    let end = markdown.length;

    if (newlineIndex !== -1) {
      end = newlineIndex + 1;
    }

    const contentEnd = end > start && markdown[end - 1] === "\n" ? end - 1 : end;
    const textEnd = contentEnd > start && markdown[contentEnd - 1] === "\r" ? contentEnd - 1 : contentEnd;
    lines.push({
      start,
      end,
      text: markdown.slice(start, textEnd)
    });
    start = end;
  }

  return lines;
}

function findFrontmatter(markdown: string, lines: MarkdownLine[]): Pick<MarkdownBlock, "start" | "end"> | null {
  if (lines.length < 2 || lines[0].text.trim() !== "---") return null;

  for (let index = 1; index < lines.length; index += 1) {
    if (lines[index].text.trim() !== "---") continue;

    let endLine = index;
    while (lines[endLine + 1]?.text.trim() === "") {
      endLine += 1;
    }

    return {
      start: 0,
      end: lines[endLine]?.end ?? markdown.length
    };
  }

  return null;
}

function findHeadings(markdown: string, contentStart: number): HeadingMarker[] {
  const headings: HeadingMarker[] = [];
  const tree = markdownProcessor.parse(markdown);

  visit(tree, "heading", (node: MarkdownAstNode) => {
    const start = node.position?.start?.offset;
    if (start === undefined || start < contentStart) return;

    headings.push({
      start,
      depth: node.depth ?? 1,
      title: getNodeText(node).trim() || "Untitled section"
    });
  });

  return headings.sort((left, right) => left.start - right.start);
}

function getNodeText(node: MarkdownAstNode): string {
  if (node.value) return node.value;
  return node.children?.map(getNodeText).join("") ?? "";
}
