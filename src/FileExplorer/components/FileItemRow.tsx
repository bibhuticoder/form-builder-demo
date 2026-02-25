import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DocumentTextIcon as FileText,
    PencilIcon as Edit,
    DocumentDuplicateIcon as Copy,
    FolderArrowDownIcon as FolderInput,
    TrashIcon as Trash2,
} from '@heroicons/react/24/outline';
import { Badge } from '@/components/badge';
import { cn } from '@/lib/utils';
import { FileItem, FileType } from '../types';
import { useFileExplorerContext } from '../context/FileExplorerContext';
import { getFullPathName, getStatusVariant } from '../utils/helpers';
import { BaseExplorerRow, RowAction } from './BaseExplorerRow';

interface FileItemRowProps {
    file: FileItem;
    showPath?: boolean;
    openMoveModal: () => void;
}

export const FileItemRow: React.FC<FileItemRowProps> = ({
    file,
    showPath = false,
    openMoveModal
}) => {
    const {
        folders,
        searchQuery,
        setSelectedFile,
        setTargetMoveFolderId,
        handleDuplicateFile,
        handleToggleFileStatus,
        handleDeleteFile
    } = useFileExplorerContext();
    const navigate = useNavigate();

    const getIcon = () => {
        return <FileText className="w-5 h-5" />;
    };

    const handleRowClick = () => {
        if (file.type === FileType.Automation) {
            navigate(`/automations/${file.id}`);
        } else if (file.type === FileType.Form) {
            navigate(`/forms/${file.id}`);
        } else if (file.type === FileType.Email) {
            navigate(`/emails/${file.id}`);
        } else {
            navigate(`/${file.type}s/${file.id}`);
        }
    };

    const actions: RowAction[] = [
        {
            icon: <Edit className="h-4 w-4" />,
            label: "Edit",
            onClick: () => handleRowClick()
        },
        {
            icon: <Copy className="h-4 w-4" />,
            label: "Duplicate",
            onClick: () => handleDuplicateFile(file)
        },
        {
            icon: <FolderInput className="h-4 w-4" />,
            label: "Move to...",
            onClick: () => {
                setSelectedFile(file);
                setTargetMoveFolderId(file.folderId);
                openMoveModal();
            }
        },
        {
            icon: <Trash2 className="h-4 w-4" />,
            label: "Delete",
            className: "text-red-600 focus:text-red-500 dark:text-red-400 dark:focus:text-red-300",
            onClick: () => handleDeleteFile(file.id)
        }
    ];

    const NameNode = () => (
        <>
            <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                <span onClick={handleRowClick} className="hover:underline hover:text-primary dark:hover:text-primary cursor-pointer">
                    {file.name}
                </span>
            </div>
            {(searchQuery && !showPath && file.folderId) && (
                <div className="text-xs text-slate-500 dark:text-gray-400 mt-0.5 flex items-center gap-1 font-normal">
                    <span className="truncate max-w-[200px]" title={getFullPathName(file.folderId, folders)}>
                        {getFullPathName(file.folderId, folders)}
                    </span>
                </div>
            )}
        </>
    );

    const PathNode = showPath ? (
        file.folderId ? (
            <span className="truncate max-w-[250px]" title={getFullPathName(file.folderId, folders)}>
                {getFullPathName(file.folderId, folders)}
            </span>
        ) : (
            <span className="text-slate-400 dark:text-gray-500 italic">Root</span>
        )
    ) : undefined;

    return (
        <BaseExplorerRow
            onClick={handleRowClick}
            icon={
                <div className={cn(
                    "w-8 h-8 rounded flex items-center justify-center",
                    getStatusVariant(file.status) === 'success' ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-gray-400"
                )}>
                    {getIcon()}
                </div>
            }
            nameNode={<NameNode />}
            pathNode={PathNode}
            statusNode={
                <Badge
                    variant={getStatusVariant(file.status)}
                    className="font-medium tracking-wide text-[10px] uppercase transition-colors"
                >
                    {file.status}
                </Badge>
            }
            dateNode={file.lastUpdated}
            actions={actions}
        />
    );
};
