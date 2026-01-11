import { courses } from "@/shared/api/endpoints";
import { ROUTES } from "@/shared/routes";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchCourseById } from "@/shared/store/slices/courseSlice";
import { commonStyles, theme } from "@/shared/styles";
import { Lesson } from "@/shared/types/course";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CourseDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { currentCourse, isLoading } = useAppSelector((state) => state.courses);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchCourseById(id));
      checkEnrollment();
    }
  }, [id]);

  const checkEnrollment = async () => {
    if (user && id) {
      try {
        const enrolled = await courses.isEnrolled(user.id, id);
        setIsEnrolled(enrolled);
      } catch (error) {
        console.error("Failed to check enrollment:", error);
      }
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      Alert.alert("Login Required", "Please login to enroll in courses");
      router.push(ROUTES.AUTH.LOGIN);
      return;
    }

    setEnrolling(true);
    try {
      await courses.enroll(user.id, id!);
      setIsEnrolled(true);
      Alert.alert("Success", "You have enrolled in this course!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to enroll");
    } finally {
      setEnrolling(false);
    }
  };

  const handleLessonPress = (lesson: Lesson) => {
    if (!isEnrolled) {
      Alert.alert("Enrollment Required", "Please enroll to access lessons");
      return;
    }
    router.push({
      pathname: ROUTES.VIDEO("[id]") as any,
      params: { id: lesson.id, courseId: id },
    });
  };

  const renderLesson = ({ item, index }: { item: Lesson; index: number }) => (
    <TouchableOpacity
      style={styles.lessonItem}
      onPress={() => handleLessonPress(item)}
    >
      <View style={styles.lessonNumber}>
        <Text style={styles.lessonNumberText}>{index + 1}</Text>
      </View>
      <View style={styles.lessonInfo}>
        <Text style={styles.lessonTitle}>{item.title}</Text>
        <Text style={styles.lessonDuration}>{item.duration} min</Text>
      </View>
      {item.isPreview && (
        <View style={styles.previewBadge}>
          <Text style={styles.previewText}>Preview</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (isLoading || !currentCourse) {
    return (
      <View style={commonStyles.containerCentered}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.thumbnail}>
            <Text style={styles.thumbnailIcon}>🎓</Text>
          </View>
        </View>

        {/* Course Info */}
        <View style={styles.content}>
          <Text style={styles.title}>{currentCourse.title}</Text>
          <Text style={styles.instructor}>By {currentCourse.instructor}</Text>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>⭐ {currentCourse.rating}</Text>
              <Text style={styles.statLabel}>
                ({currentCourse.totalRatings})
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                👥 {currentCourse.totalStudents}
              </Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>⏱️ {currentCourse.duration}</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this course</Text>
            <Text style={styles.description}>{currentCourse.description}</Text>
          </View>

          {currentCourse.whatYouWillLearn && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What you&apos;ll learn</Text>
              {currentCourse.whatYouWillLearn.map((item, index) => (
                <View key={index} style={styles.learningItem}>
                  <Text style={styles.checkmark}>✓</Text>
                  <Text style={styles.learningText}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Course Content</Text>
            <FlatList
              data={currentCourse.lessons}
              renderItem={renderLesson}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        </View>
      </ScrollView>

      {/* Enroll Button */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${currentCourse.price}</Text>
          {currentCourse.originalPrice && (
            <Text style={styles.originalPrice}>
              ${currentCourse.originalPrice}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={[
            commonStyles.button,
            commonStyles.buttonPrimary,
            styles.enrollButton,
            (isEnrolled || enrolling) && styles.enrollButtonDisabled,
          ]}
          onPress={handleEnroll}
          disabled={isEnrolled || enrolling}
        >
          <Text style={styles.enrollButtonText}>
            {enrolling
              ? "Enrolling..."
              : isEnrolled
                ? "Already Enrolled"
                : "Enroll Now"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.primary.main,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  backButton: {
    marginBottom: theme.spacing.md,
  },
  backButtonText: {
    color: theme.colors.primary.contrast,
    fontSize: theme.typography.fontSize.base,
  },
  thumbnail: {
    height: 200,
    backgroundColor: theme.colors.primary.dark,
    borderRadius: theme.borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnailIcon: {
    fontSize: 80,
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize["2xl"],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  instructor: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  learningItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.sm,
  },
  checkmark: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.success,
    marginRight: theme.spacing.sm,
  },
  learningText: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
  lessonItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  lessonNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary.light,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  lessonNumberText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  lessonDuration: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  previewBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.info,
    borderRadius: theme.borderRadius.sm,
  },
  previewText: {
    fontSize: theme.typography.fontSize.xs,
    color: "#fff",
    fontWeight: theme.typography.fontWeight.semibold,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: theme.typography.fontSize["2xl"],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
  },
  originalPrice: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textDecorationLine: "line-through",
  },
  enrollButton: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  enrollButtonDisabled: {
    opacity: 0.6,
  },
  enrollButtonText: {
    color: theme.colors.primary.contrast,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
