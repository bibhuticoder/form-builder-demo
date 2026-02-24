import { createContext, useContext, useMemo } from 'react';

type AutomationBuilderContextValue = {
  automationId: string;
};

const AutomationBuilderContext = createContext<AutomationBuilderContextValue | null>(null);

export function useAutomationBuilderContext() {
  const ctx = useContext(AutomationBuilderContext);
  if (!ctx) throw new Error('useAutomationBuilderContext must be used within AutomationBuilderProvider');
  return ctx;
}

export function AutomationBuilderProvider({ automationId, children }: { automationId: string; children: React.ReactNode }) {
  const value = useMemo(() => ({ automationId }), [automationId]);
  return <AutomationBuilderContext.Provider value={value}>{children}</AutomationBuilderContext.Provider>;
}
