import type { AutomationDefinition } from '../types';
import type { AutomationValidationResult } from '../types';
import { AutomationValidationResultBuilder } from './validation-result-builder';
import { validateNodeInteractiveData } from './node-config.validators';

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

export function validateAutomationDefinition(value: unknown): AutomationValidationResult {
    const builder = new AutomationValidationResultBuilder();

    if (!value || typeof value !== 'object') {
        builder.addError('root', 'Automation definition must be an object.', 'invalid_type');
        return builder.build();
    }

    if (!isAutomationDefinition(value)) {
        builder.addError('root', 'Automation definition is missing required fields.', 'invalid_structure');
        return builder.build();
    }

    const definition = value as AutomationDefinition;

    if (definition.version <= 0 || !Number.isFinite(definition.version)) {
        builder.addError('version', 'version must be a positive number.', 'invalid_value');
    }

    if (!definition.id.trim()) {
        builder.addError('id', 'id cannot be empty.', 'required');
    }

    if (!definition.name.trim()) {
        builder.addError('name', 'name cannot be empty.', 'required');
    }

    const nodeIds = new Set<string>();
    definition.nodes.forEach((node, index) => {
        const path = `nodes[${index}]`;
        if (!node?.id || typeof node.id !== 'string') {
            builder.addError(`${path}.id`, 'Node id is required.', 'required');
            return;
        }

        if (nodeIds.has(node.id)) {
            builder.addError(`${path}.id`, 'Node ids must be unique.', 'duplicate');
        }
        nodeIds.add(node.id);

        if (!node.position || typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
            builder.addError(`${path}.position`, 'Node position must include numeric x and y.', 'invalid_type');
        }

        builder.addErrors(validateNodeInteractiveData(node, path));
    });

    definition.edges.forEach((edge, index) => {
        const path = `edges[${index}]`;
        if (!edge?.id || typeof edge.id !== 'string') {
            builder.addError(`${path}.id`, 'Edge id is required.', 'required');
        }
        if (!edge?.source || typeof edge.source !== 'string') {
            builder.addError(`${path}.source`, 'Edge source is required.', 'required');
        }
        if (!edge?.target || typeof edge.target !== 'string') {
            builder.addError(`${path}.target`, 'Edge target is required.', 'required');
        }
        if (edge?.source && !nodeIds.has(edge.source)) {
            builder.addError(`${path}.source`, 'Edge source must reference an existing node.', 'invalid_reference');
        }
        if (edge?.target && !nodeIds.has(edge.target)) {
            builder.addError(`${path}.target`, 'Edge target must reference an existing node.', 'invalid_reference');
        }
    });

    return builder.build();
}
