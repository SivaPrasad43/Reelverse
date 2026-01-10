import { ROUTES } from "@/shared/routes";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchEnrolledCourses } from "@/shared/store/slices/courseSlice";
import { commonStyles, theme } from "@/shared/styles";
import { Course } from "@/shared/types/course";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MyCoursesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { enrolledCourses, isLoading } = useAppSelector(
    (state) => state.courses
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchEnrolledCourses(user.id));
    }
  }, [user, dispatch]);

  const onRefresh = async () => {
    if (user) {
      setRefreshing(true);
      await dispatch(fetchEnrolledCourses(user.id));
      setRefreshing(false);
    }
  };

  const renderCourseCard = ({ item }: { item: Course }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => router.push(ROUTES.COURSE(item.id) as any)}
    >
      <View style={styles.courseThumbnail}>
        <Text style={styles.courseThumbnailText}>📚</Text>
      </View>
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle}>{item.title}</Text>
        <Text style={styles.courseInstructor}>{item.instructor}</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${item.progress || 0}%` }]}
            />
          </View>
          <Text style={styles.progressText}>{item.progress || 0}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading && !refreshing) {
    return (
      <View style={commonStyles.containerCentered}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Courses</Text>
        <Text style={styles.headerSubtitle}>
          {enrolledCourses.length} courses enrolled
        </Text>
      </View>

      <FlatList
        data={enrolledCourses}
        renderItem={renderCourseCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={commonStyles.containerCentered}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyTitle}>No courses yet</Text>
            <Text style={styles.emptyText}>
              Explore courses and start learning
            </Text>
            <TouchableOpacity
              style={[commonStyles.button, commonStyles.buttonPrimary]}
              onPress={() => router.push(ROUTES.TABS.INDEX)}
            >
              <Text style={styles.exploreButtonText}>Explore Courses</Text>
            </TouchableOpacity>
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
  headerTitle: {
    fontSize: theme.typography.fontSize["2xl"],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.contrast,
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.primary.contrast,
    opacity: 0.9,
    marginTop: theme.spacing.xs,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  courseCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontSize: 40,
  },
  courseInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  courseTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  courseInstructor: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.sm,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.success,
    borderRadius: theme.borderRadius.sm,
  },
  progressText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  exploreButtonText: {
    color: theme.colors.primary.contrast,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
