/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { LogicBuilder } from '../components/LogicBuilder';
import { LogicComparison, FieldType } from '../../../../../types';
import type { LogicExpression, LogicCondition, Field } from '../../../../../types';

// Mock crypto.randomUUID for stable IDs in tests
let uuidCounter = 0;
beforeEach(() => {
    uuidCounter = 0;
    Object.defineProperty(globalThis, 'crypto', {
        value: { randomUUID: () => `test-uuid-${++uuidCounter}` },
        writable: true,
    });
});

const mockFields: Field[] = [
    { id: 'field_1', type: FieldType.TEXT, label: 'Name', style: {} } as Field,
    { id: 'field_2', type: FieldType.EMAIL, label: 'Email', style: {} } as Field,
];

function makeCondition(overrides: Partial<LogicCondition> = {}): LogicCondition {
    return {
        id: `cond-${++uuidCounter}`,
        comparison: LogicComparison.EQ,
        left: { var: 'field_1' },
        right: { str: 'test' },
        logicalOp: 'and',
        ...overrides,
    };
}

describe('LogicBuilder', () => {
    // =========================================================================
    // Visual grouping
    // =========================================================================

    describe('visual grouping', () => {
        it('renders a single condition in one group container', () => {
            const expression: LogicExpression = {
                conditions: [makeCondition()],
            };

            render(
                <LogicBuilder expression={expression} onChange={jest.fn()} fields={mockFields} />
            );

            const groups = screen.getAllByTestId('condition-group');
            expect(groups).toHaveLength(1);

            // One condition row inside
            const rows = groups[0].querySelectorAll('.grid');
            expect(rows).toHaveLength(1);
        });

        it('groups AND-connected conditions into a single container', () => {
            const expression: LogicExpression = {
                conditions: [
                    makeCondition({ logicalOp: 'and' }),
                    makeCondition({ logicalOp: 'and' }),
                    makeCondition(),
                ],
            };

            render(
                <LogicBuilder expression={expression} onChange={jest.fn()} fields={mockFields} />
            );

            const groups = screen.getAllByTestId('condition-group');
            expect(groups).toHaveLength(1);

            const rows = groups[0].querySelectorAll('.grid');
            expect(rows).toHaveLength(3);
        });

        it('splits conditions into separate groups at OR boundaries', () => {
            const expression: LogicExpression = {
                conditions: [
                    makeCondition({ logicalOp: 'or' }),   // Group 1
                    makeCondition({ logicalOp: 'and' }),   // Group 2
                    makeCondition(),                        // Group 2
                ],
            };

            render(
                <LogicBuilder expression={expression} onChange={jest.fn()} fields={mockFields} />
            );

            const groups = screen.getAllByTestId('condition-group');
            expect(groups).toHaveLength(2);

            // Group 1: 1 condition
            expect(groups[0].querySelectorAll('.grid')).toHaveLength(1);
            // Group 2: 2 conditions
            expect(groups[1].querySelectorAll('.grid')).toHaveLength(2);
        });

        it('creates three groups for A OR B OR C', () => {
            const expression: LogicExpression = {
                conditions: [
                    makeCondition({ logicalOp: 'or' }),
                    makeCondition({ logicalOp: 'or' }),
                    makeCondition(),
                ],
            };

            render(
                <LogicBuilder expression={expression} onChange={jest.fn()} fields={mockFields} />
            );

            const groups = screen.getAllByTestId('condition-group');
            expect(groups).toHaveLength(3);
        });

        it('handles mixed pattern: A AND B OR C AND D', () => {
            const expression: LogicExpression = {
                conditions: [
                    makeCondition({ logicalOp: 'and' }),   // Group 1
                    makeCondition({ logicalOp: 'or' }),    // Group 1 (OR splits after this)
                    makeCondition({ logicalOp: 'and' }),   // Group 2
                    makeCondition(),                        // Group 2
                ],
            };

            render(
                <LogicBuilder expression={expression} onChange={jest.fn()} fields={mockFields} />
            );

            const groups = screen.getAllByTestId('condition-group');
            expect(groups).toHaveLength(2);

            // Group 1: A, B
            expect(groups[0].querySelectorAll('.grid')).toHaveLength(2);
            // Group 2: C, D
            expect(groups[1].querySelectorAll('.grid')).toHaveLength(2);
        });
    });

    // =========================================================================
    // AND/OR toggle buttons
    // =========================================================================

    describe('AND/OR toggle buttons', () => {
        it('shows AND/OR toggle between every pair of conditions', () => {
            const expression: LogicExpression = {
                conditions: [
                    makeCondition({ logicalOp: 'and' }),
                    makeCondition({ logicalOp: 'or' }),
                    makeCondition(),
                ],
            };

            render(
                <LogicBuilder expression={expression} onChange={jest.fn()} fields={mockFields} />
            );

            // Two toggle pairs (between conditions 0-1 and 1-2)
            // Plus the "+ AND" and "+ OR" add buttons at the bottom
            const andButtons = screen.getAllByRole('button', { name: 'AND' });
            const orButtons = screen.getAllByRole('button', { name: 'OR' });
            // 2 toggles + 1 add button each
            expect(andButtons).toHaveLength(3);
            expect(orButtons).toHaveLength(3);
        });

        it('toggling AND to OR splits the group and calls onChange', () => {
            const onChange = jest.fn();
            const expression: LogicExpression = {
                conditions: [
                    makeCondition({ id: 'c1', logicalOp: 'and' }),
                    makeCondition({ id: 'c2' }),
                ],
            };

            render(
                <LogicBuilder expression={expression} onChange={onChange} fields={mockFields} />
            );

            // Click OR button (the toggle between conditions 0 and 1)
            const orButtons = screen.getAllByRole('button', { name: 'OR' });
            fireEvent.click(orButtons[0]);

            expect(onChange).toHaveBeenCalledTimes(1);
            const newExpr = onChange.mock.calls[0][0];
            expect(newExpr.conditions[0].logicalOp).toBe('or');
        });

        it('toggling OR to AND merges groups and calls onChange', () => {
            const onChange = jest.fn();
            const expression: LogicExpression = {
                conditions: [
                    makeCondition({ id: 'c1', logicalOp: 'or' }),
                    makeCondition({ id: 'c2' }),
                ],
            };

            render(
                <LogicBuilder expression={expression} onChange={onChange} fields={mockFields} />
            );

            // Click AND button (the toggle between the two groups)
            const andButtons = screen.getAllByRole('button', { name: 'AND' });
            fireEvent.click(andButtons[0]);

            expect(onChange).toHaveBeenCalledTimes(1);
            const newExpr = onChange.mock.calls[0][0];
            expect(newExpr.conditions[0].logicalOp).toBe('and');
        });

        it('does not show toggles in restrictedMode', () => {
            const expression: LogicExpression = {
                conditions: [
                    makeCondition({ id: 'c1', logicalOp: 'and', comparison: LogicComparison.ON_SUBMIT, left: { var: 'submit_btn' } }),
                    makeCondition({ id: 'c2', comparison: LogicComparison.ON_SUBMIT, left: { var: 'submit_btn' } }),
                ],
            };

            render(
                <LogicBuilder
                    expression={expression}
                    onChange={jest.fn()}
                    fields={mockFields}
                    restrictedMode={true}
                />
            );

            expect(screen.queryAllByRole('button', { name: 'AND' })).toHaveLength(0);
            expect(screen.queryAllByRole('button', { name: 'OR' })).toHaveLength(0);
        });
    });

    // =========================================================================
    // Add condition buttons
    // =========================================================================

    describe('add condition buttons', () => {
        it('shows "+ Condition" button when there are no conditions', () => {
            const expression: LogicExpression = { conditions: [] };

            render(
                <LogicBuilder expression={expression} onChange={jest.fn()} fields={mockFields} />
            );

            expect(screen.getByText('Condition')).toBeTruthy();
        });

        it('shows "+ AND" and "+ OR" buttons when conditions exist', () => {
            const expression: LogicExpression = {
                conditions: [makeCondition()],
            };

            render(
                <LogicBuilder expression={expression} onChange={jest.fn()} fields={mockFields} />
            );

            // There are AND/OR buttons (both toggles and add buttons)
            const andButtons = screen.getAllByRole('button', { name: 'AND' });
            const orButtons = screen.getAllByRole('button', { name: 'OR' });
            expect(andButtons.length).toBeGreaterThanOrEqual(1);
            expect(orButtons.length).toBeGreaterThanOrEqual(1);
        });

        it('clicking "+ AND" adds a condition with AND joiner on previous', () => {
            const onChange = jest.fn();
            const expression: LogicExpression = {
                conditions: [makeCondition({ id: 'c1' })],
            };

            render(
                <LogicBuilder expression={expression} onChange={onChange} fields={mockFields} />
            );

            // The add buttons are the last AND/OR buttons in the DOM
            const andButtons = screen.getAllByRole('button', { name: 'AND' });
            const addAndBtn = andButtons[andButtons.length - 1]; // last one is the add button
            fireEvent.click(addAndBtn);

            expect(onChange).toHaveBeenCalledTimes(1);
            const newExpr = onChange.mock.calls[0][0];
            expect(newExpr.conditions).toHaveLength(2);
            // Previous condition's joiner set to 'and'
            expect(newExpr.conditions[0].logicalOp).toBe('and');
        });

        it('clicking "+ OR" adds a condition with OR joiner on previous', () => {
            const onChange = jest.fn();
            const expression: LogicExpression = {
                conditions: [makeCondition({ id: 'c1' })],
            };

            render(
                <LogicBuilder expression={expression} onChange={onChange} fields={mockFields} />
            );

            const orButtons = screen.getAllByRole('button', { name: 'OR' });
            const addOrBtn = orButtons[orButtons.length - 1]; // last one is the add button
            fireEvent.click(addOrBtn);

            expect(onChange).toHaveBeenCalledTimes(1);
            const newExpr = onChange.mock.calls[0][0];
            expect(newExpr.conditions).toHaveLength(2);
            // Previous condition's joiner set to 'or'
            expect(newExpr.conditions[0].logicalOp).toBe('or');
        });

        it('does not show add buttons in restrictedMode', () => {
            const expression: LogicExpression = { conditions: [] };

            render(
                <LogicBuilder
                    expression={expression}
                    onChange={jest.fn()}
                    fields={mockFields}
                    restrictedMode={true}
                />
            );

            expect(screen.queryByText('Condition')).toBeNull();
        });
    });

    // =========================================================================
    // Remove condition
    // =========================================================================

    describe('remove condition', () => {
        it('removes the correct condition when X is clicked', () => {
            const onChange = jest.fn();
            const expression: LogicExpression = {
                conditions: [
                    makeCondition({ id: 'c1', right: { str: 'first' }, logicalOp: 'and' }),
                    makeCondition({ id: 'c2', right: { str: 'second' } }),
                ],
            };

            render(
                <LogicBuilder expression={expression} onChange={onChange} fields={mockFields} />
            );

            const removeButtons = screen.getAllByTitle('Remove Condition');
            expect(removeButtons).toHaveLength(2);

            // Remove first condition
            fireEvent.click(removeButtons[0]);

            expect(onChange).toHaveBeenCalledTimes(1);
            const newExpr = onChange.mock.calls[0][0];
            expect(newExpr.conditions).toHaveLength(1);
            expect(newExpr.conditions[0].id).toBe('c2');
        });
    });

    // =========================================================================
    // Empty state
    // =========================================================================

    describe('empty state', () => {
        it('renders no group containers when expression is empty', () => {
            const expression: LogicExpression = { conditions: [] };

            render(
                <LogicBuilder expression={expression} onChange={jest.fn()} fields={mockFields} />
            );

            expect(screen.queryAllByTestId('condition-group')).toHaveLength(0);
        });
    });
});
