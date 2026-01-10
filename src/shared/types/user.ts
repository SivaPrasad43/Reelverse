export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "student" | "instructor" | "admin";
  enrolledCourses?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  bio?: string;
  phone?: string;
  location?: string;
  skills?: string[];
  interests?: string[];
}

export interface UserProgress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  currentLesson?: string;
  progressPercentage: number;
  lastAccessedAt: string;
}
