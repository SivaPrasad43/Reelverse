import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchCourses } from "@/shared/store/slices/courseSlice";
import { commonStyles, theme } from "@/shared/styles";
import { Course } from "@/shared/types/course";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
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
    TextInput,
    ScrollView,
  } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";

export default function ExplorePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const tabBarHeight = useBottomTabBarHeight();
  const { courses, isLoading } = useAppSelector((state) => state.courses);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const translateY = useSharedValue(200);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    setAllCourses(courses);
  }, [courses]);

  useEffect(() => {
    if (selectedCourseIds.length > 0) {
      translateY.value = withTiming(0, {
        duration: 250,
        easing: Easing.out(Easing.ease),
      });
    } else {
      translateY.value = withTiming(200, {
        duration: 250,
        easing: Easing.in(Easing.ease),
      });
    }
  }, [selectedCourseIds.length]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const toggleCourseSelection = (courseId: string) => {
    setSelectedCourseIds((prev) => {
      if (prev.includes(courseId)) {
        return prev.filter((id) => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };

  const handleProceedToCheckout = () => {
    if (selectedCourseIds.length === 0) {
      Alert.alert(
        "No Courses Selected",
        "Please select at least one course to proceed."
      );
      return;
    }

    if (isAuthenticated) {
      router.push(`/checkout?courseIds=${selectedCourseIds.join(",")}`);
    } else {
      router.push({
        pathname: "/(auth)/login",
        params: {
          redirectTo: "checkout",
          courseIds: selectedCourseIds.join(","),
        },
      });
    }
  };

  const CATEGORIES = ["All", "Development", "Design", "Business", "Marketing", "Music"];

  const renderHeader = () => (
    <View style={styles.headerContainer}>
        <View style={styles.topRow}>
          <Text style={styles.headerTitle}>Explore</Text>
          {isAuthenticated && (
            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={24} color="#000" />
              <View style={styles.badge} />
            </TouchableOpacity>
          )}
        </View>

      <View style={styles.searchBar}>
        <Ionicons
          name="search-outline"
          size={20}
          color={theme.colors.text.secondary}
        />
          <TextInput
            placeholder="Search courses"
            style={styles.searchInput}
            placeholderTextColor={theme.colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={() => {}}
          />
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map((cat, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.categoryChip, 
                selectedCategory === cat && styles.activeCategoryChip
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[
                styles.categoryChipText,
                selectedCategory === cat && styles.activeCategoryChipText
              ]}>{cat}</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Courses</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>Filter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCourseCard = ({ item }: { item: Course }) => {
    const isSelected = selectedCourseIds.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.courseCard, isSelected && styles.selectedCourseCard]}
        onPress={() => toggleCourseSelection(item.id)}
      >
        <View style={[styles.courseImageContainer, { backgroundColor: theme.colors.pastel.lavender }]}>
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
          <View style={styles.instructorRow}>
            <View style={styles.instructorAvatar}>
               <Ionicons name="person" size={12} color={theme.colors.text.secondary} />
            </View>
            <Text style={styles.courseInstructor} numberOfLines={1}>
              {item.instructor}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.coursePrice}>${item.price}</Text>
            <View style={styles.ratingBadge}>
               <Ionicons name="star" size={12} color="#F59E0B" />
               <Text style={styles.courseRating}>{item.rating}</Text>
            </View>
          </View>
        </View>
        <View style={styles.selectionIndicator}>
          {isSelected ? (
            <View style={styles.selectedCircle}>
              <Ionicons name="checkmark" size={14} color="#fff" />
            </View>
          ) : (
            <View style={styles.unselectedCircle} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || 
      course.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <View style={commonStyles.containerCentered}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <FlatList
        data={filteredCourses}
        renderItem={renderCourseCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No courses available</Text>
          </View>
        }
      />

      <Animated.View
        style={[
          styles.bottomActionBar,
          { bottom: tabBarHeight },
          animatedStyle,
        ]}
      >
        <View>
          <Text style={styles.selectedCount}>
            {selectedCourseIds.length} course
            {selectedCourseIds.length !== 1 ? "s" : ""}
          </Text>
          <Text style={styles.totalPrice}>
            Total: $
            {allCourses
              .filter((c) => selectedCourseIds.includes(c.id))
              .reduce((acc, c) => acc + (c.price || 0), 0)
              .toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleProceedToCheckout}
        >
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </Animated.View>
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
    marginBottom: theme.spacing.lg,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: 16,
    color: "#000",
    fontWeight: '500',
  },
  categoriesScroll: {
    marginBottom: theme.spacing.xl,
  },
  categoriesContent: {
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeCategoryChip: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  activeCategoryChipText: {
    color: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#000",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary.main,
  },
  listContent: {
    paddingBottom: 120,
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
  selectedCourseCard: {
    borderColor: theme.colors.primary.main,
    backgroundColor: "#fff",
    borderWidth: 2,
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
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  courseInstructor: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
  },
  coursePrice: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.primary.main,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  courseRating: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59E0B',
    marginLeft: 4,
  },
  selectionIndicator: {
    marginLeft: 8,
  },
  selectedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary.main,
    justifyContent: "center",
    alignItems: "center",
  },
  unselectedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
    bottomActionBar: {
      position: "absolute",
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      backgroundColor: "#fff",
      borderTopWidth: 1,
      borderTopColor: "#F3F4F6",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 20,
    },
  selectedCount: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: "600",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  checkoutButton: {
    backgroundColor: "#000",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: theme.colors.text.secondary,
    fontSize: 16,
  },
});
