export const EMAIL_BREAKPOINT_IDS = ['mobile', 'desktop'] as const;
export const BASE_EMAIL_BREAKPOINT_ID = 'desktop';

export interface EmailScreenSize {
  id: string;
  label: string;
  width: number;
  title: string;
}

export const EMAIL_SCREEN_SIZES: EmailScreenSize[] = [
  { id: 'mobile', label: 'Mobile', width: 375, title: 'Mobile (375px)' },
  { id: 'desktop', label: 'Desktop', width: 600, title: 'Desktop (600px)' },
];

export const MIN_EMAIL_CANVAS_WIDTH = EMAIL_SCREEN_SIZES[0].width;
export const DEF_EMAIL_CANVAS_WIDTH = EMAIL_SCREEN_SIZES[1].width;
export const MAX_EMAIL_CANVAS_WIDTH = EMAIL_SCREEN_SIZES[1].width;

export const DEFAULT_EMAIL_CONFIG = {
  contentWidth: 600,
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#f4f4f4',
  paddingTop: 20,
  paddingBottom: 20,
  paddingRight: 20,
  paddingLeft: 20,
  borderStyle: 'none',
  borderWidth: 0,
  borderColor: '#E5E5E5',
  borderRadius: 0,
};

export type FontOption = {
  label: string
  value: string
  weights: number[]
}

export const FONT_OPTIONS: FontOption[] = [
  // Classic Sans-Serif: Only 400 and 700 are natively supported.
  { label: "Arial", value: "Arial, 'Helvetica Neue', Helvetica, sans-serif", weights: [400, 700] },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif", weights: [400, 700] },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif", weights: [400, 700] },

  // Classic Serif: Only 400 and 700.
  { label: "Times New Roman", value: "'Times New Roman', Times, Baskerville, Georgia, serif", weights: [400, 700] },
  { label: "Georgia", value: "Georgia, Times, 'Times New Roman', serif", weights: [400, 700] },

  // Monospace: Courier New is strictly 400 and 700.
  { label: "Courier New", value: "'Courier New', Courier, 'Lucida Sans Typewriter', monospace", weights: [400, 700] },

  // Special Cases: Trebuchet and Tahoma. 
  // Trebuchet usually only ships with Regular and Bold. 
  { label: "Trebuchet MS", value: "'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', sans-serif", weights: [400, 700] },

  // Impact is a single-weight font (Heavy). Applying 400 or 700 usually looks the same.
  { label: "Impact", value: "Impact, Charcoal, sans-serif", weights: [400] },

  // Comic Sans: Surprisingly reliable for Regular and Bold.
  { label: "Comic Sans MS", value: "'Comic Sans MS', cursive, sans-serif", weights: [400, 700] },

  // Modern Windows System Font: Supports a broader range of weights.
  // Note: Segoe UI Variable (Win 11) supports more, but these are the standard static weights.
  { label: "Segoe UI", value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", weights: [400, 700] },

  // Modern Cross-Platform Stack: Maps to San Francisco (Apple), Roboto (Android), and Segoe UI (Windows).
  // These are essentially Variable Fonts now and support the full 100-900 spectrum.
  { label: "System Default", value: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
]

export const FONT_WEIGHT_LABELS: Record<number, string> = {
  100: "Thin",
  200: "Extra Light",
  300: "Light",
  350: "Semi Light",
  400: "Normal",
  500: "Medium",
  600: "Semi Bold",
  700: "Bold",
  800: "Extra Bold",
  900: "Black"
}

export const BASE_BLOCK_STYLES = {
  width: "full",
  paddingTop: 10,
  paddingRight: 10,
  paddingBottom: 10,
  paddingLeft: 10,
  fontFamily: FONT_OPTIONS[0].value,
};

export const DEFAULT_HEADING_CONFIG = {
  headingLevel: "h2",
  ...BASE_BLOCK_STYLES,
  fontSize: 30,
  fontSizeUnit: "px",
  fontWeight: "bold",
  color: "#111827",
  lineHeight: 36,
  lineHeightUnit: "px",
};

export const DEFAULT_TEXT_CONFIG = {
  ...BASE_BLOCK_STYLES,
  fontSize: 14,
  fontSizeUnit: "px",
  fontWeight: "normal",
  color: "#333333",
  lineHeight: 21,
  lineHeightUnit: "px",
};

export const DEFAULT_IMAGE_CONFIG = {
  ...BASE_BLOCK_STYLES,
};

export const DEFAULT_VIDEO_CONFIG = {
  ...BASE_BLOCK_STYLES,
};

export const DEFAULT_BUTTON_CONFIG = {
  ...BASE_BLOCK_STYLES,
  fontSize: 16,
  fontSizeUnit: "px",
  fontWeight: "bold",
  color: "#ffffff",
  backgroundColor: "#525df8",
  borderRadius: 4,
  textAlign: "center",
  paddingTop: 12,
  paddingRight: 24,
  paddingBottom: 12,
  paddingLeft: 24,
};

export const DEFAULT_COLUMNS_CONFIG = {
  ...BASE_BLOCK_STYLES,
};

export const DEFAULT_DIVIDER_CONFIG = {
  ...BASE_BLOCK_STYLES,
  borderColor: "#cccccc",
  borderWidth: 1,
  borderStyle: "solid",
};

export const DEFAULT_SPACER_CONFIG = {
  ...BASE_BLOCK_STYLES,
};

export const DEFAULT_HTML_CONFIG = {
  ...BASE_BLOCK_STYLES,
};

export const DEFAULT_DISCOUNT_CODE_CONFIG = {
  ...BASE_BLOCK_STYLES,
};

export const DEFAULT_MENU_CONFIG = {
  ...BASE_BLOCK_STYLES,
};

export const DEFAULT_SOCIAL_LINKS_CONFIG = {
  ...BASE_BLOCK_STYLES,
};
