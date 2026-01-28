import type { ScreenSize } from './types/canvas'

export const SCREEN_SIZES: ScreenSize[] = [
  { id: "xs", label: "XS", width: 375, title: "Mobile (375px)" },
  { id: "sm", label: "SM", width: 640, title: "SM (640px)" },
  { id: "md", label: "MD", width: 768, title: "MD (768px)" },
  { id: "lg", label: "LG", width: 1024, title: "LG (1024px)" },
  { id: "xl", label: "XL", width: 1280, title: "XL (1280px)" },
  { id: "2xl", label: "2XL", width: 1536, title: "2XL (1536px)" },
]

export const MIN_CANVAS_WIDTH = SCREEN_SIZES[0].width
export const MAX_CANVAS_WIDTH = SCREEN_SIZES[SCREEN_SIZES.length - 1].width
