import { supabase } from "@/shared/api/supabase";
import type { Course } from "@/shared/types/course";
import type { User } from "@/shared/types/user";

// ============================================================================
// Types
// ============================================================================

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// ============================================================================
// Helper for consistent error handling
// ============================================================================

const handleApiError = (
  error: any,
  defaultMessage: string = "Request failed"
) => {
  if (error?.message) {
    throw new Error(error.message);
  }
  throw new Error(defaultMessage);
};

// ============================================================================
// API Endpoints
// ============================================================================

export const api = {
  // ==========================================================================
  // Authentication
  // ==========================================================================
  auth: {
    login: async (email: string, password: string): Promise<LoginResponse> => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) handleApiError(error, "Login failed");
      if (!data.user || !data.session) throw new Error("Login failed");

      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name || data.user.email!.split("@")[0],
          role: "student",
          createdAt: data.user.created_at,
          updatedAt: data.user.updated_at || data.user.created_at,
        },
        token: data.session.access_token,
      };
    },

    register: async (userData: RegisterData): Promise<LoginResponse> => {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
          },
        },
      });

      if (error) handleApiError(error, "Registration failed");
      if (!data.user || !data.session) throw new Error("Registration failed");

      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: userData.name,
          role: "student",
          createdAt: data.user.created_at,
          updatedAt: data.user.updated_at || data.user.created_at,
        },
        token: data.session.access_token,
      };
    },

    logout: async (): Promise<void> => {
      const { error } = await supabase.auth.signOut();
      if (error) handleApiError(error, "Logout failed");
    },

    getCurrentSession: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) handleApiError(error, "Failed to get session");
      return data.session;
    },

    getCurrentUser: async (): Promise<User | null> => {
      const { data, error } = await supabase.auth.getUser();

      if (error) handleApiError(error, "Failed to get user");
      if (!data.user) return null;

      return {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name || data.user.email!.split("@")[0],
        role: "student",
        createdAt: data.user.created_at,
        updatedAt: data.user.updated_at || data.user.created_at,
      };
    },

    forgotPassword: async (email: string): Promise<{ message: string }> => {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) handleApiError(error, "Failed to send password reset email");
      return { message: "Password reset email sent" };
    },

    updatePassword: async (
      newPassword: string
    ): Promise<{ success: boolean }> => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) handleApiError(error, "Failed to update password");
      return { success: true };
    },

    updateProfile: async (
      userId: string,
      updates: Partial<User>
    ): Promise<User> => {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: updates.name,
        },
      });

      if (error) handleApiError(error, "Failed to update profile");

      const user = await api.auth.getCurrentUser();
      if (!user) throw new Error("User not found");

      return user;
    },
  },

  // ==========================================================================
  // Courses
  // ==========================================================================
  courses: {
    getAll: async (): Promise<Course[]> => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) handleApiError(error, "Failed to fetch courses");
      return data || [];
    },

    getById: async (courseId: string): Promise<Course> => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (error) handleApiError(error, "Failed to fetch course");
      return data;
    },

    getEnrolled: async (userId: string): Promise<Course[]> => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("course_id, courses(*)")
        .eq("user_id", userId);

      if (error) handleApiError(error, "Failed to fetch enrolled courses");

      const courses = data?.map((enrollment: any) => enrollment.courses) || [];
      return courses;
    },

    enroll: async (userId: string, courseId: string): Promise<void> => {
      const { error } = await supabase.from("enrollments").insert({
        user_id: userId,
        course_id: courseId,
        progress: 0,
      });

      if (error) handleApiError(error, "Failed to enroll in course");
    },

    getByCategory: async (category: string): Promise<Course[]> => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("category", category)
        .order("created_at", { ascending: false });

      if (error) handleApiError(error, "Failed to fetch courses by category");
      return data || [];
    },

    search: async (query: string): Promise<Course[]> => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order("rating", { ascending: false });

      if (error) handleApiError(error, "Failed to search courses");
      return data || [];
    },

    getFeatured: async (): Promise<Course[]> => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .gte("rating", 4.5)
        .order("rating", { ascending: false })
        .limit(10);

      if (error) handleApiError(error, "Failed to fetch featured courses");
      return data || [];
    },

    rate: async (
      courseId: string,
      rating: number,
      userId: string
    ): Promise<void> => {
      const { error } = await supabase.from("course_ratings").insert({
        course_id: courseId,
        user_id: userId,
        rating,
      });

      if (error) handleApiError(error, "Failed to rate course");
    },

    getLessons: async (courseId: string): Promise<any[]> => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true });

      if (error) handleApiError(error, "Failed to fetch lessons");
      return data || [];
    },

    isEnrolled: async (userId: string, courseId: string): Promise<boolean> => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .single();

      return !error && !!data;
    },
  },

  // ==========================================================================
  // Progress Tracking
  // ==========================================================================
  progress: {
    get: async (userId: string, courseId: string): Promise<any> => {
      const { data, error } = await supabase
        .from("progress")
        .select("*")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned
        handleApiError(error, "Failed to fetch progress");
      }

      return data || { progress: 0 };
    },

    update: async (
      userId: string,
      courseId: string,
      lessonId: string,
      progress: number
    ): Promise<void> => {
      const { error } = await supabase.from("progress").upsert({
        user_id: userId,
        course_id: courseId,
        lesson_id: lessonId,
        progress,
        updated_at: new Date().toISOString(),
      });

      if (error) handleApiError(error, "Failed to update progress");
    },

    markComplete: async (
      userId: string,
      courseId: string,
      lessonId: string
    ): Promise<void> => {
      await api.progress.update(userId, courseId, lessonId, 100);
    },
  },

  // ==========================================================================
  // Payments (placeholder for future implementation)
  // ==========================================================================
  payment: {
    createIntent: async (courseId: string, amount: number): Promise<any> => {
      // TODO: Implement payment intent creation
      throw new Error("Payment functionality not yet implemented");
    },

    confirmPayment: async (paymentIntentId: string): Promise<any> => {
      // TODO: Implement payment confirmation
      throw new Error("Payment functionality not yet implemented");
    },
  },
};

// Named exports for convenience
export const { auth, courses, progress, payment } = api;
