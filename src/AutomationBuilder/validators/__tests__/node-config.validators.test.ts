import { validateActionConfig, validateDelayConfig, validateLogicConfig, validateNodeInteractiveData, validateTriggerConfig } from '../node-config.validators';
import type { Node } from 'reactflow';

describe('node-config.validators', () => {
    describe('validateTriggerConfig', () => {
        it('accepts valid trigger config', () => {
            const errors = validateTriggerConfig({ triggerKind: 'form_submitted', filters: [] }, 'node.data.config');
            expect(errors).toHaveLength(0);
        });

        it('rejects invalid trigger kind', () => {
            const errors = validateTriggerConfig({ triggerKind: 'invalid' }, 'node.data.config');
            expect(errors.some((e) => e.path.endsWith('.triggerKind'))).toBe(true);
        });
    });

    describe('validateActionConfig', () => {
        it('accepts valid action config', () => {
            const errors = validateActionConfig({ actionKind: 'send_email' }, 'node.data.config');
            expect(errors).toHaveLength(0);
        });

        it('rejects invalid action kind', () => {
            const errors = validateActionConfig({ actionKind: 'xxx' }, 'node.data.config');
            expect(errors.some((e) => e.path.endsWith('.actionKind'))).toBe(true);
        });
    });

    describe('validateLogicConfig', () => {
        it('validates split test weights', () => {
            const ok = validateLogicConfig({ logicKind: 'split_test', weights: [50, 50] }, 'node.data.config');
            expect(ok).toHaveLength(0);

            const bad = validateLogicConfig({ logicKind: 'split_test', weights: [100] }, 'node.data.config');
            expect(bad.some((e) => e.path.endsWith('.weights'))).toBe(true);
        });

        it('validates loop back maxLoops', () => {
            const bad = validateLogicConfig({ logicKind: 'loop_back', maxLoops: 0 }, 'node.data.config');
            expect(bad.some((e) => e.path.endsWith('.maxLoops'))).toBe(true);
        });
    });

    describe('validateDelayConfig', () => {
        it('validates delay amount + unit', () => {
            const ok = validateDelayConfig({ amount: 2, unit: 'hours' }, 'node.data.config');
            expect(ok).toHaveLength(0);

            const bad = validateDelayConfig({ amount: -1, unit: 'weeks' }, 'node.data.config');
            expect(bad.length).toBeGreaterThan(0);
        });
    });

    describe('validateNodeInteractiveData', () => {
        it('routes validation by node type', () => {
            const node: Node = {
                id: 'n1',
                type: 'trigger',
                position: { x: 0, y: 0 },
                data: {
                    label: 'Form Submitted',
                    config: { triggerKind: 'form_submitted' },
                },
            };

            const errors = validateNodeInteractiveData(node, 'nodes[0]');
            expect(errors).toHaveLength(0);
        });

        it('requires non-empty node label', () => {
            const node: Node = {
                id: 'n1',
                type: 'action',
                position: { x: 0, y: 0 },
                data: {
                    label: '',
                    config: { actionKind: 'send_email' },
                },
            };

            const errors = validateNodeInteractiveData(node, 'nodes[0]');
            expect(errors.some((e) => e.path === 'nodes[0].data.label')).toBe(true);
        });
    });
});
