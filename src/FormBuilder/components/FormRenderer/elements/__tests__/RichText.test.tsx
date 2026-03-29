/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import RichText from '../../../../../components/RichText';

// TipTap relies on DOM APIs not fully available in jsdom.
// Mock the @tiptap/react module to provide a lightweight substitute.
const mockChain = () =>
  new Proxy(
    {},
    {
      get: () => mockChain,
    }
  ) as any;

let lastEditorOpts: any = {};

jest.mock('@tiptap/react', () => {
  const React = require('react');
  return {
    useEditor: (opts: any) => {
      lastEditorOpts = opts;
      return {
        getHTML: () => opts.content || '',
        isActive: () => false,
        can: () => ({ undo: () => false, redo: () => false }),
        chain: () => ({
          focus: () => mockChain(),
        }),
        getAttributes: () => ({}),
        state: { selection: { empty: true, from: 0, to: 0 } },
        on: () => {},
        off: () => {},
      };
    },
    EditorContent: ({ editor }: any) => {
      if (!editor) return null;
      return React.createElement('div', {
        'data-testid': 'editor-content',
        'data-placeholder': lastEditorOpts?.editorProps?.attributes?.['data-placeholder'],
        dangerouslySetInnerHTML: { __html: editor.getHTML() },
      });
    },
  };
});

jest.mock('@tiptap/starter-kit', () => ({
  __esModule: true,
  default: { configure: () => ({}) },
}));
jest.mock('@tiptap/extension-italic', () => ({ __esModule: true, default: {} }));
jest.mock('@tiptap/extension-underline', () => ({ __esModule: true, default: {} }));
jest.mock('@tiptap/extension-text-align', () => ({
  __esModule: true,
  default: { configure: () => ({}) },
}));
jest.mock('@tiptap/extension-link', () => ({
  __esModule: true,
  default: { configure: () => ({}) },
}));
jest.mock('@tiptap/extension-image', () => ({
  __esModule: true,
  default: { configure: () => ({}) },
}));
jest.mock('@tiptap/extension-text-style', () => ({
  __esModule: true,
  TextStyle: {},
}));
jest.mock('@tiptap/extension-youtube', () => ({
  __esModule: true,
  default: { configure: () => ({}) },
}));

describe('RichText', () => {
  beforeEach(() => {
    lastEditorOpts = {};
  });

  it('renders with default empty state', () => {
    render(<RichText />);
    expect(screen.getByTestId('editor-content')).toBeTruthy();
  });

  it('renders with initial HTML content', () => {
    render(<RichText content="<p>Hello world</p>" />);
    expect(screen.getByTestId('editor-content').innerHTML).toContain(
      'Hello world'
    );
  });

  it('shows toolbar when editable (default)', () => {
    render(<RichText />);
    expect(screen.getByRole('toolbar')).toBeTruthy();
  });

  it('hides toolbar when editable={false}', () => {
    render(<RichText editable={false} />);
    expect(screen.queryByRole('toolbar')).toBeNull();
  });

  it('toolbar buttons are present', () => {
    render(<RichText />);
    expect(screen.getByLabelText('Bold')).toBeTruthy();
    expect(screen.getByLabelText('Italic')).toBeTruthy();
    expect(screen.getByLabelText('Underline')).toBeTruthy();
    expect(screen.getByLabelText('Strikethrough')).toBeTruthy();
    expect(screen.getByLabelText('Font family')).toBeTruthy();
    expect(screen.getByLabelText('Font size')).toBeTruthy();
    expect(screen.getByLabelText('Bullet list')).toBeTruthy();
    expect(screen.getByLabelText('Ordered list')).toBeTruthy();
    expect(screen.getByLabelText('Blockquote')).toBeTruthy();
    expect(screen.getByLabelText('Align left')).toBeTruthy();
    expect(screen.getByLabelText('Align center')).toBeTruthy();
    expect(screen.getByLabelText('Align right')).toBeTruthy();
    expect(screen.getByLabelText('Link')).toBeTruthy();
    expect(screen.getByLabelText('Image')).toBeTruthy();
    expect(screen.getByLabelText('Video')).toBeTruthy();
    expect(screen.getByLabelText('Undo')).toBeTruthy();
    expect(screen.getByLabelText('Redo')).toBeTruthy();
  });

  it('applies placeholder text via data attribute', () => {
    render(<RichText placeholder="Type something..." />);
    expect(
      screen.getByTestId('editor-content').getAttribute('data-placeholder')
    ).toBe('Type something...');
  });

  it('calls onChange when content updates', () => {
    const handleChange = jest.fn();
    render(<RichText content="<p>test</p>" onChange={handleChange} />);
    // Simulate the onUpdate callback stored by useEditor
    expect(lastEditorOpts.onUpdate).toBeDefined();
    lastEditorOpts.onUpdate({
      editor: { getHTML: () => '<p>updated</p>' },
    });
    expect(handleChange).toHaveBeenCalledWith('<p>updated</p>');
  });

  it('applies custom className', () => {
    const { container } = render(<RichText className="my-custom-class" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('my-custom-class');
  });
});
