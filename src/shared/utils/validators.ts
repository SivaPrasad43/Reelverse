// Validation utilities for the LMS app

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateName = (name: string): boolean => {
  // At least 2 characters, only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  return nameRegex.test(name) && name.trim().length >= 2;
};

export const validatePhone = (phone: string): boolean => {
  // Basic phone validation (adjust as needed)
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateCourse = (course: any): boolean => {
  return (
    course.title &&
    course.title.length >= 5 &&
    course.description &&
    course.description.length >= 20 &&
    course.price >= 0 &&
    course.category &&
    course.level
  );
};