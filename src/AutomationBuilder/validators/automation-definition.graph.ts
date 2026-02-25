import type { AutomationDefinition } from '../types';
import { validateAutomationGraph } from './graph.validators';
import { AutomationValidationResultBuilder } from './validation-result-builder';

export function validateDefinitionGraph(definition: AutomationDefinition, builder: AutomationValidationResultBuilder): void {
    const graphIssues = validateAutomationGraph(definition.nodes, definition.edges);
    graphIssues.forEach((issue) => {
        const scope = issue.nodeId ? `nodesById.${issue.nodeId}` : issue.edgeId ? `edgesById.${issue.edgeId}` : 'graph';
        builder.addError(scope, issue.message, issue.level === 'error' ? 'graph_error' : 'graph_warning');
    });
}
