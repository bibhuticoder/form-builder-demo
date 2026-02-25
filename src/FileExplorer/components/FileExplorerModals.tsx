import React from 'react';
import { CheckIcon as Check, FolderIcon as Folder } from '@heroicons/react/24/outline';
import { HomeIcon as Home } from '@heroicons/react/24/solid';
import { Dialog } from '@/components/Dialog';
import { Button } from '@/components/Button';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { ScrollArea } from '@/components/scroll-area';
import { cn } from '@/lib/utils';
import { useFileExplorerContext } from '../context/FileExplorerContext';
import { getFullPathName, getAllSubfolderIds } from '../utils/helpers';
import { FileType } from '../types';

interface FileExplorerModalsProps {
    isCreateFolderOpen: boolean;
    setIsCreateFolderOpen: (o: boolean) => void;
    isRenameFolderOpen: boolean;
    setIsRenameFolderOpen: (o: boolean) => void;
    isMoveFolderModalOpen: boolean;
    setIsMoveFolderModalOpen: (o: boolean) => void;
    isMoveModalOpen: boolean;
    setIsMoveModalOpen: (o: boolean) => void;
    fileType: FileType;
}

export const FileExplorerModals: React.FC<FileExplorerModalsProps> = ({
    isCreateFolderOpen, setIsCreateFolderOpen,
    isRenameFolderOpen, setIsRenameFolderOpen,
    isMoveFolderModalOpen, setIsMoveFolderModalOpen,
    isMoveModalOpen, setIsMoveModalOpen, fileType
}) => {
    const {
        folders,
        newFolderName, setNewFolderName,
        selectedFolderToMove,
        selectedFile,
        targetMoveFolderId, setTargetMoveFolderId,
        handleCreateFolder,
        handleRenameFolder,
        handleMoveFolder,
        handleMoveFile,
        currentPath
    } = useFileExplorerContext();

    const fullPathStr = currentPath.length > 0 ? `/${currentPath.map(f => f.name).join('/')}/` : '/';
    const MAX_PATH_LENGTH = 20;

    let displayPathStr = fullPathStr;
    if (fullPathStr.length > MAX_PATH_LENGTH) displayPathStr = `/.../${currentPath[currentPath.length - 1].name}/`;

    const createFolderBody = (
        <div className="py-4">
            <Label className="text-gray-700 dark:text-gray-300">Folder Name</Label>
            <div className="flex items-center mt-2 group">
                <div
                    className="flex items-center justify-center pl-3 pr-2 py-[0.54rem] text-xs text-gray-500 bg-slate-50 border border-slate-200 border-r-0 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 rounded-l-md whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px] shrink-0 shadow"
                    title={fullPathStr}
                >
                    <Home className="w-4 h-4 mr-0.5" />
                    {displayPathStr}
                </div>
                <Input
                    value={newFolderName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFolderName(e.target.value)}
                    placeholder="Folder name here"
                    className="rounded-l-none text-gray-900 bg-white placeholder:text-gray-400 dark:text-white dark:bg-gray-900 border-slate-200 dark:border-gray-700 focus-visible:ring-primary focus-visible:border-primary flex-1"
                />
            </div>
        </div>
    );
    const createFolderFooter = (
        <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" className='text-sm' onClick={() => setIsCreateFolderOpen(false)}>Cancel</Button>
            <Button size="sm" className='text-sm' onClick={() => handleCreateFolder(() => setIsCreateFolderOpen(false))}>Create Folder</Button>
        </div>
    );

    const renameFolderBody = (
        <div className="py-4">
            <Label className="text-gray-700 dark:text-gray-300">Folder Name</Label>
            <Input
                value={newFolderName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFolderName(e.target.value)}
                placeholder="Folder Name"
                className="mt-2 text-gray-900 bg-white placeholder:text-gray-400 dark:text-white dark:bg-gray-800 dark:border-gray-700 dark:placeholder:text-gray-500 focus-visible:ring-primary focus-visible:border-primary"
            />
        </div>
    );
    const renameFolderFooter = (
        <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" className='text-sm' onClick={() => setIsRenameFolderOpen(false)}>Cancel</Button>
            <Button size="sm" className='text-sm' onClick={() => handleRenameFolder(() => setIsRenameFolderOpen(false))}>Save Changes</Button>
        </div>
    );

    const isMovingFolder = isMoveFolderModalOpen;

    const moveFileOrFolderBody = (
        <div className="py-4">
            <ScrollArea className="h-[300px] border border-gray-200 dark:border-gray-700 rounded-md p-2 bg-slate-50 dark:bg-gray-800/50">
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full px-2 py-1 justify-start font-normal dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white",
                            targetMoveFolderId === null && "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary font-medium"
                        )}
                        onClick={() => setTargetMoveFolderId(null)}
                    >
                        <Home className="mr-2 h-4 w-4 shrink-0" /> All {fileType}s
                        {targetMoveFolderId === null && <Check className="ml-auto h-4 w-4 shrink-0" />}
                    </Button>
                    {folders.map(folder => {
                        if (isMovingFolder && selectedFolderToMove) {
                            const movingIds = getAllSubfolderIds(selectedFolderToMove.id, folders);
                            if (movingIds.includes(folder.id)) return null;
                        }
                        const path = getFullPathName(folder.id, folders);
                        return (
                            <Button
                                key={folder.id}
                                variant="ghost"
                                className={cn(
                                    "w-full px-2 py-1 justify-start font-normal text-sm dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                                    targetMoveFolderId === folder.id && "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary font-medium"
                                )}
                                onClick={() => setTargetMoveFolderId(folder.id)}
                            >
                                <Folder className="mr-2 h-4 w-4 text-primary fill-primary/10 dark:text-primary dark:fill-primary/20 shrink-0" />
                                <span className="truncate flex-1 text-left" title={path}>{path}</span>
                                {targetMoveFolderId === folder.id && <Check className="ml-2 h-4 w-4 shrink-0" />}
                            </Button>
                        )
                    })}
                </div>
            </ScrollArea>
        </div>
    );
    const moveFileOrFolderFooter = (
        <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" className='text-sm' onClick={() => {
                setIsMoveFolderModalOpen(false);
                setIsMoveModalOpen(false);
            }}>Cancel</Button>
            <Button size="sm" className='text-sm' onClick={() => {
                if (isMovingFolder) {
                    handleMoveFolder(() => setIsMoveFolderModalOpen(false));
                } else {
                    handleMoveFile(() => setIsMoveModalOpen(false));
                }
            }} disabled={targetMoveFolderId === undefined}>Move Here</Button>
        </div>
    );

    return (
        <>
            <Dialog
                isOpen={isCreateFolderOpen}
                onClose={() => setIsCreateFolderOpen(false)}
                header="Create New Folder"
                subtitle={`Create a folder to organize your ${fileType}s.`}
                body={createFolderBody}
                footer={createFolderFooter}
            />

            <Dialog
                isOpen={isRenameFolderOpen}
                onClose={() => setIsRenameFolderOpen(false)}
                header="Rename Folder"
                body={renameFolderBody}
                footer={renameFolderFooter}
            />

            <Dialog
                isOpen={isMoveFolderModalOpen || isMoveModalOpen}
                onClose={() => {
                    setIsMoveFolderModalOpen(false);
                    setIsMoveModalOpen(false);
                }}
                header={isMovingFolder ? "Move Folder" : "Move File"}
                subtitle={
                    <span>
                        Select a destination for <strong>{isMovingFolder ? selectedFolderToMove?.name : selectedFile?.name}</strong>
                    </span>
                }
                body={moveFileOrFolderBody}
                footer={moveFileOrFolderFooter}
            />
        </>
    );
};

