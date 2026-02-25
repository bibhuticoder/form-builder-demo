import React from 'react';
import {
    FolderIcon as Folder,
    PencilIcon as Edit,
    DocumentDuplicateIcon as Copy,
    FolderArrowDownIcon as FolderInput,
    TrashIcon as Trash2
} from '@heroicons/react/24/outline';
import { Badge } from '@/components/badge';
import { Folder as FolderType } from '../types';
import { useFileExplorerContext } from '../context/FileExplorerContext';
import { BaseExplorerRow, RowAction } from './BaseExplorerRow';
import { getFolderStats, getStatusVariant } from '../utils/helpers';

interface FolderRowProps {
    folder: FolderType;
    openRenameModal: () => void;
    openMoveModal: () => void;
}

export const FolderRow: React.FC<FolderRowProps> = ({ folder, openRenameModal, openMoveModal }) => {
    const {
        folders,
        files,
        setCurrentFolderId,
        setSearchQuery,
        setSelectedFolderToRename,
        setNewFolderName,
        handleDuplicateFolder,
        setSelectedFolderToMove,
        setTargetMoveFolderId,
        handleDeleteFolder,
    } = useFileExplorerContext();

    const stats = getFolderStats(folder.id, folders, files);

    const handleClick = () => {
        setCurrentFolderId(folder.id);
        setSearchQuery('');
    };

    const actions: RowAction[] = [
        {
            icon: <Edit className="h-4 w-4" />,
            label: "Rename",
            onClick: () => {
                setSelectedFolderToRename(folder);
                setNewFolderName(folder.name);
                openRenameModal();
            }
        },
        {
            icon: <Copy className="h-4 w-4" />,
            label: "Duplicate",
            onClick: () => handleDuplicateFolder(folder)
        },
        {
            icon: <FolderInput className="h-4 w-4" />,
            label: "Move to...",
            onClick: () => {
                setSelectedFolderToMove(folder);
                setTargetMoveFolderId(folder.parentId);
                openMoveModal();
            }
        },
        {
            icon: <Trash2 className="h-4 w-4" />,
            label: "Delete",
            className: "text-red-600 focus:text-red-600",
            onClick: () => handleDeleteFolder(folder.id)
        }
    ];

    return (
        <BaseExplorerRow
            onClick={handleClick}
            icon={
                <div className="w-8 h-8 rounded flex items-center justify-center">
                    <Folder className="w-5 h-5 text-blue-500 fill-blue-50 dark:text-primary dark:fill-primary/20" />
                </div>
            }
            nameNode={folder.name}
            statusNode={
                Object.keys(stats.statusCounts).length > 0 ? (
                    <div className="flex items-center gap-1.5 overflow-x-auto max-w-[200px] hide-scrollbar">
                        {Object.entries(stats.statusCounts).map(([statusName, count]) => (
                            <Badge key={statusName} variant={getStatusVariant(statusName)} className="font-medium tracking-wide text-[10px] uppercase whitespace-nowrap">
                                {count} {statusName}
                            </Badge>
                        ))}
                    </div>
                ) : null
            }
            dateNode={stats.latestUpdateStr}
            actions={actions}
        />
    );
};
