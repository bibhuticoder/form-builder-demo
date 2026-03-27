import { findBlockById } from "../blockUtils";
import { EmailBlock, EmailBlockType, ColumnsBlock } from "../../types";

describe("blockUtils", () => {
  describe("findBlockById", () => {
    const mockBlocks: EmailBlock[] = [
      {
        id: "block-1",
        type: EmailBlockType.HEADING,
        style: {},
        headingLevel: "h1",
        content: "Heading 1",
      },
      {
        id: "block-2",
        type: EmailBlockType.COLUMNS,
        style: {},
        columns: [
          {
            id: "col-1",
            width: "50%",
            blocks: [
              {
                id: "block-2-1",
                type: EmailBlockType.TEXT,
                style: {},
                content: "Nested Text",
              },
            ],
          },
          {
            id: "col-2",
            width: "50%",
            blocks: [],
          },
        ],
      } as ColumnsBlock,
      {
        id: "block-3",
        type: EmailBlockType.IMAGE,
        style: {},
        src: "test.jpg",
      },
    ];

    it("should find a block at the root level", () => {
      const result = findBlockById(mockBlocks, "block-1");
      expect(result).toBeDefined();
      expect(result?.id).toBe("block-1");
      expect(result?.type).toBe(EmailBlockType.HEADING);
    });

    it("should find a nested block inside columns", () => {
      const result = findBlockById(mockBlocks, "block-2-1");
      expect(result).toBeDefined();
      expect(result?.id).toBe("block-2-1");
      expect(result?.type).toBe(EmailBlockType.TEXT);
    });

    it("should return undefined for a non-existent ID", () => {
      const result = findBlockById(mockBlocks, "non-existent");
      expect(result).toBeUndefined();
    });

    it("should return undefined for an empty block list", () => {
      const result = findBlockById([], "block-1");
      expect(result).toBeUndefined();
    });

    it("should handle columns with no blocks", () => {
      const result = findBlockById(mockBlocks, "some-id-in-empty-col");
      expect(result).toBeUndefined();
    });

    it("should find the columns block itself", () => {
        const result = findBlockById(mockBlocks, "block-2");
        expect(result).toBeDefined();
        expect(result?.id).toBe("block-2");
        expect(result?.type).toBe(EmailBlockType.COLUMNS);
    });
  });
});
