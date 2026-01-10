# ReelVerse Navigation & Routing Guide

## 📱 App Navigation Structure

Your ReelVerse LMS app now has a complete navigation system with all screens properly set up and routed.

## 🗺️ Navigation Flow

```
App Root (app/_layout.tsx)
│
├── Index (app/index.tsx) - Auth Router
│   ├── If authenticated → (tabs)
│   └── If not authenticated → (auth)/login
│
├── Auth Stack (app/(auth)/)
│   ├── login.tsx - Login Screen
│   └── register.tsx - Register Screen
│
├── Tabs (app/(tabs)/)
│   ├── index.tsx - Home Screen (Course Listing)
│   ├── my-courses.tsx - My Enrolled Courses
│   ├── explore.tsx - Explore/Discover
│   └── profile.tsx - User Profile
│
├── Course Detail (app/course/[id].tsx)
│   └── Dynamic route for individual course details
│
├── Video Player (app/video/[id].tsx)
│   └── Dynamic route for watching lessons
│
└── Quiz (app/quiz/[id].tsx)
    └── Dynamic route for taking quizzes
```

## 📄 Screen Details

### 1. **Entry Point** - [app/index.tsx](app/index.tsx)

- **Purpose:** Authentication router
- **Logic:**
  - Shows loader while checking auth status
  - Redirects to `(tabs)` if authenticated
  - Redirects to `(auth)/login` if not authenticated
- **Props:** None
- **Redux State:** `auth.isAuthenticated`, `auth.isLoading`

### 2. **Auth Screens**

#### Login Screen - [app/(auth)/login.tsx](<app/(auth)/login.tsx>)

- **Route:** `/(auth)/login`
- **Features:**
  - Email/password login
  - Form validation
  - "Forgot Password" link (placeholder)
  - "Create Account" button → Register screen
- **Redux Actions:** `loginUser()`
- **Navigation:** Auto-navigates to `/(tabs)` on success

#### Register Screen - [app/(auth)/register.tsx](<app/(auth)/register.tsx>)

- **Route:** `/(auth)/register`
- **Features:**
  - Full name, email, password, confirm password
  - Validation (password length, match)
  - "Sign In" link → Back to login
- **Redux Actions:** `registerUser()`
- **Navigation:** Auto-navigates to `/(tabs)` on success

### 3. **Tab Screens**

#### Home Screen - [app/(tabs)/index.tsx](<app/(tabs)/index.tsx>)

- **Route:** `/(tabs)` or `/(tabs)/index`
- **Features:**
  - Personalized greeting
  - Course listing (grid/list)
  - Pull to refresh
  - Search functionality (coming soon)
- **Redux State:** `courses.courses`, `auth.user`
- **Navigation:** Tap course → `/course/[id]`

#### My Courses Screen - [app/(tabs)/my-courses.tsx](<app/(tabs)/my-courses.tsx>)

- **Route:** `/(tabs)/my-courses`
- **Features:**
  - Enrolled courses list
  - Progress bars for each course
  - Pull to refresh
  - Empty state with "Explore" button
- **Redux State:** `courses.enrolledCourses`
- **Navigation:** Tap course → `/course/[id]`

#### Explore Screen - [app/(tabs)/explore.tsx](<app/(tabs)/explore.tsx>)

- **Route:** `/(tabs)/explore`
- **Features:**
  - Categories browser
  - Featured courses
  - Search by topic
- **Status:** Template provided (customize as needed)

#### Profile Screen - [app/(tabs)/profile.tsx](<app/(tabs)/profile.tsx>)

- **Route:** `/(tabs)/profile`
- **Features:**
  - User avatar & info
  - Statistics (courses, certificates, hours)
  - Menu items:
    - Edit Profile
    - My Courses
    - Certificates
    - Settings
    - Help & Support
  - Logout button
- **Redux State:** `auth.user`, `courses.enrolledCourses`
- **Redux Actions:** `logoutUser()`

### 4. **Course Detail Screen** - [app/course/[id].tsx](app/course/[id].tsx)

- **Route:** `/course/[id]`
- **Params:** `id` (course ID)
- **Features:**
  - Course thumbnail
  - Title, instructor, rating, students
  - Description
  - "What you'll learn" section
  - Lesson list with preview badges
  - Enroll button (or "Already Enrolled")
  - Price display
- **Redux State:** `courses.currentCourse`, `auth.user`
- **Redux Actions:** `fetchCourseById(id)`
- **Navigation:**
  - Tap lesson → `/video/[id]?courseId=[courseId]`
  - Back button → Previous screen

### 5. **Video Player Screen** - [app/video/[id].tsx](app/video/[id].tsx)

- **Route:** `/video/[id]`
- **Params:** `id` (lesson ID), `courseId` (course ID)
- **Features:**
  - Video player (placeholder for now)
  - Lesson title & description
  - Duration display
  - Learning objectives list
  - "Mark as Complete" button
  - Completed badge if already done
- **API Calls:** `progressAPI.markLessonComplete()`
- **Navigation:** Back button → Previous screen

### 6. **Quiz Screen** - [app/quiz/[id].tsx](app/quiz/[id].tsx)

- **Route:** `/quiz/[id]`
- **Params:** `id` (quiz ID), `courseId` (course ID)
- **Features:**
  - Question progress indicator
  - Multiple choice options
  - Previous/Next navigation
  - Submit quiz
  - Results screen with score
  - Retry option (if failed)
- **API Calls:** `progressAPI.submitQuizScore()`
- **Navigation:**
  - Close button → Back to course
  - "Try Again" → Reset quiz

## 🔄 Navigation Methods

### Using `useRouter()` Hook

```typescript
import { useRouter } from "expo-router";

const router = useRouter();

// Navigate to a screen
router.push("/course/123");

// Navigate with params
router.push({
  pathname: "/video/[id]",
  params: { id: "lesson-1", courseId: "course-1" },
});

// Go back
router.back();

// Replace current screen
router.replace("/(tabs)");
```

### Using `<Link>` Component

```typescript
import { Link } from "expo-router";

<Link href="/course/123">View Course</Link>

<Link
  href={{
    pathname: "/video/[id]",
    params: { id: "lesson-1" }
  }}
>
  Watch Lesson
</Link>
```

## 🎨 Tab Bar Configuration

Located in [app/(tabs)/\_layout.tsx](<app/(tabs)/_layout.tsx>)

**4 Tabs:**

1. 🏠 **Home** - Course discovery
2. 📚 **My Courses** - Enrolled courses
3. 🔍 **Explore** - Search & categories
4. 👤 **Profile** - User settings

## 🔐 Authentication Flow

```
App Start
    ↓
Index checks auth status (Redux)
    ↓
    ├─ Authenticated → (tabs)/index
    └─ Not Authenticated → (auth)/login
            ↓
        Login Success
            ↓
        Redirect to (tabs)
```

## 📍 Dynamic Routes

### Course Detail: `/course/[id]`

```typescript
// Access params
const { id } = useLocalSearchParams<{ id: string }>();

// Navigate to
router.push(`/course/${courseId}`);
```

### Video Player: `/video/[id]`

```typescript
// Access params
const { id, courseId } = useLocalSearchParams<{
  id: string;
  courseId: string;
}>();

// Navigate to
router.push({
  pathname: "/video/[id]",
  params: { id: lessonId, courseId },
});
```

### Quiz: `/quiz/[id]`

```typescript
// Access params
const { id, courseId } = useLocalSearchParams<{
  id: string;
  courseId: string;
}>();

// Navigate to
router.push({
  pathname: "/quiz/[id]",
  params: { id: quizId, courseId },
});
```

## 🛠️ Common Navigation Patterns

### 1. Navigate to Course Detail from Home

```typescript
<TouchableOpacity onPress={() => router.push(`/course/${item.id}`)}>
  <CourseCard course={item} />
</TouchableOpacity>
```

### 2. Navigate to Lesson from Course Detail

```typescript
const handleLessonPress = (lesson: Lesson) => {
  router.push({
    pathname: "/video/[id]",
    params: { id: lesson.id, courseId: courseId },
  });
};
```

### 3. Navigate After Login

```typescript
await dispatch(loginUser({ email, password })).unwrap();
router.replace("/(tabs)"); // Use replace to prevent back navigation
```

### 4. Logout and Go to Login

```typescript
await dispatch(logoutUser());
router.replace("/(auth)/login");
```

## 🚀 Testing Navigation

### Test Flow Checklist:

- [ ] App opens and checks auth status
- [ ] Redirects to login if not authenticated
- [ ] Login navigates to home tab
- [ ] All 4 tabs are accessible
- [ ] Tapping course card opens course detail
- [ ] Tapping lesson opens video player
- [ ] Back buttons work correctly
- [ ] Tab bar persists across tab screens
- [ ] Logout returns to login screen
- [ ] Register screen accessible from login

## 🎯 Next Steps

### Enhance Navigation:

1. **Add Search Screen** - Create dedicated search interface
2. **Add Cart Screen** - Shopping cart for course purchases
3. **Add Notifications** - Push notification center
4. **Add Deep Linking** - Handle external links
5. **Add Loading States** - Skeleton screens for better UX

### Integration:

1. Replace mock data with real Supabase data
2. Add video player library (expo-av or react-native-video)
3. Implement real-time progress tracking
4. Add analytics tracking for navigation events

## 📝 File Structure

```
app/
├── _layout.tsx              # Root layout with Redux
├── index.tsx                # Auth router
├── (auth)/
│   ├── _layout.tsx          # Auth stack
│   ├── login.tsx            # Login screen
│   └── register.tsx         # Register screen
├── (tabs)/
│   ├── _layout.tsx          # Tab navigator
│   ├── index.tsx            # Home tab
│   ├── my-courses.tsx       # My courses tab
│   ├── explore.tsx          # Explore tab
│   └── profile.tsx          # Profile tab
├── course/
│   └── [id].tsx             # Course detail
├── video/
│   └── [id].tsx             # Video player
└── quiz/
    └── [id].tsx             # Quiz screen

src/features/
├── auth/
│   ├── LoginScreen.tsx      # Login UI
│   └── RegisterScreen.tsx   # Register UI
├── course/
│   ├── CourseDetailScreen.tsx
│   ├── MyCoursesScreen.tsx
│   └── VideoPlayerScreen.tsx
├── home/
│   └── HomeScreen.tsx
├── profile/
│   └── ProfileScreen.tsx
└── quiz/
    └── QuizScreen.tsx
```

## 🐛 Troubleshooting

### Navigation not working?

1. Check if route is registered in `app/_layout.tsx`
2. Verify file naming matches route pattern
3. Check for TypeScript errors in screen components

### Params not passed correctly?

1. Use `useLocalSearchParams()` to access params
2. Ensure params are passed as strings
3. Type your params interface properly

### Redux state not updating?

1. Check if Redux action is dispatched
2. Verify reducer is handling action
3. Use Redux DevTools to inspect state

---

**Your navigation is now complete and ready to use!** 🎉

All screens are connected, authentication flow works, and the app has a professional routing structure.
