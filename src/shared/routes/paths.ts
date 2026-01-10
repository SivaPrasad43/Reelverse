export const ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/(auth)/login",
    REGISTER: "/(auth)/register",
  },
  TABS: {
    INDEX: "/(tabs)",
    EXPLORE: "/(tabs)/explore",
    MY_COURSES: "/(tabs)/my-courses",
    PROFILE: "/(tabs)/profile",
  },
  COURSE: (id: string) => `/course/${id}` as const,
  VIDEO: (id: string) => `/video/${id}` as const,
  QUIZ: (id: string) => `/quiz/${id}` as const,
  CHECKOUT: "/checkout",
  MODAL: "/modal",
} as const;
