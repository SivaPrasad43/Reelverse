# ReelVerse - LMS Application 🎓

A modern, scalable Learning Management System built with React Native, Expo, and Redux Toolkit.

## 🏗️ Architecture

This project follows a **feature-based architecture** designed for scalability and maintainability. The structure is organized to support enterprise-level applications with clean separation of concerns.

### Folder Structure

```
reelverse/
├── app/                          # Expo Router pages (routing only)
│   ├── (auth)/                   # Auth routes
│   │   ├── login.tsx             # Re-exports from features
│   │   └── register.tsx
│   ├── (tabs)/                   # Tab navigation
│   │   ├── index.tsx             # Home tab
│   │   ├── explore.tsx           # Explore tab
│   │   └── _layout.tsx
│   ├── _layout.tsx               # Root layout with Redux Provider
│   └── index.tsx                 # Entry point
│
├── src/                          # Main source code
│   ├── api/                      # API Layer (Centralized)
│   │   ├── client.ts             # Axios instance with interceptors
│   │   ├── authAPI.ts            # Auth endpoints
│   │   ├── courseAPI.ts          # Course endpoints
│   │   ├── progressAPI.ts        # Progress endpoints
│   │   ├── paymentAPI.ts         # Payment endpoints
│   │   └── index.ts              # Barrel export
│   │
│   ├── store/                    # Redux Store
│   │   ├── index.ts              # Store configuration
│   │   └── slices/               # Redux slices
│   │       ├── authSlice.ts      # Authentication state
│   │       ├── cartSlice.ts      # Shopping cart state
│   │       ├── courseSlice.ts    # Courses state
│   │       └── progressSlice.ts  # Learning progress state
│   │
│   ├── features/                 # Feature modules (Business Logic)
│   │   ├── auth/                 # Authentication feature
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── ForgotPasswordScreen.tsx
│   │   ├── home/                 # Home feature
│   │   │   └── HomeScreen.tsx
│   │   ├── courses/              # Course feature
│   │   │   ├── CourseListScreen.tsx
│   │   │   ├── CourseDetailScreen.tsx
│   │   │   └── components/
│   │   ├── profile/              # Profile feature
│   │   └── quiz/                 # Quiz feature
│   │
│   ├── shared/                   # Shared resources
│   │   ├── components/           # Reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── Loader.tsx
│   │   │   └── index.ts
│   │   ├── utils/                # Utility functions
│   │   │   └── validators.ts
│   │   └── constants/            # App-wide constants
│   │       └── index.ts
│   │
│   ├── styles/                   # Global styles
│   │   ├── theme.ts              # Theme configuration
│   │   ├── common.ts             # Common styles
│   │   └── index.ts              # Barrel export
│   │
│   ├── types/                    # TypeScript types
│   │   ├── course.ts
│   │   ├── user.ts
│   │   └── quiz.ts
│   │
│   └── hooks/                    # Custom React hooks
│       └── use-color-scheme.ts
│
└── assets/                       # Static assets
    ├── images/
    └── icons/
```

## 🚀 Key Features

### 1. **Redux Toolkit State Management**

- Centralized state management
- Async operations with createAsyncThunk
- Redux Persist for offline data
- Typed hooks (useAppDispatch, useAppSelector)

### 2. **Centralized API Layer**

- Axios with interceptors
- Automatic token management
- Global error handling
- Type-safe API calls

### 3. **Feature-Based Organization**

- Each feature is self-contained
- Easy to scale and maintain
- Clear separation of concerns
- Reusable components in shared/

### 4. **Consistent Theming**

- Centralized theme configuration
- Support for dark/light modes
- Reusable style utilities
- Type-safe styling

### 5. **Type Safety**

- Full TypeScript support
- Typed Redux state
- API response types
- Component prop types

## 📦 Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on specific platform
npm run ios
npm run android
npm run web
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root:

```env
EXPO_PUBLIC_API_URL=https://api.reelverse.com
```

### API Configuration

Update the base URL in `src/api/client.ts`:

```typescript
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://api.reelverse.com";
```

## 📱 Redux Store Structure

```typescript
{
  auth: {
    user: User | null,
    token: string | null,
    isAuthenticated: boolean,
    isLoading: boolean,
    error: string | null
  },
  courses: {
    courses: Course[],
    enrolledCourses: Course[],
    currentCourse: Course | null,
    isLoading: boolean,
    error: string | null
  },
  cart: {
    items: Course[],
    total: number
  },
  progress: {
    userProgress: { [courseId: string]: Progress },
    isLoading: boolean,
    error: string | null
  }
}
```

## 🎨 Using the Theme System

```typescript
import { theme, commonStyles } from '@/shared/styles';

// Use predefined styles
<View style={commonStyles.card}>
  <Text style={commonStyles.textHeading}>Title</Text>
</View>

// Use theme values
<View style={{
  backgroundColor: theme.colors.primary.main,
  padding: theme.spacing.md,
  borderRadius: theme.borderRadius.lg
}}>
```

## 🔌 API Usage

```typescript
import { courseAPI } from "@/shared/api";

// In your component or Redux thunk
const courses = await courseAPI.getAllCourses();
const course = await courseAPI.getCourseById("123");
```

## 🎯 Redux Usage

```typescript
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { loginUser, fetchCourses } from "@/shared/store/slices";

function MyComponent() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  const handleLogin = async () => {
    await dispatch(loginUser({ email, password })).unwrap();
  };

  useEffect(() => {
    dispatch(fetchCourses());
  }, []);
}
```

## 📝 Best Practices

### 1. **Component Organization**

- Keep components small and focused
- Use feature folders for feature-specific components
- Use shared/ for reusable components
- Export components through index.ts files

### 2. **State Management**

- Use Redux for global state
- Use local state for UI-only state
- Use async thunks for API calls
- Keep slices focused on single domains

### 3. **API Calls**

- Always use the centralized API layer
- Never call axios directly in components
- Handle errors at the slice level
- Use loading states consistently

### 4. **Styling**

- Use the theme system for consistency
- Use commonStyles for repeated patterns
- Create StyleSheet for component-specific styles
- Avoid inline styles when possible

### 5. **Type Safety**

- Define types for all data structures
- Use typed hooks (useAppDispatch, useAppSelector)
- Type all function parameters
- Avoid 'any' type

## 🗂️ File Naming Conventions

- **Components**: PascalCase (e.g., `Button.tsx`, `CourseCard.tsx`)
- **Utilities**: camelCase (e.g., `validators.ts`, `formatters.ts`)
- **Types**: camelCase with .ts extension (e.g., `user.ts`, `course.ts`)
- **Constants**: SCREAMING_SNAKE_CASE in files (e.g., `API_URL`, `MAX_SIZE`)

## 🔄 Migration from Old Structure

The old structure used:

- Context API → Now Redux Toolkit
- Scattered services → Now centralized API layer
- Mixed styles → Now unified theme system
- Old screens/ → Now features/
- Deprecated files removed (modal.tsx, old navigators, etc.)

## 🚫 Removed Files

The following unnecessary files have been removed:

- `app/modal.tsx` - Not needed for LMS
- `src/navigation/*` - Using Expo Router
- `src/context/AuthContext.tsx` - Migrated to Redux
- `src/context/CartContext.tsx` - Migrated to Redux
- `src/screens/*` - Moved to features/
- Unused themed components

## 🛠️ Development Workflow

1. **Adding a New Feature**

   ```
   src/features/my-feature/
   ├── MyFeatureScreen.tsx
   ├── components/
   │   └── MyComponent.tsx
   └── index.ts
   ```

2. **Adding API Endpoints**

   - Create or update file in `src/api/`
   - Export from `src/api/index.ts`

3. **Adding State**

   - Create slice in `src/store/slices/`
   - Add to store in `src/store/index.ts`

4. **Adding Types**
   - Add to appropriate file in `src/types/`

## 📚 Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **Expo Router** - File-based routing
- **NativeWind** - Styling (Tailwind for RN)

## 🤝 Contributing

1. Follow the folder structure
2. Use TypeScript strict mode
3. Follow naming conventions
4. Write clean, documented code
5. Test before committing

## 📄 License

MIT

---

**Built with ❤️ for scalable learning**
