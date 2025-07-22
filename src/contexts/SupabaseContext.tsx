import { createContext, useContext, ReactNode } from 'react';
import { useSupabaseAuth, useEvents, useAttendees } from '../hooks/useSupabase';
import { User, Session } from '@supabase/supabase-js';

// Define the context type
interface SupabaseContextType {
  // Auth state
  session: Session | null;
  user: User | null;
  authLoading: boolean;
  
  // Events state and methods
  events: any[];
  eventsLoading: boolean;
  eventsError: string | null;
  fetchEvents: () => Promise<void>;
  createEvent: (eventData: any) => Promise<{ data: any; error: string | null }>;
  updateEvent: (id: string, eventData: any) => Promise<{ data: any; error: string | null }>;
  deleteEvent: (id: string) => Promise<{ error: string | null }>;
  
  // Attendees state and methods
  attendees: any[];
  attendeesLoading: boolean;
  attendeesError: string | null;
  fetchAttendees: () => Promise<void>;
  createAttendee: (attendeeData: any) => Promise<{ data: any; error: string | null }>;
  createEventOptin: (eventId: string, attendeeId: string) => Promise<{ data: any; error: string | null }>;
}

// Create the context
const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

// Provider component
interface SupabaseProviderProps {
  children: ReactNode;
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  // Use all the hooks
  const { session, user, loading: authLoading } = useSupabaseAuth();
  const {
    events,
    loading: eventsLoading,
    error: eventsError,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent
  } = useEvents();
  const {
    attendees,
    loading: attendeesLoading,
    error: attendeesError,
    fetchAttendees,
    createAttendee,
    createEventOptin
  } = useAttendees();

  const value: SupabaseContextType = {
    // Auth
    session,
    user,
    authLoading,
    
    // Events
    events,
    eventsLoading,
    eventsError,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    
    // Attendees
    attendees,
    attendeesLoading,
    attendeesError,
    fetchAttendees,
    createAttendee,
    createEventOptin
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

// Custom hook to use the context
export function useSupabaseContext() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabaseContext must be used within a SupabaseProvider');
  }
  return context;
}
