import { ROUTES } from "@/shared/routes";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { setHasLaunched } from "@/shared/store/slices/authSlice";
import { commonStyles, theme } from "@/shared/styles";
import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

  export default function Index() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
  
    const handleStart = () => {
      dispatch(setHasLaunched());
      router.push(ROUTES.TABS.INDEX);
    };

    const handleLogin = () => {
      router.push(ROUTES.AUTH.LOGIN);
    };
  
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.illustrationContainer}>
            <View style={styles.illustrationPlaceholder}>
              <Ionicons name="school-outline" size={120} color={theme.colors.primary.main} />
              <View style={styles.playIconContainer}>
                 <Ionicons name="play-circle" size={40} color={theme.colors.accent.main} />
              </View>
            </View>
          </View>
  
          <View style={styles.content}>
            <Text style={styles.title}>The only study app{"\n"}you'll ever need</Text>
            <Text style={styles.subtitle}>
              Upload class study materials, create electronic flashcards to study.
            </Text>
  
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStart}
              >
                <Text style={styles.startButtonText}>Let's start</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background.default,
    },
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing.xl,
      justifyContent: "space-between",
      paddingVertical: theme.spacing["2xl"],
    },
    illustrationContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    illustrationPlaceholder: {
      width: width * 0.8,
      height: width * 0.8,
      backgroundColor: theme.colors.background.paper,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    playIconContainer: {
      position: "absolute",
      bottom: "25%",
      right: "25%",
      backgroundColor: "#fff",
      borderRadius: 20,
    },
    content: {
      alignItems: "center",
    },
    title: {
      fontSize: 28,
      fontFamily: theme.typography.fontFamily.extraBold,
      color: theme.colors.text.primary,
      textAlign: "center",
      lineHeight: 36,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text.secondary,
      textAlign: "center",
      marginBottom: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
      lineHeight: 20,
    },
    buttonContainer: {
      width: "100%",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    startButton: {
      backgroundColor: theme.colors.primary.main,
      paddingVertical: 16,
      borderRadius: theme.borderRadius["2xl"],
      width: "100%",
      maxWidth: 280,
    },
    startButtonText: {
      color: "#fff",
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.bold,
      textAlign: "center",
    },
    loginButton: {
      backgroundColor: "transparent",
      paddingVertical: 14,
      borderRadius: theme.borderRadius["2xl"],
      width: "100%",
      maxWidth: 280,
      borderWidth: 1,
      borderColor: theme.colors.primary.main,
    },
    loginButtonText: {
      color: theme.colors.primary.main,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      textAlign: "center",
    },
  });
