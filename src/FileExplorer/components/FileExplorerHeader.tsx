import React from 'react';
import { PlusIcon as Plus } from '@heroicons/react/24/outline';
import { Button } from '@/components/Button';

interface FileExplorerHeaderProps {
    title: string;
    createButtonText: string;
    openCreateFileModal: () => void;
}

export const FileExplorerHeader: React.FC<FileExplorerHeaderProps> = ({ title, createButtonText, openCreateFileModal }) => {
    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between shrink-0">
            <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {title}
                </h1>
            </div>
            <div className="flex items-center gap-3">
                <Button className="gap-2" onClick={openCreateFileModal}>
                    <Plus className="w-4 h-4" /> {createButtonText}
                </Button>
            </div>
        </header>
    );
};
