import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Hook for authentication state management
export function useSupabaseAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Supabase is not configured (development mode), set mock state
    if (!isSupabaseConfigured) {
      setSession(null);
      setUser(null);
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      const { session } = data;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(() => {
      setSession(null);
      setUser(null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { session, user, loading };
}

// Hook for events management
export function useEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // If Supabase is not configured, return empty array
      if (!isSupabaseConfigured) {
        setEvents([]);
        setError(null);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('datetime', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: any) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;
      await fetchEvents(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const updateEvent = async (id: string, eventData: any) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchEvents(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchEvents(); // Refresh the list
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent
  };
}

// Hook for attendees management
export function useAttendees() {
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendees = async () => {
    try {
      setLoading(true);
      
      // If Supabase is not configured, return empty array
      if (!isSupabaseConfigured) {
        setAttendees([]);
        setError(null);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('attendees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAttendees(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createAttendee = async (attendeeData: any) => {
    try {
      const { data, error } = await supabase
        .from('attendees')
        .insert([attendeeData])
        .select()
        .single();

      if (error) throw error;
      await fetchAttendees(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const createEventOptin = async (eventId: string, attendeeId: string) => {
    try {
      const { data, error } = await supabase
        .from('event_optins')
        .insert([{ event_id: eventId, attendee_id: attendeeId }])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  useEffect(() => {
    fetchAttendees();
  }, []);

  return {
    attendees,
    loading,
    error,
    fetchAttendees,
    createAttendee,
    createEventOptin
  };
}
