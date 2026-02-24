import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
    Plus,
    Search,
    MoreHorizontal,
    Folder,
    FileText,
    ChevronRight,
    MoreVertical,
    Edit,
    Copy,
    FolderInput,
    Trash2,
    Home,
    Check,
    LayoutGrid,
    List as ListIcon,
    Wand2,
    FileBox,
    LayoutTemplate,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    ChevronLeft
} from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/pagination";
import { Button } from "@/components/Button";
import { Input } from "@/components/input";
import { Textarea } from "@/components/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/table";
import { Badge } from "@/components/badge";
import { ScrollArea } from "@/components/scroll-area";
import { Label } from "@/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select";
import { cn } from "@/lib/utils";
import { Card } from "@/components/card";

// --- Mock Data Types ---

type Folder = {
    id: string;
    name: string;
    parentId: string | null;
};

type Automation = {
    id: string;
    name: string;
    folderId: string | null;
    status: 'active' | 'inactive';
    lastUpdated: string;
};

// --- Mock Data ---

const INITIAL_FOLDERS: Folder[] = [
    { id: 'f1', name: 'Lead Nurturing', parentId: null },
    { id: 'f2', name: 'Customer Onboarding', parentId: null },
    { id: 'f3', name: 'Internal Processes', parentId: null },
    { id: 'f4', name: 'Webinar Campaigns', parentId: 'f1' },
    { id: 'f5', name: 'Q1 Webinars', parentId: 'f4' },
];

const INITIAL_AUTOMATIONS: Automation[] = [
    { id: 'a1', name: 'Website Contact Form Follow-up', folderId: 'f1', status: 'active', lastUpdated: '2 hours ago' },
    { id: 'a2', name: 'New User Welcome Series', folderId: 'f2', status: 'active', lastUpdated: '1 day ago' },
    { id: 'a3', name: 'Trial Expiration Warning', folderId: 'f2', status: 'active', lastUpdated: '3 days ago' },
    { id: 'a4', name: 'Employee Onboarding Task List', folderId: 'f3', status: 'inactive', lastUpdated: '1 week ago' },
    { id: 'a5', name: 'Generic Catch-all', folderId: null, status: 'inactive', lastUpdated: '2 weeks ago' },
    { id: 'a6', name: 'Q1 Webinar Invite Sequence', folderId: 'f5', status: 'active', lastUpdated: '5 hours ago' },
    { id: 'a7', name: 'Q1 Webinar Replay Follow-up', folderId: 'f5', status: 'inactive', lastUpdated: '1 day ago' },
    { id: 'a8', name: 'Previous Webinars Nurture', folderId: 'f4', status: 'active', lastUpdated: '4 days ago' },
    { id: 'a9', name: 'Q2 Webinar Teaser', folderId: 'f4', status: 'inactive', lastUpdated: '1 week ago' },
    { id: 'a10', name: 'Black Friday Promotion', folderId: 'f1', status: 'inactive', lastUpdated: '2 months ago' },
    { id: 'a11', name: 'Cyber Monday Deals', folderId: 'f1', status: 'inactive', lastUpdated: '2 months ago' },
    { id: 'a12', name: 'Christmas Special', folderId: 'f1', status: 'inactive', lastUpdated: '1 month ago' },
    { id: 'a13', name: 'New Year Resolution', folderId: 'f1', status: 'active', lastUpdated: '1 month ago' },
    { id: 'a14', name: 'Valentine\'s Day Offer', folderId: 'f1', status: 'active', lastUpdated: '2 days ago' },
    { id: 'a15', name: 'Customer Satisfaction Survey', folderId: 'f2', status: 'active', lastUpdated: '3 days ago' },
];

const AUTOMATION_TEMPLATES = [
    { id: 't1', name: 'Long Term Nurture Sequence', description: 'Send a series of emails to new leads over 7 days.', icon: FileText },
    { id: 't2', name: 'Webinar Registration', description: 'Confirm registration and send reminders before the event.', icon: Calendar },
    { id: 't3', name: 'Customer Onboarding', description: 'Welcome new customers and guide them through setup.', icon: UserPlus },
    { id: 't4', name: 'Abandoned Cart Recovery', description: 'Remind users about items left in their cart.', icon: ShoppingCart },
    { id: 't5', name: 'Appointment Reminder', description: 'Send SMS and Email reminders for upcoming appointments.', icon: Clock },
    { id: 't6', name: '9-Word Follow Up', description: 'A simple, direct question to re-engage dead leads.', icon: MessageCircle },
    { id: 't7', name: 'Fast 5 Follow Up', description: 'Rapidly engage new leads with 5 touches in 5 minutes.', icon: Zap },
    { id: 't8', name: 'Monthly Newsletter', description: 'Regular content digest sent to your subscriber base.', icon: Newspaper },
];

// --- Helper Functions ---

const getFolderPath = (folderId: string | null, folders: Folder[]): Folder[] => {
    if (!folderId) return [];
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return [];
    return [...getFolderPath(folder.parentId, folders), folder];
};

const getAllSubfolderIds = (folderId: string, folders: Folder[]): string[] => {
    const children = folders.filter(f => f.parentId === folderId);
    return [folderId, ...children.flatMap(c => getAllSubfolderIds(c.id, folders))];
};

const getFullPathName = (folderId: string | null, folders: Folder[]): string => {
    if (!folderId) return 'All Automations';
    const path = getFolderPath(folderId, folders);
    return path.map(f => f.name).join(' / ');
};

// --- Sub-Components ---
import { Calendar, UserPlus, ShoppingCart, Clock, MessageCircle, Zap, Newspaper } from "lucide-react"; // Import missing icons for templates

const TemplateCard = ({ template, selected, onClick }: { template: any, selected: boolean, onClick: () => void }) => (
    <div
        className={cn(
            "p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50 hover:bg-slate-50 flex items-start gap-3",
            selected ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-slate-200 bg-white"
        )}
        onClick={onClick}
    >
        <div className={cn("p-2 rounded-md shrink-0", selected ? "bg-white text-primary" : "bg-slate-100 text-slate-500")}>
            <template.icon className="w-5 h-5" />
        </div>
        <div>
            <h4 className="font-medium text-sm text-slate-900">{template.name}</h4>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{template.description}</p>
        </div>
    </div>
);


export default function AutomationsListPage() {
    const [_, setLocation] = useLocation();
    const [folders, setFolders] = useState<Folder[]>(INITIAL_FOLDERS);
    const [automations, setAutomations] = useState<Automation[]>(INITIAL_AUTOMATIONS);
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<'folder' | 'table'>('folder');

    // Table View State
    const [sortConfig, setSortConfig] = useState<{ key: keyof Automation | 'path', direction: 'asc' | 'desc' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Modal States
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [isMoveFolderModalOpen, setIsMoveFolderModalOpen] = useState(false);
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [isRenameFolderOpen, setIsRenameFolderOpen] = useState(false);
    const [isCreateAutomationModalOpen, setIsCreateAutomationModalOpen] = useState(false);

    // Create Automation Modal States
    const [createMode, setCreateMode] = useState<'scratch' | 'template' | 'ai'>('scratch');
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
    const [aiPrompt, setAiPrompt] = useState("");

    const [newFolderName, setNewFolderName] = useState("");
    const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);
    const [selectedFolderToRename, setSelectedFolderToRename] = useState<Folder | null>(null);
    const [selectedFolderToMove, setSelectedFolderToMove] = useState<Folder | null>(null);
    const [targetMoveFolderId, setTargetMoveFolderId] = useState<string | null>(null);

    // --- Derived Data ---

    const handleSort = (key: keyof Automation | 'path') => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const currentPath = getFolderPath(currentFolderId, folders);

    const displayedFolders = folders.filter(f => {
        if (searchQuery) {
            return f.name.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return f.parentId === currentFolderId;
    });

    const filteredAutomations = automations.filter(a => {
        // If searching, show all matches regardless of folder
        if (searchQuery) {
            return a.name.toLowerCase().includes(searchQuery.toLowerCase());
        }
        // In table view, show all automations
        if (viewMode === 'table') {
            return true;
        }
        return a.folderId === currentFolderId;
    });

    const sortedAutomations = [...filteredAutomations].sort((a, b) => {
        if (!sortConfig) return 0;

        let aValue: string = '';
        let bValue: string = '';

        if (sortConfig.key === 'path') {
            aValue = getFullPathName(a.folderId, folders).toLowerCase();
            bValue = getFullPathName(b.folderId, folders).toLowerCase();
        } else {
            aValue = (a[sortConfig.key] || '').toString().toLowerCase();
            bValue = (b[sortConfig.key] || '').toString().toLowerCase();
        }

        if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    // Pagination Logic
    const totalPages = Math.ceil(sortedAutomations.length / itemsPerPage);
    const displayedAutomations = sortedAutomations.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const displayedFolderMatches = searchQuery
        ? folders.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : displayedFolders;


    // --- Actions ---

    const handleCreateFolder = () => {
        if (!newFolderName.trim()) return;

        // Calculate depth of new folder
        // If adding to root (currentFolderId === null), depth is 0
        // If adding to parent, depth is parent's depth + 1
        let depth = 0;
        if (currentFolderId) {
            const path = getFolderPath(currentFolderId, folders);
            depth = path.length;
        }

        if (depth >= 4) {
            alert("Maximum folder depth of 4 reached. Cannot create nested folder here.");
            return;
        }

        const newFolder: Folder = {
            id: `f${Date.now()}`,
            name: newFolderName,
            parentId: currentFolderId
        };
        setFolders([...folders, newFolder]);
        setNewFolderName("");
        setIsCreateFolderOpen(false);
    };

    const handleRenameFolder = () => {
        if (!selectedFolderToRename || !newFolderName.trim()) return;
        setFolders(folders.map(f => f.id === selectedFolderToRename.id ? { ...f, name: newFolderName } : f));
        setNewFolderName("");
        setSelectedFolderToRename(null);
        setIsRenameFolderOpen(false);
    };

    const handleDeleteFolder = (folderId: string) => {
        // Simple delete: Remove folder and subfolders, move automations to root (or delete them? Let's move to root for safety)
        // Actually, better to just prevent delete if not empty, but for mock we'll just cascade delete folders and orphan items to root
        const subfolderIds = getAllSubfolderIds(folderId, folders);

        setFolders(folders.filter(f => !subfolderIds.includes(f.id) && f.id !== folderId));
        setAutomations(automations.map(a =>
            (a.folderId && (subfolderIds.includes(a.folderId) || a.folderId === folderId)) ? { ...a, folderId: null } : a
        ));
    };

    const handleDuplicateFolder = (folder: Folder) => {
        const newFolderId = `f${Date.now()}`;
        const newFolder: Folder = {
            ...folder,
            id: newFolderId,
            name: `${folder.name} (Duplicate)`,
            // parentId remains same as original
        };

        // Also duplicate direct automations inside it (Mock: not recursive deeply for subfolders for now to keep simple)
        const folderAutomations = automations.filter(a => a.folderId === folder.id);
        const newAutomations = folderAutomations.map(a => ({
            ...a,
            id: `a${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            folderId: newFolderId,
            name: `${a.name} (Copy)`,
            status: 'inactive' as const,
            lastUpdated: 'Just now'
        }));

        setFolders([...folders, newFolder]);
        setAutomations([...automations, ...newAutomations]);
    };

    const handleMoveFolder = () => {
        if (!selectedFolderToMove) return;

        // Prevent moving into itself or its children
        if (targetMoveFolderId === selectedFolderToMove.id) return;

        const subfolderIds = getAllSubfolderIds(selectedFolderToMove.id, folders);
        if (targetMoveFolderId && subfolderIds.includes(targetMoveFolderId)) {
            alert("Cannot move a folder into its own subfolder.");
            return;
        }

        setFolders(folders.map(f => f.id === selectedFolderToMove.id ? { ...f, parentId: targetMoveFolderId } : f));
        setIsMoveFolderModalOpen(false);
        setSelectedFolderToMove(null);
        setTargetMoveFolderId(null);
    };

    const handleDuplicateAutomation = (automation: Automation) => {
        const copy: Automation = {
            ...automation,
            id: `a${Date.now()}`,
            name: `${automation.name} (2) - Duplicate`,
            status: 'inactive', // Default duplicate to inactive
            lastUpdated: 'Just now'
        };
        setAutomations([...automations, copy]);
    };

    const handleDeleteAutomation = (automationId: string) => {
        setAutomations(automations.filter(a => a.id !== automationId));
    };

    const handleMoveAutomation = () => {
        if (!selectedAutomation) return;
        setAutomations(automations.map(a =>
            a.id === selectedAutomation.id ? { ...a, folderId: targetMoveFolderId } : a
        ));
        setIsMoveModalOpen(false);
        setSelectedAutomation(null);
        setTargetMoveFolderId(null);
    };

    const handleToggleAutomationStatus = (automationId: string) => {
        setAutomations(automations.map(a =>
            a.id === automationId ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a
        ));
    };

    const handleCreateAutomation = () => {
        // In a real app, we would pass the template ID or AI prompt to the builder
        // For now, we just navigate to the builder
        setLocation("/automations/new");
        setIsCreateAutomationModalOpen(false);
    };

    // --- Render Helpers ---

    const FolderRow = ({ folder }: { folder: Folder }) => (
        <TableRow className="group cursor-pointer hover:bg-slate-50" onClick={() => {
            setCurrentFolderId(folder.id);
            setSearchQuery(""); // Clear search on nav
        }}>
            <TableCell className="w-[40px]">
                <Folder className="w-5 h-5 text-blue-500 fill-blue-50" />
            </TableCell>
            <TableCell className="font-medium text-slate-700">
                {folder.name}
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFolderToRename(folder);
                            setNewFolderName(folder.name);
                            setIsRenameFolderOpen(true);
                        }}>
                            <Edit className="mr-2 h-4 w-4" /> Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateFolder(folder);
                        }}>
                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFolderToMove(folder);
                            setTargetMoveFolderId(folder.parentId); // Default to current parent? or root? Let's just reset or keep logic consistent
                            setIsMoveFolderModalOpen(true);
                        }}>
                            <FolderInput className="mr-2 h-4 w-4" /> Move to...
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFolder(folder.id);
                        }}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );

    const AutomationRow = ({ automation, showPath }: { automation: Automation, showPath?: boolean }) => (
        <TableRow className="group hover:bg-slate-50">
            <TableCell className="w-[40px]">
                <div className={cn(
                    "w-8 h-8 rounded-md flex items-center justify-center",
                    automation.status === 'active' ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
                )}>
                    <FileText className="w-4 h-4" />
                </div>
            </TableCell>
            <TableCell>
                <Link href={`/automations/${automation.id}`}>
                    <span className="font-medium text-slate-900 hover:text-primary cursor-pointer transition-colors">
                        {automation.name}
                    </span>
                </Link>
                {/* Show small path if searching AND path column is not visible */}
                {(searchQuery && !showPath && automation.folderId) && (
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Folder className="w-3 h-3" />
                        {getFullPathName(automation.folderId, folders)}
                    </div>
                )}
            </TableCell>

            {showPath && (
                <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                        <Folder className="w-3.5 h-3.5 text-blue-400" />
                        <span className="truncate max-w-[250px]" title={getFullPathName(automation.folderId, folders)}>
                            {getFullPathName(automation.folderId, folders)}
                        </span>
                    </div>
                </TableCell>
            )}

            <TableCell>
                <Badge variant={automation.status === 'active' ? 'default' : 'secondary'} className={cn(
                    "font-normal",
                    automation.status === 'active' ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200" : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                )}>
                    {automation.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
                {automation.lastUpdated}
            </TableCell>
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                        <Link href={`/automations/${automation.id}`}>
                            <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem onClick={() => handleDuplicateAutomation(automation)}>
                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            setSelectedAutomation(automation);
                            setTargetMoveFolderId(automation.folderId);
                            setIsMoveModalOpen(true);
                        }}>
                            <FolderInput className="mr-2 h-4 w-4" /> Move to...
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleAutomationStatus(automation.id)}>
                            {automation.status === 'active' ? (
                                <><div className="h-2 w-2 rounded-full bg-slate-300 mr-2" /> Deactivate</>
                            ) : (
                                <><Check className="mr-2 h-4 w-4 text-emerald-600" /> Activate</>
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDeleteAutomation(automation.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );

    return (
        <div className="flex min-h-screen bg-gray-50/50 flex-col">
            {/* Header */}
            <header className="h-16 border-b bg-white flex items-center px-6 justify-between shrink-0 sticky top-0 z-10">
                <div className="flex items-center gap-2 text-xl font-bold text-slate-800">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                        <FileText className="w-5 h-5" />
                    </div>
                    Automations
                </div>
                <div className="flex items-center gap-3">
                    <Dialog open={isCreateAutomationModalOpen} onOpenChange={setIsCreateAutomationModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" /> Create Automation
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] h-[650px] flex flex-col p-0 gap-0">
                            <div className="p-6 pb-2 shrink-0">
                                <DialogHeader>
                                    <DialogTitle>Create New Automation</DialogTitle>
                                    <DialogDescription>
                                        How would you like to start building your automation?
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="grid grid-cols-3 gap-4 pt-4">
                                    <Card
                                        className={cn(
                                            "p-4 cursor-pointer hover:border-primary/50 hover:bg-slate-50 transition-all flex flex-col items-center text-center gap-3",
                                            createMode === 'scratch' ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-slate-200"
                                        )}
                                        onClick={() => setCreateMode('scratch')}
                                    >
                                        <div className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center mb-1",
                                            createMode === 'scratch' ? "bg-white text-primary shadow-sm" : "bg-slate-100 text-slate-500"
                                        )}>
                                            <FileBox className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm">Start From Scratch</h3>
                                            <p className="text-xs text-muted-foreground mt-1">Build your workflow with a blank canvas.</p>
                                        </div>
                                    </Card>

                                    <Card
                                        className={cn(
                                            "p-4 cursor-pointer hover:border-primary/50 hover:bg-slate-50 transition-all flex flex-col items-center text-center gap-3",
                                            createMode === 'template' ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-slate-200"
                                        )}
                                        onClick={() => setCreateMode('template')}
                                    >
                                        <div className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center mb-1",
                                            createMode === 'template' ? "bg-white text-primary shadow-sm" : "bg-slate-100 text-slate-500"
                                        )}>
                                            <LayoutTemplate className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm">Use a Template</h3>
                                            <p className="text-xs text-muted-foreground mt-1">Choose from pre-built workflow recipes.</p>
                                        </div>
                                    </Card>

                                    <Card
                                        className={cn(
                                            "p-4 cursor-pointer hover:border-primary/50 hover:bg-slate-50 transition-all flex flex-col items-center text-center gap-3",
                                            createMode === 'ai' ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-slate-200"
                                        )}
                                        onClick={() => setCreateMode('ai')}
                                    >
                                        <div className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center mb-1",
                                            createMode === 'ai' ? "bg-white text-primary shadow-sm" : "bg-slate-100 text-slate-500"
                                        )}>
                                            <Wand2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm">Create with AI</h3>
                                            <p className="text-xs text-muted-foreground mt-1">Describe what you need and let AI build it.</p>
                                        </div>
                                    </Card>
                                </div>
                            </div>

                            <ScrollArea className="flex-1 w-full border-t border-b bg-slate-50/50">
                                <div className="p-6">
                                    {createMode === 'scratch' && (
                                        <div className="h-full flex flex-col items-center justify-center text-center py-8 text-muted-foreground">
                                            <FileBox className="w-12 h-12 text-slate-200 mb-4" />
                                            <p className="max-w-xs">You are ready to start with a blank canvas. Click "Create Automation" to begin.</p>
                                        </div>
                                    )}

                                    {createMode === 'template' && (
                                        <div className="grid grid-cols-1 gap-2">
                                            {AUTOMATION_TEMPLATES.map(t => (
                                                <TemplateCard
                                                    key={t.id}
                                                    template={t}
                                                    selected={selectedTemplateId === t.id}
                                                    onClick={() => setSelectedTemplateId(t.id)}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {createMode === 'ai' && (
                                        <div className="space-y-4">
                                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3">
                                                <Wand2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                                <div className="text-sm text-blue-800">
                                                    <p className="font-medium">What should this automation do?</p>
                                                    <p className="opacity-80">Be as specific as possible. Mention triggers, actions, and delays.</p>
                                                </div>
                                            </div>
                                            <Textarea
                                                value={aiPrompt}
                                                onChange={(e) => setAiPrompt(e.target.value)}
                                                placeholder="e.g. When a new lead fills out the 'Contact Us' form, wait 5 minutes, then send them a welcome email. If they reply, notify the sales team. If they don't reply after 2 days, send a follow-up email."
                                                className="min-h-[120px] resize-none bg-white"
                                            />
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>

                            <div className="p-6 pt-4 shrink-0 bg-white z-10">
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCreateAutomationModalOpen(false)}>Cancel</Button>
                                    <Button
                                        onClick={handleCreateAutomation}
                                        disabled={
                                            (createMode === 'template' && !selectedTemplateId) ||
                                            (createMode === 'ai' && !aiPrompt.trim())
                                        }
                                        className="gap-2"
                                    >
                                        {createMode === 'ai' && <Wand2 className="w-4 h-4" />}
                                        Create Automation
                                    </Button>
                                </DialogFooter>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto p-6 max-w-7xl">

                {/* Toolbar & Filters */}
                <div className="flex flex-col gap-4 mb-6">
                    <div className="flex items-center justify-between">
                        {/* Search & View Toggle */}
                        <div className="flex items-center gap-3 w-full max-w-xl">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search automations..."
                                    className="pl-9 bg-white border-slate-200 shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm gap-1 shrink-0">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn("h-8 w-8", viewMode === 'folder' && "bg-slate-100 text-primary shadow-sm")}
                                    onClick={() => setViewMode('folder')}
                                    title="Folder View"
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn("h-8 w-8", viewMode === 'table' && "bg-slate-100 text-primary shadow-sm")}
                                    onClick={() => setViewMode('table')}
                                    title="Table View"
                                >
                                    <ListIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Create Folder Button (Only shown in folder view for now) */}
                        <div className="flex items-center gap-2">
                            <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="gap-2 bg-white shadow-sm">
                                        <Plus className="w-4 h-4" /> New Folder
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Create New Folder</DialogTitle>
                                        <DialogDescription>
                                            Create a folder to organize your automations.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                        <Label>Folder Name</Label>
                                        <Input
                                            value={newFolderName}
                                            onChange={(e) => setNewFolderName(e.target.value)}
                                            placeholder="e.g. Q1 Marketing Campaigns"
                                            className="mt-2"
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>Cancel</Button>
                                        <Button onClick={handleCreateFolder}>Create Folder</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Breadcrumbs (Only show in folder view) */}
                    {viewMode === 'folder' && currentFolderId && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-muted-foreground hover:text-slate-900"
                                onClick={() => setCurrentFolderId(null)}
                            >
                                All Automations
                            </Button>

                            {currentPath.map((folder, idx) => (
                                <div key={folder.id} className="flex items-center gap-1">
                                    <ChevronRight className="w-3 h-3 text-slate-300" />
                                    <Button
                                        variant="ghost"
                                        className={cn("h-6 px-1.5 gap-1.5", idx === currentPath.length - 1 && "text-primary font-bold")}
                                        onClick={() => setCurrentFolderId(folder.id)}
                                    >
                                        <Folder className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                                        {folder.name}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden min-h-[500px]">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead className="cursor-pointer hover:text-slate-900 transition-colors" onClick={() => handleSort('name')}>
                                    <div className="flex items-center gap-2">
                                        Name
                                        {sortConfig?.key === 'name' ? (
                                            sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4 text-primary" /> : <ArrowDown className="w-4 h-4 text-primary" />
                                        ) : <ArrowUpDown className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100" />}
                                    </div>
                                </TableHead>
                                {viewMode === 'table' && (
                                    <TableHead className="cursor-pointer hover:text-slate-900 transition-colors" onClick={() => handleSort('path')}>
                                        <div className="flex items-center gap-2">
                                            Path
                                            {sortConfig?.key === 'path' ? (
                                                sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4 text-primary" /> : <ArrowDown className="w-4 h-4 text-primary" />
                                            ) : <ArrowUpDown className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100" />}
                                        </div>
                                    </TableHead>
                                )}
                                <TableHead className="w-[120px] cursor-pointer hover:text-slate-900 transition-colors" onClick={() => handleSort('status')}>
                                    <div className="flex items-center gap-2">
                                        Status
                                        {sortConfig?.key === 'status' ? (
                                            sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4 text-primary" /> : <ArrowDown className="w-4 h-4 text-primary" />
                                        ) : <ArrowUpDown className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100" />}
                                    </div>
                                </TableHead>
                                <TableHead className="w-[200px] cursor-pointer hover:text-slate-900 transition-colors" onClick={() => handleSort('lastUpdated')}>
                                    <div className="flex items-center gap-2">
                                        Last Updated
                                        {sortConfig?.key === 'lastUpdated' ? (
                                            sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4 text-primary" /> : <ArrowDown className="w-4 h-4 text-primary" />
                                        ) : <ArrowUpDown className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100" />}
                                    </div>
                                </TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Folders Section - Only show in folder view */}
                            {(viewMode === 'folder' && !searchQuery) && displayedFolders.map(folder => (
                                <FolderRow key={folder.id} folder={folder} />
                            ))}

                            {/* Automations Section */}
                            {displayedAutomations.length > 0 ? (
                                displayedAutomations.map(automation => (
                                    <AutomationRow
                                        key={automation.id}
                                        automation={automation}
                                        showPath={viewMode === 'table'}
                                    />
                                ))
                            ) : (
                                (viewMode === 'table' || displayedFolders.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={viewMode === 'table' ? 6 : 5} className="h-[300px] text-center">
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                                    <Search className="w-6 h-6 text-slate-300" />
                                                </div>
                                                <p className="font-medium text-slate-900">No automations found</p>
                                                <p className="text-sm mt-1">
                                                    {searchQuery ? "Try adjusting your search terms" : "Create a new automation or folder to get started"}
                                                </p>
                                                {!searchQuery && (
                                                    <Button className="mt-4 gap-2" onClick={() => setIsCreateAutomationModalOpen(true)}>
                                                        <Plus className="w-4 h-4" /> Create Automation
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between p-4 border-t bg-slate-50/50">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Rows per page</span>
                            <Select
                                value={itemsPerPage.toString()}
                                onValueChange={(value) => {
                                    setItemsPerPage(Number(value));
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger className="h-8 w-[70px]">
                                    <SelectValue placeholder={itemsPerPage} />
                                </SelectTrigger>
                                <SelectContent>
                                    {[10, 25, 50, 100].map(pageSize => (
                                        <SelectItem key={pageSize} value={pageSize.toString()}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-sm text-muted-foreground">
                                Page {currentPage} of {Math.max(1, totalPages)}
                            </div>
                            <Pagination className="w-auto">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            className={cn("cursor-pointer", currentPage === 1 && "pointer-events-none opacity-50")}
                                        />
                                    </PaginationItem>

                                    {/* Simple Logic for now: Just show current if many pages, or all if few */}
                                    {/* For robustness in mock: just showing prev/next as requested by user's previous "Page X of Y" preference, 
                                but user ASKED to match other tables which usually have numbers. 
                                Let's try to show numbers if possible. */}

                                    {Array.from({ length: totalPages }).map((_, i) => {
                                        const page = i + 1;
                                        // Simple logic: Show first, last, current, and neighbors
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                        ) {
                                            return (
                                                <PaginationItem key={page}>
                                                    <PaginationLink
                                                        isActive={currentPage === page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className="cursor-pointer"
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        } else if (
                                            page === currentPage - 2 ||
                                            page === currentPage + 2
                                        ) {
                                            return (
                                                <PaginationItem key={page}>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            );
                                        }
                                        return null;
                                    })}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            className={cn("cursor-pointer", currentPage === totalPages && "pointer-events-none opacity-50")}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </div>
                </div>

            </main>

            {/* Move Automation Modal */}
            <Dialog open={isMoveModalOpen} onOpenChange={setIsMoveModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Move Automation</DialogTitle>
                        <DialogDescription>
                            Select a destination folder for <strong>{selectedAutomation?.name}</strong>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <ScrollArea className="h-[300px] border rounded-md p-2">
                            <div className="space-y-1">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start font-normal",
                                        targetMoveFolderId === null && "bg-primary/10 text-primary font-medium"
                                    )}
                                    onClick={() => setTargetMoveFolderId(null)}
                                >
                                    <Home className="mr-2 h-4 w-4 shrink-0" /> All Automations (Root)
                                    {targetMoveFolderId === null && <Check className="ml-auto h-4 w-4 shrink-0" />}
                                </Button>

                                {folders.map(folder => {
                                    const path = getFullPathName(folder.id, folders);
                                    return (
                                        <Button
                                            key={folder.id}
                                            variant="ghost"
                                            className={cn(
                                                "w-full justify-start font-normal text-sm",
                                                targetMoveFolderId === folder.id && "bg-primary/10 text-primary font-medium"
                                            )}
                                            onClick={() => setTargetMoveFolderId(folder.id)}
                                        >
                                            <Folder className="mr-2 h-4 w-4 text-blue-500 fill-blue-50 shrink-0" />
                                            <span className="truncate flex-1 text-left" title={path}>{path}</span>
                                            {targetMoveFolderId === folder.id && <Check className="ml-2 h-4 w-4 shrink-0" />}
                                        </Button>
                                    )
                                })}
                            </div>
                        </ScrollArea>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsMoveModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleMoveAutomation} disabled={targetMoveFolderId === undefined}>Move Here</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Move Folder Modal */}
            <Dialog open={isMoveFolderModalOpen} onOpenChange={setIsMoveFolderModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Move Folder</DialogTitle>
                        <DialogDescription>
                            Select a destination for folder <strong>{selectedFolderToMove?.name}</strong>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <ScrollArea className="h-[300px] border rounded-md p-2">
                            <div className="space-y-1">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start font-normal",
                                        targetMoveFolderId === null && "bg-primary/10 text-primary font-medium"
                                    )}
                                    onClick={() => setTargetMoveFolderId(null)}
                                >
                                    <Home className="mr-2 h-4 w-4 shrink-0" /> All Automations (Root)
                                    {targetMoveFolderId === null && <Check className="ml-auto h-4 w-4 shrink-0" />}
                                </Button>

                                {folders.map(folder => {
                                    // Filter out the folder itself and its subfolders to prevent cycles
                                    if (selectedFolderToMove) {
                                        const movingIds = getAllSubfolderIds(selectedFolderToMove.id, folders);
                                        if (movingIds.includes(folder.id)) return null;
                                    }

                                    const path = getFullPathName(folder.id, folders);
                                    return (
                                        <Button
                                            key={folder.id}
                                            variant="ghost"
                                            className={cn(
                                                "w-full justify-start font-normal text-sm",
                                                targetMoveFolderId === folder.id && "bg-primary/10 text-primary font-medium"
                                            )}
                                            onClick={() => setTargetMoveFolderId(folder.id)}
                                        >
                                            <Folder className="mr-2 h-4 w-4 text-blue-500 fill-blue-50 shrink-0" />
                                            <span className="truncate flex-1 text-left" title={path}>{path}</span>
                                            {targetMoveFolderId === folder.id && <Check className="ml-2 h-4 w-4 shrink-0" />}
                                        </Button>
                                    )
                                })}
                            </div>
                        </ScrollArea>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsMoveFolderModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleMoveFolder} disabled={targetMoveFolderId === undefined}>Move Folder Here</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Rename Folder Modal */}
            <Dialog open={isRenameFolderOpen} onOpenChange={setIsRenameFolderOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename Folder</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Label>Folder Name</Label>
                        <Input
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="Folder Name"
                            className="mt-2"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRenameFolderOpen(false)}>Cancel</Button>
                        <Button onClick={handleRenameFolder}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
