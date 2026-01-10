import { ROUTES } from "@/shared/routes";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../../global.css";

import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { persistor, store } from "@/shared/store";
import { checkAuthStatus } from "@/shared/store/slices/authSlice";
import { useAppSelector } from "@/shared/store";
import { ActivityIndicator, View } from "react-native";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

function useProtectedRoute() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const segments = useSegments();

    useEffect(() => {
      if (isLoading) return; // Don't redirect while loading

      const inAuthGroup = segments[0] === "(auth)";

      // Define protected routes that require authentication
      const isProtectedRoute = 
        segments[0] === "video" || 
        segments[0] === "quiz" || 
        segments[0] === "checkout" || 
        (segments[0] === "(tabs)" && (segments[1] === "my-courses" || segments[1] === "profile"));

      if (!isAuthenticated && isProtectedRoute) {
        // Redirect to login if trying to access a protected route while not authenticated
        router.replace(ROUTES.AUTH.LOGIN);
      } else if (isAuthenticated && inAuthGroup) {
        // Redirect to home if authenticated and in auth group
        router.replace(ROUTES.TABS.INDEX);
      }
    }, [isAuthenticated, isLoading, segments]);
}

function AppContent() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  useProtectedRoute(); // Handle protected route logic

  useEffect(() => {
    // Check for existing Supabase session on app startup
    dispatch(checkAuthStatus() as any);
  }, [dispatch]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="course/[id]" />
        <Stack.Screen name="video/[id]" />
        <Stack.Screen name="quiz/[id]" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" />
          </View>
        }
        persistor={persistor}
      >
        <AppContent />
      </PersistGate>
    </Provider>
  );
}
