import React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { cn } from '@/lib/utils';
import { useFileExplorerContext } from '../context/FileExplorerContext';

export const FileExplorerPagination: React.FC = () => {
    const {
        itemsPerPage,
        setItemsPerPage,
        setCurrentPage,
        currentPage,
        totalPages
    } = useFileExplorerContext();

    return (
        <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800/50">
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <span>Rows per page</span>
                <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value: string) => {
                        setItemsPerPage(Number(value));
                        setCurrentPage(1);
                    }}
                >
                    <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={itemsPerPage} />
                    </SelectTrigger>
                    <SelectContent className="bottom-full mb-1">
                        {[10, 25, 50, 100].map(pageSize => (
                            <SelectItem key={pageSize} value={pageSize.toString()}>
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-end gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <div>
                        Page {currentPage} of {Math.max(1, totalPages)}
                    </div>
                    <Pagination className="w-auto">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
                                    className={cn("cursor-pointer", currentPage === 1 && "pointer-events-none opacity-50")}
                                />
                            </PaginationItem>

                            {Array.from({ length: totalPages }).map((_, i) => {
                                const page = i + 1;
                                if (
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                ) {
                                    return (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                isActive={currentPage === page}
                                                onClick={() => setCurrentPage(page)}
                                                className="cursor-pointer"
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                } else if (
                                    page === currentPage - 2 ||
                                    page === currentPage + 2
                                ) {
                                    return (
                                        <PaginationItem key={page}>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    );
                                }
                                return null;
                            })}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))}
                                    className={cn("cursor-pointer", currentPage === totalPages && "pointer-events-none opacity-50")}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
};
