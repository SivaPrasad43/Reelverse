import { ROUTES } from "@/shared/routes";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { registerUser } from "@/shared/store/slices/authSlice";
import { commonStyles, theme } from "@/shared/styles";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const { redirectTo, courseIds } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const handleRegister = async () => {
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      await dispatch(registerUser({ email, password, name })).unwrap();

        // Check if there's a redirect target
        if (redirectTo === "checkout" && courseIds) {
          // Redirect to checkout with preserved course IDs
          router.replace(`${ROUTES.CHECKOUT}?courseIds=${courseIds}`);
        } else {
          // Default redirect to tabs
          router.replace(ROUTES.TABS.INDEX);
        }
    } catch (err: any) {
      Alert.alert("Registration Failed", err || "Unable to create account");
    }
  };

  return (
    <KeyboardAvoidingView
      style={[commonStyles.container, styles.container]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Create Account 🎓</Text>
          <Text style={styles.subtitle}>Join ReelVerse and start learning</Text>

          <View style={styles.form}>
            <TextInput
              style={[commonStyles.input, styles.input]}
              placeholder="Full Name"
              placeholderTextColor={theme.colors.text.secondary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

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

            <TextInput
              style={[commonStyles.input, styles.input]}
              placeholder="Confirm Password"
              placeholderTextColor={theme.colors.text.secondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={[
                commonStyles.button,
                commonStyles.buttonPrimary,
                styles.registerButton,
              ]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.default,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize["3xl"],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
  },
  form: {
    width: "100%",
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  registerButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  registerButtonText: {
    color: theme.colors.primary.contrast,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  loginLink: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
