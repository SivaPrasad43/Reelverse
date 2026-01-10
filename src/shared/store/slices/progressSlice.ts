import { progressAPI } from "@/shared/api/progressAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Progress {
  courseId: string;
  completedLessons: string[];
  quizScores: { [quizId: string]: number };
  overallProgress: number;
}

interface ProgressState {
  userProgress: { [courseId: string]: Progress };
  isLoading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  userProgress: {},
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUserProgress = createAsyncThunk(
  "progress/fetchUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await progressAPI.getUserProgress(userId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateLessonProgress = createAsyncThunk(
  "progress/updateLesson",
  async (
    {
      userId,
      courseId,
      lessonId,
    }: { userId: string; courseId: string; lessonId: string },
    { rejectWithValue }
  ) => {
    try {
      return await progressAPI.markLessonComplete(userId, courseId, lessonId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitQuiz = createAsyncThunk(
  "progress/submitQuiz",
  async (
    {
      userId,
      courseId,
      quizId,
      score,
    }: { userId: string; courseId: string; quizId: string; score: number },
    { rejectWithValue }
  ) => {
    try {
      return await progressAPI.submitQuizScore(userId, courseId, quizId, score);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user progress
    builder
      .addCase(fetchUserProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProgress = action.payload;
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update lesson progress
    builder.addCase(updateLessonProgress.fulfilled, (state, action) => {
      const { courseId, lessonId } = action.payload;
      if (!state.userProgress[courseId]) {
        state.userProgress[courseId] = {
          courseId,
          completedLessons: [],
          quizScores: {},
          overallProgress: 0,
        };
      }
      if (!state.userProgress[courseId].completedLessons.includes(lessonId)) {
        state.userProgress[courseId].completedLessons.push(lessonId);
      }
    });

    // Submit quiz
    builder.addCase(submitQuiz.fulfilled, (state, action) => {
      const { courseId, quizId, score } = action.payload;
      if (state.userProgress[courseId]) {
        state.userProgress[courseId].quizScores[quizId] = score;
      }
    });
  },
});

export const { clearError } = progressSlice.actions;
export default progressSlice.reducer;
