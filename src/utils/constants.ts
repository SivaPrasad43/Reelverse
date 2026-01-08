// Constants for the LMS app

export const APP_NAME = "ReelVerse";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    VERIFY: "/auth/verify",
  },
  COURSES: {
    GET_ALL: "/courses",
    GET_BY_ID: "/courses/",
    SEARCH: "/courses/search",
    ENROLL: "/courses/enroll",
    GET_LESSONS: "/courses/lessons",
  },
  PROGRESS: {
    GET_USER_PROGRESS: "/progress/user",
    UPDATE_LESSON: "/progress/lesson",
    SUBMIT_QUIZ: "/progress/quiz",
  },
  PAYMENTS: {
    CREATE_INTENT: "/payments/create-intent",
    CONFIRM: "/payments/confirm",
    HISTORY: "/payments/history",
  },
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  USER_DATA: "userData",
  REFRESH_TOKEN: "refreshToken",
  ONBOARDING_COMPLETED: "onboardingCompleted",
};

export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]{10,}$/,
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/(auth)/login",
  REGISTER: "/(auth)/register",
  PROFILE: "/(tabs)/profile",
  COURSE_DETAIL: "/course/",
  VIDEO_PLAYER: "/video/",
  QUIZ: "/quiz/",
};

export const COLORS = {
  PRIMARY: "#6366F1",
  SECONDARY: "#EC4899",
  SUCCESS: "#10B981",
  ERROR: "#EF4444",
  WARNING: "#F59E0B",
  INFO: "#3B82F6",
};

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
};

export const MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNAUTHORIZED: "Unauthorized. Please log in again.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  REGISTRATION_SUCCESS: "Account created successfully!",
  LOGIN_SUCCESS: "Logged in successfully!",
  LOGOUT_SUCCESS: "Logged out successfully!",
  COURSE_ENROLLED: "Successfully enrolled in course!",
  LESSON_COMPLETED: "Lesson marked as completed!",
  QUIZ_SUBMITTED: "Quiz submitted successfully!",
};