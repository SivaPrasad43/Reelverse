import { ROUTES } from "@/shared/routes";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { loginUser } from "@/shared/store/slices/authSlice";
import { commonStyles, theme } from "@/shared/styles";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { redirectTo, courseIds } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();

        // Check if there's a redirect target
        if (redirectTo === "checkout" && courseIds) {
          // Redirect to checkout with preserved course IDs
          router.replace(`${ROUTES.CHECKOUT}?courseIds=${courseIds}`);
        } else {
          // Default redirect to tabs
          router.replace(ROUTES.TABS.INDEX);
        }
    } catch (err: any) {
      Alert.alert("Login Failed", err || "Invalid credentials");
    }
  };

  return (
    <KeyboardAvoidingView
      style={[commonStyles.container, styles.container]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Text style={styles.title}>ReelVerse 🎓</Text>
        <Text style={styles.subtitle}>Learn Anything, Anywhere</Text>

        <View style={styles.form}>
          <TextInput
            style={[commonStyles.input, styles.input]}
            placeholder="Email"
            placeholderTextColor={theme.colors.text.secondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <TextInput
            style={[commonStyles.input, styles.input]}
            placeholder="Password"
            placeholderTextColor={theme.colors.text.secondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[
              commonStyles.button,
              commonStyles.buttonPrimary,
              styles.loginButton,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

            <TouchableOpacity
              style={[commonStyles.button, commonStyles.buttonOutline]}
              onPress={() => router.push(ROUTES.AUTH.REGISTER)}
            >
            <Text style={styles.registerButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.default,
  },
  content: {
    flex: 1,
    justifyContent: "center",
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
  form: {
    width: "100%",
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  loginButton: {
    marginTop: theme.spacing.md,
  },
  loginButtonText: {
    color: theme.colors.primary.contrast,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  forgotPassword: {
    alignSelf: "center",
    marginTop: theme.spacing.md,
  },
  forgotPasswordText: {
    color: theme.colors.primary.main,
    fontSize: theme.typography.fontSize.sm,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    marginHorizontal: theme.spacing.md,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
  },
  registerButtonText: {
    color: theme.colors.primary.main,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
