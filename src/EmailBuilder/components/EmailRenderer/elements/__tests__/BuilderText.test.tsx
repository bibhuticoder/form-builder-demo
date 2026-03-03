/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderText from '../BuilderText';
import { EmailBlockType } from '../../../../types/enums';
import { MockEmailBuilderProvider } from './MockEmailBuilderProvider';

describe('BuilderText', () => {
    it('renders text content', () => {
        render(
            <MockEmailBuilderProvider>
                <BuilderText
                    block={{
                        id: 'text_1',
                        type: EmailBlockType.TEXT,
                        content: 'Hello world',
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        expect(screen.getByText('Hello world')).toBeTruthy();
    });

    it('renders HTML content', () => {
        render(
            <MockEmailBuilderProvider>
                <BuilderText
                    block={{
                        id: 'text_2',
                        type: EmailBlockType.TEXT,
                        content: '<strong>Bold text</strong>',
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        expect(screen.getByText('Bold text')).toBeTruthy();
    });
});
