import { api } from './endpoints';

/**
 * Authentication API service
 */
export const authAPI = {
  /**
   * Login user
   */
  login: async (email: string, password: string) => {
    try {
      const response = await api.auth.login(email, password);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Register user
   */
  register: async (userData: { email: string; password: string; name: string }) => {
    try {
      const response = await api.auth.register(userData);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  /**
   * Get current user session
   */
  getCurrentSession: async () => {
    try {
      return await api.auth.getCurrentSession();
    } catch (error) {
      console.error('Get session error:', error);
      throw error;
    }
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    try {
      return await api.auth.getCurrentUser();
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },

  /**
   * Forgot password
   */
  forgotPassword: async (email: string) => {
    try {
      return await api.auth.forgotPassword(email);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  /**
   * Update password
   */
  updatePassword: async (newPassword: string) => {
    try {
      return await api.auth.updatePassword(newPassword);
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (userId: string, updates: Partial<any>) => {
    try {
      return await api.auth.updateProfile(userId, updates);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
};

export default authAPI;