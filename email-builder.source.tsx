import { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Settings, 
  Eye, 
  Code, 
  Type, 
  Image as ImageIcon, 
  MousePointerClick, 
  Layout, 
  Columns, 
  Trash2, 
  Copy, 
  Undo, 
  Redo, 
  Send,
  Smartphone,
  Monitor,
  Check,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Video,
  Grid,
  Menu,
  HelpCircle,
  Plus,
  Ticket,
  GripVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface BlockStyle {
    align?: string;
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
    width?: string;
    height?: string;
    showPrivacyPolicy?: boolean;
    url?: string;
    src?: string;
    border?: string;
}

interface Block {
    id: string;
    type: string;
    content: string;
    style: BlockStyle;
    columns?: Block[][];
}

// Mock Email Elements
const EMAIL_ELEMENTS = [
    { id: 'heading', icon: Type, label: 'Heading', type: 'text' },
    { id: 'text', icon: AlignLeft, label: 'Text Block', type: 'text' },
    { id: 'image', icon: ImageIcon, label: 'Image', type: 'media' },
    { id: 'video', icon: Video, label: 'Video', type: 'media' },
    { id: 'button', icon: MousePointerClick, label: 'Button', type: 'action' },
    { id: '2col', icon: Grid, label: '2 Columns', type: 'layout' },
    { id: 'divider', icon: Minus, label: 'Divider', type: 'layout' },
    { id: 'spacer', icon: Layout, label: 'Spacer', type: 'layout' },
    { id: 'html', icon: Code, label: 'HTML', type: 'advanced' },
    { id: 'discount', icon: Ticket, label: 'Discount Code', type: 'action' },
    { id: 'menu', icon: Menu, label: 'Menu', type: 'layout' },
    { id: 'social', icon: Facebook, label: 'Social Links', type: 'footer' },
];

export default function EmailBuilderPage() {
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [showHtml, setShowHtml] = useState(false);
    const [sendAsPlainText, setSendAsPlainText] = useState(false);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("elements");
    const [emailSettings, setEmailSettings] = useState({
        subject: "New Campaign",
        preheader: "Preview text shows here...",
        fromName: "My Company",
        fromEmail: "hello@mycompany.com",
        replyTo: "",
        cc: "",
        bcc: "",
        customHeaders: [] as { name: string; value: string }[]
    });

    // Mock Canvas State
    const [blocks, setBlocks] = useState<Block[]>([
        { 
            id: 'b1', 
            type: 'image', 
            content: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 
            style: { 
                width: '150px', 
                align: 'center',
                padding: '20px',
                margin: '0px'
            } 
        },
        { 
            id: 'b2', 
            type: 'heading', 
            content: 'Big News!', 
            style: { 
                align: 'center', 
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1e293b',
                padding: '10px',
                margin: '0px'
            } 
        },
        { 
            id: 'b3', 
            type: 'text', 
            content: 'We are excited to announce our latest feature update. Read on to find out more.', 
            style: { 
                align: 'left', 
                fontSize: '16px', 
                color: '#475569',
                padding: '10px',
                margin: '0px'
            } 
        },
        { 
            id: 'b4', 
            type: 'button', 
            content: 'Learn More', 
            style: { 
                align: 'center', 
                backgroundColor: '#3b82f6', 
                color: '#ffffff', 
                borderRadius: '4px',
                padding: '12px',
                margin: '10px',
                url: '#'
            } 
        },
        { 
            id: 'b5', 
            type: 'footer', 
            content: 'My Company, Inc. 123 Main St, City, State 12345', 
            style: { 
                align: 'center', 
                fontSize: '12px', 
                color: '#94a3b8', 
                showPrivacyPolicy: true,
                padding: '20px',
                margin: '0px'
            } 
        },
    ]);

    const handleDrop = () => {
        // Mock implementation of adding a block (click behavior)
        const newBlock: Block = { 
            id: `b${Date.now()}`, 
            type: 'text', 
            content: 'New Text Block', 
            style: { 
                align: 'left', 
                fontSize: '16px', 
                color: '#334155',
                padding: '10px',
                margin: '0px'
            } 
        };
        // Insert before footer (last element)
        if (blocks.length > 0 && blocks[blocks.length - 1].type === 'footer') {
             setBlocks([...blocks.slice(0, -1), newBlock, blocks[blocks.length - 1]]);
        } else {
             setBlocks([...blocks, newBlock]);
        }
        setSelectedBlockId(newBlock.id);
        setActiveTab("properties");
    };

    const handleDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        if (!destination) return;

        type DropZone = 
            | { type: 'canvas' }
            | { type: 'elements' }
            | { type: 'column'; blockId: string; colIndex: number }
            | { type: 'unknown' };

        // Helper to parse droppableId
        const parseId = (id: string): DropZone => {
            if (id === 'droppable-canvas') return { type: 'canvas' };
            if (id === 'elements-list') return { type: 'elements' };
            if (id.startsWith('col-')) {
                // col-{blockId}-{colIndex}
                const parts = id.split('-');
                const colIndex = parseInt(parts.pop() || '0');
                const blockId = parts.slice(1).join('-');
                return { type: 'column', blockId, colIndex };
            }
            return { type: 'unknown' };
        };

        const src = parseId(source.droppableId);
        const dest = parseId(destination.droppableId);

        // Recursive helper to update a block deep in the tree
        const updateBlockRecursive = (
            currentBlocks: Block[], 
            targetId: string, 
            updateFn: (block: Block) => Block
        ): Block[] => {
            return currentBlocks.map(b => {
                if (b.id === targetId) {
                    return updateFn(b);
                }
                if (b.columns) {
                    return {
                        ...b,
                        columns: b.columns.map(col => updateBlockRecursive(col, targetId, updateFn))
                    };
                }
                return b;
            });
        };

        let movedBlock: Block | undefined;
        let finalBlocks = [...blocks];

        // 1. Extract moved block (or create new one)
        if (src.type === 'elements') {
            const element = EMAIL_ELEMENTS[source.index];
            if (element.id === '2col' && dest.type === 'column') {
                return; // Prevent nesting 2col in 2col
            }

            movedBlock = {
                id: `b${Date.now()}`,
                type: element.type === 'layout' || element.type === 'footer' ? element.id : element.type === 'action' ? 'button' : element.type,
                content: element.label === 'Heading' ? 'New Heading' : element.label === 'Button' ? 'Button' : 'New Content',
                style: { 
                    align: 'center', 
                    fontSize: '16px', 
                    color: '#334155', 
                    showPrivacyPolicy: true,
                    padding: '10px',
                    margin: '0px'
                }
            };
            
            // Set specific defaults based on type
            if (element.id === 'heading') { movedBlock.type = 'heading'; movedBlock.content = 'New Heading'; movedBlock.style.fontSize = '24px'; movedBlock.style.fontWeight = 'bold'; movedBlock.style.color = '#1e293b'; }
            else if (element.id === 'text') { movedBlock.type = 'text'; movedBlock.content = 'New Text Block'; movedBlock.style.align = 'left'; }
            else if (element.id === 'image') { movedBlock.type = 'image'; movedBlock.content = 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'; movedBlock.style.width = '100%'; movedBlock.style.padding = '0px'; }
            else if (element.id === 'video') { movedBlock.type = 'video'; movedBlock.content = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; movedBlock.style.padding = '10px'; }
            else if (element.id === 'button') { movedBlock.type = 'button'; movedBlock.content = 'Click Me'; movedBlock.style.backgroundColor = '#3b82f6'; movedBlock.style.color = '#ffffff'; movedBlock.style.borderRadius = '4px'; movedBlock.style.padding = '12px 24px'; movedBlock.style.url = '#'; }
            else if (element.id === 'footer') { movedBlock.type = 'footer'; movedBlock.content = 'Company Address'; movedBlock.style.fontSize = '12px'; movedBlock.style.color = '#94a3b8'; movedBlock.style.padding = '20px'; }
            else if (element.id === '2col') { movedBlock.type = '2col'; movedBlock.content = ''; movedBlock.style.padding = '10px'; movedBlock.columns = [[], []]; }
            else if (element.id === 'divider') { movedBlock.type = 'divider'; movedBlock.content = ''; movedBlock.style.color = '#e2e8f0'; movedBlock.style.padding = '10px 0'; }
            else if (element.id === 'spacer') { movedBlock.type = 'spacer'; movedBlock.style.height = '32px'; }
            else if (element.id === 'html') { movedBlock.type = 'html'; movedBlock.content = '<p style="padding: 10px; color: #666;">Custom HTML here</p>'; }
            else if (element.id === 'discount') { movedBlock.type = 'discount'; movedBlock.content = 'SUMMER2025'; movedBlock.style.align = 'center'; movedBlock.style.fontSize = '24px'; movedBlock.style.fontWeight = 'bold'; movedBlock.style.color = '#3b82f6'; movedBlock.style.backgroundColor = '#eff6ff'; movedBlock.style.border = '2px dashed #3b82f6'; movedBlock.style.borderRadius = '8px'; movedBlock.style.padding = '20px'; movedBlock.style.margin = '10px'; }
            else if (element.id === 'menu') { movedBlock.type = 'menu'; movedBlock.content = 'Home | Shop | About'; movedBlock.style.align = 'center'; movedBlock.style.color = '#3b82f6'; movedBlock.style.padding = '10px'; }
            else if (element.id === 'social') { movedBlock.type = 'social'; movedBlock.content = ''; movedBlock.style.align = 'center'; movedBlock.style.padding = '10px'; }
            else { movedBlock.type = element.id; }

        } else if (src.type === 'canvas') {
            [movedBlock] = finalBlocks.splice(source.index, 1);
        } else if (src.type === 'column') {
            // Recursive remove
            finalBlocks = updateBlockRecursive(finalBlocks, src.blockId, (parentBlock) => {
                if (!parentBlock.columns) return parentBlock;
                const newColumns = [...parentBlock.columns];
                if (newColumns[src.colIndex]) {
                    const newCol = [...newColumns[src.colIndex]];
                    const [removed] = newCol.splice(source.index, 1);
                    movedBlock = removed;
                    newColumns[src.colIndex] = newCol;
                }
                return { ...parentBlock, columns: newColumns };
            });
        }

        if (!movedBlock) return;

        // Prevent nesting 2col in 2col
        if (movedBlock.type === '2col' && dest.type === 'column') {
            return;
        }

        // 2. Insert block at destination
        if (dest.type === 'canvas') {
            finalBlocks.splice(destination.index, 0, movedBlock);
            setBlocks(finalBlocks);
        } else if (dest.type === 'column') {
            // Recursive insert
            const newFinalBlocks = updateBlockRecursive(finalBlocks, dest.blockId, (parentBlock) => {
                if (!parentBlock.columns) return parentBlock;
                const newColumns = [...parentBlock.columns];
                // Ensure column exists
                if (!newColumns[dest.colIndex]) newColumns[dest.colIndex] = [];
                
                const newCol = [...newColumns[dest.colIndex]];
                newCol.splice(destination.index, 0, movedBlock!);
                newColumns[dest.colIndex] = newCol;
                return { ...parentBlock, columns: newColumns };
            });
            setBlocks(newFinalBlocks);
        }
    };

    const selectedBlock = blocks.find(b => b.id === selectedBlockId);

    const settingsTabRef = useRef<HTMLDivElement>(null);

    // Auto-scroll when new headers are added (scroll the whole settings tab)
    useEffect(() => {
        if (settingsTabRef.current) {
             settingsTabRef.current.scrollTop = settingsTabRef.current.scrollHeight;
        }
    }, [emailSettings.customHeaders.length]);

    const getSpacingValues = (styleString?: string) => {
        let t = '0px', r = '0px', b = '0px', l = '0px';
        if (!styleString) return { t, r, b, l };
        
        const parts = styleString.split(' ');
        if (parts.length === 1) { t=r=b=l = parts[0]; }
        else if (parts.length === 2) { t=b=parts[0]; r=l=parts[1]; }
        else if (parts.length === 4) { t=parts[0]; r=parts[1]; b=parts[2]; l=parts[3]; }
        
        return { t, r, b, l };
    };

    const updateSpacing = (property: 'padding' | 'margin', side: 't' | 'r' | 'b' | 'l', value: string) => {
        if (!selectedBlock) return;
        const current = getSpacingValues((selectedBlock.style as any)[property]);
        const newS = { ...current, [side]: value };
        const spacingStr = `${newS.t} ${newS.r} ${newS.b} ${newS.l}`;
        
        setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, style: { ...b.style, [property]: spacingStr } } : b));
    };

    const copySpacingToAll = (property: 'padding' | 'margin', value: string) => {
        if (!selectedBlock) return;
        const spacingStr = `${value} ${value} ${value} ${value}`;
        setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, style: { ...b.style, [property]: spacingStr } } : b));
    };

    // Helper component for Unit Inputs (px, rem, em, %)
    const UnitInput = ({ value, onChange, placeholder, className, label }: { value?: string, onChange: (val: string) => void, placeholder?: string, className?: string, label?: string }) => {
        // Parse value and unit
        const match = (value || '').match(/^([0-9.]+)(.*)$/);
        const numVal = match ? match[1] : '';
        const unitVal = match && match[2] ? match[2] : 'px';

        return (
            <div className="relative flex items-center group/unit flex-1">
                {label && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-medium pointer-events-none z-10">
                        {label}
                    </div>
                )}
                <Input 
                    type="number"
                    value={numVal}
                    placeholder={placeholder}
                    onChange={(e) => onChange(`${e.target.value}${unitVal}`)}
                    className={cn(
                        "flex-1 h-8 text-xs font-mono pr-8", 
                        label && "pl-7",
                        className
                    )}
                />
                <div className="absolute right-0 top-0 bottom-0 flex items-center border-l bg-slate-50 rounded-r-md overflow-hidden">
                    <Select 
                        value={unitVal} 
                        onValueChange={(val) => onChange(`${numVal || '0'}${val}`)}
                    >
                        <SelectTrigger className="h-8 w-[40px] border-0 rounded-none bg-transparent focus:ring-0 px-1 text-[10px] text-slate-500 font-mono hover:bg-slate-100 flex items-center justify-center">
                            <span>{unitVal}</span>
                        </SelectTrigger>
                        <SelectContent align="end">
                            <SelectItem value="px">px</SelectItem>
                            <SelectItem value="%">%</SelectItem>
                            <SelectItem value="rem">rem</SelectItem>
                            <SelectItem value="em">em</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        );
    };

    // Helper component for Menu Editor
    const MenuEditor = ({ content, onChange }: { content: string, onChange: (val: string) => void }) => {
        // Parse content string "Label|URL" format or simple pipe separated
        // Let's assume content is stored as JSON string of Array<{label, url}> 
        // For backward compatibility, if it's plain string split by |, convert to object
        
        let items: { label: string, url: string }[] = [];
        try {
            if (content.startsWith('[')) {
                items = JSON.parse(content);
            } else {
                 items = content.split('|').map(item => ({ label: item.trim(), url: '#' }));
            }
        } catch (e) {
            items = [];
        }

        const updateItem = (index: number, field: 'label' | 'url', value: string) => {
            const newItems = [...items];
            newItems[index] = { ...newItems[index], [field]: value };
            onChange(JSON.stringify(newItems));
        };

        const addItem = () => {
            onChange(JSON.stringify([...items, { label: 'New Link', url: '#' }]));
        };

        const removeItem = (index: number) => {
            const newItems = [...items];
            newItems.splice(index, 1);
            onChange(JSON.stringify(newItems));
        };

        return (
            <div className="space-y-2">
                {items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start p-2 border rounded bg-slate-50">
                        <div className="space-y-2 flex-1">
                            <Input 
                                value={item.label} 
                                onChange={(e) => updateItem(index, 'label', e.target.value)}
                                placeholder="Link Text"
                                className="h-7 text-xs"
                            />
                            <Input 
                                value={item.url} 
                                onChange={(e) => updateItem(index, 'url', e.target.value)}
                                placeholder="https://..."
                                className="h-7 text-xs text-slate-500"
                            />
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-500" onClick={() => removeItem(index)}>
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    </div>
                ))}
                <Button variant="outline" size="sm" className="w-full text-xs" onClick={addItem}>
                    <Plus className="w-3 h-3 mr-1" /> Add Menu Item
                </Button>
            </div>
        );
    };

    const deleteBlock = (blockId: string) => {
        const removeRecursive = (list: Block[]): Block[] => {
            return list.filter(b => b.id !== blockId).map(b => ({
                ...b,
                columns: b.columns?.map(c => removeRecursive(c))
            }));
        };
        setBlocks(removeRecursive(blocks));
        if (selectedBlockId === blockId) setSelectedBlockId(null);
    };

    const duplicateBlock = (block: Block, parentId: string | null, colIndex: number) => {
        const newBlock = { 
            ...block, 
            id: `b${Date.now()}`,
            style: { ...block.style },
            columns: block.columns ? block.columns.map(c => c.map(b => ({...b, id: `b${Date.now()}_${Math.random()}`}))) : undefined 
        };

        if (!parentId) {
            const index = blocks.findIndex(b => b.id === block.id);
            const newBlocks = [...blocks];
            newBlocks.splice(index + 1, 0, newBlock);
            setBlocks(newBlocks);
        } else {
             setBlocks(blocks.map(b => {
                if (b.id === parentId && b.columns) {
                    const newColumns = [...b.columns];
                    const newCol = [...newColumns[colIndex]];
                    const index = newCol.findIndex(child => child.id === block.id);
                    newCol.splice(index + 1, 0, newBlock);
                    newColumns[colIndex] = newCol;
                    return { ...b, columns: newColumns };
                }
                return b;
            }));
        }
        setSelectedBlockId(newBlock.id);
    };

    const renderDraggableBlock = (block: Block, index: number, parentId: string | null = null, colIndex: number = 0) => {
        return (
            <Draggable key={block.id} draggableId={block.id} index={index} isDragDisabled={block.type === 'footer'}>
                {(provided, snapshot) => (
                    <div 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={snapshot.isDragging ? { ...provided.draggableProps.style, pointerEvents: 'none' } : provided.draggableProps.style}
                        className={cn(
                            "relative group p-2 border border-transparent hover:border-blue-300 hover:bg-blue-50/20 transition-colors duration-200 rounded",
                            selectedBlockId === block.id && "border-blue-500 ring-1 ring-blue-500 bg-blue-50/30",
                            snapshot.isDragging && "opacity-75 rotate-2 scale-105 shadow-xl bg-white ring-2 ring-blue-500 z-50",
                            block.type === 'footer' && "mt-auto border-t border-dashed border-slate-200"
                        )}
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            setSelectedBlockId(block.id);
                            setActiveTab("properties");
                        }}
                    >
                        {/* Drag Handle */}
                        <div 
                            {...provided.dragHandleProps}
                            className={cn(
                                "absolute -left-8 top-0 h-8 w-6 flex items-center justify-center cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity",
                                snapshot.isDragging && "opacity-100"
                            )}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <GripVertical className="w-4 h-4" />
                        </div>

                        {/* Block Controls */}
                        {selectedBlockId === block.id && !snapshot.isDragging && block.type !== 'footer' && (
                            <div className="absolute -right-10 top-0 flex flex-col gap-1 z-10">
                                <Button variant="secondary" size="icon" className="h-8 w-8 shadow-sm" onClick={(e) => {
                                    e.stopPropagation();
                                    duplicateBlock(block, parentId, colIndex);
                                }}>
                                    <Copy className="w-4 h-4 text-slate-600" />
                                </Button>
                                <Button variant="destructive" size="icon" className="h-8 w-8 shadow-sm" onClick={(e) => {
                                    e.stopPropagation();
                                    deleteBlock(block.id);
                                }}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        )}

                        {/* Block Content Rendering */}
                        <div 
                            style={{ 
                                textAlign: (block.style as any).align, 
                                padding: block.style.padding || '0px', 
                                backgroundColor: block.style.backgroundColor, 
                                margin: block.style.margin 
                            }}
                        >
                            {block.type === 'heading' && ( <h2 style={{ fontSize: block.style.fontSize, color: block.style.color, fontWeight: block.style.fontWeight, fontFamily: block.style.fontFamily }} className="font-bold leading-tight">{block.content}</h2> )}
                            {block.type === 'text' && ( <p style={{ fontSize: block.style.fontSize, color: block.style.color, fontWeight: block.style.fontWeight, fontFamily: block.style.fontFamily, lineHeight: '1.5' }}>{block.content}</p> )}
                            {block.type === 'image' && ( <div style={{ width: block.style.width, margin: block.style.align === 'center' ? '0 auto' : block.style.align === 'right' ? '0 0 0 auto' : '0' }}> <img src={block.content} alt="Block" className="max-w-full h-auto rounded-md" style={{ width: '100%' }} /> </div> )}
                            {block.type === 'video' && ( <div className="bg-slate-100 aspect-video rounded-md flex items-center justify-center relative overflow-hidden group"> <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center"> <div className="w-16 h-12 bg-red-600 rounded-lg flex items-center justify-center shadow-lg"> <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[16px] border-l-white border-b-[8px] border-b-transparent ml-1"></div> </div> </div> <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">Preview Video</span> </div> )}
                            {block.type === 'button' && ( <a href={block.style.url || '#'} target="_blank" rel="noopener noreferrer" className="inline-block font-medium text-white transition-opacity hover:opacity-90 no-underline" style={{ backgroundColor: block.style.backgroundColor, borderRadius: block.style.borderRadius, fontSize: block.style.fontSize, fontWeight: block.style.fontWeight, fontFamily: block.style.fontFamily, color: block.style.color, padding: block.style.padding }}>{block.content}</a> )}
                            
                            {block.type === '2col' && (
                                <div className="grid grid-cols-2 gap-4">
                                    {[0, 1].map(idx => (
                                        <Droppable 
                                            key={idx} 
                                            droppableId={`col-${block.id}-${idx}`} 
                                            type="EMAIL_BLOCK"
                                            ignoreContainerClipping={true}
                                        >
                                            {(provided, snapshot) => (
                                                <div 
                                                    ref={provided.innerRef}
                                                    {...provided.droppableProps}
                                                    className={cn(
                                                        "min-h-[80px] border-2 border-dashed rounded p-2 transition-colors relative",
                                                        snapshot.isDraggingOver ? "border-blue-500 bg-blue-50 z-20" : "border-slate-200 z-10",
                                                        (!block.columns || !block.columns[idx] || block.columns[idx].length === 0) && "flex items-center justify-center text-xs text-slate-400"
                                                    )}
                                                >
                                                    {block.columns?.[idx]?.map((b, i) => renderDraggableBlock(b, i, block.id, idx))}
                                                    {provided.placeholder}
                                                    {(!block.columns || !block.columns[idx] || block.columns[idx].length === 0) && "Drop here"}
                                                </div>
                                            )}
                                        </Droppable>
                                    ))}
                                </div>
                            )}

                            {block.type === 'divider' && ( <hr style={{ borderColor: block.style.color }} className="border-t-2 my-2" /> )}
                            {block.type === 'spacer' && ( <div style={{ height: block.style.height }} /> )}
                            {block.type === 'html' && ( <div dangerouslySetInnerHTML={{ __html: block.content }} /> )}
                            {block.type === 'discount' && ( <div style={{ border: block.style.border || '2px dashed #cbd5e1', backgroundColor: block.style.backgroundColor, borderRadius: block.style.borderRadius, padding: block.style.padding, margin: block.style.margin, textAlign: (block.style as any).align as any }}> <span style={{ fontSize: block.style.fontSize, fontWeight: block.style.fontWeight, color: block.style.color, fontFamily: block.style.fontFamily, letterSpacing: '1px' }}>{block.content}</span> <div className="mt-1 text-xs text-slate-400 uppercase tracking-widest">Discount Code</div> </div> )}
                            {block.type === 'menu' && ( <div className="flex flex-wrap gap-4 justify-center text-sm font-medium" style={{ color: block.style.color, fontFamily: block.style.fontFamily }}> {block.content.split('|').map((item, i) => ( <span key={i} className="cursor-pointer hover:underline">{item.trim()}</span> ))} </div> )}
                            {block.type === 'social' && ( <div className="flex gap-4 justify-center"> <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500"><Facebook className="w-4 h-4" /></div> <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500"><Twitter className="w-4 h-4" /></div> <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500"><Instagram className="w-4 h-4" /></div> <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500"><Linkedin className="w-4 h-4" /></div> </div> )}
                            {block.type === 'footer' && ( <div style={{ fontSize: block.style.fontSize, color: block.style.color, fontFamily: block.style.fontFamily }}> <p>{block.content}</p> {block.style.showPrivacyPolicy && ( <p className="mt-2 text-xs opacity-70"> <a href="#" className="underline">Privacy Policy</a> • <a href="#" className="underline">Unsubscribe</a> </p> )} </div> )}
                        </div>
                    </div>
                )}
            </Draggable>
        );
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col h-screen bg-slate-50">
            {/* Top Bar */}
            <header className="h-16 bg-white border-b px-4 flex items-center justify-between shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <Link href="/emails">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-slate-900">{emailSettings.subject}</span>
                            <Button variant="ghost" size="icon" className="h-4 w-4 text-slate-400 hover:text-slate-600">
                                <Settings className="w-3 h-3" />
                            </Button>
                        </div>
                        <span className="text-xs text-slate-500">Draft - Last saved 2m ago</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex bg-slate-100 rounded-md p-1 mr-4">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className={cn("h-7 w-7 p-0", viewMode === 'desktop' && "bg-white shadow-sm")}
                            onClick={() => setViewMode('desktop')}
                        >
                            <Monitor className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className={cn("h-7 w-7 p-0", viewMode === 'mobile' && "bg-white shadow-sm")}
                            onClick={() => setViewMode('mobile')}
                        >
                            <Smartphone className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 mr-4 border-r pr-4">
                        <Label htmlFor="plain-text" className="text-xs font-medium cursor-pointer">Send as Plain Text</Label>
                        <Switch 
                            id="plain-text" 
                            checked={sendAsPlainText}
                            onCheckedChange={(checked) => {
                                setSendAsPlainText(checked);
                                if (checked) setShowHtml(false);
                            }}
                        />
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <HelpCircle className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p>Sending your first email as plain text can significantly improve deliverability rates. It feels more personal and is less likely to be flagged as promotion or spam by email providers.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2" 
                        onClick={() => setShowHtml(!showHtml)}
                        disabled={sendAsPlainText}
                    >
                        <Code className="w-4 h-4" /> {showHtml ? "Design View" : "HTML View"}
                    </Button>
                    
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="secondary" size="sm" className="gap-2">
                                <Send className="w-4 h-4" /> Test Send
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Send Test Email</DialogTitle>
                                <DialogDescription>
                                    Send a preview of this email to yourself or team members.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                                <div className="space-y-2">
                                    <Label>To Email(s)</Label>
                                    <Input placeholder="name@company.com, other@company.com" />
                                    <p className="text-xs text-slate-500">Separate multiple emails with commas</p>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button>Send Test</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Save & Exit</Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Elements & Properties */}
                <div className="w-80 bg-white border-r flex flex-col shrink-0">
                    <Tabs 
                        defaultValue="elements" 
                        value={activeTab} 
                        onValueChange={(v) => {
                            setActiveTab(v);
                            // Only clear selection if we explicitly switch to Elements or Settings
                            // But we might want to keep selection active while in Settings? 
                            // User said "settings isn't clickable", implying navigation issue.
                            // Previously we forced `value` based on `selectedBlockId`.
                            // Now we control it manually. 
                            if (v === "elements" || v === "settings") {
                                // optional: setSelectedBlockId(null); 
                                // Actually, keeping it selected might be fine, but if we want to mimic "Properties appears on click" behavior:
                                // If I click Elements, I probably want to drag new things, so keeping selection is fine or clearing it is fine.
                                // Let's keep it simple: just change tabs.
                            }
                        }} 
                        className="flex-1 flex flex-col min-h-0"
                    >
                        <div className="px-4 py-3 border-b">
                            <TabsList className="w-full">
                                <TabsTrigger value="elements" className="flex-1">Elements</TabsTrigger>
                                <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
                                {selectedBlockId && (
                                    <TabsTrigger value="properties" className="flex-1">Properties</TabsTrigger>
                                )}
                            </TabsList>
                        </div>
                        
                        <TabsContent value="elements" className="flex-1 overflow-y-auto p-4 m-0">
                            <p className="text-xs font-medium text-slate-500 mb-4 uppercase tracking-wider">Drag & Drop Blocks</p>
                            
                            <Droppable droppableId="elements-list" isDropDisabled={true} type="EMAIL_BLOCK">
                                {(provided) => (
                                    <div 
                                        className="grid grid-cols-2 gap-3"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {EMAIL_ELEMENTS.map((el, index) => {
                                            const isAllowed = !sendAsPlainText || !['image', 'video', '2col', 'html'].includes(el.id);
                                            
                                            return (
                                                <div key={el.id} className="relative h-24">
                                                    {/* Static Copy (Background) */}
                                                    <div className={cn(
                                                        "absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 border rounded-lg bg-slate-50 transition-all",
                                                        isAllowed ? "opacity-100" : "opacity-40 grayscale"
                                                    )}>
                                                        <el.icon className="w-6 h-6 text-slate-500" />
                                                        <span className="text-xs font-medium text-slate-700">{el.label}</span>
                                                    </div>

                                                    {/* Draggable Item */}
                                                    <Draggable draggableId={el.id} index={index} isDragDisabled={!isAllowed}>
                                                        {(provided, snapshot) => (
                                                            <div 
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={cn(
                                                                    "absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 border rounded-lg bg-slate-50 hover:bg-white hover:border-primary/50 hover:shadow-sm transition-all group z-10",
                                                                    snapshot.isDragging && "ring-2 ring-primary bg-white shadow-lg",
                                                                    isAllowed ? "cursor-grab active:cursor-grabbing" : "opacity-0 cursor-not-allowed pointer-events-none"
                                                                )}
                                                                onClick={isAllowed ? handleDrop : undefined}
                                                                style={
                                                                    snapshot.isDragging 
                                                                        ? { ...provided.draggableProps.style, pointerEvents: 'none' } 
                                                                        : { ...provided.draggableProps.style, transform: 'translate(0,0)', transition: 'none' }
                                                                }
                                                            >
                                                                <el.icon className="w-6 h-6 text-slate-500 group-hover:text-primary" />
                                                                <span className="text-xs font-medium text-slate-700">{el.label}</span>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                </div>
                                            );
                                        })}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </TabsContent>

                        <TabsContent value="properties" className="flex-1 overflow-y-auto p-4 m-0">
                            {selectedBlock ? (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <Label>Content</Label>
                                        {selectedBlock.type === 'text' || selectedBlock.type === 'heading' || selectedBlock.type === 'button' ? (
                                            <div className="space-y-2">
                                                <Label className="text-xs text-slate-500 font-normal">Text</Label>
                                                <Input 
                                                    value={selectedBlock.content} 
                                                    onChange={(e) => {
                                                        setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, content: e.target.value } : b));
                                                    }}
                                                />
                                                {selectedBlock.type === 'button' && (
                                                    <>
                                                        <Label className="text-xs text-slate-500 font-normal mt-2">Button Link (URL)</Label>
                                                        <Input 
                                                            value={selectedBlock.style.url || ''} 
                                                            placeholder="https://..."
                                                            onChange={(e) => {
                                                                setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, style: { ...b.style, url: e.target.value } } : b));
                                                            }}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        ) : selectedBlock.type === 'image' ? (
                                            <div className="space-y-2">
                                                <div className="aspect-video bg-slate-100 rounded-md flex items-center justify-center border overflow-hidden relative group">
                                                    {selectedBlock.content ? (
                                                        <img src={selectedBlock.content} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="w-8 h-8 text-slate-300" />
                                                    )}
                                                </div>
                                                <Label className="text-xs text-slate-500 font-normal">Image URL</Label>
                                                <Input 
                                                    value={selectedBlock.content} 
                                                    placeholder="https://..."
                                                    onChange={(e) => {
                                                        setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, content: e.target.value } : b));
                                                    }}
                                                />
                                            </div>
                                        ) : selectedBlock.type === 'video' ? (
                                            <div className="space-y-2">
                                                 <div className="aspect-video bg-slate-100 rounded-md flex items-center justify-center border overflow-hidden relative group">
                                                    <Video className="w-8 h-8 text-slate-300" />
                                                </div>
                                                <Label className="text-xs text-slate-500 font-normal">Video URL (YouTube/Vimeo)</Label>
                                                <Input 
                                                    value={selectedBlock.content} 
                                                    placeholder="https://..."
                                                    onChange={(e) => {
                                                        setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, content: e.target.value } : b));
                                                    }}
                                                />
                                            </div>
                                        ) : selectedBlock.type === 'footer' ? (
                                             <div className="space-y-4">
                                                <Textarea 
                                                    value={selectedBlock.content} 
                                                    onChange={(e) => {
                                                        setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, content: e.target.value } : b));
                                                    }}
                                                    className="h-24"
                                                    placeholder="Company Address..."
                                                />
                                                <div className="flex items-center gap-2">
                                                    <Checkbox 
                                                        id="show-privacy" 
                                                        checked={(selectedBlock.style as any).showPrivacyPolicy}
                                                        onCheckedChange={(checked) => {
                                                            setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, style: { ...b.style, showPrivacyPolicy: checked === true } } : b));
                                                        }}
                                                    />
                                                    <Label htmlFor="show-privacy" className="cursor-pointer">Show Privacy Policy Link</Label>
                                                </div>
                                             </div>
                                        ) : selectedBlock.type === 'discount' ? (
                                            <div className="space-y-2">
                                                <Label className="text-xs text-slate-500 font-normal">Discount Code</Label>
                                                <Input 
                                                    value={selectedBlock.content} 
                                                    onChange={(e) => {
                                                        setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, content: e.target.value.toUpperCase() } : b));
                                                    }}
                                                    placeholder="CODE"
                                                    className="font-mono uppercase"
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-500">Edit content directly in canvas or footer settings.</p>
                                        )}
                                    </div>

                                    <Separator />

                                    {/* Typography Settings - for text-based blocks */}
                                    {(selectedBlock.type === 'text' || selectedBlock.type === 'heading' || selectedBlock.type === 'button' || selectedBlock.type === 'footer' || selectedBlock.type === 'menu' || selectedBlock.type === 'discount') && (
                                        <>
                                            <div className="space-y-3">
                                                <Label>Typography</Label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-1">
                                                        <Label className="text-xs text-slate-500 font-normal">Size</Label>
                                                        <div className="flex items-center gap-2">
                                                            <UnitInput 
                                                                value={selectedBlock.style.fontSize} 
                                                                onChange={(val) => setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, style: { ...b.style, fontSize: val } } : b))}
                                                                placeholder="16px"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-xs text-slate-500 font-normal">Weight</Label>
                                                        <Select 
                                                            value={selectedBlock.style.fontWeight || 'normal'}
                                                            onValueChange={(val) => setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, style: { ...b.style, fontWeight: val } } : b))}
                                                        >
                                                            <SelectTrigger className="h-8">
                                                                <SelectValue placeholder="Normal" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="normal">Normal</SelectItem>
                                                                <SelectItem value="bold">Bold</SelectItem>
                                                                <SelectItem value="300">Light</SelectItem>
                                                                <SelectItem value="600">Semi Bold</SelectItem>
                                                                <SelectItem value="800">Extra Bold</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-slate-500 font-normal">Font Family</Label>
                                                    <Select 
                                                        value={selectedBlock.style.fontFamily || 'sans-serif'}
                                                        onValueChange={(val) => setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, style: { ...b.style, fontFamily: val } } : b))}
                                                    >
                                                        <SelectTrigger className="h-8">
                                                            <SelectValue placeholder="System Sans" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="sans-serif">System Sans</SelectItem>
                                                            <SelectItem value="serif">System Serif</SelectItem>
                                                            <SelectItem value="monospace">Monospace</SelectItem>
                                                            <SelectItem value="'Helvetica Neue', Helvetica, Arial, sans-serif">Helvetica/Arial</SelectItem>
                                                            <SelectItem value="'Georgia', serif">Georgia</SelectItem>
                                                            <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-slate-500 font-normal">Text Color</Label>
                                                    <div className="flex gap-2">
                                                        <Input 
                                                            type="color" 
                                                            value={selectedBlock.style.color || '#000000'}
                                                            className="w-8 h-8 p-1 cursor-pointer"
                                                            onChange={(e) => setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, style: { ...b.style, color: e.target.value } } : b))}
                                                        />
                                                        <Input 
                                                            value={selectedBlock.style.color || '#000000'}
                                                            className="h-8 flex-1 font-mono text-xs"
                                                            onChange={(e) => setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, style: { ...b.style, color: e.target.value } } : b))}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <Separator />
                                        </>
                                    )}

                                    {/* Appearance Settings - Background, Spacing */}
                                    <div className="space-y-3">
                                        <Label>Appearance</Label>
                                        
                                        <div className="space-y-1">
                                            <Label className="text-xs text-slate-500 font-normal">Background Color</Label>
                                            <div className="flex gap-2">
                                                <Input 
                                                    type="color" 
                                                    value={selectedBlock.style.backgroundColor || '#ffffff'}
                                                    className="w-8 h-8 p-1 cursor-pointer"
                                                    onChange={(e) => setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, style: { ...b.style, backgroundColor: e.target.value } } : b))}
                                                />
                                                <Input 
                                                    value={selectedBlock.style.backgroundColor || 'transparent'}
                                                    className="h-8 flex-1 font-mono text-xs"
                                                    onChange={(e) => setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, style: { ...b.style, backgroundColor: e.target.value } } : b))}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs text-slate-500 font-normal">Padding</Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['t', 'r', 'b', 'l'].map((side) => {
                                                    const paddings = getSpacingValues(selectedBlock.style.padding);
                                                    const val = paddings[side as keyof typeof paddings];
                                                    
                                                    return (
                                                        <div key={side} className="flex items-center group">
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="h-8 w-8 rounded-r-none border border-r-0 border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 shrink-0 z-10" 
                                                                onClick={() => copySpacingToAll('padding', val)}
                                                                title="Copy to all sides"
                                                            >
                                                                <Copy className="w-3 h-3" />
                                                            </Button>
                                                            <UnitInput 
                                                                value={val}
                                                                onChange={(newVal) => updateSpacing('padding', side as any, newVal)}
                                                                placeholder="0"
                                                                label={side.toUpperCase()}
                                                                className="rounded-l-none"
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs text-slate-500 font-normal">Margin</Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['t', 'r', 'b', 'l'].map((side) => {
                                                    const margins = getSpacingValues(selectedBlock.style.margin);
                                                    const val = margins[side as keyof typeof margins];
                                                    
                                                    return (
                                                        <div key={side} className="flex items-center group">
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="h-8 w-8 rounded-r-none border border-r-0 border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 shrink-0 z-10" 
                                                                onClick={() => copySpacingToAll('margin', val)}
                                                                title="Copy to all sides"
                                                            >
                                                                <Copy className="w-3 h-3" />
                                                            </Button>
                                                            <UnitInput 
                                                                value={val}
                                                                onChange={(newVal) => updateSpacing('margin', side as any, newVal)}
                                                                placeholder="0"
                                                                label={side.toUpperCase()}
                                                                className="rounded-l-none"
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        </div>

                                        {selectedBlock.type === 'button' && (
                                            <div className="space-y-1">
                                                <Label className="text-xs text-slate-500 font-normal">Border Radius</Label>
                                                <UnitInput 
                                                    value={selectedBlock.style.borderRadius} 
                                                    onChange={(val) => setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, style: { ...b.style, borderRadius: val } } : b))}
                                                    placeholder="4px"
                                                />
                                            </div>
                                        )}
                                        
                                        {selectedBlock.type === 'image' && (
                                            <div className="space-y-1">
                                                <Label className="text-xs text-slate-500 font-normal">Width</Label>
                                                <UnitInput 
                                                    value={selectedBlock.style.width} 
                                                    onChange={(val) => setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, style: { ...b.style, width: val } } : b))}
                                                    placeholder="100%"
                                                />
                                            </div>
                                        )}
                                        
                                        {(selectedBlock.type === 'video' || selectedBlock.type === 'image') && (
                                            <div className="space-y-1">
                                                <Label className="text-xs text-slate-500 font-normal">Height</Label>
                                                <UnitInput 
                                                    value={selectedBlock.style.height} 
                                                    onChange={(val) => setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, style: { ...b.style, height: val } } : b))}
                                                    placeholder="auto"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <Label>Alignment</Label>
                                        <div className="flex bg-slate-100 p-1 rounded-md">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className={cn("flex-1 h-7", (selectedBlock.style as any).align === 'left' && "bg-white shadow-sm")}
                                                onClick={() => setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, style: { ...b.style, align: 'left' } } : b))}
                                            >
                                                <AlignLeft className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className={cn("flex-1 h-7", (selectedBlock.style as any).align === 'center' && "bg-white shadow-sm")}
                                                onClick={() => setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, style: { ...b.style, align: 'center' } } : b))}
                                            >
                                                <AlignCenter className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className={cn("flex-1 h-7", (selectedBlock.style as any).align === 'right' && "bg-white shadow-sm")}
                                                onClick={() => setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, style: { ...b.style, align: 'right' } } : b))}
                                            >
                                                <AlignRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {(selectedBlock.type === 'text' || selectedBlock.type === 'heading') && (
                                        <>
                                            <div className="space-y-3">
                                                <Label>Typography</Label>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="icon" className="h-8 w-8"><Bold className="w-4 h-4" /></Button>
                                                    <Button variant="outline" size="icon" className="h-8 w-8"><Italic className="w-4 h-4" /></Button>
                                                    <Button variant="outline" size="icon" className="h-8 w-8"><Underline className="w-4 h-4" /></Button>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Label>Font Size</Label>
                                                <Slider defaultValue={[16]} max={48} step={1} />
                                            </div>
                                        </>
                                    )}

                                    {selectedBlock.type === 'button' && (
                                        <div className="space-y-3">
                                            <Label>Button Color</Label>
                                            <div className="flex gap-2">
                                                <div className="w-6 h-6 rounded-full bg-blue-500 cursor-pointer ring-2 ring-offset-2 ring-blue-500" />
                                                <div className="w-6 h-6 rounded-full bg-emerald-500 cursor-pointer" />
                                                <div className="w-6 h-6 rounded-full bg-purple-500 cursor-pointer" />
                                                <div className="w-6 h-6 rounded-full bg-slate-900 cursor-pointer" />
                                            </div>
                                        </div>
                                    )}

                                    {selectedBlock.type === 'spacer' && (
                                        <div className="space-y-3">
                                            <Label>Height ({selectedBlock.style.height})</Label>
                                            <Slider 
                                                defaultValue={[parseInt(selectedBlock.style.height || '32')]} 
                                                max={100} 
                                                step={4}
                                                onValueChange={(vals) => {
                                                    setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, style: { ...b.style, height: `${vals[0]}px` } } : b));
                                                }}
                                            />
                                        </div>
                                    )}

                                    {selectedBlock.type === 'divider' && (
                                        <div className="space-y-3">
                                            <Label>Color</Label>
                                            <div className="flex gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-200 cursor-pointer border ring-offset-2 hover:ring-2" onClick={() => setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, style: { ...b.style, color: '#e2e8f0' } } : b))} />
                                                <div className="w-6 h-6 rounded-full bg-slate-400 cursor-pointer ring-offset-2 hover:ring-2" onClick={() => setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, style: { ...b.style, color: '#94a3b8' } } : b))} />
                                                <div className="w-6 h-6 rounded-full bg-slate-900 cursor-pointer ring-offset-2 hover:ring-2" onClick={() => setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, style: { ...b.style, color: '#0f172a' } } : b))} />
                                            </div>
                                        </div>
                                    )}

                                    {selectedBlock.type === 'html' && (
                                        <div className="space-y-3">
                                            <Label>Custom HTML</Label>
                                            <Textarea 
                                                value={selectedBlock.content} 
                                                onChange={(e) => {
                                                    setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, content: e.target.value } : b));
                                                }}
                                                className="font-mono text-xs h-32"
                                            />
                                            <p className="text-xs text-slate-500">Enter valid HTML. Be careful with scripts as they may be blocked by email clients.</p>
                                        </div>
                                    )}

                                    {selectedBlock.type === 'menu' && (
                                        <div className="space-y-3">
                                            <Label>Menu Items</Label>
                                            <Input 
                                                value={selectedBlock.content} 
                                                onChange={(e) => {
                                                    setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, content: e.target.value } : b));
                                                }}
                                            />
                                            <p className="text-xs text-slate-500">Separate items with | (pipe character)</p>
                                        </div>
                                    )}

                                    {selectedBlock.type === 'social' && (
                                        <div className="space-y-3">
                                            <Label>Icons Style</Label>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" className="flex-1">Color</Button>
                                                <Button variant="outline" size="sm" className="flex-1">Dark</Button>
                                                <Button variant="outline" size="sm" className="flex-1">Light</Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500">
                                    <MousePointerClick className="w-8 h-8 mb-2 opacity-50" />
                                    <p className="text-sm">Select an element on the canvas to edit its properties.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="settings" className="flex-1 overflow-y-auto p-4 m-0 space-y-6" ref={settingsTabRef}>
                            <div className="space-y-3">
                                <Label>Subject Line</Label>
                                <Input 
                                    value={emailSettings.subject} 
                                    onChange={(e) => setEmailSettings({...emailSettings, subject: e.target.value})}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label>Preheader Text</Label>
                                <Textarea 
                                    value={emailSettings.preheader} 
                                    onChange={(e) => setEmailSettings({...emailSettings, preheader: e.target.value})}
                                    className="h-20"
                                />
                                <p className="text-xs text-slate-500">Text that appears after the subject line in the inbox.</p>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <Label>From Name</Label>
                                <Input 
                                    value={emailSettings.fromName} 
                                    onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label>From Email</Label>
                                <Input 
                                    value={emailSettings.fromEmail} 
                                    onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label>Reply-To Email</Label>
                                <Input 
                                    value={emailSettings.replyTo} 
                                    placeholder="Same as From Email"
                                    onChange={(e) => setEmailSettings({...emailSettings, replyTo: e.target.value})}
                                />
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>CC / BCC</Label>
                                    <Switch />
                                </div>
                                <div className="space-y-2">
                                    <Input placeholder="CC" />
                                    <Input placeholder="BCC" />
                                    <p className="text-xs text-slate-500">Separate multiple emails with commas</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>Custom Headers</Label>
                                    <Button variant="outline" size="icon" className="h-6 w-6 text-purple-600 border-purple-200 hover:bg-purple-50" onClick={() => setEmailSettings({
                                        ...emailSettings,
                                        customHeaders: [...emailSettings.customHeaders, { name: "", value: "" }]
                                    })}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                
                                {emailSettings.customHeaders.length > 0 ? (
                                    <div className="space-y-2">
                                        {emailSettings.customHeaders.map((header, index) => (
                                            <div key={index} className="flex gap-2 items-start">
                                                <div className="flex-1 space-y-1">
                                                    <Input 
                                                        placeholder="Name (e.g. X-Custom-ID)" 
                                                        value={header.name}
                                                        onChange={(e) => {
                                                            const newHeaders = [...emailSettings.customHeaders];
                                                            newHeaders[index].name = e.target.value;
                                                            setEmailSettings({ ...emailSettings, customHeaders: newHeaders });
                                                        }}
                                                        className="h-8 text-xs"
                                                    />
                                                    <Input 
                                                        placeholder="Value" 
                                                        value={header.value}
                                                        onChange={(e) => {
                                                            const newHeaders = [...emailSettings.customHeaders];
                                                            newHeaders[index].value = e.target.value;
                                                            setEmailSettings({ ...emailSettings, customHeaders: newHeaders });
                                                        }}
                                                        className="h-8 text-xs"
                                                    />
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-slate-400 hover:text-red-500"
                                                    onClick={() => {
                                                        const newHeaders = [...emailSettings.customHeaders];
                                                        newHeaders.splice(index, 1);
                                                        setEmailSettings({ ...emailSettings, customHeaders: newHeaders });
                                                    }}
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center p-4 border border-dashed rounded-lg text-xs text-slate-400">
                                        No custom headers added
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Main Canvas */}
                <div 
                    className="flex-1 bg-slate-100 p-8 overflow-y-auto flex justify-center items-start"
                    onClick={(e) => {
                        // Only deselect if clicking the background itself or if the event bubbled up from the canvas
                        // but not if it was stopped (which blocks do)
                        if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.droppable-canvas')) {
                            setSelectedBlockId(null);
                            setActiveTab("elements");
                        }
                    }}
                >
                    {showHtml ? (
                         <Card className="w-full max-w-4xl h-full font-mono text-sm p-4 overflow-auto">
<pre>{`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${emailSettings.subject}</title>
</head>
<body style="background-color: #f1f5f9; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
        <!-- Email Content -->
        ${blocks.map(b => `<!-- ${b.type} block -->`).join('\n        ')}
    </div>
</body>
</html>`}</pre>
                         </Card>
                    ) : (
                        <div 
                            className={cn(
                                "bg-white shadow-lg min-h-[800px] h-fit transition-all duration-300 flex flex-col relative",
                                viewMode === 'mobile' ? "w-[375px] rounded-[30px] border-8 border-slate-800" : "w-[600px]"
                            )}
                        >
                            {/* Email Canvas Content */}
                            <Droppable droppableId="droppable-canvas" type="EMAIL_BLOCK">
                                {(provided, snapshot) => (
                                    <div 
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={cn(
                                            "flex-1 py-8 px-6 space-y-2 min-h-[500px]",
                                            snapshot.isDraggingOver && "bg-blue-50/50 ring-2 ring-blue-500/20 rounded-lg"
                                        )}
                                        onClick={() => {
                                            setSelectedBlockId(null);
                                            setActiveTab("elements");
                                        }}
                                    >
                                        {blocks.map((block, index) => renderDraggableBlock(block, index))}
                                        {provided.placeholder}

                                        {blocks.length === 0 && (
                                            <div className="border-2 border-dashed border-slate-200 rounded-lg h-32 flex items-center justify-center text-slate-400">
                                                Drag elements here
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </DragDropContext>
    );
}