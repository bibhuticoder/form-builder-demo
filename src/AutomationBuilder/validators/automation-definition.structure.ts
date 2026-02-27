import type { AutomationDefinition } from '../types/automation';
import { AutomationValidationResultBuilder } from './validation-result-builder';
import { validateNodeInteractiveData } from './node-config.validators';

export function validateDefinitionMetadata(definition: AutomationDefinition, builder: AutomationValidationResultBuilder): void {
    if (definition.version <= 0 || !Number.isFinite(definition.version)) {
        builder.addError('version', 'version must be a positive number.', 'invalid_value');
    }

    if (!definition.id.trim()) {
        builder.addError('id', 'id cannot be empty.', 'required');
    }

    if (!definition.name.trim()) {
        builder.addError('name', 'name cannot be empty.', 'required');
    }
}

export function validateNodesAndCollectIds(definition: AutomationDefinition, builder: AutomationValidationResultBuilder): Set<string> {
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

    return nodeIds;
}

export function validateEdges(definition: AutomationDefinition, nodeIds: Set<string>, builder: AutomationValidationResultBuilder): void {
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

        if (edge?.data !== undefined && (typeof edge.data !== 'object' || edge.data === null || Array.isArray(edge.data))) {
            builder.addError(`${path}.data`, 'Edge data must be an object when provided.', 'invalid_type');
        }

        if (edge?.data && typeof edge.data === 'object' && !Array.isArray(edge.data)) {
            const data = edge.data as Record<string, unknown>;
            if (data.label !== undefined && typeof data.label !== 'string') {
                builder.addError(`${path}.data.label`, 'Edge data.label must be a string when provided.', 'invalid_type');
            }
            if (data.isLoopBack !== undefined && typeof data.isLoopBack !== 'boolean') {
                builder.addError(`${path}.data.isLoopBack`, 'Edge data.isLoopBack must be a boolean when provided.', 'invalid_type');
            }
            if (data.isSplitTest !== undefined && typeof data.isSplitTest !== 'boolean') {
                builder.addError(`${path}.data.isSplitTest`, 'Edge data.isSplitTest must be a boolean when provided.', 'invalid_type');
            }
        }
    });
}
