import { MenuBlock } from "../../../types";
import BuilderBlockWrapper from "./BuilderBlockWrapper";
import { getBlockContentStyles } from "../../../utils/styleUtils";
import { useEmailBuilder } from "../../../context";

interface BuilderMenuProps {
  block: MenuBlock;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderMenu({ block, isSelected, activeSubElement }: Readonly<BuilderMenuProps>) {
  const { activeBreakpoint } = useEmailBuilder();

  return (
    <BuilderBlockWrapper block={block} isSelected={isSelected} activeSubElement={activeSubElement}>
      <nav className={`flex items-center justify-center gap-4 flex-wrap ${isSelected && activeSubElement === 'content' ? 'ring-1 ring-primary ring-offset-1 rounded px-1' : ''}`}>
        {block.items.map((item) => (
          <span
            key={item.id}
            className="text-sm text-primary hover:underline cursor-pointer"
            style={getBlockContentStyles(block.style, activeBreakpoint)}
          >
            {item.label}
          </span>
        ))}
      </nav>
    </BuilderBlockWrapper>
  );
}
