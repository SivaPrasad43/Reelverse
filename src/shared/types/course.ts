export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorId: string;
  thumbnail?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  totalRatings: number;
  totalStudents: number;
  duration: string; // e.g., "10 hours"
  level: "beginner" | "intermediate" | "advanced" | "expert";
  category: string;
  tags?: string[];
  lessons: Lesson[];
  requirements?: string[];
  whatYouWillLearn?: string[];
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  isFeatured?: boolean;
  progress?: number; // For enrolled courses, track completion percentage
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  type: "video" | "article" | "quiz" | "assignment";
  duration: number; // in minutes
  order: number;
  videoUrl?: string;
  content?: string;
  resources?: Resource[];
  isPreview?: boolean;
  isCompleted?: boolean;
}

export interface Resource {
  id: string;
  name: string;
  type: "pdf" | "video" | "link" | "file";
  url: string;
  size?: string;
}

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  coursesCount: number;
}

export interface CourseReview {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  completedAt?: string;
  progress: number;
  status: "active" | "completed" | "dropped";
}
