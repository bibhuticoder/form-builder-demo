import React from "react";

import BuilderHeading from "../components/EmailRenderer/elements/BuilderHeading";
import BuilderText from "../components/EmailRenderer/elements/BuilderText";
import BuilderImage from "../components/EmailRenderer/elements/BuilderImage";
import BuilderVideo from "../components/EmailRenderer/elements/BuilderVideo";
import BuilderButton from "../components/EmailRenderer/elements/BuilderButton";
import BuilderColumns from "../components/EmailRenderer/elements/BuilderColumns";
import BuilderDivider from "../components/EmailRenderer/elements/BuilderDivider";
import BuilderSpacer from "../components/EmailRenderer/elements/BuilderSpacer";
import BuilderHtml from "../components/EmailRenderer/elements/BuilderHtml";
import BuilderDiscountCode from "../components/EmailRenderer/elements/BuilderDiscountCode";
import BuilderMenu from "../components/EmailRenderer/elements/BuilderMenu";
import BuilderSocialLinks from "../components/EmailRenderer/elements/BuilderSocialLinks";
import { EmailBlock } from "../types";

export interface BlockComponentProps {
  block: EmailBlock;
  isSelected?: boolean;
  activeSubElement?: string | null;
  selectedBlockId?: string | null;
  onSelectBlock?: (id: string) => void;
}

export const blockRegistry: Record<EmailBlock["type"], React.FC<BlockComponentProps>> = {
  heading: BuilderHeading as React.FC<BlockComponentProps>,
  text: BuilderText as React.FC<BlockComponentProps>,
  image: BuilderImage as React.FC<BlockComponentProps>,
  video: BuilderVideo as React.FC<BlockComponentProps>,
  button: BuilderButton as React.FC<BlockComponentProps>,
  columns: BuilderColumns as React.FC<BlockComponentProps>,
  divider: BuilderDivider as React.FC<BlockComponentProps>,
  spacer: BuilderSpacer as React.FC<BlockComponentProps>,
  html: BuilderHtml as React.FC<BlockComponentProps>,
  discount_code: BuilderDiscountCode as React.FC<BlockComponentProps>,
  menu: BuilderMenu as React.FC<BlockComponentProps>,
  social_links: BuilderSocialLinks as React.FC<BlockComponentProps>,
};
