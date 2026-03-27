import { EmailBlock, EmailBlockType, ColumnsBlock } from "../types";

/**
 * Finds a block by ID within a list of blocks, including nested blocks (e.g., in columns).
 */
export const findBlockById = (blocks: EmailBlock[], id: string): EmailBlock | undefined => {
    for (const block of blocks) {
        if (block.id === id) return block;

        if (block.type === EmailBlockType.COLUMNS) {
            const columnsBlock = block as ColumnsBlock;
            for (const column of columnsBlock.columns || []) {
                const found = findBlockById(column.blocks || [], id);
                if (found) return found;
            }
        }
    }
    return undefined;
};
