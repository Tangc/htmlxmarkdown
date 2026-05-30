import { describe, expect, it } from "vitest";
import { isFileSystemAccessSupported } from "./fileAccess";

describe("isFileSystemAccessSupported", () => {
  it("requires open and save picker support", () => {
    expect(isFileSystemAccessSupported({ showOpenFilePicker: async () => [] })).toBe(false);
    expect(
      isFileSystemAccessSupported({
        showOpenFilePicker: async () => [],
        showSaveFilePicker: async () => ({}) as FileSystemFileHandle
      })
    ).toBe(true);
  });
});
