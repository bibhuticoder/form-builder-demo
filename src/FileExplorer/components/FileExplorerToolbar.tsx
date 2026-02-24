import React from 'react';
import {
    MagnifyingGlassIcon as Search,
    Squares2X2Icon as LayoutGrid,
    ListBulletIcon as ListIcon,
    PlusIcon as Plus
} from '@heroicons/react/24/outline';
import { Button } from '@/components/Button';
import { IconInput } from '@/components/IconInput';
import { cn } from '@/lib/utils';
import { useFileExplorerContext } from '../context/FileExplorerContext';
import { FileExplorerBreadCrumb } from './FileExplorerBreadCrumb';

interface FileExplorerToolbarProps {
    openCreateFolderModal: () => void;
}

export const FileExplorerToolbar: React.FC<FileExplorerToolbarProps> = ({ openCreateFolderModal }) => {
    const {
        searchQuery,
        setSearchQuery,
        viewMode,
        setViewMode
    } = useFileExplorerContext();

    return (
        <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 w-full max-w-xl">
                    <IconInput
                        icon={<Search className="h-4 w-4" />}
                        containerStyles="flex-1 max-w-sm"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    />

                    <div className="flex bg-white dark:bg-gray-800 p-1 rounded-lg border border-slate-200 dark:border-gray-700 shadow-sm gap-1 shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700", viewMode === 'folder' && "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary shadow-sm")}
                            onClick={() => setViewMode('folder')}
                            title="Folder View"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700", viewMode === 'table' && "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary shadow-sm")}
                            onClick={() => setViewMode('table')}
                            title="Table View"
                        >
                            <ListIcon className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={openCreateFolderModal}>
                        <Plus className="w-4 h-4" /> New Folder
                    </Button>
                </div>
            </div>

            <FileExplorerBreadCrumb />
        </div>
    );
};
