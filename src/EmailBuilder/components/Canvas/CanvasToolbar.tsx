import React from "react";
import { Button, Card } from "@/components";
import { ComputerDesktopIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import { EMAIL_SCREEN_SIZES } from "../../constants";

export interface CanvasToolbarProps {
  canvasWidth: number;
  onCanvasWidthChange: (width: number) => void;
}

const DEVICE_ICONS: Record<string, React.ReactNode> = {
  mobile: <DevicePhoneMobileIcon className="w-4 h-4" />,
  desktop: <ComputerDesktopIcon className="w-4 h-4" />,
};

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ canvasWidth, onCanvasWidthChange }) => {
  const activeDevice = canvasWidth <= EMAIL_SCREEN_SIZES[0].width ? "mobile" : "desktop";

  return (
    <div className="flex justify-center shrink-0 pt-1">
      <div className="flex items-center gap-3">
        {/* Device toggle buttons */}
        <Card className="flex items-center gap-1 !p-1 rounded">
          {EMAIL_SCREEN_SIZES.map((size) => (
            <Button
              key={size.id}
              variant={activeDevice === size.id ? "primary" : "ghost"}
              className={`h-7 w-7 !p-0 flex items-center justify-center rounded ${activeDevice === size.id ? "" : "text-gray-500 dark:text-gray-400"}`}
              onClick={() => onCanvasWidthChange(size.width)}
              title={size.title}
            >
              {DEVICE_ICONS[size.id]}
            </Button>
          ))}
        </Card>

        {/* Width display */}
        <Card className="px-3 py-1">
          <span className="text-xs font-medium text-gray-900 dark:text-white">{Math.round(canvasWidth)}px</span>
        </Card>
      </div>
    </div>
  );
};
