import React, { useState, useEffect } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

interface CanvasResizerProps {
    canvasRef: React.RefObject<HTMLDivElement>;
    onResize: (width: number) => void;
    minWidth: number;
    maxWidth: number;
}

export const CanvasResizer: React.FC<CanvasResizerProps> = ({
    canvasRef,
    onResize,
    minWidth,
    maxWidth,
}) => {
    const [isResizing, setIsResizing] = useState(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing || !canvasRef.current) return;

            const rect = canvasRef.current.getBoundingClientRect();
            const newWidth = e.clientX - rect.left;

            // Set min and max constraints
            if (newWidth >= minWidth && newWidth <= maxWidth) {
                onResize(Math.round(newWidth));
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "ew-resize";
            document.body.style.userSelect = "none";
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };
    }, [isResizing, canvasRef, onResize, minWidth, maxWidth]);

    return (
        <div
            onMouseDown={handleMouseDown}
            className="absolute top-0 -right-3 h-full w-6 cursor-ew-resize flex items-center justify-center z-10 group hover:bg-primary/10 rounded-2xl"
        >
            <EllipsisVerticalIcon className="w-5 h-16 rounded-2xl text-white bg-primary opacity-50 transition-opacity group-hover:opacity-100" />
        </div>
    );
};
