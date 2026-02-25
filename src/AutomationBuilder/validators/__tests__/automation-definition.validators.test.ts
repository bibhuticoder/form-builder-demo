import { isAutomationDefinition, validateAutomationDefinition } from '../automation-definition.validators';

describe('automation-definition.validators', () => {
    const validDefinition = {
        version: 1,
        id: 'auto_1',
        name: 'Welcome Flow',
        nodes: [
            {
                id: 'trigger-1',
                type: 'trigger',
                position: { x: 100, y: 50 },
                data: {
                    label: 'Form Submitted',
                    config: { triggerKind: 'form_submitted' },
                },
            },
            {
                id: 'action-1',
                type: 'action',
                position: { x: 100, y: 200 },
                data: {
                    label: 'Send Email',
                    config: { actionKind: 'send_email' },
                },
            },
        ],
        edges: [
            {
                id: 'e-1',
                source: 'trigger-1',
                target: 'action-1',
            },
        ],
    };

    it('type guard accepts valid shape', () => {
        expect(isAutomationDefinition(validDefinition)).toBe(true);
    });

    it('comprehensive validator passes valid definition', () => {
        const result = validateAutomationDefinition(validDefinition);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('fails on duplicate node ids + bad edge references', () => {
        const broken = {
            ...validDefinition,
            nodes: [
                ...validDefinition.nodes,
                {
                    id: 'action-1',
                    type: 'delay',
                    position: { x: 200, y: 300 },
                    data: {
                        label: 'Wait',
                        config: { amount: 2, unit: 'hours' },
                    },
                },
            ],
            edges: [
                ...validDefinition.edges,
                {
                    id: 'e-bad',
                    source: 'missing-source',
                    target: 'missing-target',
                },
            ],
        };

        const result = validateAutomationDefinition(broken);
        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.type === 'duplicate')).toBe(true);
        expect(result.errors.some((e) => e.type === 'invalid_reference')).toBe(true);
    });

    it('fails when root shape is invalid', () => {
        const result = validateAutomationDefinition({ foo: 'bar' });
        expect(result.valid).toBe(false);
    });
});
