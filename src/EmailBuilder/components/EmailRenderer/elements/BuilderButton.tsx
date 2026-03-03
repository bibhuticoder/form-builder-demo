import { ButtonBlock } from "../../../types";
import BuilderBlockWrapper from "./BuilderBlockWrapper";
import { useEmailBuilder } from "../../../context";
import { getBlockContentStyles } from "../../../utils/styleUtils";

interface BuilderButtonProps {
  block: ButtonBlock;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderButton({ block, isSelected, activeSubElement }: Readonly<BuilderButtonProps>) {
  const { activeBreakpoint } = useEmailBuilder();

  return (
    <BuilderBlockWrapper block={block} isSelected={isSelected} activeSubElement={activeSubElement}>
      <div style={{ textAlign: getBlockContentStyles(block.style, activeBreakpoint).textAlign || 'center' }}>
        <button
          type="button"
          style={getBlockContentStyles(block.style, activeBreakpoint)}
          className={`px-6 py-3 bg-primary text-white rounded font-medium text-sm transition-colors focus:outline-none inline-block ${isSelected && activeSubElement === 'content' ? 'ring-1 ring-primary ring-offset-1' : ''}`}
        >
          {block.label}
        </button>
      </div>
    </BuilderBlockWrapper>
  );
}
