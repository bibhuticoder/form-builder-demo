import React from "react";
import { Button, Card } from "@/components";
import { EMAIL_SCREEN_SIZES } from "../../constants";

export interface CanvasToolbarProps {
  canvasWidth: number;
  onCanvasWidthChange: (width: number) => void;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ canvasWidth, onCanvasWidthChange }) => {
  const activeDevice = canvasWidth <= EMAIL_SCREEN_SIZES[0].width ? "mobile" : "desktop";

  return (
    <div className="flex justify-center shrink-0">
      <div className="flex items-center gap-4">
        <Card className="flex items-center gap-2 !p-1.5 rounded">
          {EMAIL_SCREEN_SIZES.map((size) => (
            <Button
              key={size.id}
              variant={activeDevice === size.id ? "primary" : "secondary"}
              className="!p-1 !px-3 text-xs rounded-md flex items-center justify-center"
              onClick={() => onCanvasWidthChange(size.width)}
              title={size.title}
            >
              {size.label}
            </Button>
          ))}
        </Card>

        <Card className="px-4 py-1">
          <span className="text-xs font-medium text-gray-900 dark:text-white">{Math.round(canvasWidth)}px</span>
        </Card>
      </div>
    </div>
  );
};
