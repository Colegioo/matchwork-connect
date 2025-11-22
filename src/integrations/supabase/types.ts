export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      candidates: {
        Row: {
          birth_date: string
          contact_email: string
          contact_phone: string
          created_at: string
          education: string | null
          experience: string | null
          full_name: string
          hard_skills: string[] | null
          id: string
          location: string
          objectives: string | null
          profile_photo_url: string | null
          soft_skills: string[] | null
          strengths: string | null
          subscription_plan: Database["public"]["Enums"]["subscription_plan"]
          updated_at: string
          user_id: string
          weaknesses: string | null
        }
        Insert: {
          birth_date: string
          contact_email: string
          contact_phone: string
          created_at?: string
          education?: string | null
          experience?: string | null
          full_name: string
          hard_skills?: string[] | null
          id?: string
          location: string
          objectives?: string | null
          profile_photo_url?: string | null
          soft_skills?: string[] | null
          strengths?: string | null
          subscription_plan?: Database["public"]["Enums"]["subscription_plan"]
          updated_at?: string
          user_id: string
          weaknesses?: string | null
        }
        Update: {
          birth_date?: string
          contact_email?: string
          contact_phone?: string
          created_at?: string
          education?: string | null
          experience?: string | null
          full_name?: string
          hard_skills?: string[] | null
          id?: string
          location?: string
          objectives?: string | null
          profile_photo_url?: string | null
          soft_skills?: string[] | null
          strengths?: string | null
          subscription_plan?: Database["public"]["Enums"]["subscription_plan"]
          updated_at?: string
          user_id?: string
          weaknesses?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          match_id: string
          message_text: string
          sender_id: string
          sender_type: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          id?: string
          match_id: string
          message_text: string
          sender_id: string
          sender_type: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          id?: string
          match_id?: string
          message_text?: string
          sender_id?: string
          sender_type?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          cnpj: string
          company_name: string
          company_values: string | null
          company_vision: string | null
          contact_email: string
          contact_phone: string
          created_at: string
          id: string
          location: string
          monthly_jobs_posted: number | null
          subscription_plan: Database["public"]["Enums"]["subscription_plan"]
          updated_at: string
          user_id: string
        }
        Insert: {
          cnpj: string
          company_name: string
          company_values?: string | null
          company_vision?: string | null
          contact_email: string
          contact_phone: string
          created_at?: string
          id?: string
          location: string
          monthly_jobs_posted?: number | null
          subscription_plan?: Database["public"]["Enums"]["subscription_plan"]
          updated_at?: string
          user_id: string
        }
        Update: {
          cnpj?: string
          company_name?: string
          company_values?: string | null
          company_vision?: string | null
          contact_email?: string
          contact_phone?: string
          created_at?: string
          id?: string
          location?: string
          monthly_jobs_posted?: number | null
          subscription_plan?: Database["public"]["Enums"]["subscription_plan"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      job_listings: {
        Row: {
          company_id: string
          created_at: string
          employment_type: Database["public"]["Enums"]["employment_type"]
          id: string
          is_active: boolean | null
          job_description: string
          job_title: string
          location: string
          preferences: string | null
          requirements: string | null
          salary_max: number | null
          salary_min: number | null
          salary_type: Database["public"]["Enums"]["salary_type"]
          updated_at: string
          workload_hours: number
        }
        Insert: {
          company_id: string
          created_at?: string
          employment_type: Database["public"]["Enums"]["employment_type"]
          id?: string
          is_active?: boolean | null
          job_description: string
          job_title: string
          location: string
          preferences?: string | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_type: Database["public"]["Enums"]["salary_type"]
          updated_at?: string
          workload_hours: number
        }
        Update: {
          company_id?: string
          created_at?: string
          employment_type?: Database["public"]["Enums"]["employment_type"]
          id?: string
          is_active?: boolean | null
          job_description?: string
          job_title?: string
          location?: string
          preferences?: string | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_type?: Database["public"]["Enums"]["salary_type"]
          updated_at?: string
          workload_hours?: number
        }
        Relationships: [
          {
            foreignKeyName: "job_listings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          candidate_id: string
          company_id: string
          id: string
          job_listing_id: string
          matched_at: string
        }
        Insert: {
          candidate_id: string
          company_id: string
          id?: string
          job_listing_id: string
          matched_at?: string
        }
        Update: {
          candidate_id?: string
          company_id?: string
          id?: string
          job_listing_id?: string
          matched_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_job_listing_id_fkey"
            columns: ["job_listing_id"]
            isOneToOne: false
            referencedRelation: "job_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      swipes: {
        Row: {
          created_at: string
          id: string
          is_like: boolean
          job_listing_id: string | null
          swiper_id: string
          swiper_type: Database["public"]["Enums"]["user_role"]
          target_id: string
          target_type: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          id?: string
          is_like: boolean
          job_listing_id?: string | null
          swiper_id: string
          swiper_type: Database["public"]["Enums"]["user_role"]
          target_id: string
          target_type: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          id?: string
          is_like?: boolean
          job_listing_id?: string | null
          swiper_id?: string
          swiper_type?: Database["public"]["Enums"]["user_role"]
          target_id?: string
          target_type?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "swipes_job_listing_id_fkey"
            columns: ["job_listing_id"]
            isOneToOne: false
            referencedRelation: "job_listings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      employment_type: "freelance" | "contract" | "full_time"
      salary_type: "hourly" | "monthly"
      subscription_plan: "freemium" | "premium"
      user_role: "company" | "candidate"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      employment_type: ["freelance", "contract", "full_time"],
      salary_type: ["hourly", "monthly"],
      subscription_plan: ["freemium", "premium"],
      user_role: ["company", "candidate"],
    },
  },
} as const
