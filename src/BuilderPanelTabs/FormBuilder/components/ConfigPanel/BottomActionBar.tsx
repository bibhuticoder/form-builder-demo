import {
  ArrowUturnRightIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";
import { FormSettingsTrigger } from "../FormSettings/FormSettingsTrigger";
import { useFormBuilder } from "../../context";

/**
 * ElementPaletteBottomActionsBar
 *
 * Fixed action bar at the bottom of the ElementPalette sidebar.
 * Provides quick access to form styling settings and undo/redo controls.
 *
 * Layout:
 * - Left side: Form settings/design button
 * - Right side: Undo and redo buttons
 *
 * Styling:
 * - Sticky positioning ensures it stays visible while scrolling element list
 * - Separated from content with top border and distinct background
 */

interface BottomActionBarProps {
  isCollapsed: boolean;
  parent: "element-palette" | "property-editor";
}

export const BottomActionBar: React.FC<BottomActionBarProps> = ({ isCollapsed, parent }) => {
  const { undo, redo, canUndo, canRedo } = useFormBuilder();

  return (
    <div className="sticky bottom-0 z-10 p-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className={`flex flex-${isCollapsed && parent === "element-palette" ? "col gap-4" : "row"} justify-between items-center`}>
        {/* Left section: Form settings/styling configuration trigger */}
        <FormSettingsTrigger />

        {/* Right section: Undo/Redo history controls */}
        <div className={`flex flex-${isCollapsed && parent === "element-palette" ? "col gap-4" : "row gap-4"} justify-between`}>
          {/* Undo button - reverts last action */}
          <ArrowUturnLeftIcon
            onClick={undo}
            className={`w-4 h-4 transition-colors ${canUndo
              ? "text-gray-400 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white"
              : "text-gray-200 dark:text-gray-700 cursor-not-allowed"
              }`}
            title="Undo"
          />

          {/* Redo button - reapplies undone action */}
          <ArrowUturnRightIcon
            onClick={redo}
            className={`w-4 h-4 transition-colors ${canRedo
              ? "text-gray-400 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white"
              : "text-gray-200 dark:text-gray-700 cursor-not-allowed"
              }`}
            title="Redo"
          />
        </div>
      </div>
    </div>
  );
};
