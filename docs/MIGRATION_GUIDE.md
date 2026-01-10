# Migration Guide: Old Structure → New Architecture

## Overview

This document explains how the codebase was refactored from a basic structure to a scalable, enterprise-ready architecture.

## Key Changes

### 1. State Management: Context → Redux Toolkit

**Before:**

```typescript
// src/context/AuthContext.tsx
const { login, logout, isAuthenticated } = useAuth();
```

**After:**

```typescript
// Using Redux Toolkit
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { loginUser, logoutUser } from "@/shared/store/slices/authSlice";

const dispatch = useAppDispatch();
const { user, isAuthenticated, isLoading } = useAppSelector(
  (state) => state.auth
);

// Dispatch async actions
await dispatch(loginUser({ email, password })).unwrap();
```

### 2. API Calls: Scattered → Centralized

**Before:**

```typescript
// In components
const response = await fetch("/api/courses");
```

**After:**

```typescript
// Centralized API layer
import { courseAPI } from "@/shared/api";

const courses = await courseAPI.getAllCourses();
```

### 3. File Organization: Flat → Feature-Based

**Before:**

```
src/
├── screens/
│   ├── auth/LoginScreen.tsx
│   ├── home/HomeScreen.tsx
│   └── course/CourseListScreen.tsx
└── components/
    └── Button.tsx
```

**After:**

```
src/
├── features/
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   └── components/
│   └── home/
│       └── HomeScreen.tsx
└── shared/
    └── components/
        └── Button.tsx
```

### 4. Styling: Mixed → Unified Theme

**Before:**

```typescript
// Inline styles everywhere
style={{ backgroundColor: '#6366F1', padding: 16 }}
```

**After:**

```typescript
// Using theme system
import { theme, commonStyles } from '@/shared/styles';

style={[
  commonStyles.button,
  { backgroundColor: theme.colors.primary.main }
]}
```

## File-by-File Migration

### AuthContext.tsx → authSlice.ts

| Old File                      | New File                        | Purpose               |
| ----------------------------- | ------------------------------- | --------------------- |
| `src/context/AuthContext.tsx` | `src/store/slices/authSlice.ts` | Auth state management |
| `src/context/CartContext.tsx` | `src/store/slices/cartSlice.ts` | Cart state management |

### Screens → Features

| Old Location                              | New Location                                |
| ----------------------------------------- | ------------------------------------------- |
| `src/screens/auth/LoginScreen.tsx`        | `src/features/auth/LoginScreen.tsx`         |
| `src/screens/home/HomeScreen.tsx`         | `src/features/home/HomeScreen.tsx`          |
| `src/screens/course/CourseListScreen.tsx` | `src/features/courses/CourseListScreen.tsx` |

### Services → API Layer

| Old Location                    | New Location           |
| ------------------------------- | ---------------------- |
| `src/services/authService.ts`   | `src/api/authAPI.ts`   |
| `src/services/courseService.ts` | `src/api/courseAPI.ts` |
| `src/lib/api.ts`                | `src/api/client.ts`    |

### Components → Shared

| Old Location                       | New Location                       |
| ---------------------------------- | ---------------------------------- |
| `src/components/common/Button.tsx` | `src/shared/components/Button.tsx` |
| `src/components/common/Loader.tsx` | `src/shared/components/Loader.tsx` |

## Code Migration Examples

### Example 1: Login Screen

**Before:**

```typescript
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    await login(email, password);
    router.replace("/(tabs)");
  };
}
```

**After:**

```typescript
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { loginUser } from "@/shared/store/slices/authSlice";
import { theme, commonStyles } from "@/shared/styles";

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleLogin = async () => {
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      router.replace("/(tabs)");
    } catch (err) {
      Alert.alert("Error", err);
    }
  };
}
```

### Example 2: Fetching Courses

**Before:**

```typescript
const [courses, setCourses] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchCourses = async () => {
    setLoading(true);
    const response = await fetch("/api/courses");
    const data = await response.json();
    setCourses(data);
    setLoading(false);
  };
  fetchCourses();
}, []);
```

**After:**

```typescript
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchCourses } from "@/shared/store/slices/courseSlice";

const dispatch = useAppDispatch();
const { courses, isLoading } = useAppSelector((state) => state.courses);

useEffect(() => {
  dispatch(fetchCourses());
}, []);
```

### Example 3: Styling

**Before:**

```typescript
<View
  style={{
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
  }}
>
  <Text
    style={{
      fontSize: 24,
      fontWeight: "bold",
      color: "#000000",
    }}
  >
    Title
  </Text>
</View>
```

**After:**

```typescript
import { theme, commonStyles } from "@/shared/styles";

<View style={[commonStyles.container, commonStyles.containerPadding]}>
  <Text style={commonStyles.textHeading}>Title</Text>
</View>;
```

## Removed Files

These files are no longer needed:

- ❌ `app/modal.tsx` - Removed demo modal
- ❌ `src/navigation/AppNavigator.tsx` - Using Expo Router
- ❌ `src/navigation/AuthNavigator.tsx` - Using Expo Router
- ❌ `src/navigation/MainNavigator.tsx` - Using Expo Router
- ❌ `src/context/AuthContext.tsx` - Migrated to Redux
- ❌ `src/context/CartContext.tsx` - Migrated to Redux
- ❌ `src/screens/*` - Moved to features/
- ❌ `src/components/common/hello-wave.tsx` - Demo component
- ❌ `src/components/common/parallax-scroll-view.tsx` - Demo component

## New Dependencies

```json
{
  "@reduxjs/toolkit": "^2.0.0",
  "react-redux": "^9.0.0",
  "redux-persist": "^6.0.0",
  "axios": "^1.6.0"
}
```

## Testing the Migration

1. **Start the development server:**

   ```bash
   npm start
   ```

2. **Test authentication flow:**

   - Try logging in
   - Check if token is persisted
   - Verify Redux DevTools show state

3. **Test API calls:**

   - Fetch courses
   - Check network tab for proper headers
   - Verify error handling

4. **Test navigation:**
   - Navigate between screens
   - Check if auth redirects work
   - Verify tab navigation

## Troubleshooting

### Issue: Import errors

**Solution:** Make sure `@/*` path alias is configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: Redux state not persisting

**Solution:** Check if `PersistGate` is properly configured in `app/_layout.tsx`

### Issue: API calls failing

**Solution:**

1. Check `EXPO_PUBLIC_API_URL` in `.env`
2. Verify API client interceptors
3. Check network logs

## Next Steps

1. **Implement remaining features:**

   - Course detail screen
   - Quiz functionality
   - Profile screen
   - Payment integration

2. **Add tests:**

   - Unit tests for slices
   - Integration tests for API calls
   - E2E tests for critical flows

3. **Performance optimization:**

   - Add memoization where needed
   - Implement virtual lists for long lists
   - Optimize images and assets

4. **Add monitoring:**
   - Error tracking (Sentry)
   - Analytics (Firebase/Amplitude)
   - Performance monitoring

## Resources

- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [Architecture Guide](./ARCHITECTURE.md)

---

**Questions?** Check the [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation.
