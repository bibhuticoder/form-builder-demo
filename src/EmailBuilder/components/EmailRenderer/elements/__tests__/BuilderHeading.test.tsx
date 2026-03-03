/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderHeading from '../BuilderHeading';
import { EmailBlockType, HeadingLevel } from '../../../../types/enums';
import { MockEmailBuilderProvider } from './MockEmailBuilderProvider';

describe('BuilderHeading', () => {
    it('renders the correct heading level and content', () => {
        render(
            <MockEmailBuilderProvider>
                <BuilderHeading
                    block={{
                        id: 'heading_1',
                        type: EmailBlockType.HEADING,
                        content: 'Welcome to our Newsletter',
                        headingLevel: HeadingLevel.H1,
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        expect(screen.getByRole('heading', { level: 1 })).toBeTruthy();
        expect(screen.getByText('Welcome to our Newsletter')).toBeTruthy();
    });

    it('defaults to h2 when no heading level specified', () => {
        render(
            <MockEmailBuilderProvider>
                <BuilderHeading
                    block={{
                        id: 'heading_2',
                        type: EmailBlockType.HEADING,
                        content: 'Section Title',
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        expect(screen.getByRole('heading', { level: 2 })).toBeTruthy();
    });

    it('renders H3 level heading', () => {
        render(
            <MockEmailBuilderProvider>
                <BuilderHeading
                    block={{
                        id: 'heading_3',
                        type: EmailBlockType.HEADING,
                        content: 'Sub Section',
                        headingLevel: HeadingLevel.H3,
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        expect(screen.getByRole('heading', { level: 3 })).toBeTruthy();
    });
});
