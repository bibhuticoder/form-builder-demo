/**
 * BuilderVideo
 * A React component that renders a video field within a form builder.
 * Supports embedded videos from various sources with optional alt text.
 */

import { VideoField } from "../../../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";

interface BuilderVideoProps {
  field: VideoField;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderVideo({ field, isSelected, activeSubElement }: Readonly<BuilderVideoProps>) {
  // Convert YouTube watch URLs to embed URLs
  const getEmbedUrl = (url: string | undefined) => {
    if (!url) return "";
    
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(field.url);

  return (
    <BuilderFieldWrapper field={field} isSelected={isSelected} activeSubElement={activeSubElement}>
      <div className="space-y-2">
        {field.label && (
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
        )}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
          <iframe
            src={embedUrl}
            title={field.altText || field.label || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={field.style}
          />
          {/* Overlay to prevent iframe interaction in builder */}
          <div className="absolute inset-0 cursor-pointer" />
        </div>
      </div>
    </BuilderFieldWrapper>
  );
}
