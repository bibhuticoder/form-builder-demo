import React from 'react';
import { MagnifyingGlassIcon as Search, ArrowUpIcon as ArrowUp, ArrowDownIcon as ArrowDown, ArrowsUpDownIcon as ArrowUpDown, PlusIcon as Plus } from '@heroicons/react/24/outline';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/table';
import { Button } from '@/components/Button';
import { FolderRow } from './FolderRow';
import { FileItemRow } from './FileItemRow';
import { FileExplorerPagination } from './FileExplorerPagination';
import { cn } from '@/lib/utils';
import { useFileExplorerContext } from '../context/FileExplorerContext';

interface FileExplorerTableProps {
    openRenameModal: () => void;
    openFolderMoveModal: () => void;
    openFileMoveModal: () => void;
    openCreateFileModal: () => void;
}

export const FileExplorerTable: React.FC<FileExplorerTableProps> = ({
    openRenameModal,
    openFolderMoveModal,
    openFileMoveModal,
    openCreateFileModal
}) => {
    const {
        sortConfig,
        handleSort,
        viewMode,
        searchQuery,
        displayedItems
    } = useFileExplorerContext();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm overflow-visible min-h-[500px] h-full flex flex-col justify-between">
            <Table className="min-w-[800px]">
                <TableHeader>
                    <TableRow className="bg-slate-50/50 dark:bg-gray-800/50 hover:bg-slate-50/50 dark:hover:bg-gray-800 border-slate-200 dark:border-gray-700">
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 transition-colors" onClick={() => handleSort('name')}>
                            <div className="flex items-center gap-2 select-none">
                                Name
                                {sortConfig?.key === 'name' ? (
                                    sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4 text-primary" /> : <ArrowDown className="w-4 h-4 text-primary" />
                                ) : <ArrowUpDown className="w-4 h-4 text-slate-300 dark:text-gray-600 opacity-0 group-hover:opacity-100" />}
                            </div>
                        </TableHead>
                        {viewMode === 'table' && (
                            <TableHead className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 transition-colors" onClick={() => handleSort('path')}>
                                <div className="flex items-center gap-2 select-none">
                                    Path
                                    {sortConfig?.key === 'path' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4 text-primary" /> : <ArrowDown className="w-4 h-4 text-primary" />
                                    ) : <ArrowUpDown className="w-4 h-4 text-slate-300 dark:text-gray-600 opacity-0 group-hover:opacity-100" />}
                                </div>
                            </TableHead>
                        )}
                        <TableHead
                            className={cn(
                                "w-[120px] text-gray-500  dark:text-gray-400 transition-colors",
                                viewMode === 'table' ? "cursor-pointer hover:text-slate-900 dark:hover:text-gray-100" : ""
                            )}
                            onClick={viewMode === 'table' ? () => handleSort('status') : undefined}
                        >
                            <div className="flex items-center gap-2 select-none">
                                Status
                                {viewMode === 'table' && (
                                    sortConfig?.key === 'status' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4 text-primary" /> : <ArrowDown className="w-4 h-4 text-primary" />
                                    ) : <ArrowUpDown className="w-4 h-4 text-slate-300 dark:text-gray-600 opacity-0 group-hover:opacity-100" />
                                )}
                            </div>
                        </TableHead>
                        <TableHead className="w-[200px] cursor-pointer text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 transition-colors" onClick={() => handleSort('lastUpdated')}>
                            <div className="flex items-center gap-2 select-none">
                                Last Updated
                                {sortConfig?.key === 'lastUpdated' ? (
                                    sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4 text-primary" /> : <ArrowDown className="w-4 h-4 text-primary" />
                                ) : <ArrowUpDown className="w-4 h-4 text-slate-300 dark:text-gray-600 opacity-0 group-hover:opacity-100" />}
                            </div>
                        </TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {displayedItems.length > 0 ? (
                        displayedItems.map(item => (
                            item.itemType === 'folder' ? (
                                <FolderRow
                                    key={`folder-${item.id}`}
                                    folder={item}
                                    openRenameModal={openRenameModal}
                                    openMoveModal={openFolderMoveModal}
                                />
                            ) : (
                                <FileItemRow
                                    key={`file-${item.id}`}
                                    file={item}
                                    showPath={viewMode === 'table'}
                                    openMoveModal={openFileMoveModal}
                                />
                            )
                        ))
                    ) : (
                        <TableRow className="hover:bg-transparent dark:hover:bg-transparent border-slate-200 dark:border-gray-700">
                            <TableCell colSpan={viewMode === 'table' ? 6 : 5} className="h-[300px] text-center">
                                <div className="flex flex-col items-center justify-center text-muted-foreground dark:text-gray-400">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                        <Search className="w-6 h-6 text-slate-300 dark:text-gray-400" />
                                    </div>
                                    <p className="font-medium text-slate-900 dark:text-gray-100">No files found</p>
                                    <p className="text-sm mt-1">
                                        {searchQuery ? "Try adjusting your search terms" : "Create a new file or folder to get started"}
                                    </p>
                                    {!searchQuery && (
                                        <Button className="mt-4 gap-2" onClick={openCreateFileModal}>
                                            <Plus className="w-4 h-4" /> Create New
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <FileExplorerPagination />
        </div>
    );
};
