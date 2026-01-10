import { ROUTES } from "@/shared/routes";
import { useAppSelector } from "@/shared/store";
import { commonStyles, theme } from "@/shared/styles";
import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <View style={[commonStyles.container, styles.container]}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to ReelVerse 🎓</Text>
        <Text style={styles.subtitle}>Learn Anything, Anywhere</Text>

          <TouchableOpacity
            style={[commonStyles.button, commonStyles.buttonPrimary, styles.exploreButton]}
            onPress={() => router.push(ROUTES.TABS.EXPLORE)}
          >
          <Text style={styles.buttonText}>Explore Courses</Text>
        </TouchableOpacity>

        {!isAuthenticated && (
          <View style={styles.authButtons}>
            <TouchableOpacity
              style={[commonStyles.button, commonStyles.buttonOutline, styles.authButton]}
              onPress={() => router.push(ROUTES.AUTH.LOGIN)}
            >
              <Text style={styles.authButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[commonStyles.button, commonStyles.buttonPrimary, styles.authButton]}
              onPress={() => router.push(ROUTES.AUTH.REGISTER)}
            >
              <Text style={styles.authButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.default,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize["3xl"],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginBottom: theme.spacing["2xl"],
  },
  exploreButton: {
    width: "100%",
    maxWidth: 300,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  buttonText: {
    color: theme.colors.primary.contrast,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: "center",
  },
  authButtons: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
    width: "100%",
    maxWidth: 300,
  },
  authButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  authButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: "center",
  },
});
