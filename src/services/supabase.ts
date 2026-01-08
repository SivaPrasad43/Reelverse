import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://aubgubkwgzzrmczyslwj.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1Ymd1Ymt3Z3p6cm1jenlzbHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NTczNTEsImV4cCI6MjA4MzMzMzM1MX0.gh5_mzVdiIuN_CwoBjOiSlyAbqpdFhfO9cLoQqTqlug';

// Create Supabase client with AsyncStorage for session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
