import type { User } from "@/types/user";
import { supabase } from "@/services/supabase";

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export const authAPI = {
  // Login with Supabase
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    if (!data.user || !data.session) throw new Error("Login failed");

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name || data.user.email!.split("@")[0],
        role: "student",
        createdAt: data.user.created_at,
        updatedAt: data.user.updated_at || data.user.created_at,
      },
      token: data.session.access_token,
    };
  },

  // Register with Supabase
  register: async (userData: RegisterData): Promise<LoginResponse> => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
        },
      },
    });

    if (error) throw new Error(error.message);
    if (!data.user || !data.session) throw new Error("Registration failed");

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        name: userData.name,
        role: "student",
        createdAt: data.user.created_at,
        updatedAt: data.user.updated_at || data.user.created_at,
      },
      token: data.session.access_token,
    };
  },

  // Logout
  logout: async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  // Get current session
  getCurrentSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw new Error(error.message);
    return data.session;
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    const { data, error } = await supabase.auth.getUser();

    if (error) throw new Error(error.message);
    if (!data.user) return null;

    return {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name || data.user.email!.split("@")[0],
      role: "student",
      createdAt: data.user.created_at,
      updatedAt: data.user.updated_at || data.user.created_at,
    };
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw new Error(error.message);
    return { message: "Password reset email sent" };
  },

  // Update password
  updatePassword: async (newPassword: string): Promise<{ success: boolean }> => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw new Error(error.message);
    return { success: true };
  },

  // Update profile
  updateProfile: async (
    userId: string,
    updates: Partial<User>
  ): Promise<User> => {
    const { error } = await supabase.auth.updateUser({
      data: {
        name: updates.name,
      },
    });

    if (error) throw new Error(error.message);

    const user = await authAPI.getCurrentUser();
    if (!user) throw new Error("User not found");

    return user;
  },
};
