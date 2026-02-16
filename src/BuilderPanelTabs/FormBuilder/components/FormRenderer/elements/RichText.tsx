import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dialog } from '../../../../../components/Dialog';

interface RichTextProps {
  content?: string;
  onChange?: (html: string) => void;
  editable?: boolean;
  placeholder?: string;
  className?: string;
}

interface ToolbarProps {
  editor: ReturnType<typeof useEditor>;
}

function Toolbar({ editor }: Readonly<ToolbarProps>) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const savedSelection = useRef<{ from: number; to: number } | null>(null);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!editor) return;
    const handler = () => forceUpdate((n) => n + 1);
    editor.on('selectionUpdate', handler);
    editor.on('transaction', handler);
    return () => {
      editor.off('selectionUpdate', handler);
      editor.off('transaction', handler);
    };
  }, [editor]);

  if (!editor) return null;

  const hasTextSelection = !editor.state.selection.empty;
  const isOnLink = editor.isActive('link');
  const canLink = hasTextSelection || isOnLink;

  const btnBase =
    'p-1 rounded text-xs text-gray-600 hover:bg-gray-200 transition-colors';
  const btnActive = 'bg-primary/10 text-primary';

  const btn = (isActive: boolean) =>
    `${btnBase} ${isActive ? btnActive : ''}`;

  const openLinkDialog = useCallback(() => {
    const { from, to } = editor.state.selection;
    savedSelection.current = { from, to };
    const previousUrl = (editor.getAttributes('link').href as string) || '';
    setLinkUrl(previousUrl);
    setLinkDialogOpen(true);
  }, [editor]);

  const applyLink = useCallback(() => {
    if (!savedSelection.current) return;
    const { from, to } = savedSelection.current;
    const url = linkUrl;
    savedSelection.current = null;
    setLinkDialogOpen(false);
    requestAnimationFrame(() => {
      if (url === '') {
        editor.chain().focus().setTextSelection({ from, to }).extendMarkRange('link').unsetLink().run();
      } else {
        editor.chain().focus().setTextSelection({ from, to }).setLink({ href: url }).run();
      }
    });
  }, [editor, linkUrl]);

  const removeLink = useCallback(() => {
    if (!savedSelection.current) return;
    const { from, to } = savedSelection.current;
    savedSelection.current = null;
    setLinkDialogOpen(false);
    requestAnimationFrame(() => {
      editor.chain().focus().setTextSelection({ from, to }).extendMarkRange('link').unsetLink().run();
    });
  }, [editor]);

  return (
    <div
      className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 px-2 py-1"
      role="toolbar"
      aria-label="Formatting options"
    >
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btn(editor.isActive('bold'))}
        aria-label="Bold"
        aria-pressed={editor.isActive('bold')}
      >
        <span className="font-bold">B</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btn(editor.isActive('italic'))}
        aria-label="Italic"
        aria-pressed={editor.isActive('italic')}
      >
        <span className="italic">I</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={btn(editor.isActive('underline'))}
        aria-label="Underline"
        aria-pressed={editor.isActive('underline')}
      >
        <span className="underline">U</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={btn(editor.isActive('strike'))}
        aria-label="Strikethrough"
        aria-pressed={editor.isActive('strike')}
      >
        <span className="line-through">S</span>
      </button>

      <span className="mx-1 h-4 w-px bg-gray-200" />

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        className={btn(editor.isActive('heading', { level: 1 }))}
        aria-label="Heading 1"
        aria-pressed={editor.isActive('heading', { level: 1 })}
      >
        H1
      </button>
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        className={btn(editor.isActive('heading', { level: 2 }))}
        aria-label="Heading 2"
        aria-pressed={editor.isActive('heading', { level: 2 })}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        className={btn(editor.isActive('heading', { level: 3 }))}
        aria-label="Heading 3"
        aria-pressed={editor.isActive('heading', { level: 3 })}
      >
        H3
      </button>

      <span className="mx-1 h-4 w-px bg-gray-200" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btn(editor.isActive('bulletList'))}
        aria-label="Bullet list"
        aria-pressed={editor.isActive('bulletList')}
      >
        &bull; List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btn(editor.isActive('orderedList'))}
        aria-label="Ordered list"
        aria-pressed={editor.isActive('orderedList')}
      >
        1. List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btn(editor.isActive('blockquote'))}
        aria-label="Blockquote"
        aria-pressed={editor.isActive('blockquote')}
      >
        &ldquo; Quote
      </button>

      <span className="mx-1 h-4 w-px bg-gray-200" />

      <button
        type="button"
        onClick={openLinkDialog}
        disabled={!canLink}
        className={`${btn(isOnLink)} ${!canLink ? 'opacity-30 cursor-not-allowed' : ''}`}
        aria-label="Link"
        aria-pressed={isOnLink}
      >
        Link
      </button>

      <Dialog
        isOpen={linkDialogOpen}
        header="Insert Link"
        onClose={() => setLinkDialogOpen(false)}
        className="max-w-sm"
        body={
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-600">URL</label>
            <input
              type="url"
              className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') applyLink(); }}
              autoFocus
            />
          </div>
        }
        footer={
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={removeLink}
              className="text-xs text-red-500 hover:text-red-700 transition-colors"
            >
              Remove link
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLinkDialogOpen(false)}
                className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyLink}
                className="px-3 py-1.5 text-xs text-white bg-primary hover:bg-primary-hover rounded transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        }
      />

      <span className="mx-1 h-4 w-px bg-gray-200" />

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={`${btnBase} disabled:opacity-30`}
        aria-label="Undo"
      >
        Undo
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={`${btnBase} disabled:opacity-30`}
        aria-label="Redo"
      >
        Redo
      </button>
    </div>
  );
}

export default function RichText({
  content = '',
  onChange,
  editable = true,
  placeholder,
  className = '',
}: Readonly<RichTextProps>) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
    ],
    content,
    editable,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none px-3 py-2 text-sm text-gray-900 outline-none min-h-[80px] focus:outline-none',
        ...(placeholder ? { 'data-placeholder': placeholder } : {}),
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange?.(e.getHTML());
    },
  });

  return (
    <div
      className={`rounded-md border border-gray-300 bg-white overflow-hidden ${className}`}
    >
      {editable && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
