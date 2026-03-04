/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderColumns from '../BuilderColumns';
import { EmailBlockType } from '../../../../types/enums';
import { MockEmailBuilderProvider } from './MockEmailBuilderProvider';

describe('BuilderColumns', () => {
    it('renders empty columns with placeholder text', () => {
        render(
            <MockEmailBuilderProvider>
                <BuilderColumns
                    block={{
                        id: 'columns_1',
                        type: EmailBlockType.COLUMNS,
                        columns: [
                            { id: 'c1', width: '50%', blocks: [] },
                            { id: 'c2', width: '50%', blocks: [] },
                        ],
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        const placeholders = screen.getAllByText('Drop blocks here');
        expect(placeholders).toHaveLength(2);
    });

    it('renders correct number of columns', () => {
        render(
            <MockEmailBuilderProvider>
                <BuilderColumns
                    block={{
                        id: 'columns_2',
                        type: EmailBlockType.COLUMNS,
                        columns: [
                            { id: 'c1', width: '33.33%', blocks: [] },
                            { id: 'c2', width: '33.33%', blocks: [] },
                            { id: 'c3', width: '33.33%', blocks: [] },
                        ],
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        const placeholders = screen.getAllByText('Drop blocks here');
        expect(placeholders).toHaveLength(3);
    });

    it('renders nested block content inside columns', () => {
        render(
            <MockEmailBuilderProvider>
                <BuilderColumns
                    block={{
                        id: 'columns_3',
                        type: EmailBlockType.COLUMNS,
                        columns: [
                            {
                                id: 'c1',
                                width: '50%',
                                blocks: [
                                    { id: 'nested_1', type: EmailBlockType.TEXT, content: 'Hello', style: {} },
                                ],
                            },
                            { id: 'c2', width: '50%', blocks: [] },
                        ],
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        expect(screen.getByText('Hello')).toBeTruthy();
        expect(screen.getByText('Drop blocks here')).toBeTruthy();
    });
});
