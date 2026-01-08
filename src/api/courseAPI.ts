import type { Course } from "@/types/course";
import { supabase } from "@/services/supabase";

export const courseAPI = {
  getAllCourses: async (): Promise<Course[]> => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  getCourseById: async (courseId: string): Promise<Course> => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  getEnrolledCourses: async (userId: string): Promise<Course[]> => {
    const { data, error } = await supabase
      .from("enrollments")
      .select("course_id, courses(*)")
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    
    // Extract courses from the joined data
    const courses = data?.map((enrollment: any) => enrollment.courses) || [];
    return courses;
  },

  enrollCourse: async (userId: string, courseId: string): Promise<void> => {
    const { error } = await supabase
      .from("enrollments")
      .insert({
        user_id: userId,
        course_id: courseId,
        progress: 0,
      });

    if (error) throw new Error(error.message);
  },

  getCoursesByCategory: async (category: string): Promise<Course[]> => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  searchCourses: async (query: string): Promise<Course[]> => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order("rating", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  getFeaturedCourses: async (): Promise<Course[]> => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .gte("rating", 4.5)
      .order("rating", { ascending: false })
      .limit(10);

    if (error) throw new Error(error.message);
    return data || [];
  },

  rateCourse: async (
    courseId: string,
    rating: number,
    userId: string
  ): Promise<void> => {
    // This would typically update a ratings table
    // For now, we'll just update the course's average rating
    const { error } = await supabase
      .from("course_ratings")
      .insert({
        course_id: courseId,
        user_id: userId,
        rating,
      });

    if (error) throw new Error(error.message);
  },

  // Get lessons for a specific course
  getCourseLessons: async (courseId: string): Promise<any[]> => {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  // Check if user is enrolled in a course
  isEnrolled: async (userId: string, courseId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .single();

    return !error && !!data;
  },
};

