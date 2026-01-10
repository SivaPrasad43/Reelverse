import { api } from './endpoints';

/**
 * Progress API service for handling user progress tracking
 */
export const progressAPI = {
  /**
   * Get user progress for a specific course
   */
  getUserProgress: async (userId: string) => {
    try {
      // This would typically fetch all progress data for the user
      // For now, returning a mock response based on the expected interface
      const progressData = await api.progress.get(userId, 'any-course'); // This is a simplified call
      return progressData;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  },

  /**
   * Mark a lesson as complete for a user
   */
  markLessonComplete: async (userId: string, courseId: string, lessonId: string) => {
    try {
      await api.progress.markComplete(userId, courseId, lessonId);
      // Return updated progress data
      return { courseId, lessonId };
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      throw error;
    }
  },

  /**
   * Submit quiz score for a user
   */
  submitQuizScore: async (userId: string, courseId: string, quizId: string, score: number) => {
    try {
      // Update progress based on quiz submission
      await api.progress.update(userId, courseId, quizId, score);
      // Return updated progress data
      return { courseId, quizId, score };
    } catch (error) {
      console.error('Error submitting quiz score:', error);
      throw error;
    }
  },

  /**
   * Update overall progress for a course
   */
  updateCourseProgress: async (userId: string, courseId: string, progress: number) => {
    try {
      await api.progress.update(userId, courseId, 'overall', progress);
      return { userId, courseId, progress };
    } catch (error) {
      console.error('Error updating course progress:', error);
      throw error;
    }
  },
};

export default progressAPI;