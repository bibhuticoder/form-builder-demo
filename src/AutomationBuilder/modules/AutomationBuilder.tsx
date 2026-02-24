import { ReactFlowProvider } from 'reactflow';
import { FlowBuilder } from '../components/FlowBuilder/FlowBuilder';
import { AutomationBuilderProvider } from '../context/AutomationBuilderContext';

export function AutomationBuilder({ automationId }: { automationId: string }) {
  return (
    <AutomationBuilderProvider automationId={automationId}>
      <ReactFlowProvider>
        <FlowBuilder automationId={automationId} />
      </ReactFlowProvider>
    </AutomationBuilderProvider>
  );
}
