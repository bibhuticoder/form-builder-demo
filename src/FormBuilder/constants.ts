import type { ScreenSize } from './types/canvas'

export const BREAKPOINT_IDS = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;
export const BASE_BREAKPOINT_ID = "md";


export const SCREEN_SIZES: ScreenSize[] = [
    { id: BREAKPOINT_IDS[0], label: "XS", width: 375, title: "Mobile (375px)" },
    { id: BREAKPOINT_IDS[1], label: "SM", width: 640, title: "SM (640px)" },
    { id: BREAKPOINT_IDS[2], label: "MD", width: 768, title: "MD (768px)" },
    { id: BREAKPOINT_IDS[3], label: "LG", width: 1024, title: "LG (1024px)" },
    { id: BREAKPOINT_IDS[4], label: "XL", width: 1280, title: "XL (1280px)" },
    { id: BREAKPOINT_IDS[5], label: "2XL", width: 1536, title: "2XL (1536px)" },
]

export const MIN_CANVAS_WIDTH = SCREEN_SIZES[0].width
export const DEF_CANVAS_WIDTH = SCREEN_SIZES[2].width
export const MAX_CANVAS_WIDTH = SCREEN_SIZES[SCREEN_SIZES.length - 1].width

export const DEFAULT_CONFIG = {
    surveyMode: false,
    maxWidth: DEF_CANVAS_WIDTH,
    maxWidthUnit: "px" as "%" | "px",
    maxHeight: "Auto",
    maxHeightUnit: "Auto" as "px" | "Auto",
    bodyFont: "Inter",
    titleFont: "Inter",
    marginTop: 0,
    marginBottom: 0,
    marginRight: 0,
    marginLeft: 0,
    paddingTop: 48,
    paddingBottom: 48,
    paddingRight: 48,
    paddingLeft: 48,
    backgroundColor: "#FFFFFF",
    backgroundImageUrl: "",
    backgroundRepeat: "No Repeat" as "No Repeat" | "Repeat" | "Repeat X" | "Repeat Y",
    backgroundAttachment: "Scroll" as "Scroll" | "Fixed",
    backgroundPosition: "Center" as "Center" | "Top" | "Bottom" | "Left" | "Right",
    backgroundSize: "Cover" as "Auto" | "Cover" | "Contain",
    borderStyle: "Solid" as "Solid" | "Dashed" | "Dotted" | "Double" | "None",
    borderSize: 1,
    borderColor: "#E5E5E5",
    borderRadiusTop: 12,
    borderRadiusBottom: 12,
    borderRadiusRight: 12,
    borderRadiusLeft: 12,

    // Text Styling Defaults
    helpFontSize: 9,
    helpFontSizeUnit: "px" as "px",
    helpColor: "#6b7280", // gray-500
};
