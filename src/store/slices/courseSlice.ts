import { courseAPI } from "@/api/courseAPI";
import type { Course } from "@/types/course";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CourseState {
  courses: Course[];
  enrolledCourses: Course[];
  currentCourse: Course | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  enrolledCourses: [],
  currentCourse: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchCourses = createAsyncThunk(
  "courses/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await courseAPI.getAllCourses();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEnrolledCourses = createAsyncThunk(
  "courses/fetchEnrolled",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await courseAPI.getEnrolledCourses(userId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  "courses/fetchById",
  async (courseId: string, { rejectWithValue }) => {
    try {
      return await courseAPI.getCourseById(courseId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const enrollCourse = createAsyncThunk(
  "courses/enroll",
  async (
    { userId, courseId }: { userId: string; courseId: string },
    { rejectWithValue }
  ) => {
    try {
      return await courseAPI.enrollCourse(userId, courseId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCurrentCourse: (state, action: PayloadAction<Course | null>) => {
      state.currentCourse = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all courses
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch enrolled courses
    builder
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.enrolledCourses = action.payload;
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch course by ID
    builder
      .addCase(fetchCourseById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Enroll course - This is handled by the API call directly
    // The API returns void, so we don't need to push to state here
    // The course will be loaded when the user navigates to My Courses
    builder.addCase(enrollCourse.fulfilled, (state, action) => {
      // The course will be loaded when fetchEnrolledCourses is called
    });
  },
});

export const { setCurrentCourse, clearError } = courseSlice.actions;
export default courseSlice.reducer;
