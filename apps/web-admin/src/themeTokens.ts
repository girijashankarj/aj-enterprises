export const themeTokens = {
  color: {
    bg: {
      canvas: "var(--color-bg-canvas)",
      surface: "var(--color-bg-surface)",
      subtle: "var(--color-bg-subtle)"
    },
    text: {
      primary: "var(--color-text-primary)",
      secondary: "var(--color-text-secondary)"
    },
    border: {
      default: "var(--color-border-default)"
    },
    brand: {
      primary: "var(--color-brand-primary)"
    },
    status: {
      success: "var(--color-success)",
      warning: "var(--color-warning)",
      error: "var(--color-error)",
      info: "var(--color-info)"
    }
  },
  radius: {
    control: "8px",
    container: "12px"
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px"
  }
} as const;

export type ThemeTokens = typeof themeTokens;
