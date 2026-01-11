import { ROUTES } from "@/shared/routes";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchCourses } from "@/shared/store/slices/courseSlice";
import { logoutUser } from "@/shared/store/slices/authSlice";
import { commonStyles, theme } from "@/shared/styles";
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
    Image,
    ScrollView,
    Dimensions,
  } from "react-native";
import { mockCourses } from "@/shared/data/mockData";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', title: 'Live Class', icon: 'videocam', color: '#E0E7FF', iconColor: '#6366F1' },
  { id: '2', title: 'Quizzes', icon: 'extension-puzzle', color: '#FEF3C7', iconColor: '#F59E0B' },
  { id: '3', title: 'Materials', icon: 'document-text', color: '#D1FAE5', iconColor: '#10B981' },
  { id: '4', title: 'Doubts', icon: 'chatbubbles', color: '#FCE7F3', iconColor: '#EC4899' },
];

const HERO_BANNERS = [
  { id: '1', title: 'Master React Native', subtitle: 'Join the bootcamp today!', color: '#6366F1' },
  { id: '2', title: 'Full Stack Development', subtitle: 'New course available', color: '#EC4899' },
];

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { courses, isLoading } = useAppSelector((state) => state.courses);
  const { user } = useAppSelector((state) => state.auth);
  const [localCourses, setLocalCourses] = useState(mockCourses);

  useEffect(() => {
    setLocalCourses(mockCourses);
  }, [dispatch]);

  const loadCourses = () => {
    setLocalCourses(mockCourses);
  };

  const renderHeroSection = () => (
    <ScrollView 
      horizontal 
      pagingEnabled 
      showsHorizontalScrollIndicator={false}
      style={styles.heroScroll}
    >
      {HERO_BANNERS.map((banner) => (
        <View key={banner.id} style={[styles.heroCard, { backgroundColor: banner.color }]}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>{banner.title}</Text>
            <Text style={styles.heroSubtitle}>{banner.subtitle}</Text>
            <TouchableOpacity style={styles.heroButton}>
              <Text style={styles.heroButtonText}>Enroll Now</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.heroImagePlaceholder}>
             <Ionicons name="rocket" size={80} color="rgba(255,255,255,0.3)" />
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      {CATEGORIES.map((cat) => (
        <TouchableOpacity key={cat.id} style={styles.categoryItem}>
          <View style={[styles.categoryIcon, { backgroundColor: cat.color }]}>
            <Ionicons name={cat.icon as any} size={24} color={cat.iconColor} />
          </View>
          <Text style={styles.categoryTitle}>{cat.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        <View style={styles.userInfo}>
          <View style={styles.avatarPlaceholder}>
             <Ionicons name="person" size={24} color={theme.colors.primary.main} />
          </View>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || 'Student'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
           <Ionicons name="notifications-outline" size={24} color="#000" />
           <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      {renderHeroSection()}
      {renderCategories()}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Continue Learning</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCourseCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => router.push(ROUTES.COURSE(item.id) as any)}
    >
      <View style={[styles.courseImageContainer, { backgroundColor: theme.colors.pastel.lavender }]}>
         <Ionicons name="play-circle" size={40} color={theme.colors.primary.main} />
      </View>
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.courseMeta}>
          <Ionicons name="time-outline" size={14} color={theme.colors.text.secondary} />
          <Text style={styles.courseDate}>26 Apr, 6:30pm</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: '45%' }]} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.safeArea}>
      <FlatList
        data={localCourses}
        renderItem={renderCourseCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={loadCourses} />
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
    marginBottom: theme.spacing.lg,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.pastel.lavender,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.sm,
  },
  welcomeText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
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
  heroScroll: {
    marginBottom: theme.spacing.lg,
  },
  heroCard: {
    width: width - theme.spacing.md * 2,
    height: 160,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    overflow: 'hidden',
  },
  heroTextContainer: {
    flex: 1,
    zIndex: 1,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 16,
  },
  heroButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 14,
  },
  heroImagePlaceholder: {
    position: 'absolute',
    right: -20,
    bottom: -10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  categoryItem: {
    alignItems: 'center',
    width: (width - theme.spacing.md * 2) / 4,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#000",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary.main,
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
  },
  courseInfo: {
    flex: 1,
    paddingRight: 4,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
    lineHeight: 22,
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseDate: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginLeft: 4,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary.main,
    borderRadius: 3,
  },
});
