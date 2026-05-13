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

    it('accepts PRD-style wrapped payload with ui/config node data', () => {
        const payload = {
            automation: {
                id: 'auto_001',
                name: 'Lead Follow Up Flow',
                status: 'active',
                version: 1,
                createdAt: '2026-02-22T18:00:00Z',
                updatedAt: '2026-02-22T18:00:00Z',
                nodes: [
                    {
                        id: 'node_trigger_1',
                        type: 'trigger',
                        position: { x: 100, y: 200 },
                        data: {
                            ui: { label: 'Form Submitted', subtitle: 'Cleave form submission' },
                            config: { triggerType: 'FORM_SUBMITTED', formType: 'cleave', formId: 'form_abc123' },
                        },
                    },
                    {
                        id: 'node_logic_1',
                        type: 'logic_if_else',
                        position: { x: 400, y: 200 },
                        data: {
                            ui: { label: 'If / Else', subtitle: '3 conditions' },
                            config: {
                                evaluationOrder: 'sequential',
                                branches: [
                                    {
                                        id: 'branch_if_1',
                                        label: 'If',
                                        logicalOperator: 'and',
                                        conditions: [{ field: 'contact.email', comparison: 'is_null' }],
                                    },
                                ],
                                elseLabel: 'Else',
                            },
                        },
                    },
                    {
                        id: 'node_action_sms',
                        type: 'action_notification',
                        position: { x: 700, y: 100 },
                        data: {
                            ui: { label: 'Send SMS', subtitle: 'Missing email follow-up' },
                            config: { recipientType: 'contact', message: 'Hello' },
                        },
                    },
                    {
                        id: 'node_loop_1',
                        type: 'loop_back',
                        position: { x: 1000, y: 100 },
                        data: {
                            ui: { label: 'Loop Back', subtitle: 'Max 2 times' },
                            config: { maxLoops: 2 },
                        },
                    },
                    {
                        id: 'node_end',
                        type: 'end',
                        position: { x: 1300, y: 200 },
                        data: {
                            ui: { label: 'End' },
                            config: {},
                        },
                    },
                ],
                edges: [
                    { id: 'edge_1', source: 'node_trigger_1', target: 'node_logic_1', data: {} },
                    { id: 'edge_2', source: 'node_logic_1', target: 'node_action_sms', data: { label: 'Branch A' } },
                    { id: 'edge_3', source: 'node_action_sms', target: 'node_loop_1', data: {} },
                    { id: 'edge_4', source: 'node_loop_1', target: 'node_end', data: {} },
                    { id: 'edge_loop', source: 'node_loop_1', target: 'node_action_sms', data: { isLoopBack: true } },
                ],
            },
        };

        const result = validateAutomationDefinition(payload);
        expect(result.valid).toBe(true);
    });

    it('fails when required outgoing paths or loop limits are missing', () => {
        const payload = {
            automation: {
                id: 'auto_002',
                name: 'Broken Flow',
                version: 1,
                nodes: [
                    {
                        id: 'trigger_1',
                        type: 'trigger',
                        position: { x: 0, y: 0 },
                        data: { ui: { label: 'Form Submitted' }, config: { triggerType: 'FORM_SUBMITTED' } },
                    },
                    {
                        id: 'loop_1',
                        type: 'loop_back',
                        position: { x: 0, y: 100 },
                        data: { ui: { label: 'Loop Back' }, config: {} },
                    },
                ],
                edges: [
                    { id: 'e1', source: 'trigger_1', target: 'loop_1', data: {} },
                    { id: 'e2', source: 'loop_1', target: 'trigger_1', data: { isLoopBack: true } },
                ],
            },
        };

        const result = validateAutomationDefinition(payload);
        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.message.includes('must have at least 1 outgoing path'))).toBe(true);
        expect(result.errors.some((e) => e.message.includes('must define maxLoops'))).toBe(true);
    });

    it('fails cycles without loop limits on non-loop edges', () => {
        const payload = {
            automation: {
                id: 'auto_003',
                name: 'Cycle Flow',
                version: 1,
                nodes: [
                    {
                        id: 'trigger_1',
                        type: 'trigger',
                        position: { x: 0, y: 0 },
                        data: { ui: { label: 'Form Submitted' }, config: { triggerType: 'FORM_SUBMITTED' } },
                    },
                    {
                        id: 'logic_1',
                        type: 'logic_if_else',
                        position: { x: 0, y: 100 },
                        data: {
                            ui: { label: 'If / Else' },
                            config: {
                                branches: [
                                    {
                                        id: 'branch_if_a',
                                        label: 'If',
                                        logicalOperator: 'and',
                                        conditions: [{ field: 'a', comparison: 'is_null' }],
                                    },
                                ],
                                elseLabel: 'Else',
                            },
                        },
                    },
                ],
                edges: [
                    { id: 'e1', source: 'trigger_1', target: 'logic_1', data: {} },
                    { id: 'e2', source: 'logic_1', target: 'trigger_1', data: {} },
                ],
            },
        };

        const result = validateAutomationDefinition(payload);
        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.message.includes('Cycles without loop limits are not allowed'))).toBe(true);
    });
});
