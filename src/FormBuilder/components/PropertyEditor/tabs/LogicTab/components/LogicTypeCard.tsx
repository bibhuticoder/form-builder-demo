import React, { ReactNode } from "react";

interface LogicTypeCardProps {
    title: string;
    description: string;
    icon: ReactNode;
    onClick: () => void;
    colorClass: string;
    bgClass: string;
    hoverBorderClass: string;
    hoverBgClass: string;
    hoverIconBgClass: string;
}

export const LogicTypeCard: React.FC<LogicTypeCardProps> = ({
    title,
    description,
    icon,
    onClick,
    colorClass,
    bgClass,
    hoverBorderClass,
    hoverBgClass,
    hoverIconBgClass
}) => {
    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 cursor-pointer hover:border-${hoverBorderClass} border-transparent ring-1 ring-gray-200 hover:ring-${hoverBorderClass} hover:bg-${hoverBgClass} transition-all group`}
            onClick={onClick}
        >
            <div className="flex gap-3 items-start">
                <div className={`h-8 w-8 rounded-lg ${bgClass} flex items-center justify-center shrink-0 group-hover:bg-${hoverIconBgClass} transition-colors`}>
                    <div className={`h-5 w-5 ${colorClass}`}>
                        {icon}
                    </div>
                </div>
                <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
                </div>
            </div>
        </div>
    );
};
