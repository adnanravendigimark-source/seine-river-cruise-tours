"use client";

import { useEffect, useRef, useState } from "react";

// A dependency-free rich text editor (contentEditable + the browser's
// built-in document.execCommand) — deliberately not built on an npm rich
// text library, so it works with zero new install steps for whoever
// deploys this. Supports the exact toolset asked for: H1–H3, bold,
// italic, bullet/numbered lists, links, images, and tables. Output is
// stored as an HTML string (same shape as everything else in
// HomepageContent) and rendered on the public site inside a
// `.rich-content` wrapper (see globals.css) via dangerouslySetInnerHTML —
// safe here because only authenticated admins can ever write to it, the
// same trust boundary as the JSON-LD scripts already rendered elsewhere.
export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  minHeight = "8rem",
  allowedHeadings = [1, 2, 3],
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  // Restricts which heading buttons the toolbar offers — e.g. blog article
  // body content passes [2, 3] so writers can't accidentally create a
  // second H1 on the page (the post title is already the one true H1).
  // Defaults to all three for every other existing use of this editor.
  allowedHeadings?: (1 | 2 | 3)[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(!value);

  // Only set innerHTML once, on mount — re-syncing on every `value` change
  // would reset the cursor position on every keystroke, since typing
  // itself triggers the onChange that updates `value`. Switching tabs in
  // the parent form unmounts/remounts this component, which naturally
  // re-runs this with whatever the current value is at that time.
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = value || "";
      setIsEmpty(!(value || "").trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleInput() {
    if (!ref.current) return;
    const html = ref.current.innerHTML;
    setIsEmpty(!ref.current.textContent?.trim());
    onChange(html);
  }

  function exec(command: string, arg?: string) {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    handleInput();
  }

  function insertLink() {
    const url = window.prompt(
      "Link URL — paste a full https://… address, or a relative path for an internal link (e.g. /blog/other-post)"
    );
    if (!url) return;
    exec("createLink", url);
  }

  function insertImage() {
    const url = window.prompt(
      "Image URL — upload the image on the Images tab first, then paste its URL here"
    );
    if (!url) return;
    exec("insertImage", url);
  }

  function insertTable() {
    ref.current?.focus();
    const rows = 3;
    const cols = 3;
    const cells = Array.from({ length: cols })
      .map(() => `<td style="border:1px solid #ccc;padding:6px 10px;">&nbsp;</td>`)
      .join("");
    const tableRows = Array.from({ length: rows }).map(() => `<tr>${cells}</tr>`).join("");
    document.execCommand(
      "insertHTML",
      false,
      `<table style="border-collapse:collapse;width:100%;"><tbody>${tableRows}</tbody></table><p><br></p>`
    );
    handleInput();
  }

  const ToolbarButton = ({
    label,
    title,
    onClick,
  }: {
    label: React.ReactNode;
    title: string;
    onClick: () => void;
  }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()} // keep focus/selection in the editor
      onClick={onClick}
      className="rounded px-2 py-1 text-xs font-semibold text-stone-600 transition hover:bg-stone-200 hover:text-stone-900"
    >
      {label}
    </button>
  );

  return (
    <div className="rounded-lg border border-stone-300 focus-within:border-seine-teal focus-within:ring-1 focus-within:ring-seine-teal">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-stone-200 bg-stone-50 p-1.5">
        {allowedHeadings.includes(1) && (
          <ToolbarButton label="H1" title="Heading 1" onClick={() => exec("formatBlock", "<h1>")} />
        )}
        {allowedHeadings.includes(2) && (
          <ToolbarButton label="H2" title="Heading 2" onClick={() => exec("formatBlock", "<h2>")} />
        )}
        {allowedHeadings.includes(3) && (
          <ToolbarButton label="H3" title="Heading 3" onClick={() => exec("formatBlock", "<h3>")} />
        )}
        <ToolbarButton label="¶" title="Paragraph" onClick={() => exec("formatBlock", "<p>")} />
        <span className="mx-1 h-4 w-px bg-stone-300" />
        <ToolbarButton label={<span className="font-bold">B</span>} title="Bold" onClick={() => exec("bold")} />
        <ToolbarButton label={<span className="italic">I</span>} title="Italic" onClick={() => exec("italic")} />
        <ToolbarButton label={<span className="underline">U</span>} title="Underline" onClick={() => exec("underline")} />
        <span className="mx-1 h-4 w-px bg-stone-300" />
        <ToolbarButton label="• List" title="Bullet list" onClick={() => exec("insertUnorderedList")} />
        <ToolbarButton label="1. List" title="Numbered list" onClick={() => exec("insertOrderedList")} />
        <span className="mx-1 h-4 w-px bg-stone-300" />
        <ToolbarButton label="Link" title="Insert link" onClick={insertLink} />
        <ToolbarButton label="Image" title="Insert image" onClick={insertImage} />
        <ToolbarButton label="Table" title="Insert 3×3 table" onClick={insertTable} />
        <span className="mx-1 h-4 w-px bg-stone-300" />
        <ToolbarButton label="Clear" title="Clear formatting" onClick={() => exec("removeFormat")} />
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder}
        data-rte-empty={isEmpty ? "true" : "false"}
        className="rich-content max-w-none px-3 py-2.5 text-sm text-stone-900 outline-none"
        style={{ minHeight }}
      />
    </div>
  );
}
