import { describe, expect, it } from "vitest";
import { createMarkdownDocument, discardDraft, editBlockDraft, saveBlockDraft } from "./markdownDocument";

describe("MarkdownDocument editing state", () => {
  it("tracks dirty state after block edits and can reset after save-to-disk", () => {
    const doc = createMarkdownDocument("notes.md", "# Title\nOld\n");
    const blockId = doc.blocks[0].id;

    const edited = editBlockDraft(doc, blockId, "# Title\nNew\n");
    expect(edited.dirty).toBe(false);
    expect(edited.blocks[0].draftSource).toBe("# Title\nNew\n");

    const applied = saveBlockDraft(edited, blockId);
    expect(applied.currentText).toBe("# Title\nNew\n");
    expect(applied.dirty).toBe(true);

    const persisted = createMarkdownDocument("notes.md", applied.currentText, {
      originalText: applied.currentText
    });
    expect(persisted.dirty).toBe(false);
  });

  it("cancels block drafts without mutating document text", () => {
    const doc = createMarkdownDocument("notes.md", "# Title\nOld\n");
    const blockId = doc.blocks[0].id;

    const edited = editBlockDraft(doc, blockId, "# Title\nNew\n");
    const cancelled = discardDraft(edited, blockId);

    expect(cancelled.currentText).toBe("# Title\nOld\n");
    expect(cancelled.blocks[0].draftSource).toBeUndefined();
    expect(cancelled.dirty).toBe(false);
  });
});
