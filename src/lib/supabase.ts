import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we're in development without env vars
const isDevelopment = import.meta.env.DEV;
const hasSupabaseConfig = supabaseUrl && supabaseAnonKey;

// Create a mock client for development when env vars are missing
const createMockClient = () => {
  console.warn('⚠️ Supabase not configured - using mock client for development');
  
  const mockClient = {
    auth: {
      signInWithPassword: async () => ({ data: null, error: { message: 'Mock client - no auth available' } }),
      signUp: async () => ({ data: null, error: { message: 'Mock client - no auth available' } }),
      signOut: async () => ({ error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: { message: 'Mock client - no database available' } }),
      update: () => ({ data: null, error: { message: 'Mock client - no database available' } }),
      delete: () => ({ data: null, error: { message: 'Mock client - no database available' } }),
      eq: function() { return this; },
      single: function() { return this; },
    }),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: { message: 'Mock client - no storage available' } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  };
  
  return mockClient as any;
};

// Create and export the Supabase client with TypeScript support
export const supabase = (() => {
  // In production, require the environment variables
  if (!isDevelopment && !hasSupabaseConfig) {
    throw new Error('Missing Supabase environment variables in production');
  }
  
  // In development, use mock client if env vars are missing
  if (isDevelopment && !hasSupabaseConfig) {
    return createMockClient();
  }
  
  // Create real client when env vars are available
  return createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
})();

// Export helper to check if Supabase is properly configured
export const isSupabaseConfigured = hasSupabaseConfig;

// Helper function to get the current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Helper function to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};
