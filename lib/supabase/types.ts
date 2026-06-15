// Generated-style typings for our Supabase schema.
// Keep in sync with supabase/migrations/0001_init.sql.
// You can replace this manually-written file with `supabase gen types typescript`
// output once the Supabase project is provisioned.

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          company: string | null;
          role: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          company?: string | null;
          role?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          slug: string;
          name: string;
          tagline: string | null;
          description: string;
          duration_minutes: number;
          price_cents: number;
          currency: string;
          stripe_price_id: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          tagline?: string | null;
          description: string;
          duration_minutes: number;
          price_cents: number;
          currency?: string;
          stripe_price_id?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>;
        Relationships: [];
      };
      availability_rules: {
        Row: {
          id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          timezone: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          timezone?: string;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["availability_rules"]["Insert"]
        >;
        Relationships: [];
      };
      availability_overrides: {
        Row: {
          id: string;
          date: string;
          is_available: boolean;
          start_time: string | null;
          end_time: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          is_available: boolean;
          start_time?: string | null;
          end_time?: string | null;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["availability_overrides"]["Insert"]
        >;
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          service_id: string;
          slot_start: string;
          slot_end: string;
          status:
            | "pending"
            | "paid"
            | "confirmed"
            | "cancelled"
            | "completed";
          stripe_session_id: string | null;
          stripe_payment_intent: string | null;
          google_event_id: string | null;
          meet_link: string | null;
          notes: string | null;
          created_at: string;
          confirmed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          service_id: string;
          slot_start: string;
          slot_end: string;
          status?:
            | "pending"
            | "paid"
            | "confirmed"
            | "cancelled"
            | "completed";
          stripe_session_id?: string | null;
          stripe_payment_intent?: string | null;
          google_event_id?: string | null;
          meet_link?: string | null;
          notes?: string | null;
          created_at?: string;
          confirmed_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          status: "active" | "unsubscribed";
          confirmed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          status?: "active" | "unsubscribed";
          confirmed_at?: string | null;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["newsletter_subscribers"]["Insert"]
        >;
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          company: string | null;
          message: string;
          status: "new" | "read" | "replied" | "archived";
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          company?: string | null;
          message: string;
          status?: "new" | "read" | "replied" | "archived";
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["contact_messages"]["Insert"]
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
