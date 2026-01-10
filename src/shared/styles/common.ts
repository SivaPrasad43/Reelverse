import { StyleSheet } from "react-native";
import { theme } from "./theme";

// Common/reusable styles
export const commonStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  containerPadding: {
    padding: theme.spacing.md,
  },
  containerCentered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Flexbox utilities
  row: {
    flexDirection: "row",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  column: {
    flexDirection: "column",
  },
  columnCenter: {
    flexDirection: "column",
    alignItems: "center",
  },

  // Card styles
  card: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.md,
  },
  cardElevated: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.lg,
  },

  // Button styles
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary.main,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.secondary.main,
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },

  // Text styles
  textPrimary: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
  },
  textSecondary: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
  },
  textHeading: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize["2xl"],
    fontWeight: theme.typography.fontWeight.bold,
  },
  textSubheading: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  textCenter: {
    textAlign: "center",
  },

  // Input styles
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.default,
  },
  inputFocused: {
    borderColor: theme.colors.primary.main,
  },
  inputError: {
    borderColor: theme.colors.error.main,
  },

  // Spacing utilities
  mt: {
    marginTop: theme.spacing.md,
  },
  mb: {
    marginBottom: theme.spacing.md,
  },
  ml: {
    marginLeft: theme.spacing.md,
  },
  mr: {
    marginRight: theme.spacing.md,
  },
  mx: {
    marginHorizontal: theme.spacing.md,
  },
  my: {
    marginVertical: theme.spacing.md,
  },
  pt: {
    paddingTop: theme.spacing.md,
  },
  pb: {
    paddingBottom: theme.spacing.md,
  },
  pl: {
    paddingLeft: theme.spacing.md,
  },
  pr: {
    paddingRight: theme.spacing.md,
  },
  px: {
    paddingHorizontal: theme.spacing.md,
  },
  py: {
    paddingVertical: theme.spacing.md,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },

  // Shadow utilities
  shadowSm: theme.shadows.sm,
  shadowMd: theme.shadows.md,
  shadowLg: theme.shadows.lg,
  shadowXl: theme.shadows.xl,
});
