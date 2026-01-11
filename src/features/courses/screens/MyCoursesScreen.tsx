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
  Image,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MyCoursesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { enrolledCourses, isLoading } = useAppSelector(
    (state) => state.courses
  );
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

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

  const renderHeader = () => (
    <View style={styles.headerContainer}>
        <View style={styles.topRow}>
          <Text style={styles.headerTitle}>My Courses</Text>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={20}
            color={theme.colors.text.secondary}
          />
            <TextInput
              placeholder="Search your courses"
              style={styles.searchInput}
              placeholderTextColor={theme.colors.text.secondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              onSubmitEditing={() => {}}
            />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ongoing Courses</Text>
        </View>
    </View>
  );

  const renderCourseCard = ({ item }: { item: Course }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => router.push(ROUTES.COURSE(item.id) as any)}
    >
      <View style={[styles.courseImageContainer, { backgroundColor: theme.colors.pastel.mint }]}>
        {item.thumbnail_url ? (
          <Image
            source={{ uri: item.thumbnail_url }}
            style={styles.courseThumbnail}
          />
        ) : (
          <Ionicons
            name="play-circle"
            size={40}
            color={theme.colors.primary.main}
          />
        )}
      </View>
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.courseMeta}>
            <Text style={styles.courseInstructor}>{item.instructor}</Text>
            <View style={styles.dot} />
            <Text style={styles.lessonCount}>12 Lessons</Text>
        </View>
        <View style={styles.progressRow}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${item.progress || 35}%` }]}
            />
          </View>
          <Text style={styles.progressText}>{item.progress || 35}%</Text>
        </View>
      </View>
      <View style={styles.arrowContainer}>
        <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.text.secondary}
        />
      </View>
    </TouchableOpacity>
  );

  if (isLoading && !refreshing) {
    return (
      <View style={commonStyles.containerCentered}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  const filteredCourses = enrolledCourses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.safeArea}>
      <FlatList
        data={filteredCourses}
        renderItem={renderCourseCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={64}
              color={theme.colors.text.secondary}
            />
            <Text style={styles.emptyTitle}>No enrolled courses</Text>
            <Text style={styles.emptyText}>
              You haven't enrolled in any courses yet. Start your learning
              journey today!
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push("/explore")}
            >
              <Text style={styles.exploreButtonText}>Explore Now</Text>
            </TouchableOpacity>
          </View>
          }
        />
      </View>
    );
  }

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#000",
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.error.main,
    borderWidth: 2,
    borderColor: '#fff',
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: theme.spacing.md,
    height: 52,
    borderRadius: 16,
    marginBottom: theme.spacing.xl,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: 16,
    color: "#000",
    fontWeight: '500',
  },
  sectionHeader: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#000",
  },
  listContent: {
    paddingBottom: 100,
  },
  courseCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 24,
    marginHorizontal: theme.spacing.md,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...theme.shadows.sm,
  },
  courseImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    overflow: "hidden",
  },
  courseThumbnail: {
    width: "100%",
    height: "100%",
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 6,
    lineHeight: 22,
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseInstructor: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 8,
  },
  lessonCount: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary.main,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.primary.main,
  },
  arrowContainer: {
    marginLeft: 8,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#000",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 16,
    ...theme.shadows.md,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

