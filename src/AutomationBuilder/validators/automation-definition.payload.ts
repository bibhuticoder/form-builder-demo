import type { AutomationDefinition } from '../types';

export function asRecord(value: unknown): Record<string, unknown> | null {
    if (!value || typeof value !== 'object') return null;
    return value as Record<string, unknown>;
}

export function unwrapAutomationDefinition(value: unknown): unknown {
    const root = asRecord(value);
    if (!root) return value;
    if ('automation' in root) {
        return root.automation;
    }
    return value;
}

export function hasAutomationDefinitionShape(value: unknown): value is AutomationDefinition {
    if (!value || typeof value !== 'object') return false;
    const v = value as AutomationDefinition;
    return (
        typeof v.version === 'number' &&
        typeof v.id === 'string' &&
        typeof v.name === 'string' &&
        Array.isArray(v.nodes) &&
        Array.isArray(v.edges)
    );
}
