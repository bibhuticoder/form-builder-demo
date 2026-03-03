/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderHtml from '../BuilderHtml';
import { EmailBlockType } from '../../../../types/enums';
import { MockEmailBuilderProvider } from './MockEmailBuilderProvider';

describe('BuilderHtml', () => {
    it('renders HTML content', () => {
        render(
            <MockEmailBuilderProvider>
                <BuilderHtml
                    block={{
                        id: 'html_1',
                        type: EmailBlockType.HTML,
                        content: '<p>Custom paragraph</p>',
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        expect(screen.getByText('Custom paragraph')).toBeTruthy();
    });

    it('renders complex HTML', () => {
        render(
            <MockEmailBuilderProvider>
                <BuilderHtml
                    block={{
                        id: 'html_2',
                        type: EmailBlockType.HTML,
                        content: '<div><strong>Bold</strong> and <em>italic</em></div>',
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        expect(screen.getByText('Bold')).toBeTruthy();
        expect(screen.getByText('italic')).toBeTruthy();
    });
});
