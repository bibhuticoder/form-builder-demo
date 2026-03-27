import {
    ArrowUturnRightIcon,
    ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";
import { EmailSettingsTrigger } from "../EmailSettings/EmailSettingsTrigger";
import { useEmailBuilder } from "../../context";

interface BottomActionBarProps {
    isCollapsed: boolean;
    parent: "element-palette" | "property-editor";
}

export const BottomActionBar: React.FC<BottomActionBarProps> = ({ isCollapsed, parent }) => {
    const { undo, redo, canUndo, canRedo } = useEmailBuilder();

    return (
        <div className="sticky bottom-0 z-10 p-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className={`flex flex-${isCollapsed && parent === "element-palette" ? "col gap-4" : "row"} justify-between items-center`}>
                <EmailSettingsTrigger />

                <div className={`flex flex-${isCollapsed && parent === "element-palette" ? "col gap-4" : "row gap-4"} justify-between`}>
                    <ArrowUturnLeftIcon
                        onClick={undo}
                        data-testid="undo-icon"
                        className={`w-4 h-4 transition-colors ${canUndo
                            ? "text-gray-400 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                            : "text-gray-200 dark:text-gray-700 cursor-not-allowed"
                            }`}
                        title="Undo"
                    />

                    <ArrowUturnRightIcon
                        onClick={redo}
                        data-testid="redo-icon"
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
