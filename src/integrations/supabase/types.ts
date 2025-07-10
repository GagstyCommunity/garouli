export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      agency_subscriptions: {
        Row: {
          annual_fee: number | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          status: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          annual_fee?: number | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          annual_fee?: number | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_interactions: {
        Row: {
          ai_response: string
          context_type: string | null
          course_id: string | null
          created_at: string | null
          id: string
          question: string
          user_id: string | null
        }
        Insert: {
          ai_response: string
          context_type?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          question: string
          user_id?: string | null
        }
        Update: {
          ai_response?: string
          context_type?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          question?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_interactions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          blockchain_hash: string | null
          certificate_url: string | null
          course_id: string | null
          id: string
          issued_at: string | null
          user_id: string | null
          verification_hash: string | null
        }
        Insert: {
          blockchain_hash?: string | null
          certificate_url?: string | null
          course_id?: string | null
          id?: string
          issued_at?: string | null
          user_id?: string | null
          verification_hash?: string | null
        }
        Update: {
          blockchain_hash?: string | null
          certificate_url?: string | null
          course_id?: string | null
          id?: string
          issued_at?: string | null
          user_id?: string | null
          verification_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          enrolled_at: string
          id: string
          progress: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          enrolled_at?: string
          id?: string
          progress?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string
          id?: string
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_free: boolean | null
          order_index: number
          title: string
          video_url: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_free?: boolean | null
          order_index: number
          title: string
          video_url?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_free?: boolean | null
          order_index?: number
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_quizzes: {
        Row: {
          correct_answer: number
          created_at: string | null
          explanation: string | null
          id: string
          module_id: string | null
          options: Json
          question: string
        }
        Insert: {
          correct_answer: number
          created_at?: string | null
          explanation?: string | null
          id?: string
          module_id?: string | null
          options: Json
          question: string
        }
        Update: {
          correct_answer?: number
          created_at?: string | null
          explanation?: string | null
          id?: string
          module_id?: string | null
          options?: Json
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_quizzes_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_recommendations: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          reason: string | null
          recommendation_score: number | null
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          reason?: string | null
          recommendation_score?: number | null
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          reason?: string | null
          recommendation_score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_recommendations_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_reviews: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          is_approved: boolean | null
          rating: number | null
          review_text: string | null
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          rating?: number | null
          review_text?: string | null
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          rating?: number | null
          review_text?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          company_sponsor: string | null
          created_at: string
          description: string | null
          difficulty: string | null
          duration_hours: number | null
          has_certification: boolean | null
          id: string
          instructor_id: string
          is_free: boolean | null
          is_published: boolean | null
          price: number | null
          rating: number | null
          short_description: string | null
          student_count: number | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_preview_url: string | null
        }
        Insert: {
          category?: string | null
          company_sponsor?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          duration_hours?: number | null
          has_certification?: boolean | null
          id?: string
          instructor_id: string
          is_free?: boolean | null
          is_published?: boolean | null
          price?: number | null
          rating?: number | null
          short_description?: string | null
          student_count?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_preview_url?: string | null
        }
        Update: {
          category?: string | null
          company_sponsor?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          duration_hours?: number | null
          has_certification?: boolean | null
          id?: string
          instructor_id?: string
          is_free?: boolean | null
          is_published?: boolean | null
          price?: number | null
          rating?: number | null
          short_description?: string | null
          student_count?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_preview_url?: string | null
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applied_at: string | null
          cover_letter: string | null
          id: string
          job_id: string | null
          resume_url: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          applied_at?: string | null
          cover_letter?: string | null
          id?: string
          job_id?: string | null
          resume_url?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          applied_at?: string | null
          cover_letter?: string | null
          id?: string
          job_id?: string | null
          resume_url?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          agency_id: string | null
          applications_count: number | null
          benefits: string[] | null
          created_at: string | null
          description: string
          employment_type: string | null
          id: string
          is_active: boolean | null
          location: string | null
          remote: boolean | null
          requirements: string[] | null
          salary_max: number | null
          salary_min: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          agency_id?: string | null
          applications_count?: number | null
          benefits?: string[] | null
          created_at?: string | null
          description: string
          employment_type?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          remote?: boolean | null
          requirements?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          agency_id?: string | null
          applications_count?: number | null
          benefits?: string[] | null
          created_at?: string | null
          description?: string
          employment_type?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          remote?: boolean | null
          requirements?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          passed: boolean
          quiz_id: string
          score: number
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          passed?: boolean
          quiz_id: string
          score: number
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          passed?: boolean
          quiz_id?: string
          score?: number
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "course_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_gamification: {
        Row: {
          badges: string[] | null
          created_at: string
          id: string
          last_activity_date: string | null
          level: number | null
          streak_days: number | null
          total_xp: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          badges?: string[] | null
          created_at?: string
          id?: string
          last_activity_date?: string | null
          level?: number | null
          streak_days?: number | null
          total_xp?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          badges?: string[] | null
          created_at?: string
          id?: string
          last_activity_date?: string | null
          level?: number | null
          streak_days?: number | null
          total_xp?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_at: string | null
          course_id: string | null
          created_at: string | null
          id: string
          module_id: string | null
          quiz_score: number | null
          user_id: string | null
          watch_time_minutes: number | null
        }
        Insert: {
          completed_at?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          module_id?: string | null
          quiz_score?: number | null
          user_id?: string | null
          watch_time_minutes?: number | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          module_id?: string | null
          quiz_score?: number | null
          user_id?: string | null
          watch_time_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_course_completion: {
        Args: { p_user_id: string; p_course_id: string }
        Returns: number
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      subscription_status: "trial" | "active" | "cancelled" | "expired"
      user_role: "student" | "instructor" | "admin" | "enterprise"
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
      subscription_status: ["trial", "active", "cancelled", "expired"],
      user_role: ["student", "instructor", "admin", "enterprise"],
    },
  },
} as const
