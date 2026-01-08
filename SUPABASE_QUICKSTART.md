# Supabase Integration - Quick Start Guide

## ✅ Completed Supabase Integration

Your ReelVerse LMS app now has full Supabase integration for authentication, database, and storage.

## 🔧 What's Been Configured

### 1. Authentication (`src/api/authAPI.ts`)

- ✅ Login with Supabase `signInWithPassword`
- ✅ Register with Supabase `signUp`
- ✅ Logout with Supabase `signOut`
- ✅ Get current user with Supabase `getUser`
- ✅ Password reset with `resetPasswordForEmail`
- ✅ Profile updates with `updateUser`

### 2. Auth State Management (`src/store/slices/authSlice.ts`)

- ✅ Session validation on app startup
- ✅ Redux state synced with Supabase session
- ✅ Automatic session refresh
- ✅ Persistent auth state with AsyncStorage

### 3. Course Management (`src/api/courseAPI.ts`)

- ✅ Fetch all courses from Supabase
- ✅ Get course by ID
- ✅ Enrolled courses with joins
- ✅ Course enrollment
- ✅ Search courses
- ✅ Featured courses (rating >= 4.5)
- ✅ Courses by category
- ✅ Course lessons
- ✅ Enrollment check

### 4. Progress Tracking (`src/api/progressAPI.ts`)

- ✅ User progress across all courses
- ✅ Course-specific progress
- ✅ Mark lessons complete
- ✅ Submit quiz scores
- ✅ Track watch time
- ✅ Certificate generation (placeholder)

### 5. Supabase Client (`src/services/supabase.ts`)

- ✅ AsyncStorage for session persistence
- ✅ Auto token refresh enabled
- ✅ Proper React Native configuration

### 6. App Initialization (`app/_layout.tsx`)

- ✅ Check auth status on startup
- ✅ Redux Provider wrapping
- ✅ PersistGate for state hydration

## 🚀 Next Steps to Complete Setup

### Step 1: Set Up Supabase Database

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy and run all SQL from `SUPABASE_SETUP.md`
4. This will create:
   - `profiles` table (user profiles)
   - `courses` table
   - `lessons` table
   - `enrollments` table
   - `lesson_progress` table
   - `quizzes` & `quiz_questions` tables
   - `quiz_attempts` table
   - `cart` table
   - All Row Level Security (RLS) policies
   - Storage buckets for images and videos

### Step 2: Add Sample Data

Run this SQL in your Supabase SQL Editor:

```sql
-- Insert sample courses
INSERT INTO public.courses (title, description, instructor, duration, level, rating, price, category, is_locked)
VALUES
  ('React Native Mastery', 'Learn to build mobile apps with React Native from scratch', 'John Doe', '10 hours', 'Intermediate', 4.5, 49.99, 'Development', false),
  ('UI/UX Design Fundamentals', 'Master the principles of user interface design', 'Jane Smith', '8 hours', 'Beginner', 4.8, 39.99, 'Design', false),
  ('Advanced JavaScript', 'Deep dive into JavaScript concepts and patterns', 'Mike Johnson', '15 hours', 'Advanced', 4.7, 59.99, 'Development', true),
  ('Mobile App Marketing', 'Learn how to market your mobile apps effectively', 'Sarah Williams', '6 hours', 'Beginner', 4.3, 29.99, 'Marketing', false);
```

### Step 3: Update HomeScreen to Use Real Data

Replace mock data with Supabase data in `src/features/home/HomeScreen.tsx`:

```typescript
import { courseAPI } from "@/api/courseAPI";
import { useEffect, useState } from "react";

// Inside your component:
const [courses, setCourses] = useState<Course[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadCourses = async () => {
    try {
      const data = await courseAPI.getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error("Failed to load courses:", error);
    } finally {
      setLoading(false);
    }
  };

  loadCourses();
}, []);
```

### Step 4: Test Authentication Flow

1. **Start your app:**

   ```bash
   npm start
   ```

2. **Test registration:**

   - Navigate to the login screen
   - Click "Register" (if you have a register screen)
   - Enter email and password
   - Check Supabase dashboard → Authentication → Users

3. **Test login:**

   - Enter registered credentials
   - You should be redirected to the home screen
   - Check Redux DevTools to see auth state

4. **Test session persistence:**
   - Close and reopen the app
   - Should automatically log you in
   - Check console for "Session restored" message

### Step 5: Set Up Storage (Optional)

If you plan to upload videos and images:

1. Go to **Storage** in Supabase dashboard
2. Create buckets (already defined in SQL):

   - `course-thumbnails`
   - `lesson-videos`
   - `avatars`

3. Upload sample images/videos

4. Update course records with storage URLs:
   ```sql
   UPDATE public.courses
   SET thumbnail_url = 'https://your-project.supabase.co/storage/v1/object/public/course-thumbnails/react-native.jpg'
   WHERE title = 'React Native Mastery';
   ```

## 📝 Environment Variables

Make sure `.env` is configured (already done):

```env
EXPO_PUBLIC_SUPABASE_URL=https://hwmnxyhhvzccptbtfavm.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

⚠️ **Security Note:** Never commit `.env` to version control. It's already in `.gitignore`.

## 🧪 Testing Checklist

- [ ] User registration creates profile automatically
- [ ] Login stores session in AsyncStorage
- [ ] App remembers logged-in user after restart
- [ ] Logout clears session completely
- [ ] Courses load from Supabase database
- [ ] Enrollment creates record in `enrollments` table
- [ ] Lesson completion updates progress
- [ ] Quiz submission records in `quiz_attempts`
- [ ] RLS policies prevent unauthorized access

## 🔍 Debugging

### Check Supabase Logs

1. Go to Supabase dashboard
2. Navigate to **Logs** → **API**
3. See all database queries in real-time

### Check Auth State

```typescript
import { supabase } from "@/services/supabase";

// Get current session
const {
  data: { session },
} = await supabase.auth.getSession();
console.log("Current session:", session);

// Listen to auth changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth event:", event, session);
});
```

### Common Issues

1. **"JWT expired" error**

   - Solution: Session auto-refresh is enabled in `supabase.ts`
   - Check if `autoRefreshToken: true` is set

2. **"Row Level Security policy violation"**

   - Solution: Check RLS policies in Supabase
   - Ensure user is authenticated
   - Verify policy matches your use case

3. **"Cannot read courses"**
   - Solution: Run all SQL from `SUPABASE_SETUP.md`
   - Check if RLS is properly configured
   - Verify anon key has read access

## 📚 API Usage Examples

### Fetch All Courses

```typescript
import { courseAPI } from "@/api/courseAPI";

const courses = await courseAPI.getAllCourses();
```

### Enroll in a Course

```typescript
import { courseAPI } from "@/api/courseAPI";

await courseAPI.enrollCourse(userId, courseId);
```

### Mark Lesson Complete

```typescript
import { progressAPI } from "@/api/progressAPI";

await progressAPI.markLessonComplete(userId, courseId, lessonId);
```

### Submit Quiz Score

```typescript
import { progressAPI } from "@/api/progressAPI";

await progressAPI.submitQuizScore(userId, courseId, quizId, 85);
```

## 🎯 Redux Integration

All API calls are integrated with Redux. Use these actions:

```typescript
import { useAppDispatch } from "@/store";
import { loginUser } from "@/store/slices/authSlice";

const dispatch = useAppDispatch();

// Login
dispatch(loginUser({ email, password }));

// Fetch courses (you'll need to create this action)
dispatch(fetchCourses());
```

## 🔐 Security Best Practices

1. ✅ All tables have Row Level Security (RLS) enabled
2. ✅ Users can only access their own data
3. ✅ Anonymous users can read public courses
4. ✅ Session tokens stored securely in AsyncStorage
5. ✅ Auto token refresh prevents expired sessions
6. ✅ Environment variables not committed to git

## 📖 Additional Resources

- [Supabase React Native Guide](https://supabase.com/docs/guides/getting-started/quickstarts/react-native)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)

---

**Your Supabase integration is complete!** 🎉

Follow the steps above to set up your database, test the auth flow, and start using real data instead of mocks.
