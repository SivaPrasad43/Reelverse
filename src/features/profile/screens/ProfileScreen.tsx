import { ROUTES } from "@/shared/routes";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { logoutUser } from "@/shared/store/slices/authSlice";
import { commonStyles, theme } from "@/shared/styles";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { enrolledCourses } = useAppSelector((state) => state.courses);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
            await dispatch(logoutUser());
            router.replace(ROUTES.TABS.INDEX);
          },
      },
    ]);
  };

  const menuItems = [
    {
      icon: "👤",
      title: "Edit Profile",
      subtitle: "Update your personal information",
      onPress: () => Alert.alert("Coming Soon", "Edit profile feature"),
    },
    {
      icon: "📚",
      title: "My Courses",
      subtitle: `${enrolledCourses.length} courses enrolled`,
      onPress: () => router.push(ROUTES.TABS.MY_COURSES),
    },
    {
      icon: "📜",
      title: "Certificates",
      subtitle: "View your earned certificates",
      onPress: () => Alert.alert("Coming Soon", "Certificates feature"),
    },
    {
      icon: "⚙️",
      title: "Settings",
      subtitle: "App preferences and notifications",
      onPress: () => Alert.alert("Coming Soon", "Settings feature"),
    },
    {
      icon: "❓",
      title: "Help & Support",
      subtitle: "Get help or contact us",
      onPress: () => Alert.alert("Coming Soon", "Support feature"),
    },
  ];

  return (
    <View style={commonStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name || "User"}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{enrolledCourses.length}</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Certificates</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Hours</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuIcon}>
                <Text style={styles.menuIconText}>{item.icon}</Text>
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={[styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.primary.main,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary.dark,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.contrast,
  },
  name: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.contrast,
    marginBottom: theme.spacing.xs,
  },
  email: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.primary.contrast,
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.background.paper,
    marginHorizontal: theme.spacing.md,
    marginTop: -theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: theme.typography.fontSize["2xl"],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
  menuContainer: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  menuIcon: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary.light,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  menuIconText: {
    fontSize: 24,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  menuSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  menuArrow: {
    fontSize: 24,
    color: theme.colors.text.secondary,
  },
  logoutButton: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.error,
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.error,
  },
  version: {
    textAlign: "center",
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
});
