"use client";

import { useEffect, useRef, useState } from "react";
import RichImageModal from "./RichImageModal";
import RichLinkModal from "./RichLinkModal";

// Leaves a URL alone if it already has a scheme (https:, mailto:, tel:...),
// is protocol-relative (//example.com), or is an internal path/anchor
// (/blog/post, #section) — otherwise prepends "https://" so a link typed as
// just "example.com" doesn't end up a broken relative link on the page.
function normalizeUrl(raw: string): string {
  const url = raw.trim();
  if (!url) return url;
  if (/^([a-z][a-z0-9+.-]*:|\/\/|\/|#)/i.test(url)) return url;
  return `https://${url}`;
}

// Escapes text going into HTML *content* (as opposed to an attribute value,
// which the existing alt/url handling already quote-escapes) — used for the
// image caption so a caption like "Cost < value" can't break the markup.
function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

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
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  // The DOM selection is lost the instant focus moves into the image/link
  // modal's inputs, so the cursor position (and any selected text) has to
  // be captured up front (at the moment the toolbar button is clicked) and
  // restored right before the image/link is actually inserted. Shared by
  // both modals since only one is ever open at a time.
  const savedRangeRef = useRef<Range | null>(null);

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

  function captureSelection(): Range | null {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !ref.current) return null;
    const range = sel.getRangeAt(0);
    if (!ref.current.contains(range.commonAncestorContainer)) return null;
    return range.cloneRange();
  }

  // Restores whatever was saved by captureSelection() (or, failing that,
  // collapses to the end of the content) and returns the live Range so the
  // caller can insert relative to it. Shared by both the image and link
  // insert flows, which both need this exact same "get my selection back
  // after the modal stole focus" step.
  function restoreSelection(): Range | null {
    if (!ref.current) return null;
    ref.current.focus();
    const sel = window.getSelection();
    if (!sel) return null;
    sel.removeAllRanges();
    let range: Range;
    if (savedRangeRef.current) {
      range = savedRangeRef.current;
    } else {
      range = document.createRange();
      range.selectNodeContents(ref.current);
      range.collapse(false);
    }
    sel.addRange(range);
    return range;
  }

  function insertLink() {
    savedRangeRef.current = captureSelection();
    setLinkModalOpen(true);
  }

  function handleLinkInsert({
    url,
    nofollow,
    newTab,
  }: {
    url: string;
    nofollow: boolean;
    newTab: boolean;
  }) {
    const range = restoreSelection();
    if (!range) {
      setLinkModalOpen(false);
      return;
    }
    const normalized = normalizeUrl(url);

    const anchor = document.createElement("a");
    anchor.setAttribute("href", normalized);
    if (newTab) anchor.setAttribute("target", "_blank");
    // noopener/noreferrer must go alongside target="_blank" so the new tab
    // can't reach back into this page via window.opener; nofollow rides
    // along in the same rel attribute when both are set.
    const relTokens = [
      ...(nofollow ? ["nofollow"] : []),
      ...(newTab ? ["noopener", "noreferrer"] : []),
    ];
    if (relTokens.length) anchor.setAttribute("rel", relTokens.join(" "));

    if (range.collapsed) {
      // Nothing was selected — insert the URL itself as the clickable text.
      anchor.textContent = normalized;
    } else {
      anchor.appendChild(range.extractContents());
    }
    range.insertNode(anchor);

    range.setStartAfter(anchor);
    range.collapse(true);
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }

    handleInput();
    setLinkModalOpen(false);
  }

  // Clicking H1/H2/H3 with a partial-line selection should turn only the
  // selected text into a heading — not the whole paragraph, which is what
  // document.execCommand("formatBlock") always does (it only knows how to
  // convert an entire block). This splits the current block into up to
  // three pieces instead: the text before the selection (kept as a
  // paragraph), the selection itself (the new heading), and the text after
  // (also kept as a paragraph) — any empty piece is simply omitted.
  function applyHeading(level: 1 | 2 | 3) {
    const sel = window.getSelection();
    const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;

    if (!range || range.collapsed || !ref.current || !ref.current.contains(range.commonAncestorContainer)) {
      // No real text selection (just a cursor) — fall back to the
      // familiar "convert the whole current block" behavior.
      exec("formatBlock", `<h${level}>`);
      return;
    }

    const startedInTextNode = range.commonAncestorContainer.nodeType === Node.TEXT_NODE;
    let block: HTMLElement | null = startedInTextNode
      ? range.commonAncestorContainer.parentElement
      : (range.commonAncestorContainer as HTMLElement);
    while (block && block !== ref.current && !/^(P|H1|H2|H3|H4|H5|H6|LI)$/.test(block.tagName)) {
      block = block.parentElement;
    }

    // Older content is sometimes stored as bare text with no wrapping <p>
    // (saved before this editor started wrapping paragraphs), so the
    // selected text node's parent is the editable root itself rather than
    // a recognizable block. That's still splittable — treat the whole
    // root's contents as the one implicit paragraph. But if the selection's
    // common ancestor was already the root *element* (not a text node),
    // the selection spans multiple real block children, which is
    // genuinely ambiguous — fall back rather than guessing there too.
    const useRootAsBlock = (!block || block === ref.current) && startedInTextNode;
    if ((!block || block === ref.current) && !useRootAsBlock) {
      exec("formatBlock", `<h${level}>`);
      return;
    }
    const container: HTMLElement = useRootAsBlock ? ref.current : (block as HTMLElement);

    ref.current.focus();

    const beforeRange = document.createRange();
    beforeRange.setStart(container, 0);
    beforeRange.setEnd(range.startContainer, range.startOffset);

    const afterRange = document.createRange();
    afterRange.setStart(range.endContainer, range.endOffset);
    afterRange.setEnd(container, container.childNodes.length);

    const beforeFrag = beforeRange.cloneContents();
    const selectedFrag = range.cloneContents();
    const afterFrag = afterRange.cloneContents();

    const replacement: HTMLElement[] = [];
    if (beforeFrag.textContent?.trim()) {
      const p = document.createElement("p");
      p.appendChild(beforeFrag);
      replacement.push(p);
    }
    const heading = document.createElement(`h${level}`);
    heading.appendChild(selectedFrag);
    replacement.push(heading);
    if (afterFrag.textContent?.trim()) {
      const p = document.createElement("p");
      p.appendChild(afterFrag);
      replacement.push(p);
    }

    if (useRootAsBlock) {
      container.replaceChildren(...replacement);
    } else {
      container.replaceWith(...replacement);
    }

    // Put the cursor at the end of the new heading rather than leaving it
    // wherever the browser happens to land after a manual DOM swap.
    const newSel = window.getSelection();
    if (newSel) {
      const after = document.createRange();
      after.selectNodeContents(heading);
      after.collapse(false);
      newSel.removeAllRanges();
      newSel.addRange(after);
    }

    handleInput();
  }

  function insertImage() {
    savedRangeRef.current = captureSelection();
    setImageModalOpen(true);
  }

  function handleImageInsert({ url, alt, caption }: { url: string; alt: string; caption: string }) {
    if (!restoreSelection()) {
      setImageModalOpen(false);
      return;
    }
    const safeAlt = alt.replace(/"/g, "&quot;");
    const safeUrl = url.replace(/"/g, "&quot;");
    const imgHtml = `<img src="${safeUrl}" alt="${safeAlt}" />`;
    const trimmedCaption = caption.trim();
    const html = trimmedCaption
      ? `<figure>${imgHtml}<figcaption>${escapeHtml(trimmedCaption)}</figcaption></figure>`
      : imgHtml;
    document.execCommand("insertHTML", false, html);
    handleInput();
    setImageModalOpen(false);
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
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 rounded-t-lg border-b border-stone-200 bg-stone-50 p-1.5">
        {allowedHeadings.includes(1) && (
          <ToolbarButton label="H1" title="Heading 1" onClick={() => applyHeading(1)} />
        )}
        {allowedHeadings.includes(2) && (
          <ToolbarButton label="H2" title="Heading 2" onClick={() => applyHeading(2)} />
        )}
        {allowedHeadings.includes(3) && (
          <ToolbarButton label="H3" title="Heading 3" onClick={() => applyHeading(3)} />
        )}
        <ToolbarButton label="P" title="Paragraph (normal text)" onClick={() => exec("formatBlock", "<p>")} />
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

      {imageModalOpen && (
        <RichImageModal onInsert={handleImageInsert} onClose={() => setImageModalOpen(false)} />
      )}
      {linkModalOpen && (
        <RichLinkModal onInsert={handleLinkInsert} onClose={() => setLinkModalOpen(false)} />
      )}
    </div>
  );
}
