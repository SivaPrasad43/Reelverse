import { supabase } from "@/services/supabase";

interface UserProgress {
  courseId: string;
  completedLessons: string[];
  quizScores: { [quizId: string]: number };
  overallProgress: number;
}

interface LessonProgress {
  lesson_id: string;
  completed: boolean;
  watch_time: number;
}

export const progressAPI = {
  getUserProgress: async (
    userId: string
  ): Promise<{ [courseId: string]: UserProgress }> => {
    const { data, error } = await supabase
      .from("enrollments")
      .select("course_id, progress")
      .eq("user_id", userId);

    if (error) throw new Error(error.message);

    // Transform the data into the expected format
    const progressMap: { [courseId: string]: UserProgress } = {};
    data?.forEach((enrollment: any) => {
      progressMap[enrollment.course_id] = {
        courseId: enrollment.course_id,
        completedLessons: [],
        quizScores: {},
        overallProgress: enrollment.progress,
      };
    });

    return progressMap;
  },

  getCourseProgress: async (
    userId: string,
    courseId: string
  ): Promise<UserProgress> => {
    // Get enrollment progress
    const { data: enrollment, error: enrollError } = await supabase
      .from("enrollments")
      .select("progress")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .single();

    if (enrollError) throw new Error(enrollError.message);

    // Get completed lessons
    const { data: lessonProgress, error: lessonError } = await supabase
      .from("lesson_progress")
      .select("lesson_id, completed")
      .eq("user_id", userId)
      .eq("completed", true);

    if (lessonError) throw new Error(lessonError.message);

    // Get quiz scores
    const { data: quizAttempts, error: quizError } = await supabase
      .from("quiz_attempts")
      .select("quiz_id, score")
      .eq("user_id", userId);

    if (quizError) throw new Error(quizError.message);

    const completedLessons = lessonProgress?.map((lp: any) => lp.lesson_id) || [];
    const quizScores: { [quizId: string]: number } = {};
    quizAttempts?.forEach((attempt: any) => {
      quizScores[attempt.quiz_id] = attempt.score;
    });

    return {
      courseId,
      completedLessons,
      quizScores,
      overallProgress: enrollment?.progress || 0,
    };
  },

  markLessonComplete: async (
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<{ courseId: string; lessonId: string }> => {
    // Mark lesson as completed
    const { error: progressError } = await supabase
      .from("lesson_progress")
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString(),
      });

    if (progressError) throw new Error(progressError.message);

    // Update overall course progress
    // Calculate the new progress percentage
    const { data: lessons } = await supabase
      .from("lessons")
      .select("id")
      .eq("course_id", courseId);

    const { data: completedLessons } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", userId)
      .eq("completed", true);

    const totalLessons = lessons?.length || 0;
    const completed = completedLessons?.length || 0;
    const progressPercentage = totalLessons > 0 
      ? Math.round((completed / totalLessons) * 100) 
      : 0;

    // Update enrollment progress
    const { error: enrollError } = await supabase
      .from("enrollments")
      .update({ progress: progressPercentage })
      .eq("user_id", userId)
      .eq("course_id", courseId);

    if (enrollError) throw new Error(enrollError.message);

    return { courseId, lessonId };
  },

  submitQuizScore: async (
    userId: string,
    courseId: string,
    quizId: string,
    score: number
  ): Promise<{ courseId: string; quizId: string; score: number }> => {
    // Get passing score for the quiz
    const { data: quiz } = await supabase
      .from("quizzes")
      .select("passing_score")
      .eq("id", quizId)
      .single();

    const passed = score >= (quiz?.passing_score || 70);

    // Record quiz attempt
    const { error } = await supabase
      .from("quiz_attempts")
      .insert({
        user_id: userId,
        quiz_id: quizId,
        score,
        passed,
      });

    if (error) throw new Error(error.message);

    return { courseId, quizId, score };
  },

  getCertificate: async (userId: string, courseId: string): Promise<string> => {
    // Check if user completed the course
    const { data: enrollment, error } = await supabase
      .from("enrollments")
      .select("progress, completed_at")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .single();

    if (error) throw new Error(error.message);

    if (enrollment?.progress === 100) {
      // In a real implementation, this would generate a PDF certificate
      // For now, return a certificate URL or data
      return `Certificate for course ${courseId}`;
    }

    throw new Error("Course not completed yet");
  },

  // Get lesson progress details
  getLessonProgress: async (
    userId: string,
    lessonId: string
  ): Promise<LessonProgress | null> => {
    const { data, error } = await supabase
      .from("lesson_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("lesson_id", lessonId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(error.message);
    }

    return data;
  },

  // Update watch time for a lesson
  updateWatchTime: async (
    userId: string,
    lessonId: string,
    watchTime: number
  ): Promise<void> => {
    const { error } = await supabase
      .from("lesson_progress")
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        watch_time: watchTime,
      });

    if (error) throw new Error(error.message);
  },
};
