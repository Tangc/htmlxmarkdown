import {
  CircleHelp,
  FilePenLine,
  FileText,
  FolderOpen,
  MessageCircle,
  PlayCircle,
  RotateCcw,
  Save,
  SaveAll,
  Sparkles,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import {
  createMarkdownDocument,
  discardDraft,
  editBlockDraft,
  markDocumentPersisted,
  saveBlockDraft,
  type MarkdownDocument
} from "./domain/markdownDocument";
import {
  isFileSystemAccessSupported,
  openMarkdownFile,
  saveMarkdownFile,
  saveMarkdownFileAs,
  type OpenedMarkdownFile
} from "./lib/fileAccess";
import { buildFeedbackIssueUrl } from "./lib/feedbackIssue";
import { copies, detectLanguage, getSystemLanguages, type Language } from "./lib/i18n";
import "./index.css";
import complexSampleMarkdown from "../samples/guizang-ppt-skill.SKILL.md?raw";
import { trackEvent } from "./lib/analytics";

type StatusKey =
  | "ready"
  | "openingFile"
  | "opened"
  | "openCancelled"
  | "couldNotOpenFile"
  | "saving"
  | "savingCopy"
  | "saved"
  | "saveCancelled"
  | "couldNotSaveFile"
  | "sectionApplied"
  | "sectionEditCancelled";

type StaticStatusKey = Exclude<StatusKey, "opened" | "saved">;

interface FileApi {
  open: () => Promise<OpenedMarkdownFile | null>;
  save: (handle: FileSystemFileHandle, text: string) => Promise<void>;
  saveAs: (fileName: string, text: string) => Promise<FileSystemFileHandle>;
}

interface AppProps {
  initialDocument?: MarkdownDocument;
  fileAccessSupported?: boolean;
  feedbackUrl?: string;
  fileApi?: FileApi;
  preferredLanguages?: readonly string[];
}

const defaultFileApi: FileApi = {
  open: openMarkdownFile,
  save: saveMarkdownFile,
  saveAs: saveMarkdownFileAs
};

const defaultFeedbackUrl =
  import.meta.env.VITE_FEEDBACK_URL || "https://github.com/Tangc/htmlxmarkdown/issues/new?template=feedback.yml";

const guideSourceUrl = "https://www.lennysnewsletter.com/p/html-is-the-new-markdown-how-anthropic";
const demoVideoUrl = "/htmlxmarkdown-demo.mp4";
const guideSeenStorageKey = "htmlxmarkdown.guideSeen.v1";

const complexSampleFileName = "guizang-ppt-skill.SKILL.md";
const demoSearchParam = "demo";
const demoSearchValue = "1";

function createComplexSampleDocument() {
  return createMarkdownDocument(complexSampleFileName, complexSampleMarkdown);
}

function isDemoUrl() {
  try {
    return new URL(window.location.href).searchParams.get(demoSearchParam) === demoSearchValue;
  } catch {
    return false;
  }
}

function updateDemoUrl(enabled: boolean) {
  try {
    const url = new URL(window.location.href);
    if (enabled) {
      url.searchParams.set(demoSearchParam, demoSearchValue);
    } else if (!url.searchParams.has(demoSearchParam)) {
      return;
    } else {
      url.searchParams.delete(demoSearchParam);
    }
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  } catch {
    // URL state is a convenience; the editor should still work if history is unavailable.
  }
}

function getCurrentAppUrl() {
  if (typeof window === "undefined") return null;
  return window.location.href;
}

function getCurrentAppPath() {
  if (typeof window === "undefined") return null;
  const { pathname, search, hash } = window.location;
  return `${pathname}${search}${hash}`;
}

function getUserAgent() {
  if (typeof navigator === "undefined") return null;
  return navigator.userAgent || null;
}

function hasSeenGuide() {
  try {
    return window.localStorage.getItem(guideSeenStorageKey) === "true";
  } catch {
    return true;
  }
}

function rememberGuideSeen() {
  try {
    window.localStorage.setItem(guideSeenStorageKey, "true");
  } catch {
    // Ignore unavailable storage; the modal still closes for this session.
  }
}

export default function App({
  initialDocument,
  fileAccessSupported = isFileSystemAccessSupported(),
  feedbackUrl = defaultFeedbackUrl,
  fileApi = defaultFileApi,
  preferredLanguages
}: AppProps) {
  const [openedFromDemoUrl] = useState(() => !initialDocument && isDemoUrl());
  const [language, setLanguage] = useState<Language>(() => detectLanguage(preferredLanguages ?? getSystemLanguages()));
  const copy = copies[language];
  const [document, setDocument] = useState<MarkdownDocument | null>(() =>
    initialDocument ?? (openedFromDemoUrl ? createComplexSampleDocument() : null)
  );
  const [demoMode, setDemoMode] = useState(openedFromDemoUrl);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusKey>(openedFromDemoUrl ? "opened" : "ready");
  const [statusFileName, setStatusFileName] = useState<string | null>(openedFromDemoUrl ? complexSampleFileName : null);
  const [guideOpen, setGuideOpen] = useState(() => !openedFromDemoUrl && !hasSeenGuide());
  const [busy, setBusy] = useState(false);

  const selectedBlock = useMemo(
    () => document?.blocks.find((block) => block.id === selectedBlockId) ?? null,
    [document, selectedBlockId]
  );

  useEffect(() => {
    if (openedFromDemoUrl) trackEvent("demo_opened", { source: "url" });
  }, [openedFromDemoUrl]);

  const feedbackHref = useMemo(
    () =>
      buildFeedbackIssueUrl(feedbackUrl, {
        appPath: getCurrentAppPath(),
        appUrl: getCurrentAppUrl(),
        demoMode,
        dirty: document?.dirty ?? false,
        fileName: document?.fileName ?? null,
        language,
        userAgent: getUserAgent()
      }),
    [demoMode, document?.dirty, document?.fileName, feedbackUrl, language]
  );

  function getStatusText() {
    if (document?.dirty) return copy.unsavedChanges;
    if (statusFileName && status === "opened") return copy.opened(statusFileName);
    if (statusFileName && status === "saved") return copy.saved(statusFileName);
    return copy[status as StaticStatusKey];
  }

  async function handleOpen() {
    trackEvent("open_file_clicked", { demo: isDemoUrl() });
    setBusy(true);
    setStatus("openingFile");
    setStatusFileName(null);
    try {
      const opened = await fileApi.open();
      if (!opened) {
        trackEvent("open_file_cancelled");
        return;
      }
      setDocument(createMarkdownDocument(opened.fileName, opened.text, { fileHandle: opened.handle }));
      setDemoMode(false);
      setSelectedBlockId(null);
      setStatus("opened");
      setStatusFileName(opened.fileName);
      updateDemoUrl(false);
      trackEvent("open_file_succeeded", { file_extension: opened.fileName.split(".").pop() ?? "unknown" });
    } catch (error) {
      setStatus(error instanceof DOMException && error.name === "AbortError" ? "openCancelled" : "couldNotOpenFile");
      setStatusFileName(null);
      trackEvent(error instanceof DOMException && error.name === "AbortError" ? "open_file_cancelled" : "open_file_failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleSave() {
    if (!document) return;

    if (!document.fileHandle) {
      await handleSaveAs();
      return;
    }

    setBusy(true);
    setStatus("saving");
    setStatusFileName(null);
    try {
      await fileApi.save(document.fileHandle, document.currentText);
      setDocument((current) => (current ? markDocumentPersisted(current) : current));
      setStatus("saved");
      setStatusFileName(document.fileName);
      trackEvent("save_file_succeeded", { file_name: document.fileName });
    } catch (error) {
      setStatus(error instanceof DOMException && error.name === "AbortError" ? "saveCancelled" : "couldNotSaveFile");
      setStatusFileName(null);
      trackEvent(error instanceof DOMException && error.name === "AbortError" ? "save_file_cancelled" : "save_file_failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveAs() {
    if (!document) return;

    setBusy(true);
    setStatus("savingCopy");
    setStatusFileName(null);
    try {
      const fileHandle = await fileApi.saveAs(document.fileName, document.currentText);
      setDocument((current) => (current ? markDocumentPersisted(current, fileHandle) : current));
      setStatus("saved");
      setStatusFileName(document.fileName);
      trackEvent("save_as_file_succeeded", { file_name: document.fileName });
    } catch (error) {
      setStatus(error instanceof DOMException && error.name === "AbortError" ? "saveCancelled" : "couldNotSaveFile");
      setStatusFileName(null);
      trackEvent(
        error instanceof DOMException && error.name === "AbortError" ? "save_as_file_cancelled" : "save_as_file_failed"
      );
    } finally {
      setBusy(false);
    }
  }

  function openEditor(blockId: string) {
    setDocument((current) => {
      const block = current?.blocks.find((item) => item.id === blockId);
      return current && block ? editBlockDraft(current, blockId, block.draftSource ?? block.source) : current;
    });
    setSelectedBlockId(blockId);
    trackEvent("edit_section_clicked", { block_id: blockId, file_name: document?.fileName ?? null });
  }

  function updateDraft(nextSource: string) {
    if (!selectedBlockId) return;
    setDocument((current) => (current ? editBlockDraft(current, selectedBlockId, nextSource) : current));
  }

  function applyDraft() {
    if (!selectedBlockId) return;
    setDocument((current) => (current ? saveBlockDraft(current, selectedBlockId) : current));
    setSelectedBlockId(null);
    setStatus("sectionApplied");
    setStatusFileName(null);
    trackEvent("apply_section_edit", { file_name: document?.fileName ?? null });
  }

  function cancelDraft() {
    if (!selectedBlockId) return;
    setDocument((current) => (current ? discardDraft(current, selectedBlockId) : current));
    setSelectedBlockId(null);
    setStatus("sectionEditCancelled");
    setStatusFileName(null);
  }

  function closeGuide() {
    rememberGuideSeen();
    setGuideOpen(false);
  }

  function openGuide() {
    setGuideOpen(true);
    trackEvent("usage_guide_opened");
  }

  function openTestSample() {
    setDocument(createComplexSampleDocument());
    setDemoMode(true);
    setSelectedBlockId(null);
    setStatus("opened");
    setStatusFileName(complexSampleFileName);
    updateDemoUrl(true);
    trackEvent("demo_opened", { source: "button" });
  }

  function resetDocument() {
    setDocument(null);
    setDemoMode(false);
    setSelectedBlockId(null);
    setStatus("ready");
    setStatusFileName(null);
    updateDemoUrl(false);
    trackEvent("reset_document", { had_document: Boolean(document) });
  }

  function renderLanguageSelect() {
    return (
      <select
        className="language-select"
        aria-label={copy.language}
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
      >
        <option value="en">{copy.languageEnglish}</option>
        <option value="zh-CN">{copy.languageSimplifiedChinese}</option>
      </select>
    );
  }

  if (!fileAccessSupported && !document) {
    return (
      <main className="unsupported-shell" lang={language}>
        <section className="unsupported-panel">
          <FileText aria-hidden="true" size={36} />
          <h1>{copy.fileAccessTitle}</h1>
          <p>{copy.fileAccessDescription}</p>
          {renderLanguageSelect()}
          <a href={feedbackHref} target="_blank" rel="noreferrer">
            {copy.feedback}
          </a>
        </section>
        {guideOpen ? (
          <UsageGuide
            title={copy.guideTitle}
            body={copy.guideBody}
            context={copy.guideContext}
            detail={copy.guideDetail}
            trustNote={copy.localFileTrustNote}
            demoVideoLabel={copy.demoVideo}
            demoVideoUrl={demoVideoUrl}
            sourceLabel={copy.guideSource}
            sourceUrl={guideSourceUrl}
            closeLabel={copy.gotIt}
            closeIconLabel={copy.closeGuide}
            onClose={closeGuide}
          />
        ) : null}
      </main>
    );
  }

  return (
    <main className="app-shell" lang={language}>
      <header className="toolbar">
        <div className="brand">
          <FileText aria-hidden="true" size={22} />
          <div>
            <span className="brand-name">HTMLxMarkdown</span>
            <span className="file-name">{document?.fileName ?? copy.noFileOpen}</span>
          </div>
        </div>

        <div className="toolbar-actions">
          <button className="tool-button primary" type="button" onClick={handleOpen} disabled={busy}>
            <FolderOpen aria-hidden="true" size={18} />
            {copy.open}
          </button>
          <button className="tool-button" type="button" onClick={handleSave} disabled={!document || busy}>
            <Save aria-hidden="true" size={18} />
            {copy.save}
          </button>
          <button className="tool-button" type="button" onClick={handleSaveAs} disabled={!document || busy}>
            <SaveAll aria-hidden="true" size={18} />
            {copy.saveAs}
          </button>
          <button className="tool-button" type="button" onClick={openGuide}>
            <CircleHelp aria-hidden="true" size={18} />
            {copy.usage}
          </button>
          <button className="tool-button" type="button" onClick={openTestSample}>
            <Sparkles aria-hidden="true" size={18} />
            {copy.testSample}
          </button>
          <button className="tool-button" type="button" onClick={resetDocument} disabled={!document || busy}>
            <RotateCcw aria-hidden="true" size={18} />
            {copy.reset}
          </button>
          {renderLanguageSelect()}
          <a
            className="tool-button link-button"
            href={feedbackHref}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("feedback_clicked", { file_name: document?.fileName ?? null, demo: demoMode })}
          >
            <MessageCircle aria-hidden="true" size={18} />
            {copy.feedback}
          </a>
        </div>

        <div className={`dirty-indicator ${document?.dirty ? "is-dirty" : ""}`}>
          {getStatusText()}
        </div>
      </header>

      <div className="workspace">
        <aside className="toc-panel" aria-label={copy.documentSections}>
          <h2>{copy.sections}</h2>
          {document ? (
            <nav className="toc-list">
              {document.blocks.map((block) => (
                <button
                  key={block.id}
                  className={`toc-item depth-${Math.min(block.depth, 3)} ${block.id === selectedBlockId ? "active" : ""}`}
                  type="button"
                  onClick={() => openEditor(block.id)}
                >
                  {block.title}
                </button>
              ))}
            </nav>
          ) : (
            <p className="muted">{copy.openFilePrompt}</p>
          )}
        </aside>

        <section className="reader-panel" aria-label={copy.renderedMarkdown}>
          {document ? (
            document.blocks.map((block) => (
              <article
                key={block.id}
                id={block.id}
                className={`markdown-block ${block.id === selectedBlockId ? "selected" : ""}`}
              >
                <div className="block-bar">
                  <span>{block.type === "heading" ? `H${block.depth}` : block.type}</span>
                  <button type="button" onClick={() => openEditor(block.id)} aria-label={copy.editSection(block.title)}>
                    <FilePenLine aria-hidden="true" size={16} />
                    {copy.edit}
                  </button>
                </div>
                {block.type === "frontmatter" ? (
                  <pre className="frontmatter-view">{block.source}</pre>
                ) : (
                  <div className="markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]} skipHtml>
                      {block.source}
                    </ReactMarkdown>
                  </div>
                )}
              </article>
            ))
          ) : (
            <section className="empty-state">
              <FileText aria-hidden="true" size={40} />
              <h1>{copy.openLocalTitle}</h1>
              <p>{copy.openLocalDescription}</p>
              <p className="trust-note">{copy.localFileTrustNote}</p>
              <div className="empty-actions">
                <button className="tool-button primary" type="button" onClick={handleOpen} disabled={busy}>
                  <FolderOpen aria-hidden="true" size={18} />
                  {copy.open} Markdown
                </button>
                <a className="tool-button link-button" href={demoVideoUrl} target="_blank" rel="noreferrer">
                  <PlayCircle aria-hidden="true" size={18} />
                  {copy.demoVideo}
                </a>
              </div>
            </section>
          )}
        </section>

        <aside className={`editor-panel ${selectedBlock ? "open" : ""}`} aria-label={copy.sectionEditor}>
          {selectedBlock ? (
            <>
              <div className="editor-header">
                <div>
                  <span className="eyebrow">{copy.editing}</span>
                  <h2>{selectedBlock.title}</h2>
                </div>
                <button className="icon-button" type="button" onClick={cancelDraft} aria-label={copy.closeEditor}>
                  <X aria-hidden="true" size={18} />
                </button>
              </div>
              <label htmlFor="section-source">{copy.sectionMarkdownSource}</label>
              <textarea
                id="section-source"
                value={selectedBlock.draftSource ?? selectedBlock.source}
                onChange={(event) => updateDraft(event.target.value)}
                spellCheck={false}
              />
              <div className="editor-actions">
                <button className="tool-button" type="button" onClick={cancelDraft}>
                  {copy.cancel}
                </button>
                <button className="tool-button primary" type="button" onClick={applyDraft}>
                  {copy.applySectionEdit}
                </button>
              </div>
            </>
          ) : (
            <div className="editor-placeholder">
              <FilePenLine aria-hidden="true" size={28} />
              <p>{copy.editorPlaceholder}</p>
            </div>
          )}
        </aside>
      </div>
      {guideOpen ? (
        <UsageGuide
          title={copy.guideTitle}
          body={copy.guideBody}
          context={copy.guideContext}
          detail={copy.guideDetail}
          trustNote={copy.localFileTrustNote}
          demoVideoLabel={copy.demoVideo}
          demoVideoUrl={demoVideoUrl}
          sourceLabel={copy.guideSource}
          sourceUrl={guideSourceUrl}
          closeLabel={copy.gotIt}
          closeIconLabel={copy.closeGuide}
          onClose={closeGuide}
        />
      ) : null}
    </main>
  );
}

interface UsageGuideProps {
  title: string;
  body: string;
  context: string;
  detail: string;
  trustNote: string;
  demoVideoLabel: string;
  demoVideoUrl: string;
  sourceLabel: string;
  sourceUrl: string;
  closeLabel: string;
  closeIconLabel: string;
  onClose: () => void;
}

function UsageGuide({
  title,
  body,
  context,
  detail,
  trustNote,
  demoVideoLabel,
  demoVideoUrl,
  sourceLabel,
  sourceUrl,
  closeLabel,
  closeIconLabel,
  onClose
}: UsageGuideProps) {
  return (
    <div className="modal-backdrop">
      <section className="usage-dialog" role="dialog" aria-modal="true" aria-labelledby="usage-guide-title">
        <div className="usage-dialog-header">
          <h2 id="usage-guide-title">{title}</h2>
          <button className="icon-button" type="button" onClick={onClose} aria-label={closeIconLabel}>
            <X aria-hidden="true" size={18} />
          </button>
        </div>
        <p>{context}</p>
        <p>{body}</p>
        <p>{detail}</p>
        <p className="trust-note">{trustNote}</p>
        <div className="usage-links">
          <a className="usage-source-link" href={demoVideoUrl} target="_blank" rel="noreferrer">
            <PlayCircle aria-hidden="true" size={17} />
            {demoVideoLabel}
          </a>
          <a className="usage-source-link" href={sourceUrl} target="_blank" rel="noreferrer">
            {sourceLabel}
          </a>
        </div>
        <div className="usage-dialog-actions">
          <button className="tool-button primary" type="button" onClick={onClose}>
            {closeLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
