export type Folder = {
    id: string;
    name: string;
    parentId: string | null;
};

export enum FileType {
    Automation = 'automation',
    Form = 'form',
    Email = 'email'
}

export type FileStatusType = 'active' | 'inactive' | 'published' | 'draft' | string;

export type FileItem = {
    id: string;
    name: string;
    folderId: string | null;
    status: FileStatusType;
    lastUpdated: string;
    type: FileType;
};

export type SortConfig = {
    key: keyof FileItem | 'path';
    direction: 'asc' | 'desc';
} | null;

export type ViewMode = 'folder' | 'table';

export type CreateMode = 'scratch' | 'template' | 'ai';

export type DisplayItem = (Folder & { itemType: 'folder' }) | (FileItem & { itemType: 'file' });
