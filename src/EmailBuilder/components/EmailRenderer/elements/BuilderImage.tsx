import { ImageBlock } from "../../../types";
import BuilderBlockWrapper from "./BuilderBlockWrapper";
import { useEmailBuilder } from "../../../context";
import { PhotoIcon } from "@heroicons/react/24/outline";

interface BuilderImageProps {
  block: ImageBlock;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderImage({ block, isSelected, activeSubElement }: Readonly<BuilderImageProps>) {
  const { activeBreakpoint: _activeBreakpoint } = useEmailBuilder();

  return (
    <BuilderBlockWrapper block={block} isSelected={isSelected} activeSubElement={activeSubElement}>
      {block.src ? (
        <img
          src={block.src}
          alt={block.alt || "Image"}
          className={`w-full h-auto ${isSelected && activeSubElement === 'content' ? 'ring-1 ring-primary ring-offset-1' : ''}`}
          style={{ borderRadius: 'inherit', display: 'block' }}
        />
      ) : (
        <div className={`w-full h-40 bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center rounded ${isSelected && activeSubElement === 'content' ? 'ring-1 ring-primary ring-offset-1' : ''}`}>
          <PhotoIcon className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-2" />
          <span className="text-xs text-gray-500 dark:text-gray-400">Add an image URL</span>
        </div>
      )}
    </BuilderBlockWrapper>
  );
}
