import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  CursorArrowRaysIcon,
  MinusIcon,
  ViewColumnsIcon,
  CodeBracketIcon,
  TagIcon,
  Bars3Icon,
  ShareIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import { EmailBlockType } from "../../types/enums";
import { IconInput, Card } from "../../../../components";
import { useDraggable } from "@dnd-kit/core";
import type { DragData } from "../../types/dnd";

interface ElementItem {
  type: EmailBlockType;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface ElementGroup {
  title: string;
  items: ElementItem[];
}

const ELEMENT_GROUPS: ElementGroup[] = [
  {
    title: "Content",
    items: [
      { type: EmailBlockType.HEADING, icon: DocumentTextIcon, label: "Heading" },
      { type: EmailBlockType.TEXT, icon: DocumentTextIcon, label: "Text" },
      { type: EmailBlockType.IMAGE, icon: PhotoIcon, label: "Image" },
      { type: EmailBlockType.VIDEO, icon: VideoCameraIcon, label: "Video" },
      { type: EmailBlockType.BUTTON, icon: CursorArrowRaysIcon, label: "Button" },
    ],
  },
  {
    title: "Layout",
    items: [
      { type: EmailBlockType.COLUMNS, icon: ViewColumnsIcon, label: "Columns" },
      { type: EmailBlockType.DIVIDER, icon: MinusIcon, label: "Divider" },
      { type: EmailBlockType.SPACER, icon: ArrowsUpDownIcon, label: "Spacer" },
    ],
  },
  {
    title: "Advanced",
    items: [
      { type: EmailBlockType.HTML, icon: CodeBracketIcon, label: "HTML" },
      { type: EmailBlockType.DISCOUNT_CODE, icon: TagIcon, label: "Discount Code" },
      { type: EmailBlockType.MENU, icon: Bars3Icon, label: "Menu" },
      { type: EmailBlockType.SOCIAL_LINKS, icon: ShareIcon, label: "Social Links" },
    ],
  },
];

const DraggableElementCard: React.FC<{ item: ElementItem; isMinimized?: boolean }> = ({ item, isMinimized }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${item.type}-${item.label}`,
    data: {
      kind: "palette-block",
      blockType: item.type,
      label: item.label,
    } as DragData,
  });

  if (isMinimized) {
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-grab active:cursor-grabbing transition-colors duration-200 group flex justify-center"
        title={item.label}
      >
        <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
      </div>
    );
  }

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card className="!p-2 border border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary transition-colors shadow-none" aria-label={item.label}>
        <div className="flex flex-col items-center justify-center gap-1 p-2 group cursor-grab select-none">
          <item.icon className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-primary transition-colors" />
          <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary text-center transition-colors leading-tight">
            {item.label}
          </span>
        </div>
      </Card>
    </div>
  );
};

interface ElementPaletteProps {
  isCollapsed: boolean;
}

export const ElementPalette: React.FC<ElementPaletteProps> = ({ isCollapsed }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroups = ELEMENT_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-transparent">
      {!isCollapsed ? (
        <>
          <div className="p-2 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <IconInput
              icon={<MagnifyingGlassIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Blocks..."
              containerStyles="!bg-gray-50 dark:!bg-gray-900 !min-h-[2.25rem] !rounded-md"
              inputStyles="!text-sm !bg-transparent !text-gray-900 dark:!text-white placeholder:!text-gray-400 dark:placeholder:!text-gray-500 focus:!ring-1"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-2 scrollbar-hide-hover">
            <div className="space-y-8 p-2 pb-4">
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group, idx) => (
                  <div key={idx}>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-1">{group.title}</h3>
                    <div className="grid grid-cols-2 gap-1.5">
                      {group.items.map((item, index) => (
                        <DraggableElementCard key={item.type + index} item={item} />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                  <MagnifyingGlassIcon className="w-8 h-8 mb-2 text-gray-400 dark:text-gray-500" />
                  <p className="text-sm">No elements found</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto flex flex-col items-center gap-4 py-4 scrollbar-hide-hover">
          {ELEMENT_GROUPS.map((group, idx) => (
            <div key={idx} className="w-full flex flex-col items-center gap-2">
              <div className="w-full flex justify-center py-4 border-b border-gray-200 dark:border-gray-700">
                <span className="text-[9px] font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase [writing-mode:vertical-rl] rotate-180 whitespace-nowrap">
                  {group.title}
                </span>
              </div>
              {group.items.map((item, index) => (
                <DraggableElementCard key={item.type + index} item={item} isMinimized={true} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
