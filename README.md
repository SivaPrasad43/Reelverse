# ReelVerse - Modern LMS Application 🎓

A scalable Learning Management System built with React Native, Expo, and Redux Toolkit.

## 🚀 Quick Start

```bash
npm install
npm start
```

## 🏗️ Architecture Overview

The project follows a **Feature-Based Architecture** designed for scalability and maintainability.

### 📂 Directory Structure

```
src/
├── app/                 # 🚦 Expo Router (File-based routing)
│   ├── (auth)/          # Authentication routes
│   ├── (tabs)/          # Main tab navigation
│   └── _layout.tsx      # Root layout & providers
├── components/          # 🧩 Shared global UI components
│   ├── HapticTab.tsx
│   ├── IconSymbol.tsx
│   └── index.ts
├── features/            # 📦 Feature modules (Business Logic + UI)
│   ├── auth/            # Authentication feature
│   ├── checkout/        # Payment & Checkout
│   ├── courses/         # Course browsing & details
│   ├── home/            # Landing & Home screens
│   ├── profile/         # User profile management
│   └── ...
└── shared/              # 🛠️ Shared utilities & Core Infrastructure
    ├── api/             # API client & Supabase config
    ├── constants/       # App constants (Theme, Colors)
    ├── hooks/           # Custom reusable hooks
    ├── store/           # Redux implementation
    ├── styles/          # Global styles & Theme
    └── utils/           # Helper functions
```

### 🏛️ Core Architectural Concepts

#### 1. Feature-First Separation
Instead of grouping by file type (e.g., `screens/`, `components/`), we group by **feature domain**.
- Each folder in `src/features/` represents a distinct business domain (e.g., `auth`, `courses`).
- A feature folder typically contains its own `screens/`, `components/`, and feature-specific logic.

#### 2. Shared Core (`src/shared`)
Code used across multiple features lives here.
- **State Management**: Redux Toolkit is configured in `src/shared/store`.
- **API Layer**: Centralized Supabase client and API utilities.
- **Theming**: Unified theme constants in `src/shared/constants`.

#### 3. Routing (`src/app`)
We use **Expo Router** for file-based routing.
- The `app/` directory mirrors the navigation structure.
- Routes delegate logic to feature screens immediately (e.g., `app/(auth)/login.tsx` imports from `features/auth/screens/login-screen.tsx`).
- This keeps the routing layer thin and purely focused on navigation configuration.

## �️ Tech Stack

- **Framework**: React Native + Expo
- **Language**: TypeScript
- **State Management**: Redux Toolkit & usage with `useAppSelector` / `useAppDispatch`
- **Navigation**: Expo Router (File-based)
- **Backend / Auth**: Supabase
- **Styling**: NativeWind (Tailwind CSS) / StyleSheet

## 📝 Best Practices

1. **Naming Convention**: Use `kebab-case` for file names (e.g., `login-screen.tsx`, `course-card.tsx`).
2. **Imports**: Use absolute imports via the `@/` alias (e.g., `@/shared/components`).
3. **Component Colocation**: Keep components close to where they are used. If reused globally, move to `src/components`.

## Key Features

- ✅ **Authentication**: Secure login/signup via Supabase.
- ✅ **Course Management**: Browns, view details, and track progress.
- ✅ **Video Player**: Integrated video learning experience.
- ✅ **Quizzes**: Interactive quiz feature for courses.
- ✅ **Offline Support**: Redux Persist for caching state.
