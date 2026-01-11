import { progressAPI } from "@/shared/api/progressAPI";
import { useAppSelector } from "@/shared/store";
import { commonStyles, theme } from "@/shared/styles";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function VideoPlayerPage() {
  const { id, courseId } = useLocalSearchParams<{
    id: string;
    courseId: string;
  }>();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    loadLesson();
    checkProgress();
  }, [id]);

  const loadLesson = async () => {
    // TODO: Fetch lesson from API
    // For now, using mock data
    setLesson({
      id,
      title: "Introduction to React Native",
      description:
        "Learn the basics of React Native and how to set up your development environment.",
      duration: 15,
      videoUrl: "https://example.com/video.mp4",
    });
    setLoading(false);
  };

  const checkProgress = async () => {
    if (user && id) {
      try {
        const progress = await progressAPI.getLessonProgress(user.id, id);
        setIsCompleted(progress?.completed || false);
      } catch (error) {
        console.error("Failed to check progress:", error);
      }
    }
  };

  const handleMarkComplete = async () => {
    if (!user || !courseId) return;

    setMarking(true);
    try {
      await progressAPI.markLessonComplete(user.id, courseId, id!);
      setIsCompleted(true);
      Alert.alert("Success", "Lesson marked as complete!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to mark as complete");
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
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
        </View>

        {/* Video Player Placeholder */}
        <View style={styles.videoContainer}>
          <View style={styles.videoPlaceholder}>
            <Text style={styles.videoIcon}>🎥</Text>
            <Text style={styles.videoText}>Video Player</Text>
            <Text style={styles.videoSubtext}>
              Video integration will be added here
            </Text>
          </View>
        </View>

        {/* Lesson Info */}
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{lesson?.title}</Text>
            {isCompleted && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>✓ Completed</Text>
              </View>
            )}
          </View>

          <Text style={styles.duration}>⏱️ {lesson?.duration} minutes</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this lesson</Text>
            <Text style={styles.description}>{lesson?.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Learning objectives</Text>
            <View style={styles.objectiveItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.objectiveText}>
                Understand React Native fundamentals
              </Text>
            </View>
            <View style={styles.objectiveItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.objectiveText}>
                Set up development environment
              </Text>
            </View>
            <View style={styles.objectiveItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.objectiveText}>
                Create your first component
              </Text>
            </View>
          </View>

          {!isCompleted && (
            <TouchableOpacity
              style={[
                commonStyles.button,
                commonStyles.buttonPrimary,
                styles.completeButton,
              ]}
              onPress={handleMarkComplete}
              disabled={marking}
            >
              <Text style={styles.completeButtonText}>
                {marking ? "Marking..." : "Mark as Complete"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.default,
  },
  backButton: {
    paddingTop: theme.spacing.md,
  },
  backButtonText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  videoContainer: {
    backgroundColor: "#000",
  },
  videoPlaceholder: {
    aspectRatio: 16 / 9,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  videoIcon: {
    fontSize: 60,
  },
  videoText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: "#fff",
    marginTop: theme.spacing.md,
  },
  videoSubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: "#999",
    marginTop: theme.spacing.xs,
  },
  content: {
    padding: theme.spacing.md,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    flex: 1,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  completedBadge: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginLeft: theme.spacing.sm,
  },
  completedText: {
    fontSize: theme.typography.fontSize.xs,
    color: "#fff",
    fontWeight: theme.typography.fontWeight.semibold,
  },
  duration: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  objectiveItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.sm,
  },
  checkmark: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.success,
    marginRight: theme.spacing.sm,
  },
  objectiveText: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
  completeButton: {
    marginTop: theme.spacing.md,
  },
  completeButtonText: {
    color: theme.colors.primary.contrast,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
