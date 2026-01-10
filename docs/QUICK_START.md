# 🚀 Quick Start Guide

## Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and update the API URL
# EXPO_PUBLIC_API_URL=https://your-api-url.com
```

### 3. Start Development Server

```bash
npm start
```

## Your First Feature (10 minutes)

### Adding a New Screen

1. **Create feature folder:**

```bash
src/features/my-feature/
├── MyFeatureScreen.tsx
└── components/
    └── MyComponent.tsx
```

2. **Create the screen:**

```typescript
// src/features/my-feature/MyFeatureScreen.tsx
import React from "react";
import { View, Text } from "react-native";
import { commonStyles } from "@/shared/styles";

export default function MyFeatureScreen() {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.textHeading}>My Feature</Text>
    </View>
  );
}
```

3. **Add route:**

```typescript
// app/(tabs)/my-feature.tsx
export { default } from "@/features/my-feature/MyFeatureScreen";
```

### Adding Redux State

1. **Create slice:**

```typescript
// src/store/slices/myFeatureSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MyFeatureState {
  data: any[];
  isLoading: boolean;
}

const initialState: MyFeatureState = {
  data: [],
  isLoading: false,
};

const myFeatureSlice = createSlice({
  name: "myFeature",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<any[]>) => {
      state.data = action.payload;
    },
  },
});

export const { setData } = myFeatureSlice.actions;
export default myFeatureSlice.reducer;
```

2. **Add to store:**

```typescript
// src/store/index.ts
import myFeatureReducer from "./slices/myFeatureSlice";

export const store = configureStore({
  reducer: {
    // ... other reducers
    myFeature: myFeatureReducer,
  },
});
```

3. **Use in component:**

```typescript
import { useAppDispatch, useAppSelector } from '@/shared/store';
import { setData } from '@/shared/store/slices/myFeatureSlice';

const dispatch = useAppDispatch();
const { data } = useAppSelector((state) => state.myFeature);

dispatch(setData([...]));
```

### Adding API Endpoint

1. **Create API file:**

```typescript
// src/api/myFeatureAPI.ts
import { apiService } from "./client";

export const myFeatureAPI = {
  getData: async (): Promise<any[]> => {
    return apiService.get("/my-feature/data");
  },
};
```

2. **Export from index:**

```typescript
// src/api/index.ts
export * from "./myFeatureAPI";
```

3. **Use in component:**

```typescript
import { myFeatureAPI } from "@/shared/api";

const data = await myFeatureAPI.getData();
```

## Common Tasks

### Styling a Component

```typescript
import { StyleSheet } from 'react-native';
import { theme, commonStyles } from '@/shared/styles';

// Use common styles
<View style={commonStyles.card}>

// Or create custom styles
const styles = StyleSheet.create({
  custom: {
    backgroundColor: theme.colors.primary.main,
    padding: theme.spacing.md,
  },
});
```

### Making Authenticated Requests

```typescript
// Authentication is automatic!
// The token is automatically added by the API client
const courses = await courseAPI.getAllCourses();
```

### Handling Forms

```typescript
const [email, setEmail] = useState("");
const [errors, setErrors] = useState({});

const validate = () => {
  if (!isValidEmail(email)) {
    setErrors({ email: "Invalid email" });
    return false;
  }
  return true;
};

const handleSubmit = async () => {
  if (!validate()) return;

  try {
    await dispatch(loginUser({ email, password })).unwrap();
    router.push("/(tabs)");
  } catch (error) {
    Alert.alert("Error", error);
  }
};
```

## Debugging

### Check Redux State

```typescript
// Use Redux DevTools (browser)
// Or log state:
const state = useAppSelector((state) => state);
console.log("Redux State:", state);
```

### Check API Calls

```typescript
// Axios interceptors will log requests/responses
// Or check Network tab in browser DevTools
```

### Common Issues

**Problem:** Import not found

```typescript
// Solution: Use @ alias
import { Button } from "@/shared/components";
```

**Problem:** Redux state not updating

```typescript
// Solution: Use dispatch and unwrap
await dispatch(action()).unwrap();
```

**Problem:** API call failing

```typescript
// Solution: Check .env file and API URL
console.log(process.env.EXPO_PUBLIC_API_URL);
```

## Testing

```bash
# Run linter
npm run lint

# Check TypeScript
npx tsc --noEmit
```

## Building

```bash
# Build for Android
npm run android

# Build for iOS
npm run ios

# Build for Web
npm run web
```

## Resources

- 📖 [Architecture Guide](./ARCHITECTURE.md)
- 🔄 [Migration Guide](./MIGRATION_GUIDE.md)
- 📋 [Summary](./REFACTORING_SUMMARY.md)

---

**Need help?** Check the documentation or reach out to the team! 🚀
