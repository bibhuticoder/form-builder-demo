import React from 'react';
import { ChevronRightIcon as ChevronRight, FolderIcon as Folder } from '@heroicons/react/24/outline';
import { HomeIcon as Home } from '@heroicons/react/24/solid';
import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';
import { useFileExplorerContext } from '../context/FileExplorerContext';

export const FileExplorerBreadCrumb: React.FC = () => {
    const {
        viewMode,
        currentFolderId,
        setCurrentFolderId,
        currentPath,
        fileType
    } = useFileExplorerContext();

    if (viewMode !== 'folder' || !currentFolderId) {
        return null;
    }

    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400 pt-1">
            <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-slate-500 hover:text-slate-900 dark:hover:text-gray-100"
                onClick={() => setCurrentFolderId(null)}
            >
                <Home className="w-4 h-4 mr-1" /> All {fileType}s
            </Button>

            {
                currentPath.map((folder, idx) => (
                    <div key={folder.id} className="flex items-center gap-1">
                        <ChevronRight className="w-3 h-3 text-slate-300 dark:text-gray-600" />
                        <Button
                            variant="ghost"
                            className={cn("h-6 px-1.5 gap-1.5 hover:text-slate-900 dark:hover:text-gray-100", idx === currentPath.length - 1 && "text-primary dark:text-primary font-bold")}
                            onClick={() => setCurrentFolderId(folder.id)}
                        >


                            <Folder className="w-3.5 h-3.5 text-primary fill-primary/20" />
                            {folder.name}
                        </Button>
                    </div>
                ))
            }
        </div >
    );
};
