import React from 'react';
import { CheckIcon as Check, HomeIcon as Home, FolderIcon as Folder } from '@heroicons/react/24/outline';
import { Dialog } from '@/components/Dialog';
import { Button } from '@/components/Button';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { ScrollArea } from '@/components/scroll-area';
import { cn } from '@/lib/utils';
import { useFileExplorerContext } from '../context/FileExplorerContext';
import { getFullPathName, getAllSubfolderIds } from '../utils/helpers';

interface FileExplorerModalsProps {
    isCreateFolderOpen: boolean;
    setIsCreateFolderOpen: (o: boolean) => void;
    isRenameFolderOpen: boolean;
    setIsRenameFolderOpen: (o: boolean) => void;
    isMoveFolderModalOpen: boolean;
    setIsMoveFolderModalOpen: (o: boolean) => void;
    isMoveModalOpen: boolean;
    setIsMoveModalOpen: (o: boolean) => void;
}

export const FileExplorerModals: React.FC<FileExplorerModalsProps> = ({
    isCreateFolderOpen, setIsCreateFolderOpen,
    isRenameFolderOpen, setIsRenameFolderOpen,
    isMoveFolderModalOpen, setIsMoveFolderModalOpen,
    isMoveModalOpen, setIsMoveModalOpen
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
        handleMoveFile
    } = useFileExplorerContext();

    const createFolderBody = (
        <div className="py-4">
            <Label className="text-gray-700 dark:text-gray-300">Folder Name</Label>
            <Input
                value={newFolderName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFolderName(e.target.value)}
                placeholder="e.g. Q1 Marketing Campaigns"
                className="mt-2 text-gray-900 bg-white placeholder:text-gray-400 dark:text-white dark:bg-gray-800 dark:border-gray-700 dark:placeholder:text-gray-500 focus-visible:ring-primary focus-visible:border-primary"
            />
        </div>
    );
    const createFolderFooter = (
        <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsCreateFolderOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => handleCreateFolder(() => setIsCreateFolderOpen(false))}>Create Folder</Button>
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
            <Button variant="outline" size="sm" onClick={() => setIsRenameFolderOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => handleRenameFolder(() => setIsRenameFolderOpen(false))}>Save Changes</Button>
        </div>
    );

    const moveFolderBody = (
        <div className="py-4">
            <ScrollArea className="h-[300px] border border-gray-200 dark:border-gray-700 rounded-md p-2 bg-slate-50 dark:bg-gray-800/50">
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start font-normal dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white",
                            targetMoveFolderId === null && "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary font-medium"
                        )}
                        onClick={() => setTargetMoveFolderId(null)}
                    >
                        <Home className="mr-2 h-4 w-4 shrink-0" /> All Folders (Root)
                        {targetMoveFolderId === null && <Check className="ml-auto h-4 w-4 shrink-0" />}
                    </Button>
                    {folders.map(folder => {
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
                                    "w-full justify-start font-normal text-sm dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
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
    const moveFolderFooter = (
        <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsMoveFolderModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => handleMoveFolder(() => setIsMoveFolderModalOpen(false))} disabled={targetMoveFolderId === undefined}>Move Folder Here</Button>
        </div>
    );

    const moveFileBody = (
        <div className="py-4">
            <ScrollArea className="h-[300px] border border-gray-200 dark:border-gray-700 rounded-md p-2 bg-slate-50 dark:bg-gray-800/50">
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start font-normal dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white",
                            targetMoveFolderId === null && "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary font-medium"
                        )}
                        onClick={() => setTargetMoveFolderId(null)}
                    >
                        <Home className="mr-2 h-4 w-4 shrink-0" /> All Files (Root)
                        {targetMoveFolderId === null && <Check className="ml-auto h-4 w-4 shrink-0" />}
                    </Button>
                    {folders.map(folder => {
                        const path = getFullPathName(folder.id, folders);
                        return (
                            <Button
                                key={folder.id}
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start font-normal text-sm dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
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
    const moveFileFooter = (
        <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsMoveModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => handleMoveFile(() => setIsMoveModalOpen(false))} disabled={targetMoveFolderId === undefined}>Move Here</Button>
        </div>
    );

    return (
        <>
            <Dialog
                isOpen={isCreateFolderOpen}
                onClose={() => setIsCreateFolderOpen(false)}
                header="Create New Folder"
                subtitle="Create a folder to organize your items."
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
                isOpen={isMoveFolderModalOpen}
                onClose={() => setIsMoveFolderModalOpen(false)}
                header="Move Folder"
                subtitle={
                    <span>
                        Select a destination for folder <strong>{selectedFolderToMove?.name}</strong>
                    </span>
                }
                body={moveFolderBody}
                footer={moveFolderFooter}
            />

            <Dialog
                isOpen={isMoveModalOpen}
                onClose={() => setIsMoveModalOpen(false)}
                header="Move File"
                subtitle={
                    <span>
                        Select a destination folder for <strong>{selectedFile?.name}</strong>
                    </span>
                }
                body={moveFileBody}
                footer={moveFileFooter}
            />
        </>
    );
};

