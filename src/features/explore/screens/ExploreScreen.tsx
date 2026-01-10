import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchCourses } from "@/shared/store/slices/courseSlice";
import { commonStyles, theme } from "@/shared/styles";
import { Course } from "@/shared/types/course";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";

export default function ExplorePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
    const { courses, isLoading } = useAppSelector((state) => state.courses);
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  useEffect(() => {
    // Load all courses for exploration
    dispatch(fetchCourses());
  }, [dispatch]);

  // Update local state when Redux state changes
  useEffect(() => {
    setAllCourses(courses);
  }, [courses]);

  const toggleCourseSelection = (courseId: string) => {
    setSelectedCourseIds(prev => {
      if (prev.includes(courseId)) {
        return prev.filter(id => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };

    const handleProceedToCheckout = () => {
      if (selectedCourseIds.length === 0) {
        Alert.alert("No Courses Selected", "Please select at least one course to proceed.");
        return;
      }
  
      // If user is authenticated, proceed to checkout
      // If not, redirect to login and preserve selected courses
  
      if (isAuthenticated) {
      // Navigate to checkout with selected courses
      router.push(`/checkout?courseIds=${selectedCourseIds.join(',')}`);
    } else {
      // Save selected courses to Redux state for later retrieval
      // Then redirect to login
      router.push({
        pathname: "/(auth)/login",
        params: {
          redirectTo: "checkout",
          courseIds: selectedCourseIds.join(',')
        }
      });
    }
  };

  const renderCourseCard = ({ item }: { item: Course }) => {
    const isSelected = selectedCourseIds.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.courseCard, isSelected && styles.selectedCourseCard]}
        onPress={() => toggleCourseSelection(item.id)}
      >
        {item.thumbnail_url ? (
          <Image source={{ uri: item.thumbnail_url }} style={styles.courseThumbnail} />
        ) : (
          <View style={styles.placeholderThumbnail}>
            <Text style={styles.placeholderText}>{item.title.charAt(0)}</Text>
          </View>
        )}
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.courseInstructor} numberOfLines={1}>By {item.instructor}</Text>
          <View style={commonStyles.rowBetween}>
            <Text style={styles.coursePrice}>${item.price}</Text>
            <Text style={styles.courseRating}>⭐ {item.rating}</Text>
          </View>
        </View>
        <View style={styles.selectionIndicator}>
          {isSelected ? (
            <Text style={styles.selectedIcon}>✓</Text>
          ) : (
            <Text style={styles.unselectedIcon}>○</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={commonStyles.containerCentered}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Courses</Text>
        <Text style={styles.headerSubtitle}>Discover new skills and knowledge</Text>
      </View>

      <FlatList
        data={allCourses}
        renderItem={renderCourseCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={commonStyles.containerCentered}>
            <Text style={commonStyles.textSecondary}>No courses available</Text>
          </View>
        }
      />

      {selectedCourseIds.length > 0 && (
        <View style={styles.bottomActionBar}>
          <Text style={styles.selectedCount}>
            {selectedCourseIds.length} course{selectedCourseIds.length !== 1 ? 's' : ''} selected
          </Text>
          <TouchableOpacity
            style={[commonStyles.button, commonStyles.buttonPrimary]}
            onPress={handleProceedToCheckout}
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingBottom: 120, // Extra space for bottom bar
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
  selectedCourseCard: {
    borderColor: theme.colors.primary.main,
    borderWidth: 2,
  },
  courseThumbnail: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md,
  },
  placeholderThumbnail: {
    width: 80,
    height: 80,
    backgroundColor: theme.colors.background.default,
    borderRadius: theme.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  placeholderText: {
    fontSize: theme.typography.fontSize["2xl"],
    color: theme.colors.text.secondary,
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
  coursePrice: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
  },
  courseRating: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  selectionIndicator: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.spacing.md,
  },
  selectedIcon: {
    fontSize: 24,
    color: theme.colors.success,
    fontWeight: 'bold',
  },
  unselectedIcon: {
    fontSize: 24,
    color: theme.colors.text.muted,
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  selectedCount: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  checkoutButtonText: {
    color: theme.colors.primary.contrast,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});