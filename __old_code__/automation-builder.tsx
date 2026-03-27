import { useState, useCallback, memo, useEffect } from 'react';
import ReactFlow, { 
  useReactFlow,
  useNodes,
  ReactFlowProvider,
  Controls, 
  Background, 
  applyNodeChanges, 
  applyEdgeChanges,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  Handle, 
  Position,
  MarkerType,
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  ReactFlowInstance,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Zap, 
  Mail, 
  Clock, 
  MessageSquare, 
  Users, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Plus,
  Search,
  GripVertical,
  Tag,
  FileText,
  Columns,
  Cake,
  UserPlus,
  Building2,
  StickyNote,
  CheckSquare,
  Activity,
  Webhook,
  GitBranch,
  Repeat,
  Calendar,
  TrendingUp,
  Split,
  Star,
  Bell,
  Phone,
  Trash2,
  Facebook,
  Video,
  Chrome,
  UserCog,
  FileSignature,
  Receipt,
  Calculator,
  ShieldCheck,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Undo2,
  Redo2,
  StopCircle,
  Share,
  Copy,
  Move,
  MessageCircle,
  Send
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AutomationConfigModal } from './automation-config-modal';

const SlackIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="3" height="8" x="13" y="2" rx="1.5" />
    <path d="M19 8.5V10h1.5A1.5 1.5 0 1 0 19 8.5" />
    <rect width="3" height="8" x="8" y="14" rx="1.5" />
    <path d="M5 15.5V14H3.5A1.5 1.5 0 1 0 5 15.5" />
    <rect width="8" height="3" x="14" y="13" rx="1.5" />
    <path d="M15.5 19H14v1.5a1.5 1.5 0 1 0 1.5-1.5" />
    <rect width="8" height="3" x="2" y="8" rx="1.5" />
    <path d="M8.5 5H10V3.5A1.5 1.5 0 1 0 8.5 5" />
  </svg>
)

const TeamsIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M7 15.5a3.5 3.5 0 0 1 3.5-3.5h.5" />
    <rect width="13" height="13" x="8" y="7" rx="2" />
    <path d="M11 11.5v3" />
    <path d="M14 11.5v3" />
    <path d="M3 17.5V6.5a1.5 1.5 0 0 1 1.5-1.5H8" />
  </svg>
)

const GoogleIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s8.597 3.603 9.696 8.5H12v5h9.846C21.93 18.23 21.056 20.355 19.5 22" />
  </svg>
)

const TikTokIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
)

// --- Custom Nodes ---

const HORIZONTAL_SPACING = 320; // 280 width + 40 gap
const X_GAP = 60; 
const Y_GAP = 150;
const VERTICAL_SPACING = 150;
const NODE_WIDTH = 280;
const NODE_HEIGHT = 100;
const BRANCH_BUTTON_WIDTH = 100; // 50px connector + 40px button + 10px buffer
const BRANCH_BUTTON_SPACING = 120; // Extra spacing when button is present

// Helper to delete node and all its descendants
const deleteNodeAndDescendants = (
  id: string,
  deleteElements: (params: { nodes: { id: string }[] }) => void,
  getNodes: () => Node[],
  getEdges: () => Edge[]
) => {
  const edges = getEdges();
  const nodesToDelete = new Set<string>();

  const traverse = (nodeId: string) => {
    if (nodesToDelete.has(nodeId)) return;
    nodesToDelete.add(nodeId);
    
    // Find all edges starting from this node
    const outgoingEdges = edges.filter(e => e.source === nodeId);
    
    outgoingEdges.forEach(edge => {
       // Do NOT follow LoopBack edges to avoid deleting ancestors or infinite loops
       if (edge.data?.isLoopBack) return;

       if (!nodesToDelete.has(edge.target)) {
           traverse(edge.target);
       }
    });
  };

  traverse(id);

  const nodesToDeleteArray = Array.from(nodesToDelete).map(nodeId => ({ id: nodeId }));
  console.log('Deleting nodes:', nodesToDeleteArray); // Debug log
  deleteElements({ nodes: nodesToDeleteArray });
};

const NodeCard = ({ id, icon: Icon, title, subtitle, colorClass, selected, isLastBranchNode, isDragging, isRoot, isTargetable, hideSourceHandle }: any) => {
  const { deleteElements, getNodes, getEdges } = useReactFlow();

  return (
  <div className="relative w-[280px]">
    <div className={`
      w-full bg-white rounded-lg shadow-sm border-2 transition-all duration-200 group relative z-10
      ${selected ? 'border-primary ring-2 ring-primary/20' : isTargetable ? 'border-green-500 ring-2 ring-green-500/20 cursor-crosshair animate-pulse' : 'border-border hover:border-primary/50'}
    `}>
      <div className={`h-1.5 w-full rounded-t-sm ${colorClass}`} />
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-md bg-white border shadow-sm shrink-0 ${colorClass.replace('bg-', 'text-')}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground truncate">{title}</h3>
            <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
          </div>
          {!isTargetable && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 text-muted-foreground transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); /* TODO: Duplicate */ }}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); /* TODO: Move */ }}>
                  <Move className="mr-2 h-4 w-4" />
                  Move
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={(e) => { 
                    e.stopPropagation(); 
                    deleteNodeAndDescendants(id, deleteElements, getNodes, getEdges);
                }}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      {!isTargetable && <Handle type="target" position={Position.Top} className={`!w-3 !h-3 !bg-slate-300 !border-2 !border-white transition-colors hover:!bg-primary ${isRoot ? '!opacity-0 !border-0' : ''}`} />}
      {!isTargetable && !hideSourceHandle && <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-slate-300 !border-2 !border-white transition-colors hover:!bg-primary" />}
    </div>
    
    {/* Add Branch UI - Outside the card container to prevent hover inheritance */}
    {isLastBranchNode && !isTargetable && !hideSourceHandle && (
        <>
            {/* The Dot on the Card Border */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-slate-300 border-2 border-white rounded-full z-20" />

            {/* Connector Line */}
            <div className="absolute left-[280px] top-1/2 -translate-y-1/2 w-[50px] h-[2px] bg-slate-300 pointer-events-none flex items-center z-0">
                 <div className="absolute right-0 top-1/2 -translate-y-[calc(50%+0.5px)] translate-x-[1px] w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-slate-300" />
            </div>

            {/* Add Branch Button (Handle) */}
            <Handle 
                type="source" 
                position={Position.Right} 
                id="right-source"
                className={`
                    !w-auto !h-auto !bg-transparent !border-none !rounded-none
                    !left-[330px] !right-auto !top-1/2 !-translate-y-1/2 !transform-none !mt-3
                    !flex !flex-col !items-center !justify-center !gap-2
                    group/adder !opacity-100 !pointer-events-auto
                `}
            >
                <div className={`w-10 h-10 rounded-full bg-white border-2 border-dashed flex items-center justify-center transition-colors shadow-sm
                    ${isDragging ? 'border-primary text-primary' : 'border-slate-300 text-slate-400 group-hover/adder:border-primary group-hover/adder:text-primary'}
                `}>
                    <Plus className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-medium whitespace-nowrap transition-colors ${isDragging ? 'text-primary' : 'text-slate-400 group-hover/adder:text-primary'}`}>Add Branch</span>
            </Handle>
        </>
    )}
    
    {/* Hidden handle for connection logic if not last branch (fallback) */}
    {!isLastBranchNode && !isTargetable && (
       <Handle 
          type="source" 
          position={Position.Right} 
          id="right-source"
          className="!opacity-0 !pointer-events-none"
       />
    )}
  </div>
  );
};

const TriggerNode = ({ id, data, selected }: any) => {
  const { deleteElements } = useReactFlow();

  return (
  <div className={`
    w-[280px] bg-white rounded-lg shadow-sm border-2 transition-all duration-200 group
    ${selected ? 'border-primary ring-2 ring-primary/20' : data.isTargetable ? 'border-green-500 ring-2 ring-green-500/20 cursor-crosshair animate-pulse' : 'border-border hover:border-primary/50'}
  `}>
    <div className={`h-1.5 w-full rounded-t-sm bg-blue-500`} />
    <div className="p-4">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-md bg-white border shadow-sm shrink-0 text-blue-500`}>
          {data.icon ? <data.icon className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate">{data.label}</h3>
          <p className="text-xs text-muted-foreground truncate">{data.subtitle || "When this happens..."}</p>
        </div>
        {!data.isTargetable && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 text-muted-foreground transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); /* TODO: Duplicate */ }}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); /* TODO: Move */ }}>
                  <Move className="mr-2 h-4 w-4" />
                  Move
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={(e) => { 
                    e.stopPropagation(); 
                    deleteElements({ nodes: [{ id }] });
                }}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        )}
      </div>
    </div>
    {/* No Top Handle for Triggers */}
    {!data.isTargetable && <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-slate-300 !border-2 !border-white transition-colors hover:!bg-primary" />}
  </div>
  );
};

const ActionNode = ({ id, data, selected }: any) => (
  <NodeCard 
    id={id}
    icon={data.icon || Mail} 
    title={data.label} 
    subtitle={data.subtitle || "Perform action"} 
    colorClass="bg-emerald-500" 
    selected={selected}
    isLastBranchNode={data.isLastBranchNode}
    isDragging={data.isDragging}
    isRoot={data.isRoot}
    isTargetable={data.isTargetable}
    hideSourceHandle={['End Automation', 'Send To Automation'].includes(data.label)}
  />
);

const ConditionNode = ({ id, data, selected }: any) => (
  <NodeCard 
    id={id}
    icon={data.icon || Filter} 
    title={data.label} 
    subtitle={data.subtitle || "Check if..."} 
    colorClass="bg-amber-500" 
    selected={selected}
    isLastBranchNode={data.isLastBranchNode}
    isDragging={data.isDragging}
    isRoot={data.isRoot}
    isTargetable={data.isTargetable}
  />
);

const DelayNode = ({ id, data, selected }: any) => (
  <NodeCard 
    id={id}
    icon={data.icon || Clock} 
    title={data.label} 
    subtitle={data.subtitle || "Wait for..."} 
    colorClass="bg-amber-500" 
    selected={selected}
    isLastBranchNode={data.isLastBranchNode}
    isDragging={data.isDragging}
    isRoot={data.isRoot}
    isTargetable={data.isTargetable}
  />
);

const EndNode = ({ data, selected }: any) => (
  <div className="w-[280px] flex flex-col items-center">
    <div className={`
      w-6 h-6 rounded-full bg-slate-200 border-2 flex items-center justify-center mb-1
      ${selected ? 'border-slate-400 ring-2 ring-slate-200' : 'border-slate-300'}
    `}>
      <div className="w-2 h-2 rounded-full bg-slate-400" />
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-slate-300 !border-2 !border-white transition-colors opacity-0" />
    </div>
    <span className="text-[10px] font-medium text-slate-500">{data?.label || 'End'}</span>
  </div>
);

const LoopBackNode = ({ id, data, selected }: any) => {
  const { getEdges, getNodes } = useReactFlow();
  const edges = getEdges();
  const nodes = getNodes();
  const currentEdge = edges.find(e => e.source === id && e.data?.isLoopBack);
  const targetNode = currentEdge ? nodes.find(n => n.id === currentEdge.target) : null;
  const targetLabel = targetNode?.data?.label;

  return (
    <div className={`
      w-[280px] bg-white rounded-lg shadow-sm border-2 transition-all duration-200 group relative
      ${selected ? 'border-primary ring-2 ring-primary/20' : data.isConnecting ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-border hover:border-primary/50'}
    `}>
       <div className={`h-1.5 w-full rounded-t-sm bg-amber-500`} />
       <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-md bg-white border shadow-sm shrink-0 text-amber-500`}>
             <Repeat className={`w-5 h-5 ${data.isConnecting ? 'animate-spin-slow' : ''}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground truncate">{data.label}</h3>
            <p className="text-xs text-muted-foreground truncate">
                {currentEdge ? `Loops back to: ${targetLabel || 'Unknown Step'}` : 'Select a step to loop back to...'}
            </p>
          </div>
          {currentEdge && (
             <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 -mr-2 text-muted-foreground hover:text-red-500"
                onClick={(e) => {
                    e.stopPropagation();
                    data.onClearConnection?.(id);
                }}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
       </div>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-slate-300 !border-2 !border-white transition-colors hover:!bg-primary" />
      {/* Source handle needed for the edge, but hidden/neutral */}
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-slate-300 !border-2 !border-white opacity-0 pointer-events-none" />
    </div>
  );
};

// Helper hook to get node data by id safely
function useNodesData(id: string | undefined) {
    const nodes = useNodes();
    const node = id ? nodes.find(n => n.id === id) : null;
    return { nodes: node };
}

const CustomEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  label
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetPosition,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      {data?.isSplitTest && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${data?.isSplitTest ? targetX : labelX}px,${labelY}px)`,
              fontSize: 12,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <div className="bg-white rounded-full border border-slate-200 shadow-sm px-3 py-1 flex items-center justify-center min-w-[40px]">
               <span className="text-[10px] font-semibold text-slate-500">
                 {label as string || "50%"}
               </span>
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

const PlaceholderNode = () => (
  <div className="w-[280px] border-b-2 border-l-2 border-r-2 border-dashed border-slate-300 rounded-lg bg-slate-50/50 flex flex-col">
    <div className="h-1.5 w-full rounded-t-sm bg-slate-300" />
    <div className="flex items-center p-4">
      <div className="p-2 rounded-md bg-white border border-dashed border-slate-300 shadow-sm shrink-0 text-slate-400 mr-3">
        <Zap className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-slate-400 truncate">Start your automation</h3>
        <p className="text-xs text-slate-400">Drag a Trigger, Action or Logic Here to Begin...</p>
      </div>
    </div>
  </div>
);

const AddStepNode = ({ data }: any) => {
  const isDragging = data?.isDragging;
  const isBranchAdder = data?.isBranchAdder;

  if (isBranchAdder) {
      return null;
  }

  return (
  <div className="w-[280px] flex flex-col items-center justify-center relative">
    <div className={`w-10 h-10 rounded-full bg-slate-50 border-2 border-dashed flex items-center justify-center transition-colors cursor-pointer group
      ${isDragging ? 'border-primary text-primary' : 'border-slate-300 hover:border-primary hover:text-primary'}
    `}>
       <Plus className={`w-5 h-5 ${isDragging ? 'text-primary' : 'text-slate-400'} group-hover:text-primary`} />
    </div>
    <span className="text-[10px] font-medium text-slate-400 mt-2 text-center w-32">Drag your next Action or Logic</span>
    <Handle 
      type="target" 
      position={Position.Top} 
      className="!w-2 !h-2 !bg-slate-300 !border-2 !border-white transition-colors opacity-0 !mt-[1.5px]" 
    />
  </div>
  );
};

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  delay: DelayNode,
  end: EndNode,
  loopBack: LoopBackNode,
  placeholder: PlaceholderNode,
  addStep: AddStepNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

// --- Initial Data ---

const initialNodes: Node[] = [
  {
    id: 'placeholder-1',
    type: 'placeholder',
    position: { x: 250, y: 100 },
    data: { label: 'Start your automation' },
    draggable: false,
    selectable: false,
  }
];

const initialEdges: Edge[] = [];


// --- Sidebar Items ---

const TOOLBOX_ITEMS = [
  { 
    category: "Triggers", 
    value: "triggers",
    items: [
      // Available Triggers
      { type: 'trigger', label: 'Form Submitted', icon: FileText, color: 'text-blue-500' },
      { type: 'trigger', label: 'Tags', icon: Tag, color: 'text-blue-500' },
      { type: 'trigger', label: 'Contacts', icon: UserPlus, color: 'text-blue-500' },
      { type: 'trigger', label: 'Companies', icon: Building2, color: 'text-blue-500' },
      { type: 'trigger', label: 'Birthday', icon: Cake, color: 'text-blue-500' },
      { type: 'trigger', label: 'Notes', icon: StickyNote, color: 'text-blue-500' },
      { type: 'trigger', label: 'Engagement Score', icon: Activity, color: 'text-blue-500' },
      { type: 'trigger', label: 'Do Not Disturb', icon: Bell, color: 'text-blue-500' },
      { type: 'trigger', label: 'Direct Messages', icon: Send, color: 'text-blue-500' },
      { type: 'trigger', label: 'Comments', icon: MessageCircle, color: 'text-blue-500' },
      { type: 'trigger', label: 'Call Status', icon: Phone, color: 'text-blue-500' },
      
      // Coming Soon Triggers
      { type: 'trigger', label: 'Calendar Appointment', icon: Calendar, color: 'text-blue-500', comingSoon: true },
      { type: 'trigger', label: 'Pipelines', icon: Columns, color: 'text-blue-500', comingSoon: true },
      { type: 'trigger', label: 'Tasks', icon: CheckSquare, color: 'text-blue-500', comingSoon: true },
      { type: 'trigger', label: 'Webhooks', icon: Webhook, color: 'text-blue-500', comingSoon: true },
    ]
  },
  { 
    category: "Actions", 
    value: "actions",
    items: [
      // Available Actions
      { type: 'action', label: 'Send Email', icon: Mail, color: 'text-emerald-500' },
      { type: 'action', label: 'Send SMS', icon: MessageSquare, color: 'text-emerald-500' },
      { type: 'action', label: 'Send Notification', icon: Bell, color: 'text-emerald-500' },
      { type: 'action', label: 'Update Contact', icon: UserCog, color: 'text-emerald-500' },
      { type: 'action', label: 'Update Company', icon: Building2, color: 'text-emerald-500' },
      { type: 'action', label: 'Add / Remove Task', icon: CheckSquare, color: 'text-emerald-500' },
      { type: 'action', label: 'Add Note', icon: StickyNote, color: 'text-emerald-500' },
      { type: 'action', label: 'Add / Remove Tag', icon: Tag, color: 'text-emerald-500' },
      { type: 'action', label: 'Add to Review Autopilot', icon: Star, color: 'text-emerald-500' },
      { type: 'action', label: 'Send To Slack', icon: SlackIcon, color: 'text-emerald-500' },
      { type: 'action', label: 'Send To Teams', icon: TeamsIcon, color: 'text-emerald-500' },
      { type: 'action', label: 'End Automation', icon: StopCircle, color: 'text-emerald-500' },
      { type: 'action', label: 'Send To Automation', icon: Share, color: 'text-emerald-500' },
      
      // Coming Soon Actions
      { type: 'action', label: 'Update Deal', icon: Briefcase, color: 'text-emerald-500', comingSoon: true },
      { type: 'action', label: 'Update Pipeline Stage', icon: TrendingUp, color: 'text-emerald-500', comingSoon: true },
      { type: 'action', label: 'Calendar Appointment', icon: Calendar, color: 'text-emerald-500', comingSoon: true },
      { type: 'action', label: 'Validate Phone Number', icon: Phone, color: 'text-emerald-500', comingSoon: true },
      { type: 'action', label: 'Validate Email', icon: ShieldCheck, color: 'text-emerald-500', comingSoon: true },
      { type: 'action', label: 'Send Contract', icon: FileSignature, color: 'text-emerald-500', comingSoon: true },
      { type: 'action', label: 'Update Contract', icon: FileSignature, color: 'text-emerald-500', comingSoon: true },
      { type: 'action', label: 'Send Invoice', icon: Receipt, color: 'text-emerald-500', comingSoon: true },
      { type: 'action', label: 'Update Invoice', icon: Receipt, color: 'text-emerald-500', comingSoon: true },
      { type: 'action', label: 'Send Estimate', icon: Calculator, color: 'text-emerald-500', comingSoon: true },
      { type: 'action', label: 'Update Estimate', icon: Calculator, color: 'text-emerald-500', comingSoon: true },
      { type: 'action', label: 'Webhooks', icon: Webhook, color: 'text-emerald-500', comingSoon: true },
    ]
  },
  { 
    category: "Logic", 
    value: "logic",
    items: [
      { type: 'condition', label: 'If / Else', icon: Filter, color: 'text-amber-500' },
      { type: 'condition', label: 'Split Test (A/B)', icon: GitBranch, color: 'text-amber-500' },
      { type: 'delay', label: 'Wait', icon: Clock, color: 'text-amber-500' },
      { type: 'loopBack', label: 'Loop Back To', icon: Repeat, color: 'text-amber-500' },
    ]
  }
];

const PRO_TIPS = [
  "Drag items onto the canvas to add them to your automation.",
  "You can add multiple triggers to start the same automation.",
  "Use 'Split Test' to run A/B experiments on your audience.",
  "Connect actions in parallel to execute them simultaneously.",
  "Click on any step to edit its properties"
];

export default function AutomationsBuilder() {
  return (
    <ReactFlowProvider>
      <FlowBuilder />
    </ReactFlowProvider>
  );
}

// Custom Controls Component with Undo/Redo

const CustomControls = ({ 
  canUndo, 
  canRedo, 
  onUndo, 
  onRedo 
}: { 
  canUndo: boolean; 
  canRedo: boolean; 
  onUndo: () => void; 
  onRedo: () => void;
}) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <Panel position="bottom-left" className="flex gap-2 items-end">
      <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center gap-1">
        <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => zoomIn()}
            title="Zoom In"
        >
            <Plus className="h-4 w-4" />
        </Button>
        <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => zoomOut()}
            title="Zoom Out"
        >
            <div className="h-0.5 w-4 bg-current" />
        </Button>
        <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => fitView()}
            title="Fit View"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-maximize"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
        </Button>
      </div>

      <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex items-center gap-1">
        <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo"
        >
            <Undo2 className="h-4 w-4" />
        </Button>
        <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo"
        >
            <Redo2 className="h-4 w-4" />
        </Button>
      </div>
    </Panel>
  );
};

// --- Helper Functions ---
function getClosestEdge(pos: { x: number; y: number }, edges: Edge[], nodes: Node[]): Edge | null {
  let closestEdge: Edge | null = null;
  let minDistance = Infinity;

  edges.forEach((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);
    
    if (!sourceNode || !targetNode) return;

    // Use default node dimensions if not available
    const sourceWidth = sourceNode.width ?? 280;
    const sourceHeight = sourceNode.height ?? 80;
    const targetWidth = targetNode.width ?? 280;
    const targetHeight = targetNode.height ?? 80;

    const sourceX = sourceNode.position.x + sourceWidth / 2;
    const sourceY = sourceNode.position.y + sourceHeight;
    const targetX = targetNode.position.x + targetWidth / 2;
    const targetY = targetNode.position.y;
    
    // Distance from point to line segment
    const dist = distanceToSegment(pos, {x: sourceX, y: sourceY}, {x: targetX, y: targetY});
    
    if (dist < minDistance && dist < 50) { // 50px threshold
      minDistance = dist;
      closestEdge = edge;
    }
  });
  
  return closestEdge;
}

function distanceToSegment(p: {x: number, y: number}, v: {x: number, y: number}, w: {x: number, y: number}) {
  const l2 = (v.x - w.x) * (v.x - w.x) + (v.y - w.y) * (v.y - w.y);
  if (l2 === 0) return Math.sqrt((p.x - v.x) * (p.x - v.x) + (p.y - v.y) * (p.y - v.y));
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  const proj = { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) };
  return Math.sqrt((p.x - proj.x) * (p.x - proj.x) + (p.y - proj.y) * (p.y - proj.y));
}

// Helper to find all nodes visually below a certain Y point to push them down
function getNodesBelow(yThreshold: number, nodes: Node[]): string[] {
  const nodesBelow: string[] = [];
  const queue: string[] = nodes.filter(n => n.position.y > yThreshold).map(n => n.id);
  
  // Simple check based on Y position is often enough for visual reorganization
  // A more graph-based approach would traverse edges, but this is sufficient for "push down"
  return queue;
}

// --- Layout Engine ---


// Helper to get node dimensions based on type
function getNodeDimensions(node: Node) {
    if (node.type === 'addStep' && node.data?.isBranchAdder) {
        return { width: 0, height: 0 };
    }
    // Action nodes and others are typically 280px wide
    // But if they have children, the subtree calculation handles it.
    // However, we should be explicit.
    return { width: 280, height: 100 };
}

// Helper to restore icons after JSON parse (Undo/Redo)
function restoreNodeIcons(nodes: Node[]) {
    nodes.forEach(node => {
        if (!node.data) return;
        
        // Find matching item in toolbox to restore icon component
        let foundItem;
        for (const group of TOOLBOX_ITEMS) {
            foundItem = group.items.find(i => i.label === node.data.label);
            if (foundItem) break;
        }
        
        if (foundItem) {
            node.data.icon = foundItem.icon;
        } 
    });
}

function ensureBranchAdders(nodes: Node[], edges: Edge[]) {
    // Strategy: Find all branch parents (If/Else, Split Test)
    // Find their children (branches)
    // Ensure the last child has an "Add Branch" button attached
    
    // NOTE: We must filter to ensure we are looking at the current state of nodes passed in.
    const branchParents = nodes.filter(n => ['If / Else', 'Split Test (A/B)', 'Switch Case', 'Parallel'].includes(n.data?.label));
    
    branchParents.forEach(parent => {
        // Find children
        const childrenEdges = edges.filter(e => e.source === parent.id);
        const childrenIds = childrenEdges.map(e => e.target);
        let children = nodes.filter(n => childrenIds.includes(n.id) && !n.data?.isBranchAdder);
        
        if (children.length > 0) {
            children.sort((a, b) => a.position.x - b.position.x);
            const lastChild = children[children.length - 1];
            
            // Check if an adder is already connected to the last child
            // Note: layout engine hasn't run yet, so positions might be stale, but connections are truth.
            const existingAdderEdge = edges.find(e => e.source === lastChild.id && nodes.find(n => n.id === e.target)?.data?.isBranchAdder);
            
            if (!existingAdderEdge) {
                // We need to restore/create the adder!
                const addBranchNodeId = `add-branch-${parent.id}-restored`; // Use stable ID based on parent
                
                // Check if node already exists in list (maybe disconnected?)
                let addBranchNode = nodes.find(n => n.id === addBranchNodeId);
                
                if (!addBranchNode) {
                    addBranchNode = {
                        id: addBranchNodeId,
                        type: 'addStep',
                        position: { x: 0, y: 0 }, // Will be fixed by layout below
                        data: { 
                            label: 'Add Branch', 
                            isBranchAdder: true,
                            siblingId: lastChild.id // Store sibling ID for robust detection
                        },
                        draggable: false,
                        width: 60,
                        height: 60
                    };
                    nodes.push(addBranchNode);
                }
                
                // Create edge
                edges.push({
                     id: `e-${lastChild.id}-${addBranchNode.id}`,
                     source: lastChild.id,
                     sourceHandle: 'right-source',
                     target: addBranchNode.id,
                     type: 'smoothstep',
                     markerEnd: { type: MarkerType.ArrowClosed },
                     style: { strokeDasharray: '5,5', opacity: 0.5 }
                 });
            }
        }
    });
}

function performAutoLayout(nodes: Node[], edges: Edge[]) {
          // Handle "Add Branch" Adder Logic - ENSURE IT EXISTS for Branch Groups
          ensureBranchAdders(nodes, edges);
    
    // 1. Find root nodes (Trigger or Placeholder, or any node with no incoming edges)
    // We filter for nodes that are NOT targets of any edge.
    // This supports multiple roots (though rare in automation) and robustly handles cases where trigger is deleted.
    const targets = new Set(edges.map(e => e.target));
    const roots = nodes.filter(n => !targets.has(n.id));

    // Fallback: If no roots found (e.g. cycles), just pick the top-most node
    if (roots.length === 0 && nodes.length > 0) {
        nodes.sort((a, b) => a.position.y - b.position.y);
        roots.push(nodes[0]); 
    }

    // 2. Build Adjacency List
    const childrenMap = new Map<string, string[]>();
    edges.forEach(e => {
        if (e.data?.isLoopBack) return;
        if (!childrenMap.has(e.source)) childrenMap.set(e.source, []);
        childrenMap.get(e.source)!.push(e.target);
    });

        // 3. Helper to get subtree width and center offset
    const subtreeMetrics = new Map<string, { width: number, centerOffset: number }>();
    
    // Safety check: ensure no infinite recursion if cycles exist
    const visitedMetrics = new Set<string>();

    function calculateMetrics(nodeId: string): { width: number, centerOffset: number } {
        if (visitedMetrics.has(nodeId)) return subtreeMetrics.get(nodeId) || { width: NODE_WIDTH, centerOffset: NODE_WIDTH / 2 };
        visitedMetrics.add(nodeId);

        const children = childrenMap.get(nodeId) || [];
        
        // Separate Standard Children (Bottom) from Right Children (Side)
        const standardChildrenIds: string[] = [];
        const rightChildrenIds: string[] = [];
        
        children.forEach(childId => {
             const edge = edges.find(e => e.source === nodeId && e.target === childId);
             if (edge?.sourceHandle === 'right-source') {
                 rightChildrenIds.push(childId);
             } else {
                 standardChildrenIds.push(childId);
             }
        });

        const childNodes = standardChildrenIds.map(id => nodes.find(n => n.id === id)).filter(Boolean) as Node[];
        const rightNodes = rightChildrenIds.map(id => nodes.find(n => n.id === id)).filter(Boolean) as Node[];
        
        const structuralChildren = childNodes; // Include ALL standard children
        
        // Sort children to ensure stability. 
        structuralChildren.sort((a, b) => {
            if (Math.abs(a.position.x - b.position.x) > 10) {
                return a.position.x - b.position.x;
            }
            return a.id.localeCompare(b.id);
        });

        // UPDATE Branch Button Status (Moved from assignPosition to ensure metrics match)
        const isBranchingParent = nodes.find(n => n.id === nodeId) && ['If / Else', 'Split Test (A/B)', 'Switch Case', 'Parallel'].includes(nodes.find(n => n.id === nodeId)?.data?.label || '');
        
        if (structuralChildren.length > 0) {
            structuralChildren.forEach((child, idx) => {
                 // Only update if we are in a branching context
                 // If NOT branching, we shouldn't touch these flags (though they shouldn't exist)
                 if (isBranchingParent) {
                     if (child.data) {
                         // It is the last one if it's the last index
                         child.data.isLastBranchNode = (idx === structuralChildren.length - 1);
                     }
                 }
            });
        }
        
        // Calculate width of Right Children (Attachments)
        let rightAttachmentWidth = 0;
        rightNodes.forEach(rn => {
            if (rn.data?.isBranchAdder) return; // Skip width contribution
            const m = calculateMetrics(rn.id); 
            rightAttachmentWidth += m.width + 20; // 20px Gap
        });

        const node = nodes.find(n => n.id === nodeId);
        const selfWidth = node ? getNodeDimensions(node).width : NODE_WIDTH;
        const effectiveSelfWidth = selfWidth + rightAttachmentWidth;

        if (structuralChildren.length === 0) {
            const metrics = { width: effectiveSelfWidth, centerOffset: selfWidth / 2 };
            subtreeMetrics.set(nodeId, metrics);
            return metrics;
        }

        let totalChildrenWidth = 0;
        const childMetricsList: { width: number, centerOffset: number }[] = [];

        structuralChildren.forEach((child, index) => {
            const m = calculateMetrics(child.id);
            childMetricsList.push(m);
            totalChildrenWidth += m.width;
            
            // Add Gap
            if (index < structuralChildren.length - 1) {
                 // Dynamic Gap: If this child has an "Add Branch" button, we need more space
                 let gap = X_GAP;
                 
                 // Check if this child has the "Add Branch" button
                 // We trust the data state, assuming the layout engine or manual actions set it correctly.
                 // We add significant spacing to ensure the button doesn't overlap the next sibling.
                 if (child.data?.isLastBranchNode) {
                     gap += BRANCH_BUTTON_SPACING; 
                 }
                 totalChildrenWidth += gap;
            }
        });
        
        // CRITICAL FIX: If this is a branching group, the LAST child has an "Add Branch" button
        // that sticks out to the right. We MUST account for this in the total width
        // so that this group doesn't overlap with its right-side neighbors.
        if (isBranchingParent && structuralChildren.length > 0) {
            totalChildrenWidth += BRANCH_BUTTON_WIDTH;
        }

        // Calculate "Stem Center" relative to the start of the children block
        // We want the parent to be centered over the AVERAGE of the children's centers
        let currentX = 0;
        let sumCenters = 0;
        
        childMetricsList.forEach((m, idx) => {
            // Center of this child relative to block start
            const childCenter = currentX + m.centerOffset;
            sumCenters += childCenter;
            
            let gap = X_GAP;
            const childNode = structuralChildren[idx];
            
            // Apply the same gap logic as above to ensure consistent centering
            if (childNode?.data?.isLastBranchNode && idx < structuralChildren.length - 1) {
                 gap += BRANCH_BUTTON_SPACING;
            }
            
            currentX += m.width + gap;
        });
        
        const averageChildrenCenter = sumCenters / childMetricsList.length;
        
        // Total width of the subtree is determined by the children block (or self width if wider)
        // If children block is wider, we center the parent over `averageChildrenCenter`.
        // If self is wider, we center children under parent.
        
        const width = Math.max(effectiveSelfWidth, totalChildrenWidth);
        
        // Where is the center of THIS node relative to the left edge of the total width?
        // If children are wider: center is at `averageChildrenCenter`.
        // If self is wider: center is at `width / 2` (assuming children are centered under it).
        
        let centerOffset;
        if (totalChildrenWidth > effectiveSelfWidth) {
             centerOffset = averageChildrenCenter;
             // But wait, if right attachments exist on parent, we need to ensure they fit?
             // Actually `effectiveSelfWidth` accounts for parent+attachments.
             // If children are super wide, parent is placed at `averageChildrenCenter`.
             // We need to ensure `averageChildrenCenter` leaves enough room on the left for `selfWidth/2`?
             // Usually yes, but technically if the tree is extremely skewed left, it might be an issue.
             // For now, simple average is standard.
        } else {
             centerOffset = width / 2;
             // If self is wider, we shift children block to center?
             // Yes, but `centerOffset` just reports where the stem is.
        }

        const metrics = { width, centerOffset };
        subtreeMetrics.set(nodeId, metrics);
        return metrics;
    }

    // Calculate metrics for all roots
    roots.forEach(root => calculateMetrics(root.id));

    // Also iterate over ALL nodes
    nodes.forEach(node => {
        if (!subtreeMetrics.has(node.id)) {
            calculateMetrics(node.id);
        }
    });

    // 4. Assign Positions
    const newPositions = new Map<string, {x: number, y: number}>();
    const visitedPos = new Set<string>();
    
    function assignPosition(nodeId: string, x: number, y: number) {
        if (visitedPos.has(nodeId)) return;
        visitedPos.add(nodeId);
        
        newPositions.set(nodeId, {x, y});
        
        const children = childrenMap.get(nodeId) || [];
        if (children.length === 0) return;

        // Separate Standard Children vs Right Children again
        const standardChildrenIds: string[] = [];
        const rightChildrenIds: string[] = [];
        
        children.forEach(childId => {
             const edge = edges.find(e => e.source === nodeId && e.target === childId);
             if (edge?.sourceHandle === 'right-source') {
                 rightChildrenIds.push(childId);
             } else {
                 standardChildrenIds.push(childId);
             }
        });

        const childNodes = standardChildrenIds.map(id => nodes.find(n => n.id === id)).filter(Boolean) as Node[];
        const rightNodes = rightChildrenIds.map(id => nodes.find(n => n.id === id)).filter(Boolean) as Node[];
        
        const structuralChildren = childNodes;
        
        // Position Right Attachments
        // x is Top-Left. 
        const parentNode = nodes.find(n => n.id === nodeId);
        const parentWidth = parentNode ? getNodeDimensions(parentNode).width : NODE_WIDTH;
        
        let currentRightX = x + parentWidth + 20;
        
        rightNodes.forEach(rn => {
             const rnWidth = getNodeDimensions(rn).width; 
             // assignPosition expects Top-Left
             assignPosition(rn.id, currentRightX, y); // Same Y as parent
             
             // Update for next attachment (if any)
             const m = subtreeMetrics.get(rn.id) || { width: rnWidth, centerOffset: rnWidth/2 };
             // Use metrics to advance, in case attachment has its own tree (unlikely but possible)
             // Actually, attachments are usually leaves or simple chains. 
             // Logic above used metrics width.
             currentRightX += m.width + 20; 
        });

        if (structuralChildren.length === 0) return;

        // SAME Sort order as calculateMetrics
        structuralChildren.sort((a, b) => {
            if (Math.abs(a.position.x - b.position.x) > 10) {
                return a.position.x - b.position.x;
            }
            return a.id.localeCompare(b.id);
        });

        // FORCE set isLastBranchNode for the right-most structural child
        // CRITICAL: We DO NOT force reset to false here anymore.
        // We trust that if a node has isLastBranchNode=true, it needs the button and the spacing.
        // The user might have manually added branches in the middle, or the sort order might differ.
        // If we force reset, we might hide buttons or remove spacing that is visually required.
        
        const isBranchingParent = parentNode && ['If / Else', 'Split Test (A/B)', 'Switch Case', 'Parallel'].includes(parentNode.data?.label);

        // Only ensure the LAST one has it if NONE have it? 
        // Or ensure the last one always has it?
         if (structuralChildren.length > 0 && isBranchingParent) {
             const lastChild = structuralChildren[structuralChildren.length - 1];
             if (lastChild.data && !lastChild.data.isLastBranchNode) {
                 // Ensure at least the last one has it (default behavior)
                 lastChild.data.isLastBranchNode = true;
             }
         }
        
        // Start X for the children block
        // x is Top-Left of Parent.
        // Parent Center = x + parentWidth / 2.
        // We want Children Average Center to align with Parent Center.
        // Children Block Start (startX) + AverageCenterOffset = Parent Center.
        // startX = Parent Center - AverageCenterOffset.
        
        const parentCenter = x + (parentWidth / 2);

        // Let's re-calculate `averageChildrenCenter` for the children block relative to its start.
        let totalChildrenWidth = 0;
        let sumCenters = 0;
        
        structuralChildren.forEach((child, idx) => {
             const m = subtreeMetrics.get(child.id) || { width: getNodeDimensions(child).width, centerOffset: getNodeDimensions(child).width/2 };
             const childCenter = totalChildrenWidth + m.centerOffset;
             sumCenters += childCenter;
             
             let gap = X_GAP;
             if (child.data?.isLastBranchNode && idx < structuralChildren.length - 1) {
                 gap += 120;
             }
             
             totalChildrenWidth += m.width;
             if (idx < structuralChildren.length - 1) totalChildrenWidth += gap;
        });
        
        const averageCenterOffset = sumCenters / structuralChildren.length;
        
        let startX = parentCenter - averageCenterOffset;
        
        // Apply positions
        let currentX = startX;
        structuralChildren.forEach((child, idx) => {
            const m = subtreeMetrics.get(child.id) || { width: getNodeDimensions(child).width, centerOffset: getNodeDimensions(child).width/2 };
            
            // Child Center X relative to startX
            const childCenterX = currentX + m.centerOffset;
            
            // Convert to Top-Left for assignPosition
            const childWidth = getNodeDimensions(child).width;
            const childTopLeftX = childCenterX - (childWidth / 2);
            
            assignPosition(child.id, childTopLeftX, y + Y_GAP);
            
            let gap = X_GAP;
            if (child.data?.isLastBranchNode && idx < structuralChildren.length - 1) {
                gap += BRANCH_BUTTON_SPACING;
            }
            
            currentX += m.width + gap;
        });

    }

    // Assign positions for all roots (Centered)
    if (roots.length > 0) {
         // Sort roots by X to maintain left-to-right order (if they had prev positions)
         roots.sort((a, b) => a.position.x - b.position.x);

         // --- NEW CLUSTERING LOGIC ---
         // Group roots that share the same first child (Multiplexing Triggers)
         // This prevents triggers from spreading apart when they feed into the same wide tree.
         
         const rootClusters: Node[][] = [];
         const processedRoots = new Set<string>();
         
         roots.forEach(root => {
             if (processedRoots.has(root.id)) return;
             
             // Start a new cluster
             const cluster = [root];
             processedRoots.add(root.id);
             
             // Find siblings that share children with this root
             const rootChildren = childrenMap.get(root.id) || [];
             
             roots.forEach(otherRoot => {
                 if (processedRoots.has(otherRoot.id)) return;
                 
                 const otherChildren = childrenMap.get(otherRoot.id) || [];
                 // Check intersection
                 const sharesChild = rootChildren.some(childId => otherChildren.includes(childId));
                 
                 if (sharesChild) {
                     cluster.push(otherRoot);
                     processedRoots.add(otherRoot.id);
                 }
             });
             
             rootClusters.push(cluster);
         });

         // --- Layout Clusters ---
         let currentX = 425; // Start near center, but we'll center the whole group later
         
         const clusterMetrics = rootClusters.map((cluster, i) => {
             // 1. Calculate Cluster Width (Footprint of shared descendants)
             // We can approximate this by taking the MAX width of any root in the cluster
             // because `calculateMetrics` already computes the full subtree width.
             // If multiple roots feed the same tree, they will all report that tree's width.
             
             let maxSubtreeWidth = 0;
             let maxCenterOffset = 0;
             
             cluster.forEach(root => {
                 const m = subtreeMetrics.get(root.id) || { width: NODE_WIDTH, centerOffset: NODE_WIDTH / 2 };
                 if (m.width > maxSubtreeWidth) maxSubtreeWidth = m.width;
                 if (m.centerOffset > maxCenterOffset) maxCenterOffset = m.centerOffset;
             });
             
             // 2. Calculate "Packed" Width of Roots themselves
             // This is the width if we just placed the triggers side-by-side
             const rootsPackedWidth = cluster.reduce((acc, root, idx) => {
                 const rootWidth = getNodeDimensions(root).width;
                 const gap = idx < cluster.length - 1 ? 60 : 0;
                 return acc + rootWidth + gap;
             }, 0);
             
             // The cluster occupies the MAX of (Subtree Width, Packed Roots Width)
             const clusterTotalWidth = Math.max(maxSubtreeWidth, rootsPackedWidth);
             
             // Gap between clusters
             const clusterGap = i < rootClusters.length - 1 ? 100 : 0;
             
             return {
                 cluster,
                 totalWidth: clusterTotalWidth,
                 rootsPackedWidth,
                 maxCenterOffset, // Where the "stem" of the shared tree is relative to left
                 clusterGap
             };
         });
         
         // Calculate Global Start X to center ALL clusters on screen
         const totalAllClustersWidth = clusterMetrics.reduce((acc, c) => acc + c.totalWidth + c.clusterGap, 0);
         const globalCenterX = 425;
         let clusterStartX = globalCenterX - (totalAllClustersWidth / 2);
         
         // Apply Positions
         clusterMetrics.forEach(cm => {
             const { cluster, totalWidth, rootsPackedWidth, maxCenterOffset } = cm;
             
             // The cluster occupies [clusterStartX ... clusterStartX + totalWidth]
             // The shared tree is centered at: clusterStartX + maxCenterOffset (roughly)
             // We want to center the PACKED ROOTS over the SHARED TREE CENTER.
             
             // Center of the allocated space (where the tree stem is)
             // Actually, `maxCenterOffset` tells us where the stem is relative to the start of the bounding box.
             const treeStemX = clusterStartX + maxCenterOffset;
             
             // Center the packed roots over `treeStemX`
             let currentRootX = treeStemX - (rootsPackedWidth / 2);
             
             cluster.forEach((root, idx) => {
                 const rootWidth = getNodeDimensions(root).width;
                 
                 // If we have mixed widths in a cluster, we might want to be careful.
                 // But simply packing them left-to-right centered over the stem is good.
                 
                 assignPosition(root.id, currentRootX, 50);
                 
                 const gap = idx < cluster.length - 1 ? 60 : 0;
                 currentRootX += rootWidth + gap;
             });
             
             clusterStartX += totalWidth + cm.clusterGap;
         });
    }

    // 5. Post-process: Center Merge Nodes (Nodes with multiple parents)
    // Identify nodes that have multiple incoming edges
    const incomingEdgesMap = new Map<string, string[]>();
    edges.forEach(e => {
        if (!incomingEdgesMap.has(e.target)) incomingEdgesMap.set(e.target, []);
        incomingEdgesMap.get(e.target)!.push(e.source);
    });

    // Find nodes with > 1 parent
    incomingEdgesMap.forEach((parentIds, nodeId) => {
        if (parentIds.length > 1) {
            // Get positions of all parents (from newPositions or current nodes)
            // Note: Roots are already processed in newPositions or are static.
            // If parents are processed, use newPositions.
            
            let sumX = 0;
            let count = 0;
            
            parentIds.forEach(pid => {
                const pos = newPositions.get(pid) || nodes.find(n => n.id === pid)?.position;
                if (pos) {
                    // Adjust for parent width to get center
                    const parentNode = nodes.find(n => n.id === pid);
                    const width = parentNode ? (parentNode.type === 'addStep' && parentNode.data?.isBranchAdder ? 60 : 280) : 280;
                    sumX += pos.x + (width / 2); // Use center of parent
                    count++;
                }
            });
            
            if (count > 0) {
                const avgCenterX = sumX / count;
                
                // Set new X for this node (centered below parents)
                const currentNodePos = newPositions.get(nodeId) || nodes.find(n => n.id === nodeId)?.position;
                if (currentNodePos) {
                    const nodeWidth = nodes.find(n => n.id === nodeId)?.type === 'addStep' && nodes.find(n => n.id === nodeId)?.data?.isBranchAdder ? 60 : 280;
                    const targetX = avgCenterX - (nodeWidth / 2);
                    const deltaX = targetX - currentNodePos.x;
                    
                    // Apply delta to this node
                    newPositions.set(nodeId, { x: targetX, y: currentNodePos.y });
                    
                    // Apply delta to all descendants
                    // BFS to find descendants
                    const queue = [nodeId];
                    const visited = new Set<string>([nodeId]);
                    
                    while (queue.length > 0) {
                        const curr = queue.shift()!;
                        const kids = childrenMap.get(curr) || [];
                        kids.forEach(kid => {
                            if (!visited.has(kid)) {
                                visited.add(kid);
                                queue.push(kid);
                                
                                // Try to get position from newPositions (if visited by tree layout)
                                // If not, fall back to current node position (if valid)
                                const kidPos = newPositions.get(kid);
                                const kidNode = nodes.find(n => n.id === kid);
                                
                                if (kidPos) {
                                    newPositions.set(kid, { x: kidPos.x + deltaX, y: kidPos.y });
                                } else if (kidNode) {
                                    // Fallback: If layout engine didn't touch it, shift it relative to its current pos
                                    newPositions.set(kid, { x: kidNode.position.x + deltaX, y: kidNode.position.y });
                                }
                            }
                        });
                    }
                }
            }
        }
    });

    // Return updated nodes
    const rootIds = new Set(roots.map(r => r.id));

    return nodes.map(n => {
        const pos = newPositions.get(n.id);
        const isRoot = rootIds.has(n.id);
        
        const newData = { ...n.data, isRoot };

        if (pos) {
            return { ...n, position: pos, data: newData };
        }
        return { ...n, data: newData };
    });
}

// History Hook
function useHistory(initialNodes: Node[], initialEdges: Edge[]) {
    const [past, setPast] = useState<{ nodes: Node[], edges: Edge[] }[]>([]);
    const [future, setFuture] = useState<{ nodes: Node[], edges: Edge[] }[]>([]);

    const takeSnapshot = useCallback((nodes: Node[], edges: Edge[]) => {
        setPast((p) => [...p.slice(-10), { nodes, edges }]); // Keep last 10 steps
        setFuture([]);
    }, []);

    const undo = useCallback((currentNodes: Node[], currentEdges: Edge[]) => {
        setPast((p) => {
            const newPast = [...p];
            const previous = newPast.pop();
            
            if (previous) {
                setFuture((f) => [{ nodes: currentNodes, edges: currentEdges }, ...f]);
                return newPast;
            }
            return p;
        });
        // We need to return the previous state to the caller, handled in wrapper
    }, []);

    const redo = useCallback((currentNodes: Node[], currentEdges: Edge[]) => {
        setFuture((f) => {
            const newFuture = [...f];
            const next = newFuture.shift();
            
            if (next) {
                setPast((p) => [...p, { nodes: currentNodes, edges: currentEdges }]);
                return newFuture;
            }
            return f;
        });
    }, []);

    return { past, future, takeSnapshot, setPast, setFuture };
}

function FlowBuilder() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  
  // Clean up orphans and restore placeholder if needed
  useEffect(() => {
    // 1. If no nodes at all, restore placeholder
    if (nodes.length === 0) {
      setNodes(initialNodes);
      setEdges(initialEdges);
      return;
    }

    // 2. If we have nodes, check if any are "meaningful" (content nodes)
    const hasContentNodes = nodes.some(n => 
        ['trigger', 'action', 'condition', 'delay', 'end', 'loopBack', 'placeholder'].includes(n.type || '')
    );

    if (!hasContentNodes) {
        // Only AddStep nodes or other junk left - reset everything
        setNodes(initialNodes);
        setEdges(initialEdges);
    }
  }, [nodes]);
  
  // History State
  const [past, setPast] = useState<{ nodes: Node[], edges: Edge[] }[]>([]);
  const [future, setFuture] = useState<{ nodes: Node[], edges: Edge[] }[]>([]);
  
  const takeSnapshot = useCallback(() => {
     setPast((p) => [...p.slice(-19), { nodes, edges }]);
     setFuture([]);
  }, [nodes, edges]);

  const onUndo = useCallback(() => {
      if (past.length === 0) return;
      
      const newPast = [...past];
      const previousState = newPast.pop();
      
      if (previousState) {
          setFuture((f) => [{ nodes, edges }, ...f]);
          setPast(newPast);
          
          // Deep clone to avoid mutating history and to allow repair
          const restoredNodes = JSON.parse(JSON.stringify(previousState.nodes));
          const restoredEdges = JSON.parse(JSON.stringify(previousState.edges));
          
          restoreNodeIcons(restoredNodes);
          ensureBranchAdders(restoredNodes, restoredEdges);
          
          setNodes(restoredNodes);
          setEdges(restoredEdges);
      }
  }, [nodes, edges, past]);

  const onRedo = useCallback(() => {
      if (future.length === 0) return;
      
      const newFuture = [...future];
      const nextState = newFuture.shift();
      
      if (nextState) {
          setPast((p) => [...p, { nodes, edges }]);
          setFuture(newFuture);
          
          // Deep clone to avoid mutating history and to allow repair
          const restoredNodes = JSON.parse(JSON.stringify(nextState.nodes));
          const restoredEdges = JSON.parse(JSON.stringify(nextState.edges));
          
          restoreNodeIcons(restoredNodes);
          ensureBranchAdders(restoredNodes, restoredEdges);
          
          setNodes(restoredNodes);
          setEdges(restoredEdges);
      }
  }, [nodes, edges, future]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showProTips, setShowProTips] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const { project, screenToFlowPosition } = useReactFlow();

  const [dropIndicator, setDropIndicator] = useState<{ x: number; y: number; type: 'trigger' | 'action' | 'logic' } | null>(null);
  const [selectedNodeForConfig, setSelectedNodeForConfig] = useState<Node | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const onStartConnect = useCallback((nodeId: string) => {
      setConnectingNodeId(nodeId);
      setNodes((nds) => nds.map(n => {
          if (n.id === nodeId) {
              return { ...n, data: { ...n.data, isConnecting: true } };
          }
          // Mark others as targetable
          if (n.type !== 'placeholder' && n.type !== 'addStep' && n.type !== 'loopBack' && !n.data?.isBranchAdder) {
              return { ...n, data: { ...n.data, isTargetable: true } };
          }
          return n;
      }));
  }, []);

  const onCancelConnect = useCallback(() => {
      setConnectingNodeId(null);
      setNodes((nds) => nds.map(n => ({
          ...n,
          data: { ...n.data, isConnecting: false, isTargetable: false }
      })));
  }, []);

  const onClearConnection = useCallback((nodeId: string) => {
      setEdges((eds) => eds.filter(e => !(e.source === nodeId && e.data?.isLoopBack)));
      
      // Auto-restart connection mode for this node
      setConnectingNodeId(nodeId);
      setNodes((nds) => nds.map(n => {
          if (n.id === nodeId) {
              return { ...n, data: { ...n.data, isConnecting: true } };
          }
          // Mark others as targetable
          if (n.type !== 'placeholder' && n.type !== 'addStep' && n.type !== 'loopBack' && !n.data?.isBranchAdder) {
              return { ...n, data: { ...n.data, isTargetable: true } };
          }
          return n;
      }));
  }, []);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
     if (connectingNodeId && node.data?.isTargetable) {
         // Create Loop Back Edge
         const newEdge: Edge = {
             id: `e-${connectingNodeId}-${node.id}-loopback`,
             source: connectingNodeId,
             target: node.id,
             type: 'custom',
             animated: true,
             style: { stroke: '#22c55e', strokeWidth: 2, strokeDasharray: '5,5' },
             markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' },
             data: { isLoopBack: true }
         };
         
         setEdges((eds) => [...eds, newEdge]);
         
         // Clear connecting state
         setConnectingNodeId(null);
         setNodes((nds) => nds.map(n => ({
             ...n,
             data: { ...n.data, isConnecting: false, isTargetable: false }
         })));
     } else {
         // Open Config Modal
         // Don't open for placeholder or addStep
         if (node.type !== 'placeholder' && node.type !== 'addStep' && node.data?.label !== 'End Automation') {
             // Re-attach icon component from TOOLBOX_ITEMS if missing (due to JSON parse issues sometimes)
             if (!node.data.icon) {
                for (const group of TOOLBOX_ITEMS) {
                    const found = group.items.find(i => i.label === node.data.label);
                    if (found) {
                        node.data.icon = found.icon;
                        break;
                    }
                }
             }
             setSelectedNodeForConfig(node);
             setIsConfigModalOpen(true);
         }
     }
  }, [connectingNodeId]);

  const onSaveConfig = useCallback((nodeId: string, newData: any) => {
      takeSnapshot();
      setNodes((nds) => nds.map(n => {
          if (n.id === nodeId) {
              return { ...n, data: { ...n.data, ...newData } };
          }
          return n;
      }));
      
      // Special Handling for Split Test - Update Edges based on weights
      if (newData.label === 'Split Test (A/B)' && newData.weights) {
          setEdges((eds) => eds.map(e => {
              if (e.source === nodeId) {
                   // Which branch is this? 
                   // We need to identify if it's the "first" or "second" edge... 
                   // Currently our layout/builder logic isn't strictly storing "branch index" on the edge.
                   // But typically they are created in order or we can infer from target X position.
                   
                   // Find all edges from this source
                   const siblings = edges.filter(ed => ed.source === nodeId);
                   siblings.sort((a, b) => {
                       // Sort by target node X position
                       const nodeA = nodes.find(n => n.id === a.target);
                       const nodeB = nodes.find(n => n.id === b.target);
                       return (nodeA?.position.x || 0) - (nodeB?.position.x || 0);
                   });
                   
                   const index = siblings.findIndex(s => s.id === e.id);
                   if (index !== -1 && newData.weights[index] !== undefined) {
                       return { ...e, label: `${newData.weights[index]}%` };
                   }
              }
              return e;
          }));
      }
      
  }, [takeSnapshot, nodes, edges]);


  // Update edges with isDragging state whenever it changes
  const edgesWithData = edges.map(edge => ({
    ...edge,
    type: 'custom', // Force custom edge type
    data: { ...edge.data, isDragging }
  }));

  // Update nodes with isDragging state and connection handlers
  const nodesWithData = nodes.map(node => {
      // Pass isDragging to all nodes so they can handle visual states (like Add Branch highlighting)
     return {
         ...node,
         data: { 
             ...node.data, 
             isDragging,
             onStartConnect,
             onCancelConnect,
             onClearConnection
         }
     };
  });

  const nextTip = () => setCurrentTipIndex((prev) => (prev + 1) % PRO_TIPS.length);
  const prevTip = () => setCurrentTipIndex((prev) => (prev - 1 + PRO_TIPS.length) % PRO_TIPS.length);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
        // Filter out selection changes and dimension changes from snapshotting history
        const significantChanges = changes.filter(c => c.type !== 'select' && c.type !== 'dimensions');
        if (significantChanges.length > 0) {
             takeSnapshot();
        }
        
        setNodes((currentNodes) => {
            const updatedNodes = applyNodeChanges(changes, currentNodes);
            
            // Check if removal happened and trigger re-layout
            if (changes.some(c => c.type === 'remove')) {
                return performAutoLayout(updatedNodes, edges);
            }
            return updatedNodes;
        });
    },
    [takeSnapshot, edges],
  );
  
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
        const significantChanges = changes.filter(c => c.type !== 'select');
        if (significantChanges.length > 0) {
             takeSnapshot();
        }
        setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [takeSnapshot],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
        takeSnapshot();
        setEdges((eds) => addEdge({ ...connection, type: 'custom' }, eds));
    },
    [takeSnapshot],
  );
  
  const onDragEnter = useCallback((event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((event: React.DragEvent) => {
      event.preventDefault();
      // Only clear if leaving the container, not entering a child
      // Use explicit casting to avoid conflict with ReactFlow Node type
      const relatedTarget = event.relatedTarget as HTMLElement | null;
      if (event.currentTarget.contains(relatedTarget)) return;
      
      setIsDragging(false);
      setDropIndicator(null);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    if (!isDragging) setIsDragging(true);
    
    // Calculate Flow Position
    // We strictly use project() here because screenToFlowPosition can be unreliable in some React Flow versions/configs
    // when dragging from outside.
    let position = { x: 0, y: 0 };
    const reactFlowBounds = document.querySelector('.react-flow')?.getBoundingClientRect();
    
    if (reactFlowBounds) {
        position = project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });
    }
      
    const type = event.dataTransfer.types.includes('application/reactflow/type') ? 'action' : 'trigger';
        
    // Check if hovering over an AddStep node OR an "Add Branch" button on a NodeCard
    let targetNode = nodes.find(n => {
        if (n.type === 'addStep') {
            const isBranchAdder = n.data?.isBranchAdder;
            const width = isBranchAdder ? 60 : 280;
            const height = isBranchAdder ? 60 : 100;
            
            const centerX = n.position.x + (width / 2);
            const centerY = n.position.y + (height / 2);
            
            const dist = Math.sqrt(Math.pow(centerX - position.x, 2) + Math.pow(centerY - position.y, 2));
            return dist < 80;
        }
        
        // Check for "Add Branch" button on normal nodes
        if (n.data?.isLastBranchNode) {
            // Button is approx at x + 350, y + 50
            const buttonX = n.position.x + 350;
            const buttonY = n.position.y + 50;
            const dist = Math.sqrt(Math.pow(buttonX - position.x, 2) + Math.pow(buttonY - position.y, 2));
            return dist < 60;
        }

        return false;
    });

    if (targetNode) {
        if (targetNode.type === 'addStep') {
            const isBranchAdder = targetNode.data?.isBranchAdder;
            const width = isBranchAdder ? 60 : 280;
            const height = isBranchAdder ? 60 : 100;
            setDropIndicator({
                x: targetNode.position.x + (width / 2),
                y: targetNode.position.y + (height / 2),
                type: type as 'trigger' | 'action' | 'logic'
            });
        } else {
            // It's a NodeCard with "Add Branch" button
            setDropIndicator({
                x: targetNode.position.x + 350,
                y: targetNode.position.y + 50,
                type: type as 'trigger' | 'action' | 'logic'
            });
        }
    } else {
        setDropIndicator({
            x: position.x,
            y: position.y,
            type: type as 'trigger' | 'action' | 'logic'
        });
    }
  }, [project, screenToFlowPosition, nodes, isDragging]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);
      setDropIndicator(null);
      
      let type = event.dataTransfer.getData('application/reactflow/type');
      let label = event.dataTransfer.getData('application/reactflow/label');

      // Fallback for text/plain (some browsers/environments)
      if (!type) {
        try {
            const raw = event.dataTransfer.getData('text/plain');
            if (raw) {
                const parsed = JSON.parse(raw);
                type = parsed.type;
                label = parsed.label;
            }
        } catch (e) {
            console.error('Failed to parse drag data', e);
        }
      }

      if (!type) return;

      takeSnapshot();
      
      const isTerminal = type === 'loopBack' || label === 'End Automation' || label === 'Send To Automation';


      // Calculate Flow Position
      // Strictly use project() to avoid screenToFlowPosition issues
      let position = { x: 0, y: 0 };
      const reactFlowBounds = document.querySelector('.react-flow')?.getBoundingClientRect();
      
      if (reactFlowBounds) {
          position = project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
          });
      }

      // Check if we have a valid position (if project failed and screenToFlowPosition failed, we might be at 0,0)
      // But usually one of them works.

      const newNode: Node = {
        id: `${type}-${nodes.length + 1}-${Date.now()}`,
        type,
        position,
        data: { label: label },
        width: 280,
      };

      // Find icon and add it to data
      let foundItem;
      for (const group of TOOLBOX_ITEMS) {
        foundItem = group.items.find(i => i.label === label);
        if (foundItem) break;
      }
      
      if (foundItem) {
        newNode.data = { 
          label: foundItem.label, 
          icon: foundItem.icon,
          subtitle: foundItem.label === 'Birthday' ? 'Triggers on contact\'s birthday' :
                   foundItem.label === 'Notes' ? 'Note Added' :
                   type === 'trigger' ? 'When this happens...' : 
                   type === 'condition' ? 'Check if...' : 
                   type === 'delay' ? 'Wait for...' : 'Perform action'
        };
      }

      // Special Case: Replacing the placeholder with the first node (Trigger, Action, or Logic)
      const placeholderNode = nodes.find(n => n.type === 'placeholder');
      const isFirstNode = nodes.length === 1 && placeholderNode;
      
      if (isFirstNode && placeholderNode) {
          // Snap to placeholder position
          newNode.position = { ...placeholderNode.position };

          // Check if this is a Branching Node
          const isBranching = ['If / Else', 'Split Test (A/B)', 'Switch Case', 'Parallel'].includes(foundItem?.label || label);

          if (isBranching) {
               const branchY = newNode.position.y + VERTICAL_SPACING;
               // Calculate width for 2 nodes
               const totalWidth = (280 * 2) + 60; // 2 nodes + 60px gap (X_GAP)
               const startX = newNode.position.x + 140 - (totalWidth / 2); // Center of parent - half total width
               
               // Branch A
               const addStepA: Node = {
                  id: `add-step-${Date.now()}-A`,
                  type: 'addStep',
                  position: { x: startX, y: branchY }, 
                  data: { label: 'Add Step' },
                  draggable: false,
                  width: 280, 
                  height: 100
               };

               // Branch B
               const addStepB: Node = {
                  id: `add-step-${Date.now()}-B`,
                  type: 'addStep',
                  position: { x: startX + 280 + 60, y: branchY }, 
                  data: { label: 'Add Step', isLastBranchNode: true },
                  draggable: false,
                  width: 280, 
                  height: 100
               };

               // Common Merge Node (Below Branches)
               // CONDITIONAL: Only create Merge Node if we have >= 2 branches with content (initially empty, so HIDE)
               
               // Add Branch Button
               const addBranchNode: Node = {
                    id: `add-branch-${Date.now()}`,
                    type: 'addStep',
                    position: { 
                        x: addStepB.position.x + 280 + 20, 
                        y: branchY + 20 
                    },
                    data: { label: 'Add Branch', isBranchAdder: true },
                    draggable: false,
                    width: 60,
                    height: 60
                };

               const isSplitTest = (foundItem?.label || label) === 'Split Test (A/B)';

               const edgeA = {
                   id: `e-${newNode.id}-${addStepA.id}`,
                   source: newNode.id,
                   target: addStepA.id,
                   type: 'smoothstep',
                   markerEnd: { type: MarkerType.ArrowClosed },
                   label: isSplitTest ? '50%' : undefined,
                   data: isSplitTest ? { isSplitTest: true } : undefined
               };

               const edgeB = {
                   id: `e-${newNode.id}-${addStepB.id}`,
                   source: newNode.id,
                   target: addStepB.id,
                   type: 'smoothstep',
                   markerEnd: { type: MarkerType.ArrowClosed },
                   label: isSplitTest ? '50%' : undefined,
                   data: isSplitTest ? { isSplitTest: true } : undefined
               };
               
               // Edges from Branches to Merge Node (DISABLED)
               /*
               const edgeMergeA = {
                   id: `e-${addStepA.id}-${mergeNode.id}`,
                   source: addStepA.id,
                   target: mergeNode.id,
                   type: 'smoothstep',
                   markerEnd: { type: MarkerType.ArrowClosed }
               };

               const edgeMergeB = {
                   id: `e-${addStepB.id}-${mergeNode.id}`,
                   source: addStepB.id,
                   target: mergeNode.id,
                   type: 'smoothstep',
                   markerEnd: { type: MarkerType.ArrowClosed }
               };
               */
               
               const edgeBranch = {
                   id: `e-${addStepB.id}-${addBranchNode.id}`,
                   source: addStepB.id,
                   sourceHandle: 'right-source',
                   target: addBranchNode.id,
                   type: 'smoothstep',
                   markerEnd: { type: MarkerType.ArrowClosed },
                   style: { strokeDasharray: '5,5', opacity: 0.5 }
               };

               const newEdges = [edgeA, edgeB, edgeBranch]; // Removed edgeMergeA, edgeMergeB
               const newNodes = [newNode, addStepA, addStepB, addBranchNode]; // Removed mergeNode

               const layoutedNodes = performAutoLayout(newNodes, newEdges);
               setEdges(newEdges);
               setNodes(layoutedNodes);
               return;

          } else {
              // Standard Node -> Single AddStep below
              if (!isTerminal) {
                const addStepNode: Node = {
                    id: `add-step-${Date.now()}`,
                    type: 'addStep',
                    position: { x: newNode.position.x, y: newNode.position.y + VERTICAL_SPACING }, // Centered below
                    data: { label: 'Add Step' },
                    draggable: false,
                    width: 280,
                    height: 100
                };
                
                const newEdge = {
                    id: `e-${newNode.id}-${addStepNode.id}`,
                    source: newNode.id,
                    target: addStepNode.id,
                    type: 'smoothstep',
                    markerEnd: { type: MarkerType.ArrowClosed }
                };

                const layoutedNodes = performAutoLayout([newNode, addStepNode], [newEdge]);
                setEdges([newEdge]);
                setNodes(layoutedNodes);
              } else {
                setNodes([newNode]);
                setEdges([]);
              }
              return;
          }
      }


      // 1. Trigger Logic: Only allow at top (or horizontally if there are existing triggers)
      if (type === 'trigger') {
        const existingTriggers = nodes.filter(n => n.type === 'trigger');
        
        // Try to find a connected trigger to use as a template
        let templateEdge: Edge | undefined;
        let templateTrigger: Node | undefined;
        
        if (existingTriggers.length > 0) {
            for (const trig of existingTriggers) {
                const edge = edges.find(e => e.source === trig.id);
                if (edge) {
                    templateEdge = edge;
                    templateTrigger = trig;
                    break;
                }
            }
        }
        
        if (templateEdge && templateTrigger) {
           // Match Y position of existing triggers (or the template one)
           const firstTriggerY = templateTrigger.position.y;
           newNode.position.y = firstTriggerY;

           // Place to the right of the last trigger
           const maxX = Math.max(...existingTriggers.map(n => n.position.x));
           newNode.position.x = maxX + 300; // 280 width + 20 gap
           
           // Connect to the same next node
           setEdges((eds) => [
             ...eds,
             { 
                 id: `e-${newNode.id}-${templateEdge!.target}`, 
                 source: newNode.id, 
                 target: templateEdge!.target, 
                 type: 'smoothstep', 
                 markerEnd: { type: MarkerType.ArrowClosed } 
             }
           ]);

           // Re-center the Add Step Node (or whatever the next node is)
           const nextNodeId = templateEdge.target;
           const allTriggers = [...existingTriggers, newNode];
           
           // Calculate center X of all triggers
           const minTriggerX = Math.min(...allTriggers.map(n => n.position.x));
           const maxTriggerX = Math.max(...allTriggers.map(n => n.position.x));
           // Center is (MinX + (MaxX + Width)) / 2
           const centerX = (minTriggerX + maxTriggerX + 280) / 2;

           // Find the entire subtree below the trigger group
           const subtreeNodes: Set<string> = new Set();
           const queue = [nextNodeId];
           while (queue.length > 0) {
               const currentId = queue.shift()!;
               if (!subtreeNodes.has(currentId)) {
                   subtreeNodes.add(currentId);
                   // Add children to queue
                   const children = edges
                       .filter(e => e.source === currentId)
                       .map(e => e.target);
                   queue.push(...children);
               }
           }
           
           // Calculate delta
           const rootNode = nodes.find(n => n.id === nextNodeId);
           let deltaX = 0;
           
           if (rootNode) {
                const rootWidth = rootNode.type === 'addStep' ? 280 : 280; 
                const targetX = centerX - (rootWidth / 2);
                deltaX = targetX - rootNode.position.x;
           }

           setNodes((currentNodes) => {
               return currentNodes.map(n => {
                   if (subtreeNodes.has(n.id)) {
                       // Update root status if it's the target node
                       // This ensures the "dot" handle appears on top of the node we connect to
                       if (n.id === nextNodeId) {
                           return { 
                               ...n, 
                               position: { ...n.position, x: n.position.x + deltaX },
                               data: { ...n.data, isRoot: false } // Force isRoot false to show handle
                           };
                       }
                       return { ...n, position: { ...n.position, x: n.position.x + deltaX } };
                   }
                   return n;
               }).concat(newNode);
           });

           return; // Skip the default setNodes at end
        } else {
           // NEW LOGIC: If no connected triggers exist (either 0 triggers, or all disconnected)
           // Check if there are other nodes (Actions/Logic)
           // If so, put Trigger ABOVE them and shift everything down.
           
           // Filter for "root" nodes - nodes that don't have incoming flow edges (but might be Actions/Logic)
           // Actually, just find the topmost node.
           
           const nonPlaceholderNodes = nodes.filter(n => n.type !== 'placeholder' && n.type !== 'trigger');
           
           if (nonPlaceholderNodes.length > 0) {
               // Find topmost Y
               const minY = Math.min(...nonPlaceholderNodes.map(n => n.position.y));
               
               // Find nodes at that level (could be multiple if parallel roots?)
               // Usually there's one start.
               
               // Position new trigger at top
               newNode.position.x = 425; // Default center X (or match the X of the node below?)
               
               // Let's try to match X of the topmost node if it's single
               const topNodes = nonPlaceholderNodes.filter(n => Math.abs(n.position.y - minY) < 10);
               if (topNodes.length === 1) {
                   newNode.position.x = topNodes[0].position.x;
               }
               
               newNode.position.y = 50; // Fixed top position
               
               // Calculate shift amount
               // We want the old top (minY) to move down to at least 50 + VERTICAL_SPACING + Gap?
               // Actually, let's just shift everything down by one step (VERTICAL_SPACING = 150 usually)
               
               const shiftAmount = VERTICAL_SPACING;
               
               // Shift all existing nodes down
               // Also connect new Trigger to the old "top" nodes?
               // If there was no trigger before, the flow was technically broken or just floating actions.
               // We should connect the Trigger to the topmost node(s).
               
               const newEdges: Edge[] = [];
               
               // Connect to top nodes (roots)
               // A root is a node with no incoming edges?
               // Or just the ones at minY?
               
               // Let's identify "roots" - nodes with no incoming edges from other nodes (except placeholders)
               // Since we are adding the FIRST trigger, any existing chain starts somewhere.
               
               const existingTargetIds = new Set(edges.map(e => e.target));
               const rootNodes = nonPlaceholderNodes.filter(n => !existingTargetIds.has(n.id));
               
               // If there are no clear roots (maybe loops?), fallback to topNodes
               const targets = rootNodes.length > 0 ? rootNodes : topNodes;
               
               targets.forEach(target => {
                   newEdges.push({
                       id: `e-${newNode.id}-${target.id}`,
                       source: newNode.id,
                       target: target.id,
                       type: 'smoothstep',
                       markerEnd: { type: MarkerType.ArrowClosed }
                   });
               });
               
               // Use Auto Layout to ensure consistent state and handle updates (fixing missing indicator lines)
               const cleanNodes = nodes.filter(n => n.type !== 'placeholder');
               const allNodes = [...cleanNodes, newNode];
               const allEdges = [...edges, ...newEdges];
               
               const layoutedNodes = performAutoLayout(allNodes, allEdges);
               
               setNodes(layoutedNodes);
               setEdges(allEdges);
               
               return;
           } else {

               // Empty canvas (except placeholder)
               newNode.position.y = 50;
               newNode.position.x = 425; // Default center
           }
        }
        
        // Remove placeholder if it exists and add new trigger (Fallback if not caught by first node logic)
        setNodes((nds) => {
            const cleanNodes = nds.filter(n => n.type !== 'placeholder');
            return cleanNodes.concat(newNode);
        });
        return;
      }

      // 2. Action/Logic Logic: Insert Above, Below, or Split
      
      // Strict Snapping Rule:
      // Actions/Logic MUST snap to an 'addStep' node.
      // If not dropped directly on one, find the closest one.
      
      // Strict Snapping Rule:
      // Actions/Logic MUST snap to an 'addStep' node OR "Add Branch" button.
      const closestTargetNode = nodes.find(n => {
         // Skip if we are dropping a trigger
         if (type === 'trigger') return false;

         if (n.type === 'addStep') {
             const isBranchAdder = n.data?.isBranchAdder;
             const width = isBranchAdder ? 60 : 280;
             const height = isBranchAdder ? 60 : 100;
             
             const centerX = n.position.x + (width / 2);
             const centerY = n.position.y + (height / 2);
             
             const dist = Math.sqrt(Math.pow(centerX - position.x, 2) + Math.pow(centerY - position.y, 2));
             return dist < 80;
         }

         // Check for "Add Branch" button on normal nodes
         if (n.data?.isLastBranchNode) {
             const buttonX = n.position.x + 350;
             const buttonY = n.position.y + 50;
             const dist = Math.sqrt(Math.pow(buttonX - position.x, 2) + Math.pow(buttonY - position.y, 2));
             return dist < 60;
         }
         
         return false;
      });
      
      // If we dropped on a node that is NOT an addStep, it must be the "Add Branch" button case
      let isAddBranchDrop = false;
      let closestAddStepNode: Node | undefined;
      
      if (closestTargetNode) {
          if (closestTargetNode.type === 'addStep') {
              closestAddStepNode = closestTargetNode;
          } else {
              isAddBranchDrop = true;
          }
      }
      
      if (closestAddStepNode || isAddBranchDrop) {
          
          // Handle "Add Branch" Drop Logic (on visible button OR on invisible addStep node)
          if (isAddBranchDrop || closestAddStepNode?.data?.isBranchAdder) {
             
             // We are adding a NEW branch (Option C, D...)
             const referenceNode = isAddBranchDrop ? closestTargetNode! : closestAddStepNode!;
             
             // Find siblings of the branch
             // If dropped on referenceNode (which is the last branch node), we know the parent edge.
             // If dropped on addStepNode, we need to find the node to its left.
             
             let siblingNode: Node | undefined;
             
             if (isAddBranchDrop) {
                 siblingNode = referenceNode;
             } else {
                 // Try to find by stored sibling ID first (ROBUST)
                 siblingNode = nodes.find(n => n.id === referenceNode.data?.siblingId);

                 if (!siblingNode) {
                    // Fallback to heuristic
                    siblingNode = nodes.find(n => 
                        Math.abs(n.position.y - referenceNode.position.y - (-20)) < 40 && 
                     n.position.x < referenceNode.position.x &&
                     (referenceNode.position.x - (n.position.x + 280)) < 150
                 );
             }
             }

             if (siblingNode) {
                 // Find parent
                 const parentEdge = edges.find(e => e.target === siblingNode!.id);
                 if (parentEdge) {
                     const parentNode = nodes.find(n => n.id === parentEdge.source);
                     
                     // Create the new node
                     newNode.data = { ...newNode.data, isBranchChild: true };
                     
                     // We need to insert this new node as a sibling and re-layout
                     let newNodes = [...nodes];
                     let updatedEdges = [...edges];
                     
                     // Remove the old adder if it exists (only if we dropped on it)
                     if (!isAddBranchDrop) {
                         newNodes = newNodes.filter(n => n.id !== referenceNode.id);
                         updatedEdges = updatedEdges.filter(e => e.target !== referenceNode.id);
                     }
                     
                     // Get all siblings
                     const siblingEdges = edges.filter(e => e.source === parentNode!.id && e.target !== referenceNode.id); // Exclude adder if picked up by edge
                     const currentSiblingIds = siblingEdges.map(e => e.target);
                     const siblings = nodes.filter(n => currentSiblingIds.includes(n.id) && !n.data?.isBranchAdder);
                     
                     // Add new node to siblings
                     siblings.push(newNode);
                     
                     // Add new node to nodes list
                     newNodes.push(newNode);
                     
                     // Add edge for new node
                     updatedEdges.push({
                         id: `e-${parentNode!.id}-${newNode.id}`,
                         source: parentNode!.id,
                         target: newNode.id,
                         type: 'smoothstep',
                         markerEnd: { type: MarkerType.ArrowClosed },
                         label: '' // Will update below
                     });
                     
                     // Sort siblings by X
                     siblings.sort((a, b) => a.position.x - b.position.x);

                     // Recalculate layout using Auto Layout instead of manual
                     const updatedSiblings = siblings; // Use sorted siblings directly
                     
                     // Update nodes in main list
                     newNodes = newNodes.map(n => {
                         const updated = updatedSiblings.find(s => s.id === n.id);
                         return updated || n;
                     });
                     
                     // Handle Branch Adder (ensure only one exists at the end)
                     // Remove any existing branch adders for this group
                     // (We already removed the one we dropped on if applicable, but clean up any others)
                     const siblingIdsList = siblings.map(n => n.id);
                     const connectedAdderEdges = edges.filter(e => siblingIdsList.includes(e.source) && nodes.find(n => n.id === e.target)?.data?.isBranchAdder);
                     const adderIds = connectedAdderEdges.map(e => e.target);
                     
                     newNodes = newNodes.filter(n => !adderIds.includes(n.id));
                     updatedEdges = updatedEdges.filter(e => !adderIds.includes(e.target) && !adderIds.includes(e.source));
                     
                     // Create NEW Branch Adder
                     const lastSibling = updatedSiblings[updatedSiblings.length - 1];
                     const addBranchNodeId = `add-branch-${Date.now()}`;
                     
                     const addBranchNode: Node = {
                          id: addBranchNodeId,
                          type: 'addStep',
                          position: { 
                              x: lastSibling.position.x + 280 + 20, 
                              y: lastSibling.position.y + 20 
                          },
                          data: { label: 'Add Branch', isBranchAdder: true },
                          draggable: false,
                          width: 60,
                          height: 60,
                          parentId: undefined
                      };
                      
                      newNodes.push(addBranchNode);
                      
                      updatedEdges.push({
                           id: `e-${lastSibling.id}-${addBranchNode.id}`,
                           source: lastSibling.id,
                           sourceHandle: 'right-source',
                           target: addBranchNode.id,
                           type: 'smoothstep',
                           markerEnd: { type: MarkerType.ArrowClosed },
                           style: { strokeDasharray: '5,5', opacity: 0.5 }
                       });
                       
                       // Check if the NEW node is a Branching Node
                      const isBranching = ['If / Else', 'Split Test (A/B)', 'Switch Case', 'Parallel'].includes(label);
                      const isSplitTestParent = parentNode?.data?.label === 'Split Test (A/B)';

                      if (isBranching) {
                           // Initialize Branching Structure (A/B)
                           const branchY = newNode.position.y + VERTICAL_SPACING;
                           
                           // Branch A
                           const addStepA: Node = {
                              id: `add-step-${Date.now()}-A`,
                              type: 'addStep',
                              position: { x: newNode.position.x, y: branchY }, // Position will be fixed by layout
                              data: { label: 'Add Step' },
                              draggable: false,
                              width: 280, 
                              height: 100
                           };

                           // Branch B
                           const addStepB: Node = {
                              id: `add-step-${Date.now()}-B`,
                              type: 'addStep',
                              position: { x: newNode.position.x + 340, y: branchY }, 
                              data: { label: 'Add Step', isLastBranchNode: true },
                              draggable: false,
                              width: 280, 
                              height: 100
                           };

                           // Inner Add Branch Button
                           const innerAddBranchNode: Node = {
                                id: `add-branch-${Date.now()}-Inner`,
                                type: 'addStep',
                                position: { 
                                    x: addStepB.position.x + 280 + 20, 
                                    y: branchY + 20 
                                },
                                data: { 
                                    label: 'Add Branch', 
                                    isBranchAdder: true,
                                    siblingId: addStepB.id // Store sibling ID for robust detection
                                },
                                draggable: false,
                                width: 60,
                                height: 60
                            };

                           newNodes.push(addStepA, addStepB, innerAddBranchNode);

                           // Connect edges
                           updatedEdges.push({
                               id: `e-${newNode.id}-${addStepA.id}`,
                               source: newNode.id,
                               target: addStepA.id,
                               type: 'smoothstep',
                               markerEnd: { type: MarkerType.ArrowClosed },
                               label: '50%'
                           });

                           updatedEdges.push({
                               id: `e-${newNode.id}-${addStepB.id}`,
                               source: newNode.id,
                               target: addStepB.id,
                               type: 'smoothstep',
                               markerEnd: { type: MarkerType.ArrowClosed },
                               label: '50%'
                           });
                           
                           updatedEdges.push({
                               id: `e-${addStepB.id}-${innerAddBranchNode.id}`,
                               source: addStepB.id,
                               sourceHandle: 'right-source',
                               target: innerAddBranchNode.id,
                               type: 'smoothstep',
                               markerEnd: { type: MarkerType.ArrowClosed },
                               style: { strokeDasharray: '5,5', opacity: 0.5 }
                           });

                      } else {
                          // Standard Node
                          // If this is a branch child, we need to check if there's a Merge Node to connect to.
                          // If there is, connect to it and DO NOT create a local Add Step below.
                          
                          // Check for siblings' connections to find a merge node
                          const otherSiblings = updatedSiblings.filter(s => s.id !== newNode.id);
                          let connectedToMerge = false;
                          let mergeNodeId: string | undefined = undefined;
                          
                          if (isSplitTestParent) {
                              // Collect all outgoing targets from other siblings
                              const siblingTargets = otherSiblings.map(sib => {
                                  // Only look at FLOW edges
                                  const edge = updatedEdges.find(e => e.source === sib.id && e.sourceHandle !== 'right-source');
                                  return edge ? edge.target : null;
                              }).filter(t => t !== null) as string[];

                              // Count occurrences to find SHARED targets
                              const targetCounts: Record<string, number> = {};
                              siblingTargets.forEach(t => { targetCounts[t] = (targetCounts[t] || 0) + 1; });

                              // Only connect if the target is SHARED by at least 2 other siblings
                              // OR if all other siblings share it (e.g. 2 siblings total, both go to M)
                              // If we have A->M, B->M. Count(M)=2. Shared.
                              // If we have A->AddStepA, B->AddStepB. Count(AddStepA)=1. Not shared.
                              const sharedTargetId = Object.keys(targetCounts).find(id => targetCounts[id] > 1);

                              if (sharedTargetId) {
                                  mergeNodeId = sharedTargetId;
                                  connectedToMerge = true;
                              }
                          }
                          
                          if (connectedToMerge && mergeNodeId) {
                               updatedEdges.push({
                                   id: `e-${newNode.id}-${mergeNodeId}`,
                                   source: newNode.id,
                                   target: mergeNodeId,
                                   type: 'smoothstep',
                                   markerEnd: { type: MarkerType.ArrowClosed }
                               });
                          } else {
                             // If no merge node found, we rely on the main "Handle Merge Node Logic" (usually runs after this?)
                             // Wait, "Handle Merge Node Logic" runs in `onDrop`, but here we are inside `onNodeClick` (which mimics `onDrop` logic?)
                             // NO, `onNodeClick` for `isBranchAdder` does NOT run the big merge logic block found in `onDrop`.
                             
                             // So we MUST run the merge logic here too if we want to create a new merge node!
                             
                             // Calculate real siblings count (including newNode)
                             const realSiblings = updatedSiblings.filter(s => s.data.label !== 'Add Step');
                             
                             // If we have >= 2 real siblings, create a merge node
                             
                             // ONLY Split Test should group back together automatically
                             // DISABLE automatic merging for Split Tests to keep branches independent
                             // Users can manually merge if they want, or we can add a "Merge Branches" button later.
                             // For now, allow independent branches (A/B/C testing often has different lengths).
                             if (false && isSplitTestParent) {
                                  // Disabled merge logic
                             } else if (!connectedToMerge && !isTerminal) {
                                // If not merging and not terminal, add a local Add Step node below the NEW branch
                                
                                // BUG FIX: Ensure we don't add duplicate Add Step nodes if one already exists
                                // Check if there is ALREADY an edge from newNode to an "Add Step" node
                                const existingOutgoing = updatedEdges.find(e => e.source === newNode.id && e.sourceHandle !== 'right-source');
                                if (!existingOutgoing) {
                                    const addStepNode: Node = {
                                        id: `add-step-${Date.now()}-local`,
                                        type: 'addStep',
                                        position: { x: newNode.position.x, y: newNode.position.y + VERTICAL_SPACING },
                                        data: { label: 'Add Step' },
                                        draggable: false,
                                        width: 280,
                                        height: 100
                                    };
                                    newNodes.push(addStepNode);
                                    updatedEdges.push({
                                        id: `e-${newNode.id}-${addStepNode.id}`,
                                        source: newNode.id,
                                        target: addStepNode.id,
                                        type: 'smoothstep',
                                        markerEnd: { type: MarkerType.ArrowClosed }
                                    });
                                }
                             }
                          }
                      }

                       // Update labels
                       const count = siblings.length;
                       const percentage = Math.floor(100 / count) + '%';
                       
                       updatedEdges = updatedEdges.map(e => {
                           if (e.source === parentNode!.id) {
                               return { 
                                   ...e, 
                                   label: percentage,
                                   data: isSplitTestParent ? { ...e.data, isSplitTest: true } : e.data
                               };
                           }
                           return e;
                       });
                       
                       const layoutedNodes = performAutoLayout(newNodes, updatedEdges);
                       setNodes(layoutedNodes);
                       setEdges(updatedEdges);
                       return;
                 }
             }
          }
          
          if (isAddBranchDrop) {
              // Should not happen as logic above covers it, but return to prevent falling into standard addStep logic
              return;
          }

          // 1. Position new node at the AddStep location (centered)
          newNode.position = {
              x: closestAddStepNode!.position.x - 76, 
              y: closestAddStepNode!.position.y
          };

          // 2. Find incoming edge(s) to the AddStep node and redirect to New Node
          let incomingEdges: Edge[] = [];
          
          // Separate outgoing edges into Flow (Bottom) and Control (Right/Other)
          let outgoingFlowEdges: Edge[] = []; 
          let outgoingControlEdges: Edge[] = [];

          if (closestAddStepNode) {
              incomingEdges = edges.filter(e => e.target === closestAddStepNode!.id);
              
              const allOutgoing = edges.filter(e => e.source === closestAddStepNode!.id);
              
              allOutgoing.forEach(e => {
                  if (e.sourceHandle === 'right-source') {
                      outgoingControlEdges.push(e);
                  } else {
                      outgoingFlowEdges.push(e);
                  }
              });
          }
          
          let updatedEdges = [...edges];
          if (closestAddStepNode) {
              // Remove edges connected to the replaced node
              updatedEdges = edges.filter(e => e.target !== closestAddStepNode!.id && e.source !== closestAddStepNode!.id);
          }
          
          if (incomingEdges.length > 0) {
              incomingEdges.forEach(edge => {
                  updatedEdges.push({
                      ...edge,
                      target: newNode.id
                  });
              });
          }
          
          // Always reconnect Control Edges (e.g. Add Branch button)
          if (outgoingControlEdges.length > 0) {
              outgoingControlEdges.forEach(outEdge => {
                  updatedEdges.push({
                      ...outEdge, // Keep properties (like ID, style, sourceHandle)
                      source: newNode.id, // Redirect source to new node
                      target: outEdge.target
                  });
              });
          }

          // 3. Determine if this is a Branching Node
          const isBranching = ['If / Else', 'Split Test (A/B)', 'Switch Case', 'Parallel'].includes(label);

          // Handle Loop Back Drop Auto-Start
          const isLoopBack = label === 'Loop Back To';

          let newNodes = [...nodes];
          if (closestAddStepNode) {
             newNodes = [...nodes.filter(n => n.id !== closestAddStepNode!.id), newNode];
          } else {
             newNodes = [...nodes, newNode];
          }

          if (isLoopBack) {
              // Mark new node as connecting
              newNode.data = { ...newNode.data, isConnecting: true };
              setConnectingNodeId(newNode.id);
              
              // Mark all other nodes as targetable immediately
              newNodes = newNodes.map(n => {
                  if (n.id === newNode.id) return n;
                  // Targetable criteria
                  if (n.type !== 'placeholder' && n.type !== 'addStep' && n.type !== 'loopBack' && !n.data?.isBranchAdder) {
                      return { ...n, data: { ...n.data, isTargetable: true } };
                  }
                  return n;
              });
          }

          if (isBranching) {
             // 4a. Handle Branching Nodes
             const branchY = newNode.position.y + VERTICAL_SPACING;
             // Calculate width for 2 nodes
             const totalWidth = (280 * 2) + 60; // 2 nodes + 60px gap (X_GAP)
             const startX = newNode.position.x + 140 - (totalWidth / 2); // Center of parent - half total width
             
             // Branch A
             const branchAX = startX;
             const addStepA: Node = {
                id: `add-step-${Date.now()}-A`,
                type: 'addStep',
                position: { x: branchAX, y: branchY }, // Centered under slot A
                data: { label: 'Add Step' },
                draggable: false,
                width: 280, 
                height: 100
             };

             // Branch B
             const branchBX = startX + 280 + 60; // X_GAP
             const addStepB: Node = {
                id: `add-step-${Date.now()}-B`,
                type: 'addStep',
                position: { x: branchBX, y: branchY }, // Centered under slot B
                data: { label: 'Add Step', isLastBranchNode: true },
                draggable: false,
                width: 280, 
                height: 100
             };

             // Handle Merge Node Logic (Dynamic Creation/Removal)
             // CONDITIONAL: Only create Merge Node if we have >= 2 branches (always true here)
             // BUT, we want to hide it if the branches are just empty placeholders?
             // Actually, when initializing, we have 2 empty placeholders.
             // User wants to hide it until "at least two actions items are added".
             // So initially, NO Merge Node.
             
             /* 
             const mergeNode: Node = {
                  id: `add-step-${Date.now()}-Merge`,
                  type: 'addStep',
                  ...
             };
             newNodes.push(mergeNode);
             */

             newNodes.push(addStepA, addStepB);

             const isSplitTest = label === 'Split Test (A/B)';

             // Connect edges
             updatedEdges.push({
                 id: `e-${newNode.id}-${addStepA.id}`,
                 source: newNode.id,
                 target: addStepA.id,
                 type: 'smoothstep',
                 markerEnd: { type: MarkerType.ArrowClosed },
                 label: isSplitTest ? '50%' : undefined,
                 data: isSplitTest ? { isSplitTest: true } : undefined
             });

             updatedEdges.push({
                 id: `e-${newNode.id}-${addStepB.id}`,
                 source: newNode.id,
                 target: addStepB.id,
                 type: 'smoothstep',
                 markerEnd: { type: MarkerType.ArrowClosed },
                 label: isSplitTest ? '50%' : undefined,
                 data: isSplitTest ? { isSplitTest: true } : undefined
             });
             
             // DO NOT connect branches to Merge Node yet (it doesn't exist)
             /*
             updatedEdges.push({
                 id: `e-${addStepA.id}-${mergeNode.id}`,
                 source: addStepA.id,
                 target: mergeNode.id,
                 ...
             });
             */

             // Connect Merge Node to Outgoing Edges
             // Since Merge Node doesn't exist, where do outgoing edges go?
             // They should probably float or be disconnected for now.
             // Or maybe we attach them to the Split Node temporarily? No, that's messy.
             // If we are inserting a Split Test into an existing flow, `outgoingEdges` point to the next step.
             // We should probably keep track of them but not connect them until the Merge Node appears?
             // OR, better: Connect both branches to the "next step" if it exists?
             // But if "next step" is a single node, that acts like a merge node.
             
             if (outgoingFlowEdges.length > 0) {
                 // If we have a next step, maybe we use THAT as the merge node?
                 // But the next step might be a real action, not an "Add Step".
                 // That's fine.
                 
                 // If we have outgoing edges, let's connect both branches to the target.
                 // ONLY if it is a Split Test (which merges)
                 // If it is If/Else, we might NOT want to connect them to the same next step automatically?
                 // Usually If/Else branches stay separate until explicitly merged.
                 // BUT if we insert it into a linear flow, what happens to the stuff below?
                 // Standard behavior: The stuff below becomes the "After" block, which implies a merge.
                 // If/Else implies separation.
                 // So maybe for If/Else we should NOT connect the branches to the outgoing edges?
                 // Or connect them only if the user explicitly wants to merge?
                 // The request says "specifically each branch added should be separate for If/Else logics".
                 // This implies NO automatic merge to the subsequent node.
                 
                 if (isSplitTest) {
                     outgoingFlowEdges.forEach(outEdge => {
                         // Connect A
                         updatedEdges.push({
                             id: `e-${addStepA.id}-${outEdge.target}`,
                             source: addStepA.id,
                             target: outEdge.target,
                             type: 'smoothstep',
                             markerEnd: { type: MarkerType.ArrowClosed }
                         });
                         // Connect B
                         updatedEdges.push({
                             id: `e-${addStepB.id}-${outEdge.target}`,
                             source: addStepB.id,
                             target: outEdge.target,
                             type: 'smoothstep',
                             markerEnd: { type: MarkerType.ArrowClosed }
                         });
                     });
                 }
                 // If NOT Split Test (e.g. If/Else), the outgoing edges (the rest of the flow) become disconnected?
                 // Or maybe we attach the rest of the flow to ONE of the branches? Or let it hang?
                 // Usually, inserting an If/Else breaks the flow. The user has to rebuild or drag items in.
                 // Disconnecting seems safer for "Separate" requirement.
             }

             // Add "Add Branch" button to the right
             const addBranchNode: Node = {
                  id: `add-branch-${Date.now()}`,
                  type: 'addStep',
                  position: { 
                      x: branchBX + 280 + 20, // Right of B + gap
                      y: branchY + 20 
                  },
                  data: { label: 'Add Branch', isBranchAdder: true },
                  draggable: false,
                  width: 60,
                  height: 60,
                  parentId: undefined
              };
              newNodes.push(addBranchNode);
              
              updatedEdges.push({
                   id: `e-${addStepB.id}-${addBranchNode.id}`,
                   source: addStepB.id,
                   sourceHandle: 'right-source', // Explicitly use right handle
                   target: addBranchNode.id,
                   type: 'smoothstep',
                   markerEnd: { type: MarkerType.ArrowClosed },
                   style: { strokeDasharray: '5,5', opacity: 0.5 }
               });

          } else {
             // 4b. Standard Node -> Single AddStep below
             // SKIP for Terminal nodes (LoopBack, End Automation, Send To Automation) - they are terminal for this branch
             if (!isTerminal) {
                 // Check if we already have an outgoing path (e.g. into a Merge Node or filling a gap)
                 // If so, we do NOT want to add an extra "Add Step" placeholder.
                 if (outgoingFlowEdges.length > 0) {
                     outgoingFlowEdges.forEach(outEdge => {
                         updatedEdges.push({
                             id: `e-${newNode.id}-${outEdge.target}`,
                             source: newNode.id,
                             target: outEdge.target,
                             type: 'smoothstep',
                             markerEnd: { type: MarkerType.ArrowClosed }
                         });
                     });
                 } else {
                     // Standard case: Extend the flow with a new Add Step placeholder
                     const addStepNode: Node = {
                        id: `add-step-${Date.now()}`,
                        type: 'addStep',
                        position: { x: newNode.position.x, y: newNode.position.y + VERTICAL_SPACING },
                        data: { label: 'Add Step' },
                        draggable: false,
                        width: 280, 
                        height: 100
                     };
                     
                     newNodes.push(addStepNode);
                     
                     updatedEdges.push({
                         id: `e-${newNode.id}-${addStepNode.id}`,
                         source: newNode.id,
                         target: addStepNode.id,
                         type: 'smoothstep',
                         markerEnd: { type: MarkerType.ArrowClosed }
                     });
                 }
             }
          }
          
          // Check for filling a branch slot
          if (incomingEdges.length === 1) {
              const incomingEdge = incomingEdges[0];
              const parentNode = nodes.find(n => n.id === incomingEdge.source);
              if (parentNode && ['If / Else', 'Split Test (A/B)', 'Switch Case', 'Parallel'].includes(parentNode.data.label)) {
                  
                  // 1. Mark this node as a branch child and potentially last in branch
                  newNode.data = { ...newNode.data, isBranchChild: true };

                  // 2. Identify all current siblings (including this new one)
                  const siblingEdges = edges.filter(e => e.source === parentNode.id && e.target !== closestAddStepNode!.id);
                  const siblingIds = siblingEdges.map(e => e.target);
                  
                  // Filter out any "Add Branch" nodes that might have been accidentally included (though unlikely via edges)
                  const siblings = [
                      ...nodes.filter(n => siblingIds.includes(n.id) && !n.data?.isBranchAdder),
                      newNode
                  ];

                  // If we just replaced an empty slot, check if we need to add a "Add Branch" button to the right
                  // We sort siblings by X position to find the order
                  siblings.sort((a, b) => a.position.x - b.position.x);
                  
                  // Recalculate layout for centering
                  const count = siblings.length;
                  const totalWidth = (count * 280) + ((count - 1) * 60); // X_GAP
                  const startX = parentNode.position.x + 140 - (totalWidth / 2); // Center relative to parent
                  
                  // Apply new positions to all siblings
                  let updatedSiblings = siblings.map((sib, index) => {
                      const newX = startX + (index * 340); // 280 + 60
                      
                      // Calculate delta to shift children
                      const deltaX = newX - sib.position.x;
                      
                      // If we are shifting the node, we should also shift its immediate children (like Add Step)
                      // to keep them aligned visually, especially if auto-layout misses them or if they are placeholders.
                      // We only do this for "Add Step" nodes to avoid messing up complex sub-graphs that auto-layout handles.
                      if (deltaX !== 0) {
                          const childEdges = updatedEdges.filter(e => e.source === sib.id);
                          childEdges.forEach(edge => {
                              const childNode = newNodes.find(n => n.id === edge.target);
                              if (childNode && childNode.type === 'addStep') {
                                  childNode.position.x += deltaX;
                              }
                          });
                      }

                      // If it's the new node, update its position directly
                      if (sib.id === newNode.id) {
                          newNode.position.x = newX;
                      }
                      
                      // Check if it's the last node
                      const isLast = index === count - 1;
                      
                      const updatedNode = {
                          ...sib,
                          position: { ...sib.position, x: newX },
                          data: { ...sib.data, isLastBranchNode: isLast }
                      };

                      // IMPORTANT: Update newNode data ref if it's the one being processed
                      if (sib.id === newNode.id) {
                          newNode.data = updatedNode.data;
                      }

                      return updatedNode;
                  });
                  
                  // Replace nodes in newNodes list
                  newNodes = newNodes.map(n => {
                      const updated = updatedSiblings.find(s => s.id === n.id);
                      return updated || n;
                  });

                  // 3. Handle "Add Branch" Button
                  // Identify existing branch adders connected to this specific branch group
                  const siblingIdsList = siblings.map(n => n.id);
                  const connectedBranchAdderEdges = edges.filter(e => 
                      siblingIdsList.includes(e.source) && 
                      nodes.find(n => n.id === e.target)?.data?.isBranchAdder
                  );
                  const connectedBranchAdderIds = connectedBranchAdderEdges.map(e => e.target);
                  
                  // Remove ONLY the branch adders related to this group
                  newNodes = newNodes.filter(n => !connectedBranchAdderIds.includes(n.id));
                  
                  // Remove edges connected to these specific adder nodes
                  updatedEdges = updatedEdges.filter(e => 
                      !connectedBranchAdderIds.includes(e.target) && 
                      !connectedBranchAdderIds.includes(e.source)
                  );
                  
                  // Create NEW Branch Adder
                  const lastSibling = updatedSiblings[updatedSiblings.length - 1];
                  const addBranchNodeId = `add-branch-${Date.now()}`;
                  
                  const addBranchNode: Node = {
                      id: addBranchNodeId,
                      type: 'addStep',
                      position: { 
                          x: lastSibling.position.x + 280 + 20, // Right of card + gap
                          y: lastSibling.position.y + 20 
                      },
                      data: { 
                          label: 'Add Branch', 
                          isBranchAdder: true,
                          siblingId: lastSibling.id // Store sibling ID for robust detection
                      },
                      draggable: false,
                      width: 60,
                      height: 60,
                      parentId: undefined
                  };
                  
                  newNodes.push(addBranchNode);
                  
                  // Add edge connecting last sibling to addBranchNode
                  // CRITICAL: Source is lastSibling.id, Handle is 'right-source'
                  updatedEdges.push({
                       id: `e-${lastSibling.id}-${addBranchNode.id}`,
                       source: lastSibling.id,
                       sourceHandle: 'right-source',
                       target: addBranchNode.id,
                       type: 'smoothstep',
                       markerEnd: { type: MarkerType.ArrowClosed },
                       style: { strokeDasharray: '5,5', opacity: 0.5 }
                   });

                  // 5. Handle Merge Node Logic (Dynamic Creation/Removal)
                  // Check if we have at least 2 "real" actions in the branches (siblings + newNode)
                  // Real action = node.type !== 'addStep' (or data.label !== 'Add Step')
                  
                  // Filter for "Real" nodes
                  const realSiblings = updatedSiblings.filter(s => s.data.label !== 'Add Step');
                  const realNodeCount = realSiblings.length; // siblings includes newNode now
                  
                  // We need to find the common merge node (if it exists)
                  // It would be the target of the siblings' edges
                  // But edges might point to different things if no merge node exists yet.
                  // We need to find a node that is targeted by AT LEAST one sibling?
                  // Or we can look for a node with "isMergeNode" flag? (We didn't add one)
                  // Or we can look for a node that is below the siblings.
                  
                  // Let's check outgoing edges from siblings.
                  // If they point to a common "Add Step" node, that's our merge node.
                  // If they point to a real node, that's the next step (effectively a merge).
                  
                  // If count >= 2, we want to ensure there is an "Add Step" merge node IF there isn't a real next step.
                  // Wait, user said: "should not show up until at least two actions items are added".
                  // This means: IF count < 2, NO Merge Node (Add Step).
                  // IF count >= 2, SHOW Merge Node (Add Step).
                  
                  // Note: If there is already a REAL next step (e.g. "Send SMS"), that acts as a merge.
                  // We only care about the explicit "Add Step" merge node.
                  
                  // Strategy:
                  // 1. Find existing outgoing edges from siblings.
                  // 2. See what they point to.
                  // 3. If they point to an "Add Step", that's a candidate for removal if count < 2.
                  // 4. If they don't point to a common "Add Step", we might need to create one if count >= 2.
                  
                  const outgoingFromSiblings = updatedEdges.filter(e => siblingIds.includes(e.source) || e.source === newNode.id);
                  const targets = Array.from(new Set(outgoingFromSiblings.map(e => e.target)));
                  
                  const isSplitTestParent = parentNode?.data?.label === 'Split Test (A/B)';

                  // Find if any target is an "Add Step" (Merge Node)
                  let mergeNodeId: string | undefined = undefined;
                  
                  // Only identify Merge Nodes if we are in a Split Test (which uses them)
                  // For independent branches (If/Else), we don't want to find/delete "Add Steps" of siblings
                  if (isSplitTestParent) {
                      targets.forEach(tId => {
                          const tNode = nodes.find(n => n.id === tId) || newNodes.find(n => n.id === tId);
                          // Check if it's an "Add Step" and NOT one of the siblings (it shouldn't be anyway)
                          if (tNode && tNode.data.label === 'Add Step' && !siblingIds.includes(tId) && tId !== newNode.id) {
                              mergeNodeId = tId;
                          }
                      });
                  }

                  if (realNodeCount < 2 || !isSplitTestParent) {
                      // HIDE Merge Node
                      if (mergeNodeId) {
                          // Remove the merge node
                          newNodes = newNodes.filter(n => n.id !== mergeNodeId);
                          // Remove edges to/from it
                          updatedEdges = updatedEdges.filter(e => e.target !== mergeNodeId && e.source !== mergeNodeId);
                          
                          // Find what the merge node was connected to
                          const outgoingFromMerge = edges.filter(e => e.source === mergeNodeId);
                          if (outgoingFromMerge.length > 0) {
                              // Connect siblings directly to the next step
                              outgoingFromMerge.forEach(outEdge => {
                                  updatedSiblings.forEach(sib => {
                                      // Check if edge already exists
                                      const exists = updatedEdges.some(e => e.source === sib.id && e.target === outEdge.target);
                                      if (!exists) {
                                          updatedEdges.push({
                                              id: `e-${sib.id}-${outEdge.target}`,
                                              source: sib.id,
                                              target: outEdge.target,
                                              type: 'smoothstep',
                                              markerEnd: { type: MarkerType.ArrowClosed }
                                          });
                                      }
                                  });
                              });
                          }
                      }
                      
                      // If NOT Split Test, ensure we have a local Add Step below the new node
                      if (!isSplitTestParent && !isTerminal && !isLoopBack) {
                           // BUG FIX: Prevent duplicate local "Add Step" nodes
                           // Check if there is ALREADY an edge from newNode to an "Add Step" node
                           const existingOutgoing = updatedEdges.find(e => e.source === newNode.id);
                           if (!existingOutgoing) {
                               const addStepNodeId = `add-step-${Date.now()}-local`;
                               const addStepNode: Node = {
                                   id: addStepNodeId,
                                   type: 'addStep',
                                   position: { x: newNode.position.x, y: newNode.position.y + VERTICAL_SPACING },
                                   data: { label: 'Add Step' },
                                   draggable: false,
                                   width: 280,
                                   height: 100
                               };
                               newNodes.push(addStepNode);
                               updatedEdges.push({
                                   id: `e-${newNode.id}-${addStepNodeId}`,
                                   source: newNode.id,
                                   target: addStepNodeId,
                                   type: 'smoothstep',
                                   markerEnd: { type: MarkerType.ArrowClosed }
                               });
                           }
                      }

                  } else {
                      // SHOW Merge Node (only for Split Test with >= 2 items)
                      if (!mergeNodeId) {
                          // Check if they are already connected to a REAL node (not Add Step)
                          // If they all connect to the same real node, we don't need an intermediate "Add Step"?
                          // Or do we? "Merge Node" usually implies an "Add Step" placeholder.
                          // If I have Branch A -> Email -> End, Branch B -> SMS -> End.
                          // "End" is the merge.
                          // The user probably wants an INSERTION POINT (Add Step) to appear.
                          
                          // So, if they connect to a real node, maybe we insert an "Add Step" in between?
                          // Or just create one if they are dangling.
                          
                          // Let's keep it simple: Create a Merge Node (Add Step) if one doesn't exist.
                          
                          // But wait, if they are connected to a REAL node, inserting an "Add Step" might be annoying?
                          // Usually, you want "Add Step" to appear so you can add more stuff.
                          // So yes, insert it.
                          
                          // Identify common target (if any)
                          // If siblings point to different things, that's a problem (shouldn't happen in this model).
                          // Assuming they point to same or nothing.
                          
                          let commonTargetId = targets[0]; // Take first one found
                          
                          const mergeNodeY = parentNode.position.y + 300; // Approx below branches
                          // We need to calculate proper Y based on longest branch? 
                          // For now, fixed offset or relative to longest sibling?
                          // Let's use longest sibling Y + spacing.
                          const maxY = Math.max(...updatedSiblings.map(s => s.position.y));
                          
                          const newMergeNode: Node = {
                              id: `add-step-${Date.now()}-Merge`,
                              type: 'addStep',
                              position: { x: startX + 140, y: maxY + VERTICAL_SPACING }, 
                              data: { label: 'Add Step' },
                              draggable: false,
                              width: 280, 
                              height: 100
                          };
                          newNodes.push(newMergeNode);
                          
                          // Connect siblings to new merge node
                          updatedSiblings.forEach(sib => {
                              // Remove old outgoing edges
                              updatedEdges = updatedEdges.filter(e => e.source !== sib.id);
                              
                              updatedEdges.push({
                                  id: `e-${sib.id}-${newMergeNode.id}`,
                                  source: sib.id,
                                  target: newMergeNode.id,
                                  type: 'smoothstep',
                                  markerEnd: { type: MarkerType.ArrowClosed }
                              });
                          });
                          
                          // Connect new merge node to old target
                          if (commonTargetId) {
                               updatedEdges.push({
                                  id: `e-${newMergeNode.id}-${commonTargetId}`,
                                  source: newMergeNode.id,
                                  target: commonTargetId,
                                  type: 'smoothstep',
                                  markerEnd: { type: MarkerType.ArrowClosed }
                              });
                          }
                      }
                  }
              }
          }
          
             // Handle clicking/dropping on "Add Branch" (+) button
          if (closestAddStepNode?.data?.isBranchAdder) {
             // We are adding a NEW branch (Option C, D...)
             // 1. Find the branch group
             
             // Try to find by stored sibling ID first (ROBUST)
             let leftNode = nodes.find(n => n.id === closestAddStepNode!.data?.siblingId);
             
             if (!leftNode) {
                 // Fallback to heuristic (Legacy support or if data missing)
                 leftNode = nodes.find(n => 
                     Math.abs(n.position.y - closestAddStepNode!.position.y - (-40)) < 10 && // Same Y (approx, adder is +40)
                     n.position.x < closestAddStepNode!.position.x &&
                     (closestAddStepNode!.position.x - (n.position.x + 280)) < 100 // Close enough
                 );
             }
             
             if (leftNode) {
                 // Find parent of leftNode
                 const parentEdge = edges.find(e => e.target === leftNode.id);
                 if (parentEdge) {
                     const parentNode = nodes.find(n => n.id === parentEdge.source);
                     
                     // Create the new node
                     // Mark it as branch child
                     newNode.data = { ...newNode.data, isBranchChild: true };
                     
                     // Add to nodes list (replacing the adder? No, adder moves)
                     newNodes = nodes.filter(n => n.id !== closestAddStepNode!.id); // Remove adder
                     newNodes.push(newNode);
                     
                     // Remove ANY edges connected to the old adder (both source and target)
                     updatedEdges = updatedEdges.filter(e => e.target !== closestAddStepNode!.id && e.source !== closestAddStepNode!.id);
                     
                     // Add edge from parent
                     updatedEdges.push({
                         id: `e-${parentNode?.id}-${newNode.id}`,
                         source: parentNode!.id,
                         target: newNode.id,
                         type: 'smoothstep',
                         markerEnd: { type: MarkerType.ArrowClosed },
                         label: '33%' // Temp, will recalculate
                     });
                     
                     // Recalculate layout for ALL siblings (including new one)
                     const siblingEdges = edges.filter(e => e.source === parentNode!.id);
                     const siblingIds = siblingEdges.map(e => e.target);
                     // Note: newNode is not in edges yet, so we add it manually
                     const siblings = [
                         ...nodes.filter(n => siblingIds.includes(n.id)),
                         newNode
                     ];
                     
                     siblings.sort((a, b) => a.position.x - b.position.x);
                     
                     const count = siblings.length;
                     const percentage = Math.floor(100 / count) + '%';
                     const totalWidth = (count * 280) + ((count - 1) * 60); // X_GAP
                     const startX = parentNode!.position.x + 140 - (totalWidth / 2);

                     let updatedSiblings = siblings.map((sib, index) => {
                          const newX = startX + (index * 340); // 280 + 60
                          const isLast = index === count - 1;
                          
                          // Update node
                          if (sib.id === newNode.id) newNode.position.x = newX;
                          
                          return {
                              ...sib,
                              position: { ...sib.position, x: newX },
                              data: { ...sib.data, isLastBranchNode: isLast }
                          };
                     });

                     newNodes = newNodes.map(n => {
                          const updated = updatedSiblings.find(s => s.id === n.id);
                          return updated || n;
                     });
                     
                     // Update labels
                     updatedEdges = updatedEdges.map(e => {
                         if (e.source === parentNode!.id) return { ...e, label: percentage };
                         return e;
                     });
                     
                     // Create NEW Branch Adder
                     const lastSibling = updatedSiblings[updatedSiblings.length - 1];
                     const addBranchNodeId = `add-branch-${Date.now()}`;
                     
                     const addBranchNode: Node = {
                          id: addBranchNodeId,
                          type: 'addStep',
                          position: { 
                              x: lastSibling.position.x + 280 + 20, // Right of card + gap
                              y: lastSibling.position.y + 20 
                          },
                          data: { label: 'Add Branch', isBranchAdder: true },
                          draggable: false,
                          width: 60,
                          height: 60,
                          parentId: undefined
                      };
                      newNodes.push(addBranchNode);
                      
                      // Add edge connecting last sibling to addBranchNode
                      updatedEdges.push({
                           id: `e-${lastSibling.id}-${addBranchNode.id}`,
                           source: lastSibling.id,
                           sourceHandle: 'right-source',
                           target: addBranchNode.id,
                           type: 'smoothstep',
                           markerEnd: { type: MarkerType.ArrowClosed },
                           style: { strokeDasharray: '5,5', opacity: 0.5 }
                       });
                      
                      // Check if the NEW node is a Branching Node
                      const isBranching = ['If / Else', 'Split Test (A/B)', 'Switch Case', 'Parallel'].includes(label);

                      if (isBranching) {
                           // Initialize Branching Structure (A/B)
                           const branchY = newNode.position.y + VERTICAL_SPACING;
                           
                           // Branch A
                           const addStepA: Node = {
                              id: `add-step-${Date.now()}-A`,
                              type: 'addStep',
                              position: { x: newNode.position.x, y: branchY }, // Position will be fixed by layout
                              data: { label: 'Add Step' },
                              draggable: false,
                              width: 280, 
                              height: 100
                           };

                           // Branch B
                           const addStepB: Node = {
                              id: `add-step-${Date.now()}-B`,
                              type: 'addStep',
                              position: { x: newNode.position.x + 340, y: branchY }, 
                              data: { label: 'Add Step', isLastBranchNode: true },
                              draggable: false,
                              width: 280, 
                              height: 100
                           };

                           // Inner Add Branch Button
                           const innerAddBranchNode: Node = {
                                id: `add-branch-${Date.now()}-Inner`,
                                type: 'addStep',
                                position: { 
                                    x: addStepB.position.x + 280 + 20, 
                                    y: branchY + 20 
                                },
                                data: { 
                                    label: 'Add Branch', 
                                    isBranchAdder: true,
                                    siblingId: addStepB.id // Store sibling ID for robust detection
                                },
                                draggable: false,
                                width: 60,
                                height: 60
                            };

                           newNodes.push(addStepA, addStepB, innerAddBranchNode);

                           // Connect edges
                           updatedEdges.push({
                               id: `e-${newNode.id}-${addStepA.id}`,
                               source: newNode.id,
                               target: addStepA.id,
                               type: 'smoothstep',
                               markerEnd: { type: MarkerType.ArrowClosed },
                               label: '50%'
                           });

                           updatedEdges.push({
                               id: `e-${newNode.id}-${addStepB.id}`,
                               source: newNode.id,
                               target: addStepB.id,
                               type: 'smoothstep',
                               markerEnd: { type: MarkerType.ArrowClosed },
                               label: '50%'
                           });
                           
                           updatedEdges.push({
                               id: `e-${addStepB.id}-${innerAddBranchNode.id}`,
                               source: addStepB.id,
                               sourceHandle: 'right-source',
                               target: innerAddBranchNode.id,
                               type: 'smoothstep',
                               markerEnd: { type: MarkerType.ArrowClosed },
                               style: { strokeDasharray: '5,5', opacity: 0.5 }
                           });

                      } else {
                          // 5. Unified Branch Logic
                          // "If Action is Nested { do this } Else {do this}"
                          
                          // Determine Parent Type
                          const isSplitTest = parentNode?.data?.label === 'Split Test (A/B)';
                          
                          if (isSplitTest) {
                               // --- SPLIT TEST (MERGE) LOGIC ---
                               // Logic: Branches combine and show only 1 button.
                               
                               // 1. Check if a Merge Node already exists for siblings
                               let mergeNodeId: string | undefined = undefined;
                               
                               // Look at where siblings go
                               const siblingEdges = updatedEdges.filter(e => siblingIds.includes(e.source));
                               const targets = Array.from(new Set(siblingEdges.map(e => e.target)));
                               
                               targets.forEach(tId => {
                                   const tNode = nodes.find(n => n.id === tId) || newNodes.find(n => n.id === tId);
                                   if (tNode && (tNode.type === 'addStep' || tNode.data.label === 'Add Step') && !tNode.data.isBranchAdder) {
                                       mergeNodeId = tId;
                                   }
                               });
                               
                               if (!mergeNodeId) {
                                   // Create Shared Merge Node
                                   // Position below the lowest sibling
                                   const maxY = Math.max(...updatedSiblings.map(s => s.position.y));
                                   const newMergeNode: Node = {
                                      id: `add-step-${Date.now()}-Merge`,
                                      type: 'addStep',
                                      position: { x: parentNode!.position.x + 140, y: maxY + VERTICAL_SPACING }, 
                                      data: { label: 'Add Step' },
                                      draggable: false,
                                      width: 280, 
                                      height: 100
                                   };
                                   newNodes.push(newMergeNode);
                                   mergeNodeId = newMergeNode.id;
                               }
                               
                               // Connect New Node to Merge Node
                               updatedEdges.push({
                                  id: `e-${newNode.id}-${mergeNodeId}`,
                                  source: newNode.id,
                                  target: mergeNodeId!,
                                  type: 'smoothstep',
                                  markerEnd: { type: MarkerType.ArrowClosed }
                               });
                               
                               // Ensure all other siblings are connected to it too (if they weren't)
                               updatedSiblings.forEach(sib => {
                                   if (sib.id === newNode.id) return; // Already handled
                                   const hasEdge = updatedEdges.some(e => e.source === sib.id && e.target === mergeNodeId);
                                   if (!hasEdge) {
                                       // Remove any old "local" add steps they might have had (if we are converting/fixing)
                                       // Actually, just connect them.
                                       updatedEdges.push({
                                           id: `e-${sib.id}-${mergeNodeId}`,
                                           source: sib.id,
                                           target: mergeNodeId!,
                                           type: 'smoothstep',
                                           markerEnd: { type: MarkerType.ArrowClosed }
                                       });
                                   }
                               });

                          } else {
                               // --- IF / ELSE (INDEPENDENT) LOGIC ---
                               // Logic: Do the multiple buttons.
                               
                               if (!isTerminal && !isLoopBack) {
                                   // Check if we already have a following step (unlikely for new branch)
                                   const existingOutgoing = updatedEdges.find(e => e.source === newNode.id && e.sourceHandle !== 'right-source');
                                   
                                   if (!existingOutgoing) {
                                       // Create Local Add Step
                                       const addStepNode: Node = {
                                           id: `add-step-${Date.now()}-local`,
                                           type: 'addStep',
                                           position: { x: newNode.position.x, y: newNode.position.y + VERTICAL_SPACING },
                                           data: { label: 'Add Step' },
                                           draggable: false,
                                           width: 280,
                                           height: 100
                                       };
                                       newNodes.push(addStepNode);
                                       updatedEdges.push({
                                           id: `e-${newNode.id}-${addStepNode.id}`,
                                           source: newNode.id,
                                           target: addStepNode.id,
                                           type: 'smoothstep',
                                           markerEnd: { type: MarkerType.ArrowClosed }
                                       });
                                   }
                               }
                          }
                      }
                     
                     const layoutedNodes = performAutoLayout(newNodes, updatedEdges);
                     setNodes(layoutedNodes);
                     setEdges(updatedEdges);
                     return;
                 }
             }
          }

          const layoutedNodes = performAutoLayout(newNodes, updatedEdges);
          setNodes(layoutedNodes);
          setEdges(updatedEdges);
          return;
      }
      
      // Fallback: If no AddStep found (unlikely), do nothing or return.
      // We explicitly removed the "Insert Above/Below" and "Split Edge" logic for Actions.
      // Actions MUST snap to AddStep.
      return;
  },
  [nodes, edges, project]
);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    // Fit view first to center horizontally and establish scale
    instance.fitView({ maxZoom: 0.8 });
    
    // Then override Y position to start at top
    // The placeholder is at y=100.
    // We want it to be roughly under the header/autosave indicator.
    // Autosave is at top-4 (16px) + height ~30px.
    // Let's say we want the node at screen Y = 80.
    // screenY = viewportY + nodeY * zoom
    // viewportY = screenY - nodeY * zoom
    
    const { x, zoom } = instance.getViewport();
    
    // Desired screen position for the node (top of node)
    const desiredScreenY = 80;
    const nodeY = 100;
    
    const newY = desiredScreenY - (nodeY * zoom);
    
    instance.setViewport({ x, y: newY, zoom });
  }, []);

  return (
    <div className="flex h-full w-full bg-slate-50 relative">
      <AutomationConfigModal 
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        node={selectedNodeForConfig}
        onSave={onSaveConfig}
        edges={edges}
      />
      
      {/* Canvas Area */}
      <div className="flex-1 h-full relative" onDragEnter={onDragEnter} onDragLeave={onDragLeave}>
        
        <ReactFlow
          nodes={nodesWithData}
          edges={edgesWithData}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onInit={onInit}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          defaultEdgeOptions={{
            type: 'custom',
            markerEnd: { type: MarkerType.ArrowClosed },
          }}
          proOptions={{ hideAttribution: true }}
          className="bg-slate-50"
        >
          <Background color="#94a3b8" gap={20} size={1} />
          
          <CustomControls 
            canUndo={past.length > 0} 
            canRedo={future.length > 0} 
            onUndo={onUndo} 
            onRedo={onRedo} 
          />
          
          {/* Static Flow Lines - Always visible for connected nodes */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: -1 }}>
             {/* This could be used for static grid lines or other decor */}
          </svg>
        </ReactFlow>

        {showProTips && (
        <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-end pointer-events-none">
          <Card className="p-3 bg-blue-50 border-blue-100 shadow-lg pointer-events-auto max-w-2xl w-full mr-4">
             <div className="flex gap-3 items-center">
               <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
               <div className="flex-1 text-xs text-blue-900 flex items-center gap-2">
                 <span className="font-semibold">Pro Tip:</span>
                 <span className="text-blue-700">{PRO_TIPS[currentTipIndex]}</span>
               </div>
               
               <div className="flex items-center gap-1 border-l border-blue-200 pl-2">
                 <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-500 hover:text-blue-700 hover:bg-blue-100" onClick={prevTip}>
                    <ChevronLeft className="h-3 w-3" />
                 </Button>
                 <span className="text-[10px] text-blue-500 font-medium w-8 text-center">
                    {currentTipIndex + 1} / {PRO_TIPS.length}
                 </span>
                 <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-500 hover:text-blue-700 hover:bg-blue-100" onClick={nextTip}>
                    <ChevronRight className="h-3 w-3" />
                 </Button>
               </div>

               <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-500 hover:text-blue-700 hover:bg-blue-100 ml-1" onClick={() => setShowProTips(false)}>
                  <span className="sr-only">Dismiss</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
               </Button>
             </div>
          </Card>
        </div>
        )}
      </div>

      {/* Right Sidebar: Toolbox */}
      <div className={`bg-white border-l h-full flex flex-col shadow-xl z-20 transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-80'}`}>
        
        <Tabs defaultValue="triggers" className="flex flex-col h-full">
          {!isSidebarCollapsed && (
            <div className="px-4 py-3 border-b bg-white space-y-3">
                <div className="flex items-center gap-2">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-slate-600 shrink-0"
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search..." 
                            className="pl-9 bg-slate-50" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                
                <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="triggers">Triggers</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="logic">Logic</TabsTrigger>
                </TabsList>
            </div>
          )}

           {isSidebarCollapsed && (
             <div className="flex flex-col items-center py-2 space-y-2 border-b">
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-400 hover:text-slate-600"
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                 >
                    <ChevronLeft className="h-4 w-4" />
                 </Button>
                 <TooltipProvider>
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <TabsList className="flex flex-col h-auto bg-transparent gap-2 p-0">
                                <TabsTrigger value="triggers" className="w-10 h-10 p-0 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                                    <Zap className="h-5 w-5" />
                                </TabsTrigger>
                            </TabsList>
                        </TooltipTrigger>
                        <TooltipContent side="left">Triggers</TooltipContent>
                    </Tooltip>
                    <Tooltip delayDuration={0}>
                         <TooltipTrigger asChild>
                            <TabsList className="flex flex-col h-auto bg-transparent gap-2 p-0">
                                <TabsTrigger value="actions" className="w-10 h-10 p-0 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-600">
                                    <Mail className="h-5 w-5" />
                                </TabsTrigger>
                            </TabsList>
                         </TooltipTrigger>
                         <TooltipContent side="left">Actions</TooltipContent>
                    </Tooltip>
                    <Tooltip delayDuration={0}>
                         <TooltipTrigger asChild>
                            <TabsList className="flex flex-col h-auto bg-transparent gap-2 p-0">
                                <TabsTrigger value="logic" className="w-10 h-10 p-0 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-600">
                                    <GitBranch className="h-5 w-5" />
                                </TabsTrigger>
                            </TabsList>
                         </TooltipTrigger>
                        <TooltipContent side="left">Logic</TooltipContent>
                    </Tooltip>
                 </TooltipProvider>
             </div>
           )}

          <div className="flex-1 overflow-hidden bg-slate-50/50">
            <ScrollArea className="h-full">
              {TOOLBOX_ITEMS.map((section) => {
                const filteredItems = section.items.filter(item => 
                   isSidebarCollapsed ? true : item.label.toLowerCase().includes(searchQuery.toLowerCase())
                );
                
                const availableItems = filteredItems.filter(item => !item.comingSoon);
                const comingSoonItems = filteredItems.filter(item => item.comingSoon);

                return (
                <TabsContent key={section.value} value={section.value} className="m-0 h-full p-2 space-y-2 mt-0">
                    {availableItems.map((item, itemIdx) => (
                      <div 
                        key={`avail-${itemIdx}`}
                        draggable 
                        className={`flex items-center gap-2 p-1.5 rounded-md border border-transparent hover:border-slate-200 hover:bg-slate-50 cursor-grab active:cursor-grabbing transition-all group ${isSidebarCollapsed ? 'justify-center' : ''}`}
                        onDragStart={(event) => {
                          event.dataTransfer.setData('application/reactflow/type', item.type);
                          event.dataTransfer.setData('application/reactflow/label', item.label);
                          // Fallback for some browsers/environments
                          event.dataTransfer.setData('text/plain', JSON.stringify({ type: item.type, label: item.label }));
                          event.dataTransfer.effectAllowed = 'move';
                        }}
                      >
                         <TooltipProvider>
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <div className={`p-1 rounded bg-white border shadow-sm group-hover:shadow-md transition-shadow ${item.color}`}>
                                    <item.icon className="w-4 h-4" />
                                    </div>
                                </TooltipTrigger>
                                {isSidebarCollapsed && <TooltipContent side="left">{item.label}</TooltipContent>}
                            </Tooltip>
                         </TooltipProvider>

                        {!isSidebarCollapsed && (
                            <>
                                <div className="flex-1">
                                <span className="text-xs font-medium text-foreground">{item.label}</span>
                                </div>
                                <GripVertical className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </>
                        )}
                      </div>
                    ))}
                    
                    {comingSoonItems.length > 0 && (
                        <>
                            {!isSidebarCollapsed && (
                                <div className="flex items-center gap-2 mt-6 mb-2 px-1">
                                    <div className="h-px bg-slate-200 flex-1"></div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Coming Soon</span>
                                    <div className="h-px bg-slate-200 flex-1"></div>
                                </div>
                            )}
                            {isSidebarCollapsed && <div className="h-px w-8 mx-auto bg-slate-200 my-2" />}
                            
                            {comingSoonItems.map((item, itemIdx) => (
                                <div 
                                    key={`soon-${itemIdx}`}
                                    draggable={false}
                                    className={`flex items-center gap-2 p-1.5 rounded-md border border-transparent opacity-75 cursor-not-allowed group select-none ${isSidebarCollapsed ? 'justify-center' : ''}`}
                                >
                                     <TooltipProvider>
                                        <Tooltip delayDuration={0}>
                                            <TooltipTrigger asChild>
                                                <div className={`p-1 rounded bg-slate-100 border shadow-none grayscale`}>
                                                <item.icon className="w-4 h-4 text-slate-400" />
                                                </div>
                                            </TooltipTrigger>
                                            {isSidebarCollapsed && <TooltipContent side="left">{item.label} (Coming Soon)</TooltipContent>}
                                        </Tooltip>
                                     </TooltipProvider>

                                    {!isSidebarCollapsed && (
                                        <div className="flex-1">
                                            <span className="text-xs font-medium text-slate-400">{item.label}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </>
                    )}
                </TabsContent>
              )})}
            </ScrollArea>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
