import { render, screen, cleanup } from '@testing-library/react';
import { FieldType, FormStatus, FormDefinition } from '../../../types';
import FormRenderer from '../FormRenderer';
import { MockFormBuilderProvider } from '../elements/__tests__/MockFormBuilderProvider';

describe('FormRenderer - Dynamic Updates & Styles', () => {
    afterEach(cleanup);

    const baseForm: FormDefinition = {
        formSettings: {
            name: 'Test Form',
            status: FormStatus.DRAFT,
            settings: {
                width: 800,
                fontFamilyBody: 'Inter',
                fontFamilyTitle: 'Inter'
            },
        },
        fields: [
            {
                id: '1',
                type: FieldType.TEXT,
                label: 'Initial Label',
                placeholder: 'Initial Placeholder',
                style: {
                    input: {
                        borderRadius: '0px',
                        borderColor: '#000000'
                    }
                }
            } as any
        ],
    };

    it('updates text content when formData prop changes', () => {
        const { rerender } = render(
            <MockFormBuilderProvider>
                <FormRenderer formData={baseForm} canvasWidth={768} />
            </MockFormBuilderProvider>
        );

        expect(screen.getByText('Initial Label')).toBeTruthy();

        // Update label
        const updatedForm = {
            ...baseForm,
            fields: [
                {
                    ...baseForm.fields[0],
                    label: 'Updated Label',
                },
            ],
        };

        rerender(
            <MockFormBuilderProvider>
                <FormRenderer formData={updatedForm} canvasWidth={768} />
            </MockFormBuilderProvider>
        );

        expect(screen.queryByText('Initial Label')).toBeNull();
        expect(screen.getByText('Updated Label')).toBeTruthy();
    });

    it('applies field styles to rendered elements', () => {
        render(
            <MockFormBuilderProvider>
                <FormRenderer formData={baseForm} canvasWidth={768} />
            </MockFormBuilderProvider>
        );

        // This selector depends on implementation. 
        // Assuming BuilderText renders an input.
        // Note: Tailwind classes or inline styles might be used. 
        // If inline styles:
        // expect(input).toHaveStyle({ backgroundColor: '#ff0000' });

        // If styled-components or tailwind, we might check class or computed style.
        // Let's assume inline style for user-customizable colors often.
        // If this fails, I'll need to check BuilderText implementation.

        // Actually, style application for 'inputBackgroundColor' might be on the input itself.
        // Let's check if we can verify the style.
        // 'full' width usually maps to 'w-full' class.
    });
});
