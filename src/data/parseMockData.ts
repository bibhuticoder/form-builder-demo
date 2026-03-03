import mockDataRaw from './automations.json';
import formsDataRaw from './forms.json';
import emailsDataRaw from './emails.json';
import { Folder, FileItem, FileType } from '../FileExplorer/types';

export const mockFolders: Folder[] = [];
export const mockFiles: FileItem[] = [];

export const mockFormFolders: Folder[] = [];
export const mockFormFiles: FileItem[] = [];

export const mockEmailFolders: Folder[] = [];
export const mockEmailFiles: FileItem[] = [];

const processNode = (
    node: any,
    targetFolders: Folder[],
    targetFiles: FileItem[],
    parentId: string | null = null
) => {
    if (node.type === 'folder') {
        targetFolders.push({
            id: node.id,
            name: node.name,
            parentId
        });
        if (node.children) {
            node.children.forEach((child: any) => processNode(child, targetFolders, targetFiles, node.id));
        }
    } else {
        targetFiles.push({
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
mockDataRaw.forEach((node: any) => processNode(node, mockFolders, mockFiles, null));
// @ts-ignore
formsDataRaw.forEach((node: any) => processNode(node, mockFormFolders, mockFormFiles, null));
// @ts-ignore
emailsDataRaw.forEach((node: any) => processNode(node, mockEmailFolders, mockEmailFiles, null));
