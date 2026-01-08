import { useAppDispatch, useAppSelector } from "@/store";
import { fetchCourses } from "@/store/slices/courseSlice";
import { logoutUser } from "@/store/slices/authSlice";
import { commonStyles, theme } from "@/styles";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { mockCourses } from "@/shared/data/mockData";

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { courses, isLoading } = useAppSelector((state) => state.courses);
  const { user } = useAppSelector((state) => state.auth);
  const [localCourses, setLocalCourses] = useState(mockCourses);

  useEffect(() => {
    // Use mock data for now - uncomment when backend is ready
    // dispatch(fetchCourses());
    setLocalCourses(mockCourses);
  }, [dispatch]);

  const loadCourses = () => {
    // Use mock data for now
    setLocalCourses(mockCourses);
    // dispatch(fetchCourses());
  };

  const renderCourseCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => router.push(`/course/${item.id}` as any)}
    >
      <View style={styles.courseThumbnail}>
        <Text style={styles.courseThumbnailText}>📚</Text>
      </View>
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle}>{item.title}</Text>
        <Text style={styles.courseInstructor}>{item.instructor}</Text>
        <View style={commonStyles.rowBetween}>
          <Text style={styles.coursePrice}>${item.price}</Text>
          <Text style={styles.courseRating}>⭐ {item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hello, {user?.name || "Student"}! 👋
          </Text>
          <Text style={styles.subtitle}>
            What would you like to learn today?
          </Text>
        </View>
        {/* logout button */}
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Logout",
              "Are you sure you want to logout?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Logout",
                  style: "destructive",
                  onPress: async () => {
                    await dispatch(logoutUser()).unwrap();
                    router.push("/(auth)/login");
                  }
                }
              ]
            );
          }}
        >
          <Text style={{ color: theme.colors.primary.contrast }}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={localCourses}
        renderItem={renderCourseCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={loadCourses} />
        }
        ListEmptyComponent={
          <View style={commonStyles.containerCentered}>
            <Text style={commonStyles.textSecondary}>No courses available</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary.main,
    paddingTop: theme.spacing.xl,
  },
  greeting: {
    fontSize: theme.typography.fontSize["2xl"],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.contrast,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.primary.contrast,
    opacity: 0.9,
    marginTop: theme.spacing.xs,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  courseCard: {
    ...commonStyles.card,
    marginBottom: theme.spacing.md,
    flexDirection: "row",
  },
  courseThumbnail: {
    width: 80,
    height: 80,
    backgroundColor: theme.colors.primary.light,
    borderRadius: theme.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  courseThumbnailText: {
    fontSize: 32,
  },
  courseInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  courseTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  courseInstructor: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  coursePrice: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
  },
  courseRating: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
});
