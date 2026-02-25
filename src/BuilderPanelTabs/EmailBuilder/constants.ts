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
  contentBackgroundColor: '#ffffff',
  paddingTop: 20,
  paddingBottom: 20,
  paddingRight: 20,
  paddingLeft: 20,
  borderStyle: 'none',
  borderWidth: 0,
  borderColor: '#E5E5E5',
  borderRadius: 0,
};
