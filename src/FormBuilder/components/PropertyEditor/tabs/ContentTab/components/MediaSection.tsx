import React from "react";
import { Field, ImageField, VideoField } from "../../../../../types";

interface MediaSectionProps {
    field: Field;
    handleUpdate: (key: string, value: unknown) => void;
}

export const MediaSection: React.FC<MediaSectionProps> = ({ field, handleUpdate }) => {
    if (!["image", "video"].includes(field.type)) return null;

    return (
        <div className="space-y-4 border-y border-gray-200 dark:border-gray-700 py-3 my-2">
            <div className="space-y-1">
                <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Source URL</label>
                <input
                    type="text"
                    value={(field as ImageField | VideoField).url || ""}
                    onChange={(e) => handleUpdate("url", e.target.value)}
                    placeholder={field.type === "video" ? "YouTube, Vimeo, or Loom URL" : "https://example.com/image.jpg"}
                    className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Alt Text</label>
                <input
                    type="text"
                    value={(field as ImageField | VideoField).altText || ""}
                    onChange={(e) => handleUpdate("altText", e.target.value)}
                    placeholder="Descriptive text for accessibility"
                    className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
        </div>
    );
};
