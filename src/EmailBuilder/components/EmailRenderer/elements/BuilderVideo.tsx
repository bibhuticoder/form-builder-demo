import { VideoBlock } from "../../../types";
import BuilderBlockWrapper from "./BuilderBlockWrapper";
import { useEmailBuilder } from "../../../context";
import { VideoCameraIcon } from "@heroicons/react/24/outline";

interface BuilderVideoProps {
  block: VideoBlock;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderVideo({ block, isSelected, activeSubElement }: Readonly<BuilderVideoProps>) {
  const { activeBreakpoint: _activeBreakpoint } = useEmailBuilder();

  const getEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return null;
  };

  const embedUrl = getEmbedUrl(block.url);

  return (
    <BuilderBlockWrapper block={block} isSelected={isSelected} activeSubElement={activeSubElement}>
      {embedUrl ? (
        <div className="relative">
          <iframe
            src={embedUrl}
            className="w-full aspect-video"
            allowFullScreen
            title={block.alt || "Video"}
          />
          <div className="absolute inset-0" />
        </div>
      ) : (
        <div className={`w-full h-40 bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center rounded ${isSelected && activeSubElement === 'content' ? 'ring-1 ring-primary ring-offset-1' : ''}`}>
          <VideoCameraIcon className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-2" />
          <span className="text-xs text-gray-500 dark:text-gray-400">Add a video URL</span>
        </div>
      )}
    </BuilderBlockWrapper>
  );
}
