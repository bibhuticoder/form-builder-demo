import { HtmlBlock } from "../../../types";
import BuilderBlockWrapper from "./BuilderBlockWrapper";

interface BuilderHtmlProps {
  block: HtmlBlock;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderHtml({ block, isSelected, activeSubElement }: Readonly<BuilderHtmlProps>) {
  return (
    <BuilderBlockWrapper block={block} isSelected={isSelected} activeSubElement={activeSubElement}>
      <div
        className={`text-xs ${isSelected && activeSubElement === 'content' ? 'ring-1 ring-primary ring-offset-1 rounded' : ''}`}
        dangerouslySetInnerHTML={{ __html: block.content }}
      />
    </BuilderBlockWrapper>
  );
}
