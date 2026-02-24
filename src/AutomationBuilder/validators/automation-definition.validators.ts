import type { AutomationDefinition } from '../types';

export function isAutomationDefinition(value: unknown): value is AutomationDefinition {
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
