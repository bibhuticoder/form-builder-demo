import React from "react";
import {
    ArrowRightCircleIcon,
    ChatBubbleBottomCenterTextIcon,
    NoSymbolIcon,
    EyeIcon
} from "@heroicons/react/24/outline";
import { LogicTypeCard } from "./LogicTypeCard";

interface LogicTypeSelectionProps {
    onSelect: (type: 'redirect' | 'message' | 'disqualify' | 'visibility') => void;
}

export const LogicTypeSelection: React.FC<LogicTypeSelectionProps> = ({ onSelect }) => {
    return (
        <div className="grid grid-cols-2 gap-3">
            {/* Custom Message */}
            <LogicTypeCard
                title="Custom Message"
                description="Show a custom success message."
                icon={<ChatBubbleBottomCenterTextIcon />}
                onClick={() => onSelect('message')}
                colorClass="text-green-600 dark:text-green-400"
                bgClass="bg-green-50 dark:bg-green-900/30"
                hoverBorderClass="green-500"
                hoverBgClass="green-50/10 dark:hover:bg-green-900/20"
                hoverIconBgClass="green-100 dark:group-hover:bg-green-900/50"
            />

            {/* Page Redirect */}
            <LogicTypeCard
                title="Page Redirect"
                description="Redirect users after submission."
                icon={<ArrowRightCircleIcon />}
                onClick={() => onSelect('redirect')}
                colorClass="text-blue-600 dark:text-blue-400"
                bgClass="bg-blue-50 dark:bg-blue-900/30"
                hoverBorderClass="blue-500"
                hoverBgClass="blue-50/10 dark:hover:bg-blue-900/20"
                hoverIconBgClass="blue-100 dark:group-hover:bg-blue-900/50"
            />

            {/* Conditional Visibility */}
            <LogicTypeCard
                title="Conditional Visibility"
                description="Show or hide fields based on input."
                icon={<EyeIcon />}
                onClick={() => onSelect('visibility')}
                colorClass="text-purple-600 dark:text-purple-400"
                bgClass="bg-purple-50 dark:bg-purple-900/30"
                hoverBorderClass="purple-500"
                hoverBgClass="purple-50/10 dark:hover:bg-purple-900/20"
                hoverIconBgClass="purple-100 dark:group-hover:bg-purple-900/50"
            />

            {/* Filter Submission */}
            <LogicTypeCard
                title="Filter Submission"
                description="Reject submissions based on criteria."
                icon={<NoSymbolIcon />}
                onClick={() => onSelect('disqualify')}
                colorClass="text-red-600 dark:text-red-400"
                bgClass="bg-red-50 dark:bg-red-900/30"
                hoverBorderClass="red-500"
                hoverBgClass="red-50/10 dark:hover:bg-red-900/20"
                hoverIconBgClass="red-100 dark:group-hover:bg-red-900/50"
            />
        </div>
    );
};
