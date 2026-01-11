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
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Manrope_200ExtraLight,
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from "@expo-google-fonts/manrope";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function useProtectedRoute() {
  const router = useRouter();
  const { isAuthenticated, isLoading, hasLaunched } = useAppSelector((state) => state.auth);
  const segments = useSegments();

    useEffect(() => {
      if (isLoading) return; // Don't redirect while loading

      const inAuthGroup = segments[0] === "(auth)";
      const isLandingPage = segments.length === 0 || (segments.length === 1 && segments[0] === "index");

      // Define protected routes that require authentication
      const isProtectedRoute = 
        segments[0] === "video" || 
        segments[0] === "quiz" || 
        segments[0] === "checkout" || 
        (segments[0] === "(tabs)" && (segments[1] === "my-courses" || segments[1] === "profile"));

      if (isLandingPage && (hasLaunched || isAuthenticated)) {
        // If app has already launched once OR user is authenticated, skip landing screen
        router.replace(ROUTES.TABS.INDEX);
        return;
      }

      if (!isAuthenticated && isProtectedRoute) {
        // Redirect to login if trying to access a protected route while not authenticated
        router.replace(ROUTES.AUTH.LOGIN);
      } else if (isAuthenticated && inAuthGroup) {
        // Redirect to home if authenticated and in auth group
        router.replace(ROUTES.TABS.INDEX);
      }
    }, [isAuthenticated, isLoading, segments, hasLaunched]);
}

function AppContent() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  useProtectedRoute(); // Handle protected route logic

  useEffect(() => {
    // Check for existing Supabase session on app startup
    dispatch(checkAuthStatus() as any);
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { marginTop: 38, backgroundColor: "#FFFFFF" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="course/[id]" />
        <Stack.Screen name="video/[id]" />
        <Stack.Screen name="quiz/[id]" />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Manrope_200ExtraLight,
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Prevent rendering until fonts are loaded or an error occurred
  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate
          loading={
            <View
              style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" }}
            >
              <ActivityIndicator size="large" color="#000000" />
            </View>
          }
          persistor={persistor}
        >
          <AppContent />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
