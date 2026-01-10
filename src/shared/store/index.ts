import safeStorage from "@/shared/utils/storage";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import courseReducer from "./slices/courseSlice";
import progressReducer from "./slices/progressSlice";

const persistConfig = {
  key: "root",
  storage: safeStorage,
  whitelist: ["auth", "cart"], // Only persist auth and cart
};

const persistedAuthReducer = persistReducer(
  { ...persistConfig, key: "auth" },
  authReducer
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    cart: cartReducer,
    courses: courseReducer,
    progress: progressReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
