import { parseMarkdownBlocks, replaceBlockSource, type MarkdownBlock } from "./markdownBlocks";

export interface MarkdownDocument {
  fileName: string;
  originalText: string;
  currentText: string;
  blocks: MarkdownBlock[];
  dirty: boolean;
  fileHandle?: FileSystemFileHandle;
}

interface CreateMarkdownDocumentOptions {
  originalText?: string;
  fileHandle?: FileSystemFileHandle;
}

export function createMarkdownDocument(
  fileName: string,
  currentText: string,
  options: CreateMarkdownDocumentOptions = {}
): MarkdownDocument {
  const originalText = options.originalText ?? currentText;

  return {
    fileName,
    originalText,
    currentText,
    blocks: parseMarkdownBlocks(currentText),
    dirty: currentText !== originalText,
    fileHandle: options.fileHandle
  };
}

export function editBlockDraft(document: MarkdownDocument, blockId: string, draftSource: string): MarkdownDocument {
  return {
    ...document,
    blocks: document.blocks.map((block) => (block.id === blockId ? { ...block, draftSource } : block))
  };
}

export function discardDraft(document: MarkdownDocument, blockId: string): MarkdownDocument {
  return {
    ...document,
    blocks: document.blocks.map((block) => {
      if (block.id !== blockId) return block;
      const { draftSource: _draftSource, ...rest } = block;
      return rest;
    })
  };
}

export function saveBlockDraft(document: MarkdownDocument, _blockId: string): MarkdownDocument {
  const block = document.blocks.find((item) => item.id === _blockId);
  if (!block || block.draftSource === undefined) return document;

  const currentText = replaceBlockSource(document.currentText, block, block.draftSource);

  return {
    ...document,
    currentText,
    blocks: parseMarkdownBlocks(currentText),
    dirty: currentText !== document.originalText
  };
}

export function markDocumentPersisted(document: MarkdownDocument, fileHandle = document.fileHandle): MarkdownDocument {
  return {
    ...document,
    originalText: document.currentText,
    dirty: false,
    fileHandle
  };
}
