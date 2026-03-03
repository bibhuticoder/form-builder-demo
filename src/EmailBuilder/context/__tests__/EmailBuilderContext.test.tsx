import { useEffect } from 'react';
import { render, act } from '@testing-library/react';
import { EmailBuilderProvider, useEmailBuilder } from '../EmailBuilderContext';
import { EmailBlockType, EmailStatus } from '../../types';

const TestComponent = ({ onMount }: { onMount: (context: any) => void }) => {
    const context = useEmailBuilder();
    useEffect(() => {
        onMount(context);
    }, [context, onMount]);
    return <div>Test</div>;
};

describe('EmailBuilderContext', () => {
    let context: any;

    const renderProvider = (initialContent: any) => {
        return render(
            <EmailBuilderProvider initialContent={initialContent}>
                <TestComponent onMount={(c) => context = c} />
            </EmailBuilderProvider>
        );
    };

    const initialTemplate = {
        templateSettings: {
            name: 'Test Email',
            subject: 'Test Subject',
            status: EmailStatus.DRAFT,
            settings: { contentWidth: 600, fontFamily: 'Arial, sans-serif' },
        },
        blocks: [],
    };

    it('initializes with provided content', () => {
        renderProvider(initialTemplate);
        expect(context.jsonContent.templateSettings.name).toBe('Test Email');
    });

    it('updates template name', () => {
        renderProvider(initialTemplate);
        act(() => {
            context.updateTemplateName('Updated Email');
        });
        expect(context.jsonContent.templateSettings.name).toBe('Updated Email');
    });

    it('updates template settings', () => {
        renderProvider(initialTemplate);
        act(() => {
            context.updateTemplateSettings({ subject: 'New Subject' });
        });
        expect(context.jsonContent.templateSettings.subject).toBe('New Subject');
    });

    it('updates canvas width', () => {
        renderProvider(initialTemplate);
        act(() => {
            context.setCanvasWidth(375);
        });
        expect(context.canvasWidth).toBe(375);
    });

    it('derives active breakpoint from canvas width', () => {
        renderProvider(initialTemplate);
        // Default is 600px -> desktop
        expect(context.activeBreakpoint).toBe('desktop');

        act(() => {
            context.setCanvasWidth(375);
        });
        expect(context.activeBreakpoint).toBe('mobile');
    });

    // Block Operations
    it('adds a block', () => {
        renderProvider(initialTemplate);
        const newBlock = { id: 'b1', type: EmailBlockType.TEXT, content: 'Hello' };
        act(() => {
            context.addBlock(newBlock);
        });
        expect(context.jsonContent.blocks).toHaveLength(1);
        expect(context.jsonContent.blocks[0].id).toBe('b1');
    });

    it('inserts a block after ID position', () => {
        const templateWithBlocks = {
            ...initialTemplate,
            blocks: [
                { id: 'b1', type: EmailBlockType.TEXT, content: 'A' },
                { id: 'b2', type: EmailBlockType.TEXT, content: 'B' },
            ],
        };
        renderProvider(templateWithBlocks);

        const newBlock = { id: 'b3', type: EmailBlockType.TEXT, content: 'C' };
        act(() => {
            context.addBlock(newBlock, 'b1');
        });

        const ids = context.jsonContent.blocks.map((b: any) => b.id);
        expect(ids).toEqual(['b1', 'b3', 'b2']);
    });

    it('inserts a block at specific index', () => {
        const templateWithBlocks = {
            ...initialTemplate,
            blocks: [
                { id: 'b1', type: EmailBlockType.TEXT, content: 'A' },
                { id: 'b2', type: EmailBlockType.TEXT, content: 'B' },
            ],
        };
        renderProvider(templateWithBlocks);

        const newBlock = { id: 'b0', type: EmailBlockType.TEXT, content: 'Z' };
        act(() => {
            context.addBlock(newBlock, 0);
        });

        expect(context.jsonContent.blocks[0].id).toBe('b0');
        expect(context.jsonContent.blocks).toHaveLength(3);
    });

    it('updates a block', () => {
        const templateWithBlocks = {
            ...initialTemplate,
            blocks: [{ id: 'b1', type: EmailBlockType.TEXT, content: 'Old' }],
        };
        renderProvider(templateWithBlocks);

        act(() => {
            context.updateBlock('b1', { content: 'New' });
        });
        expect(context.jsonContent.blocks[0].content).toBe('New');
    });

    it('batch updates block styles', () => {
        const templateWithBlocks = {
            ...initialTemplate,
            blocks: [{ id: 'b1', type: EmailBlockType.TEXT, content: 'Text', style: {} }],
        };
        renderProvider(templateWithBlocks);

        act(() => {
            context.updateBlockStyleBatch('b1', { color: 'blue', fontSize: 12 });
        });

        // Should create style under the active breakpoint (desktop by default)
        expect(context.jsonContent.blocks[0].style.desktop).toEqual({ color: 'blue', fontSize: 12 });
    });

    it('deletes a block', () => {
        const templateWithBlocks = {
            ...initialTemplate,
            blocks: [{ id: 'b1', type: EmailBlockType.TEXT, content: 'Text' }],
        };
        renderProvider(templateWithBlocks);

        act(() => {
            context.deleteBlock('b1');
        });
        expect(context.jsonContent.blocks).toHaveLength(0);
    });

    it('reorders blocks', () => {
        const templateWithBlocks = {
            ...initialTemplate,
            blocks: [
                { id: 'b1', type: EmailBlockType.TEXT, content: 'A' },
                { id: 'b2', type: EmailBlockType.TEXT, content: 'B' },
                { id: 'b3', type: EmailBlockType.TEXT, content: 'C' },
            ],
        };
        renderProvider(templateWithBlocks);

        act(() => {
            context.reorderBlocks(0, 2);
        });

        const ids = context.jsonContent.blocks.map((b: any) => b.id);
        expect(ids).toEqual(['b2', 'b3', 'b1']);
    });

    // History
    it('supports undo and redo', () => {
        renderProvider(initialTemplate);

        act(() => {
            context.updateTemplateName('Version 2');
        });
        expect(context.jsonContent.templateSettings.name).toBe('Version 2');
        expect(context.canUndo).toBe(true);

        act(() => {
            context.undo();
        });
        expect(context.jsonContent.templateSettings.name).toBe('Test Email');
        expect(context.canRedo).toBe(true);

        act(() => {
            context.redo();
        });
        expect(context.jsonContent.templateSettings.name).toBe('Version 2');
    });

    it('throws error when used outside provider', () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation();
        expect(() => {
            render(<TestComponent onMount={() => {}} />);
        }).toThrow('useEmailBuilder must be used within an EmailBuilderProvider');
        consoleError.mockRestore();
    });
});
