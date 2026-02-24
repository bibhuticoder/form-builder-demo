import mockDataRaw from './automations.json';
import { Folder, FileItem, FileType } from '../FileExplorer/types';

export const mockFolders: Folder[] = [];
export const mockFiles: FileItem[] = [];

const processNode = (node: any, parentId: string | null = null) => {
    if (node.type === 'folder') {
        mockFolders.push({
            id: node.id,
            name: node.name,
            parentId
        });
        if (node.children) {
            node.children.forEach((child: any) => processNode(child, node.id));
        }
    } else {
        mockFiles.push({
            id: node.id,
            name: node.name,
            type: node.type as FileType,
            status: node.status || 'inactive',
            lastUpdated: node.lastUpdated || 'Just now',
            folderId: parentId
        });
    }
};

// @ts-ignore
mockDataRaw.forEach((node: any) => processNode(node, null));
