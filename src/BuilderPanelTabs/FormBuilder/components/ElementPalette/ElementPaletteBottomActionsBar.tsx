import {
  ArrowUturnRightIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";
import { FormSettingsTrigger } from "../FormSettings/FormSettingsTrigger";

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
export const ElementPaletteBottomActionsBar: React.FC = () => {
  return (
    <div className="sticky bottom-0 z-10 p-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex justify-between">
        {/* Left section: Form settings/styling configuration trigger */}
        <div>
          <FormSettingsTrigger />
        </div>

        {/* Right section: Undo/Redo history controls */}
        <div className="flex justify-between">
          {/* Undo button - reverts last action */}
          <ArrowUturnLeftIcon className="w-5 h-5 text-gray-400  dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" />

          {/* Redo button - reapplies undone action */}
          <ArrowUturnRightIcon className="w-5 h-5 text-gray-400 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors ml-4" />
        </div>
      </div>
    </div>
  );
};
