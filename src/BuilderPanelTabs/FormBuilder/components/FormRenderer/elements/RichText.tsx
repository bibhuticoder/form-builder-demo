import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dialog } from '../../../../../components/Dialog';

interface RichTextProps {
  content?: string;
  onChange?: (html: string) => void;
  editable?: boolean;
  placeholder?: string;
  className?: string;
  uploadEndpoint?: string;
  uploadFieldName?: string;
  uploadHeaders?: Record<string, string>;
  uploadMedia?: (file: File, type: 'image' | 'video') => Promise<string>;
  resolveUploadUrl?: (response: unknown, type: 'image' | 'video') => string | null;
}

interface ToolbarProps {
  editor: ReturnType<typeof useEditor>;
  uploadMediaFile?: (file: File, type: 'image' | 'video') => Promise<string>;
}

const URL_CANDIDATE_KEYS = ['url', 'fileUrl', 'secure_url', 'location', 'src', 'href'];

function isDirectVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

function extractUrlFromResponse(response: unknown): string | null {
  if (!response) return null;

  if (typeof response === 'string') {
    return /^https?:\/\//i.test(response) ? response : null;
  }

  if (typeof response !== 'object') return null;

  const queue: unknown[] = [response];
  const seen = new Set<unknown>();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || typeof current !== 'object' || seen.has(current)) continue;
    seen.add(current);

    const obj = current as Record<string, unknown>;

    for (const key of URL_CANDIDATE_KEYS) {
      const value = obj[key];
      if (typeof value === 'string' && /^https?:\/\//i.test(value)) {
        return value;
      }
    }

    for (const value of Object.values(obj)) {
      if (value && typeof value === 'object') {
        queue.push(value);
      }
    }
  }

  return null;
}

function Toolbar({ editor, uploadMediaFile }: Readonly<ToolbarProps>) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const imageFileInputRef = useRef<HTMLInputElement | null>(null);
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);
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
  const canUploadMedia = Boolean(uploadMediaFile);

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
    requestAnimationFrame(() => {
      if (isDirectVideoUrl(url)) {
        editor
          .chain()
          .focus()
          .insertContent(`<video controls src="${url}" class="w-full rounded"></video>`)
          .run();
      } else {
        editor.chain().focus().setYoutubeVideo({ src: url }).run();
      }
    });
    setVideoUrl('');
  }, [editor, videoUrl]);

  const handleUploadFile = useCallback(
    async (file: File, type: 'image' | 'video') => {
      if (!uploadMediaFile) return;

      setUploadError(null);
      setIsUploading(true);
      try {
        const uploadedUrl = await uploadMediaFile(file, type);
        requestAnimationFrame(() => {
          if (type === 'image') {
            editor.chain().focus().setImage({ src: uploadedUrl, alt: file.name }).run();
            setImageDialogOpen(false);
            setImageUrl('');
          } else {
            if (isDirectVideoUrl(uploadedUrl)) {
              editor
                .chain()
                .focus()
                .insertContent(`<video controls src="${uploadedUrl}" class="w-full rounded"></video>`)
                .run();
            } else {
              editor.chain().focus().setYoutubeVideo({ src: uploadedUrl }).run();
            }
            setVideoDialogOpen(false);
            setVideoUrl('');
          }
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Upload failed';
        setUploadError(message);
      } finally {
        setIsUploading(false);
      }
    },
    [editor, uploadMediaFile]
  );

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
          setUploadError(null);
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
          setUploadError(null);
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
            <div className="pt-1 border-t border-gray-200 dark:border-gray-700">
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">Or upload image file</p>
              <input
                ref={imageFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    void handleUploadFile(file, 'image');
                  }
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                onClick={() => imageFileInputRef.current?.click()}
                disabled={!canUploadMedia || isUploading}
                className="px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Upload image'}
              </button>
            </div>
            {uploadError && <p className="text-[11px] text-red-500">{uploadError}</p>}
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
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') applyVideo(); }}
              autoFocus
            />
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Supports YouTube links.</p>
            <div className="pt-1 border-t border-gray-200 dark:border-gray-700">
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">Or upload video file</p>
              <input
                ref={videoFileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    void handleUploadFile(file, 'video');
                  }
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                onClick={() => videoFileInputRef.current?.click()}
                disabled={!canUploadMedia || isUploading}
                className="px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Upload video'}
              </button>
            </div>
            {uploadError && <p className="text-[11px] text-red-500">{uploadError}</p>}
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
  uploadEndpoint = '/api/upload',
  uploadFieldName = 'file',
  uploadHeaders,
  uploadMedia,
  resolveUploadUrl,
}: Readonly<RichTextProps>) {
  const uploadMediaFile = useCallback(
    async (file: File, type: 'image' | 'video'): Promise<string> => {
      if (uploadMedia) {
        return uploadMedia(file, type);
      }

      const formData = new FormData();
      formData.append(uploadFieldName, file);
      formData.append('mediaType', type);

      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        headers: uploadHeaders,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed (${response.status})`);
      }

      const data = await response.json().catch(() => null);
      const url = resolveUploadUrl?.(data, type) ?? extractUrlFromResponse(data);
      if (!url) {
        throw new Error('Upload succeeded but no URL was returned');
      }

      return url;
    },
    [uploadEndpoint, uploadFieldName, uploadHeaders, uploadMedia, resolveUploadUrl]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded',
        },
      }),
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
      className={`rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden ${className}`}
    >
      {editable && <Toolbar editor={editor} uploadMediaFile={uploadMediaFile} />}
      <EditorContent editor={editor} />
    </div>
  );
}
