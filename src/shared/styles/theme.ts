// Theme configuration for the LMS app
export const theme = {
  colors: {
    // Primary colors
    primary: {
      main: "#6366F1",
      light: "#818CF8",
      dark: "#4F46E5",
      contrast: "#FFFFFF",
    },
    // Secondary colors
    secondary: {
      main: "#EC4899",
      light: "#F472B6",
      dark: "#DB2777",
      contrast: "#FFFFFF",
    },
    // Accent colors
    accent: {
      main: "#F59E0B",
      light: "#FBBF24",
      dark: "#D97706",
    },
    // Neutral colors
    background: {
      default: "#FFFFFF",
      paper: "#F9FAFB",
      elevated: "#FFFFFF",
    },
    text: {
      primary: "#111827",
      secondary: "#6B7280",
      disabled: "#9CA3AF",
      inverse: "#FFFFFF",
    },
    // Semantic colors
    success: {
      main: "#10B981",
      light: "#34D399",
      dark: "#059669",
    },
    error: {
      main: "#EF4444",
      light: "#F87171",
      dark: "#DC2626",
    },
    warning: {
      main: "#F59E0B",
      light: "#FBBF24",
      dark: "#D97706",
    },
    info: {
      main: "#3B82F6",
      light: "#60A5FA",
      dark: "#2563EB",
    },
      // Borders
      border: "#E5E7EB",
      borderLight: "#F3F4F6",
      borderDark: "#D1D5DB",
      // Education App Pastel Colors
      pastel: {
        lavender: "#E0E7FF",
        blue: "#DBEAFE",
        green: "#D1FAE5",
        yellow: "#FEF3C7",
        pink: "#FCE7F3",
        purple: "#F3E8FF",
      }
    },

  // Dark mode colors
  darkColors: {
    primary: {
      main: "#818CF8",
      light: "#A5B4FC",
      dark: "#6366F1",
      contrast: "#000000",
    },
    secondary: {
      main: "#F472B6",
      light: "#F9A8D4",
      dark: "#EC4899",
      contrast: "#000000",
    },
    accent: {
      main: "#FBBF24",
      light: "#FCD34D",
      dark: "#F59E0B",
    },
    background: {
      default: "#111827",
      paper: "#1F2937",
      elevated: "#374151",
    },
    text: {
      primary: "#F9FAFB",
      secondary: "#D1D5DB",
      disabled: "#9CA3AF",
      inverse: "#111827",
    },
    success: {
      main: "#34D399",
      light: "#6EE7B7",
      dark: "#10B981",
    },
    error: {
      main: "#F87171",
      light: "#FCA5A5",
      dark: "#EF4444",
    },
    warning: {
      main: "#FBBF24",
      light: "#FCD34D",
      dark: "#F59E0B",
    },
    info: {
      main: "#60A5FA",
      light: "#93C5FD",
      dark: "#3B82F6",
    },
    border: "#374151",
    borderLight: "#4B5563",
    borderDark: "#1F2937",
  },

  // Typography
  typography: {
    fontFamily: {
      regular: "Manrope_400Regular",
      medium: "Manrope_500Medium",
      semiBold: "Manrope_600SemiBold",
      bold: "Manrope_700Bold",
      extraBold: "Manrope_800ExtraBold",
    },
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      "2xl": 24,
      "3xl": 30,
      "4xl": 36,
      "5xl": 48,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
    fontWeight: {
      regular: "400" as const,
      medium: "500" as const,
      semibold: "600" as const,
      bold: "700" as const,
    },
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48,
    "3xl": 64,
  },

  // Border radius
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    "2xl": 24,
    full: 9999,
  },

  // Shadows
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    xl: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },

  // Breakpoints (for responsive design)
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
} as const;

export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;
export type DarkThemeColors = typeof theme.darkColors;
