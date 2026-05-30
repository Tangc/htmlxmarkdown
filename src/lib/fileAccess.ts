export function isFileSystemAccessSupported(host: Partial<Window> = window): boolean {
  return Boolean(host.showOpenFilePicker && host.showSaveFilePicker);
}

const markdownTypes: FilePickerAcceptType[] = [
  {
    description: "Markdown files",
    accept: {
      "text/markdown": [".md", ".markdown", ".mdown"],
      "text/plain": [".txt"]
    }
  }
];

export interface OpenedMarkdownFile {
  fileName: string;
  text: string;
  handle: FileSystemFileHandle;
}

export async function openMarkdownFile(): Promise<OpenedMarkdownFile | null> {
  const [handle] = await window.showOpenFilePicker({
    multiple: false,
    types: markdownTypes,
    excludeAcceptAllOption: false
  });

  if (!handle) return null;

  const file = await handle.getFile();
  return {
    fileName: file.name,
    text: await file.text(),
    handle
  };
}

export async function saveMarkdownFile(handle: FileSystemFileHandle, text: string): Promise<void> {
  const writable = await handle.createWritable();
  await writable.write(text);
  await writable.close();
}

export async function saveMarkdownFileAs(fileName: string, text: string): Promise<FileSystemFileHandle> {
  const handle = await window.showSaveFilePicker({
    suggestedName: fileName || "document.md",
    types: markdownTypes,
    excludeAcceptAllOption: false
  });

  await saveMarkdownFile(handle, text);
  return handle;
}
