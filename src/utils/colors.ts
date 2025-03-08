/**
 * Terminal color codes for consistent styling throughout the application
 */
export const COLORS = {
  // Text formatting
  RESET: '\x1b[0m',
  BRIGHT: '\x1b[1m',
  DIM: '\x1b[2m',
  UNDERSCORE: '\x1b[4m',
  BLINK: '\x1b[5m',
  REVERSE: '\x1b[7m',
  HIDDEN: '\x1b[8m',

  // Foreground colors
  BLACK: '\x1b[30m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
  WHITE: '\x1b[37m',

  // Background colors
  BG_BLACK: '\x1b[40m',
  BG_RED: '\x1b[41m',
  BG_GREEN: '\x1b[42m',
  BG_YELLOW: '\x1b[43m',
  BG_BLUE: '\x1b[44m',
  BG_MAGENTA: '\x1b[45m',
  BG_CYAN: '\x1b[46m',
  BG_WHITE: '\x1b[47m'
};

/**
 * Wraps text with color codes
 * @param text The text to colorize
 * @param color The color code to apply
 * @returns Colorized text
 */
export function colorize(text: string, color: string): string {
  return `${color}${text}${COLORS.RESET}`;
}

/**
 * Common color combinations for different message types
 */
export const MESSAGE = {
  SUCCESS: (text: string) => colorize(text, COLORS.GREEN),
  ERROR: (text: string) => colorize(text, COLORS.RED),
  WARNING: (text: string) => colorize(text, COLORS.YELLOW),
  INFO: (text: string) => colorize(text, COLORS.BLUE),
  HEADER: (text: string) => colorize(text, `${COLORS.BRIGHT}${COLORS.CYAN}`),
  LINK: (text: string) => colorize(text, COLORS.UNDERSCORE),
  HIGHLIGHT: (text: string) => colorize(text, COLORS.BRIGHT),
  MUTED: (text: string) => colorize(text, COLORS.DIM)
}; 