import type { AutomationDefinition } from '../types/automation';
import type { AutomationValidationResult } from '../types/automation';
import { AutomationValidationResultBuilder } from './validation-result-builder';
import { hasAutomationDefinitionShape, unwrapAutomationDefinition } from './automation-definition.payload';
import { validateDefinitionGraph } from './automation-definition.graph';
import { validateDefinitionMetadata, validateEdges, validateNodesAndCollectIds } from './automation-definition.structure';

export function isAutomationDefinition(value: unknown): value is AutomationDefinition {
    const unwrapped = unwrapAutomationDefinition(value);
    return hasAutomationDefinitionShape(unwrapped);
}

export function validateAutomationDefinition(value: unknown): AutomationValidationResult {
    const builder = new AutomationValidationResultBuilder();
    const unwrapped = unwrapAutomationDefinition(value);

    if (!unwrapped || typeof unwrapped !== 'object') {
        builder.addError('root', 'Automation definition must be an object.', 'invalid_type');
        return builder.build();
    }

    if (!isAutomationDefinition(unwrapped)) {
        builder.addError('root', 'Automation definition is missing required fields.', 'invalid_structure');
        return builder.build();
    }

    const definition = unwrapped as AutomationDefinition;
    validateDefinitionMetadata(definition, builder);
    const nodeIds = validateNodesAndCollectIds(definition, builder);
    validateEdges(definition, nodeIds, builder);
    validateDefinitionGraph(definition, builder);

    return builder.build();
}
