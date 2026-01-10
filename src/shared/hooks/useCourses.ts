import { useSelector } from 'react-redux';
import { RootState } from '@/shared/store';

export const useCourses = () => {
  const { courses, enrolledCourses, currentCourse, isLoading, error } = useSelector(
    (state: RootState) => state.courses
  );

  return {
    courses,
    enrolledCourses,
    currentCourse,
    isLoading,
    error,
  };
};