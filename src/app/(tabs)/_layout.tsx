import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/IconSymbol";
import { theme } from "@/shared/styles/theme";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useAppSelector } from "@/shared/store";
import { ROUTES } from "@/shared/routes";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const activeColor = "#000000";
  const inactiveColor = "rgba(0, 0, 0, 0.5)";
  const bgColor = "#FFFFFF";

    const bottomPadding = insets.bottom > 0 ? insets.bottom : 12;
    const tabHeight = 64 + bottomPadding;

    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: inactiveColor,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
            marginBottom: insets.bottom > 0 ? 0 : 4,
          },
          tabBarStyle: {
            backgroundColor: bgColor,
            height: tabHeight,
            paddingBottom: insets.bottom,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: "rgba(0,0,0,0.08)",
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconContainer}>
                {focused && <View style={styles.activeIndicator} />}
                <IconSymbol size={24} name="house" color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconContainer}>
                {focused && <View style={styles.activeIndicator} />}
                <IconSymbol size={24} name="magnifyingglass" color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="my-courses"
          options={{
            title: "My Courses",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconContainer}>
                {focused && <View style={styles.activeIndicator} />}
                <IconSymbol size={24} name="book.fill" color={color} />
              </View>
            ),
          }}
          listeners={{
            tabPress: (e) => {
              if (!isAuthenticated) {
                e.preventDefault();
                router.push(ROUTES.AUTH.LOGIN);
              }
            },
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconContainer}>
                {focused && <View style={styles.activeIndicator} />}
                <IconSymbol size={24} name="person" color={color} />
              </View>
            ),
          }}
          listeners={{
            tabPress: (e) => {
              if (!isAuthenticated) {
                e.preventDefault();
                router.push(ROUTES.AUTH.LOGIN);
              }
            },
          }}
        />
      </Tabs>
    );
  }

  const styles = StyleSheet.create({
    iconContainer: {
      alignItems: "center",
      justifyContent: "center",
      width: '100%',
      height: '100%',
    },
    activeIndicator: {
      position: 'absolute',
      top: -8,
      width: 40,
      height: 3,
      backgroundColor: "#000000",
      borderBottomLeftRadius: 3,
      borderBottomRightRadius: 3,
    }
  });
