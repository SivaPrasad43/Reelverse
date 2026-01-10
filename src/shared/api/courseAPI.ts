import { api } from './endpoints';
import type { Course } from '@/shared/types/course';

/**
 * Course API service
 */
export const courseAPI = {
  /**
   * Get all courses
   */
  getAllCourses: async (): Promise<Course[]> => {
    try {
      return await api.courses.getAll();
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  /**
   * Get course by ID
   */
  getCourseById: async (courseId: string): Promise<Course> => {
    try {
      return await api.courses.getById(courseId);
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  },

  /**
   * Get enrolled courses for a user
   */
  getEnrolledCourses: async (userId: string): Promise<Course[]> => {
    try {
      return await api.courses.getEnrolled(userId);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      throw error;
    }
  },

  /**
   * Enroll user in a course
   */
  enrollCourse: async (userId: string, courseId: string): Promise<void> => {
    try {
      await api.courses.enroll(userId, courseId);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw error;
    }
  },

  /**
   * Get courses by category
   */
  getCoursesByCategory: async (category: string): Promise<Course[]> => {
    try {
      return await api.courses.getByCategory(category);
    } catch (error) {
      console.error('Error fetching courses by category:', error);
      throw error;
    }
  },

  /**
   * Search courses
   */
  searchCourses: async (query: string): Promise<Course[]> => {
    try {
      return await api.courses.search(query);
    } catch (error) {
      console.error('Error searching courses:', error);
      throw error;
    }
  },

  /**
   * Get featured courses
   */
  getFeaturedCourses: async (): Promise<Course[]> => {
    try {
      return await api.courses.getFeatured();
    } catch (error) {
      console.error('Error fetching featured courses:', error);
      throw error;
    }
  },

  /**
   * Rate a course
   */
  rateCourse: async (courseId: string, rating: number, userId: string): Promise<void> => {
    try {
      await api.courses.rate(courseId, rating, userId);
    } catch (error) {
      console.error('Error rating course:', error);
      throw error;
    }
  },

  /**
   * Get lessons for a course
   */
  getCourseLessons: async (courseId: string): Promise<any[]> => {
    try {
      return await api.courses.getLessons(courseId);
    } catch (error) {
      console.error('Error fetching course lessons:', error);
      throw error;
    }
  },

  /**
   * Check if user is enrolled in a course
   */
  isEnrolled: async (userId: string, courseId: string): Promise<boolean> => {
    try {
      return await api.courses.isEnrolled(userId, courseId);
    } catch (error) {
      console.error('Error checking enrollment:', error);
      throw error;
    }
  },
};

export default courseAPI;