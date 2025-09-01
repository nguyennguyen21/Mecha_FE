export interface SelectOption {
  value: string;
  label: string;
}

// Border Style Options
export const BORDER_STYLE_OPTIONS: SelectOption[] = [
  { value: "solid", label: "Solid" },
  { value: "dashed", label: "Dashed" },
  { value: "dotted", label: "Dotted" },
  { value: "double", label: "Double" },
  { value: "groove", label: "Groove" },
  { value: "ridge", label: "Ridge" },
  { value: "inset", label: "Inset" },
  { value: "outset", label: "Outset" },
];

// Basic Border Style Options (for simpler cases)
export const BASIC_BORDER_STYLE_OPTIONS: SelectOption[] = [
  { value: "solid", label: "Solid" },
  { value: "dashed", label: "Dashed" },
  { value: "dotted", label: "Dotted" },
  { value: "double", label: "Double" },
];

// Avatar Shape Options
export const AVATAR_SHAPE_OPTIONS: SelectOption[] = [
  { value: "circle", label: "Circle (Tròn)" },
  { value: "square", label: "Square (Vuông)" },
];

// Font Style Options
export const FONT_STYLE_OPTIONS: SelectOption[] = [
  { value: "normal", label: "Normal" },
  { value: "italic", label: "Italic" },
  { value: "oblique", label: "Oblique" },
];

// Font Weight Options
export const FONT_WEIGHT_OPTIONS: SelectOption[] = [
  { value: "300", label: "Light" },
  { value: "400", label: "Normal" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semi Bold" },
  { value: "700", label: "Bold" },
  { value: "800", label: "Extra Bold" },
];

// Basic Font Weight Options (for simpler cases)
export const BASIC_FONT_WEIGHT_OPTIONS: SelectOption[] = [
  { value: "300", label: "Light" },
  { value: "400", label: "Normal" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semi Bold" },
  { value: "700", label: "Bold" },
];

// Text Transform Options
export const TEXT_TRANSFORM_OPTIONS: SelectOption[] = [
  { value: "none", label: "None" },
  { value: "uppercase", label: "UPPERCASE" },
  { value: "lowercase", label: "lowercase" },
  { value: "capitalize", label: "Capitalize" },
];

// Cursor Type Options
export const CURSOR_TYPE_OPTIONS: SelectOption[] = [
  { value: "crosshair", label: "Crosshair" },
  { value: "pointer", label: "Pointer" },
  { value: "move", label: "Move" },
  { value: "text", label: "Text" },
  { value: "wait", label: "Wait" },
  { value: "help", label: "Help" },
  { value: "grab", label: "Grab" },
];

// Object Fit Options
export const OBJECT_FIT_OPTIONS: SelectOption[] = [
  { value: "cover", label: "Cover" },
  { value: "contain", label: "Contain" },
  { value: "fill", label: "Fill" },
  { value: "scale-down", label: "Scale Down" },
  { value: "none", label: "None" },
];

// Extended Cursor Options (có thể thêm sau)
export const EXTENDED_CURSOR_OPTIONS: SelectOption[] = [
  ...CURSOR_TYPE_OPTIONS,
  { value: "copy", label: "Copy" },
  { value: "zoom-in", label: "Zoom In" },
  { value: "zoom-out", label: "Zoom Out" },
  { value: "not-allowed", label: "Not Allowed" },
];

// Animation Options (có thể sử dụng sau)
export const ANIMATION_OPTIONS: SelectOption[] = [
  { value: "none", label: "None" },
  { value: "fade", label: "Fade" },
  { value: "slide", label: "Slide" },
  { value: "bounce", label: "Bounce" },
  { value: "pulse", label: "Pulse" },
];

// Display Options
export const DISPLAY_OPTIONS: SelectOption[] = [
  { value: "block", label: "Block" },
  { value: "inline", label: "Inline" },
  { value: "inline-block", label: "Inline Block" },
  { value: "flex", label: "Flex" },
  { value: "grid", label: "Grid" },
  { value: "none", label: "None" },
];

// Position Options
export const POSITION_OPTIONS: SelectOption[] = [
  { value: "static", label: "Static" },
  { value: "relative", label: "Relative" },
  { value: "absolute", label: "Absolute" },
  { value: "fixed", label: "Fixed" },
  { value: "sticky", label: "Sticky" },
];