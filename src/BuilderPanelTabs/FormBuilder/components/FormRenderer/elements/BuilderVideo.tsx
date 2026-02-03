/**
 * BuilderVideo
 * A React component that renders a video field within a form builder.
 * Supports embedded videos from various sources with optional alt text.
 */

import { VideoField } from "../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";

interface BuilderVideoProps {
  field: VideoField;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderVideo({ field, isSelected, activeSubElement }: Readonly<BuilderVideoProps>) {
  const getEmbedUrl = (url: string | undefined): string | null => {
    if (!url) return null;

    // YouTube
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Vimeo
    if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
      // Check if it's a numeric ID to avoid matching other vimeo paths incorrectly
      if (/^\d+$/.test(videoId)) {
        return `https://player.vimeo.com/video/${videoId}`;
      }
    }

    // Loom
    if (url.includes("loom.com/share/")) {
      const videoId = url.split("loom.com/share/")[1]?.split("?")[0];
      return `https://www.loom.com/embed/${videoId}`;
    }

    return url;
  };

  const isDirectFile = (url: string | undefined) => {
    if (!url) return false;
    return /\.(mp4|webm|ogg|mov)$/i.test(url);
  };

  const url = field.url;
  const isDirect = isDirectFile(url);
  const embedUrl = !isDirect ? getEmbedUrl(url) : url;

  return (
    <BuilderFieldWrapper field={field} isSelected={isSelected} activeSubElement={activeSubElement}>
      <div className="space-y-2">
        {field.label && (
          <label className={`block text-sm font-medium text-gray-700 ${isSelected && activeSubElement === 'label' ? 'ring-1 ring-primary ring-offset-1 rounded px-1' : ''}`}>
            {field.label}
          </label>
        )}
        <div className={`relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100 ${isSelected && ['input', 'url'].includes(activeSubElement || '') ? 'ring-1 ring-primary ring-offset-1' : ''}`}>
          {url ? (
            isDirect ? (
              <video
                src={url}
                controls
                className="absolute inset-0 w-full h-full object-cover"
                style={field.style}
              />
            ) : (
              embedUrl && (
                <iframe
                  src={embedUrl}
                  title={field.altText || field.label || "Video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={field.style}
                />
              )
            )
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">
              No Video Source
            </div>
          )}
          {/* Overlay to prevent interaction in builder (only for iframes) */}
          {!isDirect && <div className="absolute inset-0 cursor-pointer" />}
        </div>
      </div>
    </BuilderFieldWrapper>
  );
}
