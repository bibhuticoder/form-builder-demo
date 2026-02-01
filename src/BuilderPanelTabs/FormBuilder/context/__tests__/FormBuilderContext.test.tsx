import { useEffect } from 'react';
import { render, act } from '@testing-library/react';
import { FormBuilderProvider, useFormBuilder } from '../FormBuilderContext';
import { FieldType, FormStatus } from '../../types';

// Helper component to expose context methods for testing
const TestComponent = ({ onMount }: { onMount: (context: any) => void }) => {
    const context = useFormBuilder();
    useEffect(() => {
        onMount(context);
    }, [context, onMount]);
    return <div>Test</div>;
};

describe('FormBuilderContext', () => {
    let context: any;

    const renderProvider = (initialContent: any) => {
        return render(
            <FormBuilderProvider initialContent={initialContent}>
                <TestComponent onMount={(c) => context = c} />
            </FormBuilderProvider>
        );
    };

    const initialForm = {
        formSettings: {
            name: 'Init Form',
            status: FormStatus.DRAFT,
            settings: { width: 800 },
        },
        fields: [],
        logic: { version: 1, rules: [] },
    };

    it('initializes with provided content', () => {
        renderProvider(initialForm);
        expect(context.jsonContent.formSettings.name).toBe('Init Form');
    });

    it('updates form name', () => {
        renderProvider(initialForm);
        act(() => {
            context.updateFormName('Updated Name');
        });
        expect(context.jsonContent.formSettings.name).toBe('Updated Name');
    });

    it('updates form settings', () => {
        renderProvider(initialForm);
        act(() => {
            context.updateFormSettings({ backgroundColor: '#fff' });
        });
        expect(context.jsonContent.formSettings.backgroundColor).toBe('#fff');
    });

    it('updates canvas width', () => {
        renderProvider(initialForm);
        act(() => {
            context.updateCanvasWidth(500);
        });
        expect(context.jsonContent.formSettings.settings.width).toBe(500);
    });

    // Field Operations
    it('adds a field', () => {
        renderProvider(initialForm);
        const newField = { id: 'f1', type: FieldType.TEXT, label: 'Text' };
        act(() => {
            context.addField(newField);
        });
        expect(context.jsonContent.fields).toHaveLength(1);
        expect(context.jsonContent.fields[0].id).toBe('f1');
    });

    it('inserts a field in specific position', () => {
        const formWithFields = {
            ...initialForm,
            fields: [
                { id: 'f1', type: FieldType.TEXT },
                { id: 'f2', type: FieldType.TEXT }
            ]
        };
        renderProvider(formWithFields);

        const newField = { id: 'f3', type: FieldType.TEXT };
        act(() => {
            context.addField(newField, 'f1'); // Insert after f1
        });

        const ids = context.jsonContent.fields.map((f: any) => f.id);
        expect(ids).toEqual(['f1', 'f3', 'f2']);
    });

    it('updates a field', () => {
        const formWithFields = {
            ...initialForm,
            fields: [{ id: 'f1', type: FieldType.TEXT, label: 'Old' }]
        };
        renderProvider(formWithFields);

        act(() => {
            context.updateField('f1', { label: 'New' });
        });
        expect(context.jsonContent.fields[0].label).toBe('New');
    });

    it('batch updates field styles', () => {
        const formWithFields = {
            ...initialForm,
            fields: [{ id: 'f1', type: FieldType.TEXT, style: { color: 'red' } }]
        };
        renderProvider(formWithFields);

        act(() => {
            context.updateFieldStyleBatch('f1', { color: 'blue', fontSize: 12 });
        });

        expect(context.jsonContent.fields[0].style).toEqual({ color: 'blue', fontSize: 12 });
    });

    it('deletes a field', () => {
        const formWithFields = {
            ...initialForm,
            fields: [{ id: 'f1', type: FieldType.TEXT }]
        };
        renderProvider(formWithFields);

        act(() => {
            context.deleteField('f1');
        });
        expect(context.jsonContent.fields).toHaveLength(0);
    });

    it('reorders fields', () => {
        const formWithFields = {
            ...initialForm,
            fields: [
                { id: 'f1', type: FieldType.TEXT },
                { id: 'f2', type: FieldType.TEXT },
                { id: 'f3', type: FieldType.TEXT }
            ]
        };
        renderProvider(formWithFields);

        // Move f1 (index 0) to index 2
        act(() => {
            context.reorderFields(0, 2);
        });

        const ids = context.jsonContent.fields.map((f: any) => f.id);
        // arrayMove(items, 0, 2) -> [f2, f3, f1]
        expect(ids).toEqual(['f2', 'f3', 'f1']);
    });

    // Logic Rules
    it('adds logic rule', () => {
        renderProvider(initialForm);
        const rule = { id: 'r1', if: {}, then: [] };
        act(() => {
            context.addLogicRule(rule);
        });
        expect(context.jsonContent.logic.rules).toHaveLength(1);
        expect(context.jsonContent.logic.rules[0].id).toBe('r1');
    });

    it('updates logic rule', () => {
        const formWithRules = {
            ...initialForm,
            logic: { version: 1, rules: [{ id: 'r1', enabled: true }] }
        };
        renderProvider(formWithRules);

        act(() => {
            context.updateLogicRule('r1', { enabled: false });
        });
        expect(context.jsonContent.logic.rules[0].enabled).toBe(false);
    });

    it('deletes logic rule', () => {
        const formWithRules = {
            ...initialForm,
            logic: { version: 1, rules: [{ id: 'r1' }] }
        };
        renderProvider(formWithRules);

        act(() => {
            context.deleteLogicRule('r1');
        });
        expect(context.jsonContent.logic.rules).toHaveLength(0);
    });
});
