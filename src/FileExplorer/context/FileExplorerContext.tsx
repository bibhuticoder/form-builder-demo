import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import {
    Folder,
    FileItem,
    SortConfig,
    ViewMode,
    DisplayItem,
    FileType,
} from '../types';
import { getFolderPath, getAllSubfolderIds, getFullPathName, getFolderStats, parseRelativeDate } from '../utils/helpers';

interface FileExplorerContextProps {
    fileType: FileType;
    folders: Folder[];
    files: FileItem[];
    currentFolderId: string | null;
    setCurrentFolderId: (id: string | null) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;

    // Table state
    sortConfig: SortConfig;
    handleSort: (key: keyof FileItem | 'path') => void;
    currentPage: number;
    setCurrentPage: (page: React.SetStateAction<number>) => void;
    itemsPerPage: number;
    setItemsPerPage: (items: number) => void;

    // Selected for modals
    newFolderName: string;
    setNewFolderName: (name: string) => void;
    selectedFile: FileItem | null;
    setSelectedFile: (file: FileItem | null) => void;
    selectedFolderToRename: Folder | null;
    setSelectedFolderToRename: (folder: Folder | null) => void;
    selectedFolderToMove: Folder | null;
    setSelectedFolderToMove: (folder: Folder | null) => void;
    targetMoveFolderId: string | null;
    setTargetMoveFolderId: (id: string | null) => void;

    // Modal actions
    handleCreateFolder: (closeModal: () => void) => void;
    handleRenameFolder: (closeModal: () => void) => void;
    handleDeleteFolder: (folderId: string) => void;
    handleDuplicateFolder: (folder: Folder) => void;
    handleMoveFolder: (closeModal: () => void) => void;

    // File actions
    handleDuplicateFile: (file: FileItem) => void;
    handleDeleteFile: (fileId: string) => void;
    handleMoveFile: (closeModal: () => void) => void;
    handleToggleFileStatus: (fileId: string) => void;

    // Derived state that connects to components
    currentPath: Folder[];
    displayedItems: DisplayItem[];
    totalPages: number;
}

const FileExplorerContext = createContext<FileExplorerContextProps | undefined>(undefined);

interface FileExplorerProviderProps {
    children: ReactNode;
    fileType: FileType;
    initialFolders?: Folder[];
    initialFiles?: FileItem[];
}

export const FileExplorerProvider = ({ children, fileType, initialFolders = [], initialFiles = [] }: FileExplorerProviderProps) => {
    const [folders, setFolders] = useState<Folder[]>(initialFolders);
    const [files, setFiles] = useState<FileItem[]>(initialFiles);
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('folder');

    // Table View State
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Partial states for modals that need simple input handling
    const [newFolderName, setNewFolderName] = useState('');
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
    const [selectedFolderToRename, setSelectedFolderToRename] = useState<Folder | null>(null);
    const [selectedFolderToMove, setSelectedFolderToMove] = useState<Folder | null>(null);
    const [targetMoveFolderId, setTargetMoveFolderId] = useState<string | null>(null);

    const handleSort = (key: keyof FileItem | 'path') => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleCreateFolder = (closeModal: () => void) => {
        if (!newFolderName.trim()) return;
        let depth = 0;
        if (currentFolderId) {
            const path = getFolderPath(currentFolderId, folders);
            depth = path.length;
        }
        if (depth >= 4) return;

        const newFolder: Folder = {
            id: `f${Date.now()}`,
            name: newFolderName,
            parentId: currentFolderId,
        };
        setFolders([...folders, newFolder]);
        setNewFolderName("");
        closeModal();
    };

    const handleRenameFolder = (closeModal: () => void) => {
        if (!selectedFolderToRename || !newFolderName.trim()) return;
        setFolders(folders.map(f => f.id === selectedFolderToRename.id ? { ...f, name: newFolderName } : f));
        setNewFolderName("");
        setSelectedFolderToRename(null);
        closeModal();
    };

    const handleDeleteFolder = (folderId: string) => {
        const subfolderIds = getAllSubfolderIds(folderId, folders);
        setFolders(folders.filter(f => !subfolderIds.includes(f.id) && f.id !== folderId));
        setFiles(files.map(a =>
            (a.folderId && (subfolderIds.includes(a.folderId) || a.folderId === folderId)) ? { ...a, folderId: null } : a
        ));
    };

    const handleDuplicateFolder = (folder: Folder) => {
        const newFolderId = `f${Date.now()}`;
        const newFolder: Folder = {
            ...folder,
            id: newFolderId,
            name: `${folder.name} (Duplicate)`,
        };

        const folderFiles = files.filter(a => a.folderId === folder.id);
        const newFiles = folderFiles.map(a => ({
            ...a,
            id: `a${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            folderId: newFolderId,
            name: `${a.name} (Copy)`,
            status: 'inactive' as const,
            lastUpdated: 'Just now'
        }));

        setFolders([...folders, newFolder]);
        setFiles([...files, ...newFiles]);
    };

    const handleMoveFolder = (closeModal: () => void) => {
        if (!selectedFolderToMove) return;
        if (targetMoveFolderId === selectedFolderToMove.id) return;

        const subfolderIds = getAllSubfolderIds(selectedFolderToMove.id, folders);
        if (targetMoveFolderId && subfolderIds.includes(targetMoveFolderId)) {
            alert("Cannot move a folder into its own subfolder.");
            return;
        }

        setFolders(folders.map(f => f.id === selectedFolderToMove.id ? { ...f, parentId: targetMoveFolderId } : f));
        setSelectedFolderToMove(null);
        setTargetMoveFolderId(null);
        closeModal();
    };

    const handleDuplicateFile = (file: FileItem) => {
        const copy: FileItem = {
            ...file,
            id: `a${Date.now()}`,
            name: `${file.name} (2) - Duplicate`,
            status: 'inactive',
            lastUpdated: 'Just now'
        };
        setFiles([...files, copy]);
    };

    const handleDeleteFile = (fileId: string) => {
        setFiles(files.filter(a => a.id !== fileId));
    };

    const handleMoveFile = (closeModal: () => void) => {
        if (!selectedFile) return;
        setFiles(files.map(a =>
            a.id === selectedFile.id ? { ...a, folderId: targetMoveFolderId } : a
        ));
        setSelectedFile(null);
        setTargetMoveFolderId(null);
        closeModal();
    };

    const handleToggleFileStatus = (fileId: string) => {
        setFiles(files.map(a =>
            a.id === fileId ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a
        ));
    };

    const currentPath = useMemo(() => getFolderPath(currentFolderId, folders), [currentFolderId, folders]);

    const filteredFiles = useMemo(() => files.filter(a => {
        if (searchQuery) {
            return a.name.toLowerCase().includes(searchQuery.toLowerCase());
        }
        if (viewMode === 'table') {
            return true;
        }
        return a.folderId === currentFolderId;
    }), [files, currentFolderId, searchQuery, viewMode]);

    const sortedCombinedItems = useMemo(() => {
        let items: DisplayItem[] = [];

        if (viewMode === 'folder') {
            const currentFolders = folders.filter(f => {
                if (searchQuery) return f.name.toLowerCase().includes(searchQuery.toLowerCase());
                return f.parentId === currentFolderId;
            });
            items.push(...currentFolders.map(f => ({ ...f, itemType: 'folder' as const })));
        }

        items.push(...filteredFiles.map(f => ({ ...f, itemType: 'file' as const })));

        if (sortConfig) {
            items.sort((a, b) => {
                let aValue: any = '';
                let bValue: any = '';

                // Extract a
                if (a.itemType === 'folder') {
                    if (sortConfig.key === 'name') aValue = a.name.toLowerCase();
                    else if (sortConfig.key === 'lastUpdated') aValue = getFolderStats(a.id, folders, files).latestUpdateMs;
                } else {
                    if (sortConfig.key === 'path') aValue = getFullPathName(a.folderId, folders).toLowerCase();
                    else if (sortConfig.key === 'lastUpdated') aValue = parseRelativeDate(a.lastUpdated);
                    else aValue = (a[sortConfig.key as keyof FileItem] || '').toString().toLowerCase();
                }

                // Extract b
                if (b.itemType === 'folder') {
                    if (sortConfig.key === 'name') bValue = b.name.toLowerCase();
                    else if (sortConfig.key === 'lastUpdated') bValue = getFolderStats(b.id, folders, files).latestUpdateMs;
                } else {
                    if (sortConfig.key === 'path') bValue = getFullPathName(b.folderId, folders).toLowerCase();
                    else if (sortConfig.key === 'lastUpdated') bValue = parseRelativeDate(b.lastUpdated);
                    else bValue = (b[sortConfig.key as keyof FileItem] || '').toString().toLowerCase();
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;

                // Sort folders before files typically when values match
                if (a.itemType !== b.itemType) return a.itemType === 'folder' ? -1 : 1;
                return 0;
            });
        } else {
            // Default sort: folders first
            items.sort((a, b) => {
                if (a.itemType !== b.itemType) return a.itemType === 'folder' ? -1 : 1;
                return 0;
            });
        }

        return items;
    }, [folders, files, currentFolderId, searchQuery, viewMode, filteredFiles, sortConfig]);

    const totalPages = Math.ceil(sortedCombinedItems.length / itemsPerPage);
    const displayedItems = sortedCombinedItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <FileExplorerContext.Provider value={{
            fileType,
            folders, files, currentFolderId, setCurrentFolderId, searchQuery, setSearchQuery, viewMode, setViewMode, sortConfig, handleSort, currentPage, setCurrentPage, itemsPerPage, setItemsPerPage,
            newFolderName, setNewFolderName, selectedFile, setSelectedFile, selectedFolderToRename, setSelectedFolderToRename, selectedFolderToMove, setSelectedFolderToMove, targetMoveFolderId, setTargetMoveFolderId,
            handleCreateFolder, handleRenameFolder, handleDeleteFolder, handleDuplicateFolder, handleMoveFolder, handleDuplicateFile, handleDeleteFile, handleMoveFile, handleToggleFileStatus,
            currentPath, displayedItems, totalPages
        }}>
            {children}
        </FileExplorerContext.Provider>
    );
};

export const useFileExplorerContext = () => {
    const context = useContext(FileExplorerContext);
    if (!context) throw new Error('useFileExplorerContext must be used within a FileExplorerProvider');
    return context;
};
