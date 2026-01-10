import { ROUTES } from "@/shared/routes";
import { useAppSelector } from "@/shared/store";
import { courses } from "@/shared/api/endpoints";
import { commonStyles, theme } from "@/shared/styles";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
} from "react-native";
import { supabase } from "@/shared/api/supabase";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: string;
  rating: number;
  price: number;
  thumbnail_url?: string;
  category: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { courseIds } = useLocalSearchParams();
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  // Parse course IDs from URL params
  const courseIdsArray = typeof courseIds === 'string' ? courseIds.split(',') : [];

  useEffect(() => {
    if (!isAuthenticated) {
      // If user is not authenticated, redirect to login with course IDs
      router.replace({
        pathname: ROUTES.AUTH.LOGIN as any,
        params: { 
          redirectTo: "checkout",
          courseIds: courseIdsArray.join(',')
        }
      });
      return;
    }

    if (courseIdsArray.length > 0) {
      loadSelectedCourses();
    } else {
      // If no courses selected, redirect back to explore
      router.replace(ROUTES.TABS.EXPLORE);
    }
  }, [isAuthenticated, courseIdsArray, router]);

  const loadSelectedCourses = async () => {
    try {
      setLoading(true);
      const coursePromises = courseIdsArray.map(id => courses.getById(id));
      const loadedCourses = await Promise.all(coursePromises);
      setSelectedCourses(loadedCourses);
    } catch (error) {
      console.error("Error loading selected courses:", error);
        Alert.alert("Error", "Failed to load selected courses. Please try again.");
        router.replace(ROUTES.TABS.EXPLORE);
      } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = () => {
    return selectedCourses.reduce((total, course) => total + course.price, 0);
  };

  const handleCompletePurchase = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to complete the purchase.");
      return;
    }

    try {
      setProcessingPayment(true);

      // Enroll user in all selected courses
      for (const course of selectedCourses) {
        await courses.enroll(user.id, course.id);
      }

      // Show success message
      Alert.alert(
        "Purchase Successful!",
        `You've successfully enrolled in ${selectedCourses.length} course${selectedCourses.length !== 1 ? 's' : ''}.`,
        [
            {
              text: "Continue Learning",
              onPress: () => {
                router.replace(ROUTES.TABS.INDEX);
              }
            }
        ]
      );
    } catch (error) {
      console.error("Error completing purchase:", error);
      Alert.alert("Error", "Failed to complete purchase. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const renderCourseItem = ({ item }: { item: Course }) => (
    <View style={styles.courseItem}>
      {item.thumbnail_url ? (
        <Image source={{ uri: item.thumbnail_url }} style={styles.itemThumbnail} />
      ) : (
        <View style={styles.placeholderThumbnail}>
          <Text style={styles.placeholderText}>{item.title.charAt(0)}</Text>
        </View>
      )}
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemInstructor}>By {item.instructor}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[commonStyles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Text style={styles.loadingText}>Loading your selection...</Text>
      </View>
    );
  }

  return (
    <View style={[commonStyles.container, styles.container]}>
      <View style={styles.header}>
        <Text style={styles.title}>Checkout</Text>
        <Text style={styles.subtitle}>Review your course selection</Text>
      </View>

      <FlatList
        data={selectedCourses}
        renderItem={renderCourseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.summarySection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${getTotalPrice().toFixed(2)}</Text>
        </View>
        
        <TouchableOpacity
          style={[commonStyles.button, commonStyles.buttonPrimary, styles.purchaseButton]}
          onPress={handleCompletePurchase}
          disabled={processingPayment}
        >
          {processingPayment ? (
            <ActivityIndicator size="small" color={theme.colors.primary.contrast} />
          ) : (
            <Text style={styles.purchaseButtonText}>Complete Purchase</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.default,
    flex: 1,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.typography.fontSize["2xl"],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  courseItem: {
    flexDirection: "row",
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemThumbnail: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.md,
  },
  placeholderThumbnail: {
    width: 60,
    height: 60,
    backgroundColor: theme.colors.background.default,
    borderRadius: theme.borderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  placeholderText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
  },
  itemInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  itemInstructor: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  itemPrice: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
  },
  summarySection: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background.paper,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  totalLabel: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  totalAmount: {
    fontSize: theme.typography.fontSize["2xl"],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
  },
  purchaseButton: {
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  purchaseButtonText: {
    color: theme.colors.primary.contrast,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: "center",
  },
});