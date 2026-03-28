import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { TextStyle } from '@tiptap/extension-text-style';
import { Node, Extension } from '@tiptap/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dialog } from "@/components/Dialog";

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

const FONT_FAMILY_OPTIONS = [
  { label: 'Default Font', value: '' },
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS", Helvetica, sans-serif' },
  { label: 'Georgia', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Courier New', value: '"Courier New", Courier, monospace' },
  { label: 'Sans Serif', value: 'sans-serif' },
  { label: 'Serif', value: 'serif' },
  { label: 'Monospace', value: 'monospace' },
];

const FONT_SIZE_OPTIONS = [
  { label: 'Default Size', value: '' },
  { label: '10px', value: '10px' },
  { label: '11px', value: '11px' },
  { label: '12px', value: '12px' },
  { label: '13px', value: '13px' },
  { label: '14px', value: '14px' },
  { label: '15px', value: '15px' },
  { label: '16px', value: '16px' },
  { label: '18px', value: '18px' },
  { label: '20px', value: '20px' },
  { label: '22px', value: '22px' },
  { label: '24px', value: '24px' },
  { label: '28px', value: '28px' },
  { label: '30px', value: '30px' },
  { label: '36px', value: '36px' },
  { label: '48px', value: '48px' },
  { label: '64px', value: '64px' },
];

const FontFamilyExtension = Extension.create({
  name: 'fontFamilyExtension',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: (element) => element.style.fontFamily || null,
            renderHTML: (attributes) => {
              if (!attributes.fontFamily) return {};
              return { style: `font-family: ${attributes.fontFamily}` };
            },
          },
        },
      },
    ];
  },
});

const FontSizeExtension = Extension.create({
  name: 'fontSizeExtension',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
});

const EmbedIframe = Node.create({
  name: 'embedIframe',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      src: {
        default: null,
      },
      class: {
        default: 'w-full rounded aspect-video',
      },
      frameborder: {
        default: '0',
      },
      allow: {
        default: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
      },
      allowfullscreen: {
        default: 'true',
      },
    };
  },
  parseHTML() {
    return [{ tag: 'iframe[src]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['iframe', HTMLAttributes];
  },
});

function getVideoEmbedInfo(url: string): { provider: 'youtube' | 'vimeo' | 'loom'; embedUrl: string } | null {
  if (!url) return null;

  // YouTube
  if (url.includes('youtube.com/watch')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (videoId) {
      return {
        provider: 'youtube',
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
      };
    }
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) {
      return {
        provider: 'youtube',
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
      };
    }
  }

  // Vimeo
  if (url.includes('vimeo.com/')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    if (videoId && /^\d+$/.test(videoId)) {
      return {
        provider: 'vimeo',
        embedUrl: `https://player.vimeo.com/video/${videoId}`,
      };
    }
  }

  // Loom
  if (url.includes('loom.com/share/')) {
    const videoId = url.split('loom.com/share/')[1]?.split('?')[0];
    if (videoId) {
      return {
        provider: 'loom',
        embedUrl: `https://www.loom.com/embed/${videoId}`,
      };
    }
  }

  return null;
}

function Toolbar({ editor }: Readonly<ToolbarProps>) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
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
  const textStyleAttributes = editor.getAttributes('textStyle') as { fontFamily?: string; fontSize?: string };
  const currentFontFamily = textStyleAttributes.fontFamily ?? '';
  const currentFontSize = textStyleAttributes.fontSize ?? '';

  const btnBase =
    'p-1 rounded text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';
  const btnActive = 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary';

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

  const applyImage = useCallback(() => {
    const url = imageUrl.trim();
    setImageDialogOpen(false);
    if (!url) return;
    requestAnimationFrame(() => {
      editor.chain().focus().setImage({ src: url, alt: 'Embedded image' }).run();
    });
    setImageUrl('');
  }, [editor, imageUrl]);

  const applyVideo = useCallback(() => {
    const url = videoUrl.trim();
    setVideoDialogOpen(false);
    if (!url) return;

    const embedInfo = getVideoEmbedInfo(url);
    if (!embedInfo) {
      setVideoUrl('');
      return;
    }

    requestAnimationFrame(() => {
      if (embedInfo.provider === 'youtube') {
        editor.chain().focus().setYoutubeVideo({ src: url }).run();
        return;
      }

      editor
        .chain()
        .focus()
        .insertContent({
          type: 'embedIframe',
          attrs: {
            src: embedInfo.embedUrl,
          },
        })
        .run();
    });
    setVideoUrl('');
  }, [editor, videoUrl]);

  return (
    <div
      className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-1"
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

      <span className="mx-1 h-4 w-px bg-gray-200 dark:bg-gray-700" />

      <select
        value={currentFontFamily}
        onChange={(e) => {
          const nextFontFamily = e.target.value;
          const nextAttrs = {
            fontFamily: nextFontFamily || null,
            fontSize: currentFontSize || null,
          };
          editor.chain().focus().setMark('textStyle', nextAttrs).run();
        }}
        className="h-7 rounded border border-gray-300 bg-white px-2 text-xs text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
        aria-label="Font family"
      >
        {FONT_FAMILY_OPTIONS.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={currentFontSize}
        onChange={(e) => {
          const nextFontSize = e.target.value;
          const nextAttrs = {
            fontFamily: currentFontFamily || null,
            fontSize: nextFontSize || null,
          };
          editor.chain().focus().setMark('textStyle', nextAttrs).run();
        }}
        className="h-7 rounded border border-gray-300 bg-white px-2 text-xs text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
        aria-label="Font size"
      >
        {FONT_SIZE_OPTIONS.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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

      <span className="mx-1 h-4 w-px bg-gray-200 dark:bg-gray-700" />

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

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={btn(editor.isActive({ textAlign: 'left' }))}
        aria-label="Align left"
        aria-pressed={editor.isActive({ textAlign: 'left' })}
      >
        Left
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={btn(editor.isActive({ textAlign: 'center' }))}
        aria-label="Align center"
        aria-pressed={editor.isActive({ textAlign: 'center' })}
      >
        Center
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={btn(editor.isActive({ textAlign: 'right' }))}
        aria-label="Align right"
        aria-pressed={editor.isActive({ textAlign: 'right' })}
      >
        Right
      </button>

      <span className="mx-1 h-4 w-px bg-gray-200 dark:bg-gray-700" />

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
      <button
        type="button"
        onClick={() => {
          setImageDialogOpen(true);
        }}
        className={btn(false)}
        aria-label="Image"
      >
        Image
      </button>
      <button
        type="button"
        onClick={() => {
          setVideoDialogOpen(true);
        }}
        className={btn(false)}
        aria-label="Video"
      >
        Video
      </button>

      <Dialog
        isOpen={linkDialogOpen}
        header="Insert Link"
        onClose={() => setLinkDialogOpen(false)}
        className="max-w-sm"
        body={
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">URL</label>
            <input
              type="url"
              className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
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
              className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            >
              Remove link
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLinkDialogOpen(false)}
                className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
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

      <Dialog
        isOpen={imageDialogOpen}
        header="Embed Image"
        onClose={() => setImageDialogOpen(false)}
        className="max-w-sm"
        body={
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">Image URL</label>
            <input
              type="url"
              className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') applyImage(); }}
              autoFocus
            />
          </div>
        }
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setImageDialogOpen(false)}
              className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={applyImage}
              className="px-3 py-1.5 text-xs text-white bg-primary hover:bg-primary-hover rounded transition-colors"
            >
              Embed
            </button>
          </div>
        }
      />

      <Dialog
        isOpen={videoDialogOpen}
        header="Embed Video"
        onClose={() => setVideoDialogOpen(false)}
        className="max-w-sm"
        body={
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">Video URL</label>
            <input
              type="url"
              className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="YouTube, Vimeo, or Loom URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') applyVideo(); }}
              autoFocus
            />
          </div>
        }
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setVideoDialogOpen(false)}
              className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={applyVideo}
              className="px-3 py-1.5 text-xs text-white bg-primary hover:bg-primary-hover rounded transition-colors"
            >
              Embed
            </button>
          </div>
        }
      />

      <span className="mx-1 h-4 w-px bg-gray-200 dark:bg-gray-700" />

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
      StarterKit.configure({
        italic: false,
      }),
      Italic,
      TextStyle,
      FontFamilyExtension,
      FontSizeExtension,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({ openOnClick: false }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded',
        },
      }),
      EmbedIframe,
      Youtube.configure({
        controls: true,
        nocookie: true,
        modestBranding: true,
        HTMLAttributes: {
          class: 'w-full rounded',
        },
      }),
    ],
    content,
    editable,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm dark:prose-invert max-w-none px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none min-h-[80px] focus:outline-none bg-white dark:bg-gray-900',
        ...(placeholder ? { 'data-placeholder': placeholder } : {}),
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange?.(e.getHTML());
    },
  });

  return (
    <div
      className={`rich-text rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden ${className}`}
    >
      {editable && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
