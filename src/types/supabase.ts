// Database types based on the schema from memory
export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          name: string;
          location: string;
          guests: string;
          datetime: string;
          link: string;
          image_url: string | null;
          pix_key: string | null;
          admin_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          location: string;
          guests: string;
          datetime: string;
          link?: string;
          image_url?: string | null;
          pix_key?: string | null;
          admin_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string;
          guests?: string;
          datetime?: string;
          link?: string;
          image_url?: string | null;
          pix_key?: string | null;
          admin_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      attendees: {
        Row: {
          id: string;
          cpf: string;
          full_name: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cpf: string;
          full_name: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cpf?: string;
          full_name?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_optins: {
        Row: {
          event_id: string;
          attendee_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          event_id: string;
          attendee_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          event_id?: string;
          attendee_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Convenience types for easier usage
export type Event = Database['public']['Tables']['events']['Row'];
export type EventInsert = Database['public']['Tables']['events']['Insert'];
export type EventUpdate = Database['public']['Tables']['events']['Update'];

export type Attendee = Database['public']['Tables']['attendees']['Row'];
export type AttendeeInsert = Database['public']['Tables']['attendees']['Insert'];
export type AttendeeUpdate = Database['public']['Tables']['attendees']['Update'];

export type EventOptin = Database['public']['Tables']['event_optins']['Row'];
export type EventOptinInsert = Database['public']['Tables']['event_optins']['Insert'];
export type EventOptinUpdate = Database['public']['Tables']['event_optins']['Update'];
