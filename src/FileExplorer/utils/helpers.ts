import { Folder, FileItem } from '../types';

export const getFolderPath = (folderId: string | null, folders: Folder[]): Folder[] => {
    if (!folderId) return [];
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return [];
    return [...getFolderPath(folder.parentId, folders), folder];
};

export const getAllSubfolderIds = (folderId: string, folders: Folder[]): string[] => {
    const children = folders.filter(f => f.parentId === folderId);
    return [folderId, ...children.flatMap(c => getAllSubfolderIds(c.id, folders))];
};

export const getFullPathName = (folderId: string | null, folders: Folder[]): string => {
    if (!folderId) return 'All Automations';
    const path = getFolderPath(folderId, folders);
    return path.map(f => f.name).join(' / ');
};

const timeUnits: Record<string, number> = {
    'just now': 0,
    'hour': 3600 * 1000,
    'hours': 3600 * 1000,
    'day': 24 * 3600 * 1000,
    'days': 24 * 3600 * 1000,
    'week': 7 * 24 * 3600 * 1000,
    'weeks': 7 * 24 * 3600 * 1000,
    'month': 30 * 24 * 3600 * 1000,
    'months': 30 * 24 * 3600 * 1000,
    'year': 365 * 24 * 3600 * 1000,
    'years': 365 * 24 * 3600 * 1000,
};

export const parseRelativeDate = (dateStr: string): number => {
    if (!dateStr) return Number.MAX_SAFE_INTEGER;
    const str = dateStr.toLowerCase().trim();
    if (str === 'just now') return 0;

    const parts = str.split(' ');
    if (parts.length >= 2) {
        const val = parseInt(parts[0], 10);
        const unit = parts[1];
        if (!isNaN(val) && timeUnits[unit] !== undefined) {
            return val * timeUnits[unit];
        }
    }
    return Number.MAX_SAFE_INTEGER;
};

export const getFolderStats = (folderId: string, folders: Folder[], files: FileItem[]) => {
    const subfolderIds = getAllSubfolderIds(folderId, folders);
    const statusCounts: Record<string, number> = {};
    let latestUpdateStr = 'Never';
    let latestUpdateMs = Number.MAX_SAFE_INTEGER;

    files.forEach(file => {
        if (file.folderId && subfolderIds.includes(file.folderId)) {
            const currentStatus = file.status;
            if (!statusCounts[currentStatus]) {
                statusCounts[currentStatus] = 0;
            }
            statusCounts[currentStatus]++;

            const fileMs = parseRelativeDate(file.lastUpdated);
            if (fileMs < latestUpdateMs) {
                latestUpdateMs = fileMs;
                latestUpdateStr = file.lastUpdated;
            }
        }
    });

    return {
        statusCounts,
        latestUpdateStr: latestUpdateMs === Number.MAX_SAFE_INTEGER ? '--' : latestUpdateStr,
        latestUpdateMs
    };
};

export const getStatusVariant = (status: string): 'success' | 'muted' | 'default' => {
    const lowerStatus = status.toLowerCase();
    if (['active', 'published', 'success'].includes(lowerStatus)) {
        return 'success';
    }
    if (['inactive', 'draft', 'archived'].includes(lowerStatus)) {
        return 'muted';
    }
    return 'default';
};
