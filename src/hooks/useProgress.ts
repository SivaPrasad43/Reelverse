import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export const useProgress = () => {
  const { userProgress, isLoading, error } = useSelector(
    (state: RootState) => state.progress
  );

  return {
    userProgress,
    isLoading,
    error,
  };
};