import React, { useState } from "react";
import "./ElementPalette.css";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  HashtagIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  PlusCircleIcon,
  CalendarIcon,
  ClockIcon,
  ArrowUpTrayIcon,
  CursorArrowRaysIcon,
  PhotoIcon,
  VideoCameraIcon,
  MinusIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import { FieldType } from "../../types/enums";
import { IconInput, Card } from "../../../../components";
import { useDraggable } from "@dnd-kit/core";
import type { DragData } from "../../types/dnd";
// import { ElementPaletteBottomActionsBar } from "../ConfigPanel/ElementPaletteBottomActionsBar";

interface ElementItem {
  type: FieldType;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface ElementGroup {
  title: string;
  items: ElementItem[];
}

const ELEMENT_GROUPS: ElementGroup[] = [
  {
    title: "Contact Fields",
    items: [
      { type: FieldType.TEXT, icon: UserIcon, label: "First Name" },
      { type: FieldType.TEXT, icon: UserIcon, label: "Last Name" },
      { type: FieldType.EMAIL, icon: EnvelopeIcon, label: "Email Address" },
      { type: FieldType.PHONE, icon: PhoneIcon, label: "Phone Number" },
      {
        type: FieldType.TEXT,
        icon: BuildingOfficeIcon,
        label: "Business Name",
      },
      { type: FieldType.TEXT, icon: MapPinIcon, label: "Address" },
      { type: FieldType.TEXT, icon: MapPinIcon, label: "City" },
      { type: FieldType.TEXT, icon: MapPinIcon, label: "State" },
      { type: FieldType.TEXT, icon: HashtagIcon, label: "Zip Code" },
      { type: FieldType.URL, icon: GlobeAltIcon, label: "Website" },
    ],
  },
  {
    title: "Custom Fields",
    items: [
      { type: FieldType.TEXT, icon: DocumentTextIcon, label: "Text Input" },
      { type: FieldType.TEXTAREA, icon: DocumentTextIcon, label: "Text Area" },
      { type: FieldType.NUMBER, icon: HashtagIcon, label: "Number" },
      { type: FieldType.CHECKBOX, icon: CheckCircleIcon, label: "Checkbox" },
      { type: FieldType.RADIO, icon: PlusCircleIcon, label: "Radio Button" },
      { type: FieldType.DROPDOWN, icon: DocumentTextIcon, label: "Dropdown" },
      { type: FieldType.DATE, icon: CalendarIcon, label: "Date Picker" },
      { type: FieldType.TIME, icon: ClockIcon, label: "Time Picker" },
      { type: FieldType.UPLOAD, icon: ArrowUpTrayIcon, label: "File Upload" },
      { type: FieldType.BUTTON, icon: CursorArrowRaysIcon, label: "Button" },
    ],
  },
  {
    title: "Layout & Media",
    items: [
      { type: FieldType.HEADING, icon: DocumentTextIcon, label: "Heading" },
      { type: FieldType.PARAGRAPH, icon: DocumentTextIcon, label: "Paragraph" },
      { type: FieldType.IMAGE, icon: PhotoIcon, label: "Image" },
      { type: FieldType.VIDEO, icon: VideoCameraIcon, label: "Video" },
      { type: FieldType.DIVIDER, icon: MinusIcon, label: "Divider" },
      { type: FieldType.CAPTCHA, icon: ShieldCheckIcon, label: "Captcha" },
    ],
  },
];

/**
 * Draggable card component for palette elements
 * Wraps field type cards with dnd-kit draggable functionality
 */
const DraggableElementCard: React.FC<{ item: ElementItem }> = ({ item }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${item.type}-${item.label}`,
    // Attach metadata for drop handler to create the correct field type
    data: {
      kind: "palette-field",
      fieldType: item.type,
      label: item.label,
    } as DragData,
  });

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

export const ElementPalette: React.FC<ElementPaletteProps> = ({
  isCollapsed,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroups = ELEMENT_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="flex flex-col max-h-[calc(100vh-120px)]">
      {!isCollapsed ? (
        <>
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <IconInput
              icon={
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Fields..."
              containerStyles="!bg-gray-50 dark:!bg-gray-900 !min-h-[2.25rem] !rounded-md"
              inputStyles="!text-sm !bg-transparent !text-gray-900 dark:!text-white placeholder:!text-gray-400 dark:placeholder:!text-gray-500 focus:!ring-1"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-2 scrollbar-hide-hover">
            <div className="space-y-8 p-2 pb-20">
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group, idx) => (
                  <div key={idx}>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-1">{group.title}</h3>
                    <div className="grid grid-cols-2 gap-1.5">
                      {group.items.map((item, index) => (
                        <DraggableElementCard
                          key={item.type + index}
                          item={item}
                        />
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

              {/*  To compensate for space hidden by BottomActionBar  */}
              <div className="h-16"></div>
            </div>
          </div>

          {/* <ElementPaletteBottomActionsBar /> */}
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
                <div
                  key={item.type + index}
                  className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 group flex justify-center"
                  title={item.label}
                >
                  <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
