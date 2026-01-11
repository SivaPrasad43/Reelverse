import { ROUTES } from "@/shared/routes";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { logoutUser } from "@/shared/store/slices/authSlice";
import { theme } from "@/shared/styles";
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
import { Ionicons } from "@expo/vector-icons";

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
      icon: "person-outline",
      title: "Edit Profile",
      subtitle: "Update your personal information",
      onPress: () => Alert.alert("Coming Soon", "Edit profile feature"),
    },
    {
      icon: "book-outline",
      title: "My Courses",
      subtitle: `${enrolledCourses.length} courses enrolled`,
      onPress: () => router.push(ROUTES.TABS.MY_COURSES),
    },
    {
      icon: "ribbon-outline",
      title: "Certificates",
      subtitle: "View your earned certificates",
      onPress: () => Alert.alert("Coming Soon", "Certificates feature"),
    },
    {
      icon: "settings-outline",
      title: "Settings",
      subtitle: "Notifications, privacy and more",
      onPress: () => Alert.alert("Coming Soon", "Settings feature"),
    },
    {
      icon: "help-circle-outline",
      title: "Help & Support",
      subtitle: "Get help or contact us",
      onPress: () => Alert.alert("Coming Soon", "Support feature"),
    },
  ];

  return (
    <View style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <View style={styles.topRow}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={24} color="#000" />
              <View style={styles.badge} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileSection}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatar}>
                <Ionicons
                  name="person"
                  size={48}
                  color={theme.colors.primary.main}
                />
              </View>
              <TouchableOpacity style={styles.editButton}>
                <Ionicons name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || "Erica Hawkins"}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
          </View>

            <View style={styles.statsRow}>
              <View
                style={[
                  styles.statBox,
                  { backgroundColor: theme.colors.pastel.blue },
                ]}
              >
                <Ionicons
                  name="book"
                  size={28}
                  color={theme.colors.info.main}
                />
                <Text style={styles.statNumber}>{enrolledCourses.length}</Text>
                <Text style={styles.statLabel}>Courses</Text>
              </View>

              <View
                style={[
                  styles.statBox,
                  { backgroundColor: theme.colors.pastel.yellow },
                ]}
              >
                <Ionicons
                  name="time"
                  size={28}
                  color={theme.colors.warning.main}
                />
                <Text style={styles.statNumber}>148</Text>
                <Text style={styles.statLabel}>Hours</Text>
              </View>

              <View
                style={[
                  styles.statBox,
                  { backgroundColor: theme.colors.pastel.green },
                ]}
              >
                <Ionicons
                  name="ribbon"
                  size={28}
                  color={theme.colors.success.main}
                />
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Certificates</Text>
              </View>
            </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.menuList}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index === menuItems.length - 1 && styles.noBorder,
                ]}
                onPress={item.onPress}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: theme.colors.pastel.lavender },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={theme.colors.primary.main}
                  />
                </View>
                <View style={styles.menuText}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.logoutAction} onPress={handleLogout}>
            <View style={styles.logoutIcon}>
              <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            </View>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>Version 1.0.2</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "#F9FAFB",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarWrapper: {
    position: "relative",
    marginRight: 20,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary.main,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
    statsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    statBox: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
    statNumber: {
      fontSize: 18,
      fontWeight: "800",
      color: "#111827",
      marginTop: 8,
      marginBottom: 2,
    },
    statLabel: {
      fontSize: 10,
      color: "#6B7280",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
  menuSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
    marginLeft: 4,
  },
  menuList: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    overflow: "hidden",
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  logoutAction: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    marginBottom: 24,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#EF4444",
  },
  versionText: {
    textAlign: "center",
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
  },
});
