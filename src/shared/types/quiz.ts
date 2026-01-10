export interface Quiz {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  description?: string;
  timeLimit?: number; // in minutes
  passingScore: number; // percentage
  questions: QuizQuestion[];
  attempts: number;
  maxAttempts?: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  type: "multiple-choice" | "true-false" | "short-answer" | "matching";
  question: string;
  options?: QuizOption[];
  correctAnswer: string | string[];
  points: number;
  explanation?: string;
  order: number;
}

export interface QuizOption {
  id: string;
  label: string;
  text: string;
  isCorrect?: boolean;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  answers: QuizAnswer[];
  startedAt: string;
  completedAt?: string;
  timeSpent: number; // in seconds
  passed: boolean;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string | string[];
  isCorrect: boolean;
  points: number;
}

export interface QuizResult {
  attemptId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  timeSpent: number;
  answers: QuizAnswer[];
}
