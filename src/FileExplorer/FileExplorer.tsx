import React, { useState } from 'react';
import { FileExplorerProvider } from './context/FileExplorerContext';
import { FileExplorerHeader } from './components/FileExplorerHeader';
import { FileExplorerToolbar } from './components/FileExplorerToolbar';
import { FileExplorerTable } from './components/FileExplorerTable';
import { FileExplorerModals } from './components/FileExplorerModals';
import { Folder, FileItem } from './types';

interface FileExplorerProps {
    title: string;
    createButtonText: string;
    initialFolders?: Folder[];
    initialFiles?: FileItem[];
    onCreateFile: () => void;
}

const FileExplorerContent: React.FC<FileExplorerProps> = ({ title, createButtonText, onCreateFile }) => {
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [isRenameFolderOpen, setIsRenameFolderOpen] = useState(false);
    const [isMoveFolderModalOpen, setIsMoveFolderModalOpen] = useState(false);
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 flex-col">
            <FileExplorerHeader
                title={title}
                createButtonText={createButtonText}
                openCreateFileModal={onCreateFile}
            />

            <main className="flex-1 px-6 py-6 max-w-7xl mx-auto w-full">
                <FileExplorerToolbar
                    openCreateFolderModal={() => setIsCreateFolderOpen(true)}
                />

                <FileExplorerTable
                    openRenameModal={() => setIsRenameFolderOpen(true)}
                    openFolderMoveModal={() => setIsMoveFolderModalOpen(true)}
                    openFileMoveModal={() => setIsMoveModalOpen(true)}
                    openCreateFileModal={onCreateFile}
                />
            </main>

            <FileExplorerModals
                isCreateFolderOpen={isCreateFolderOpen}
                setIsCreateFolderOpen={setIsCreateFolderOpen}
                isRenameFolderOpen={isRenameFolderOpen}
                setIsRenameFolderOpen={setIsRenameFolderOpen}
                isMoveFolderModalOpen={isMoveFolderModalOpen}
                setIsMoveFolderModalOpen={setIsMoveFolderModalOpen}
                isMoveModalOpen={isMoveModalOpen}
                setIsMoveModalOpen={setIsMoveModalOpen}
            />
        </div>
    );
};

export const FileExplorer: React.FC<FileExplorerProps> = (props) => {
    return (
        <FileExplorerProvider initialFolders={props.initialFolders} initialFiles={props.initialFiles}>
            <FileExplorerContent {...props} />
        </FileExplorerProvider>
    );
};

export default FileExplorer;
