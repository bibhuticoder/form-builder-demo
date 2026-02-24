import React from 'react';
import { EllipsisHorizontalIcon as MoreHorizontal } from '@heroicons/react/24/outline';
import { Button } from '@/components/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/dropdown-menu';
import { TableRow, TableCell } from '@/components/table';


export interface RowAction {
    icon: React.ReactNode;
    label: React.ReactNode;
    className?: string;
    onClick: (e: React.MouseEvent) => void;
}

interface BaseExplorerRowProps {
    onClick: () => void;
    icon: React.ReactNode;
    nameNode: React.ReactNode;
    pathNode?: React.ReactNode;
    statusNode?: React.ReactNode;
    dateNode?: React.ReactNode;
    actions: RowAction[];
}

export const BaseExplorerRow: React.FC<BaseExplorerRowProps> = ({
    onClick,
    icon,
    nameNode,
    pathNode,
    statusNode,
    dateNode,
    actions
}) => {
    return (
        <TableRow className="group cursor-pointer hover:bg-slate-50/50 dark:hover:bg-gray-800 border-slate-200 dark:border-gray-700" onClick={onClick}>
            <TableCell>
                {icon}
            </TableCell>
            <TableCell className="font-medium text-slate-900 dark:text-gray-100">
                {nameNode}
            </TableCell>

            {pathNode !== undefined && (
                <TableCell className="text-slate-500 dark:text-gray-400 text-sm">
                    {pathNode}
                </TableCell>
            )}

            <TableCell>
                {statusNode}
            </TableCell>
            <TableCell className="text-slate-500 dark:text-gray-400 text-sm whitespace-nowrap">
                {dateNode}
            </TableCell>

            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <div className="inline-block relative">
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {actions.map((action, index) => (
                            <DropdownMenuItem
                                key={index}
                                className={action.className}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick(e);
                                }}
                            >
                                {action.icon}
                                <span className={action.icon ? "ml-2" : ""}>{action.label}</span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
};
