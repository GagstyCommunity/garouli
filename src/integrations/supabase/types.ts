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
      admin_activity_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_activity_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      admins: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          permissions: Json | null
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      agency_profiles: {
        Row: {
          company_name: string | null
          company_size: string | null
          created_at: string | null
          id: string
          industry: string | null
          user_id: string | null
          verified: boolean | null
          website_url: string | null
        }
        Insert: {
          company_name?: string | null
          company_size?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          user_id?: string | null
          verified?: boolean | null
          website_url?: string | null
        }
        Update: {
          company_name?: string | null
          company_size?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          user_id?: string | null
          verified?: boolean | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agency_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
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
      app_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_linkedin_verified: boolean | null
          is_verified: boolean | null
          name: string
          photo_url: string | null
          red_flag: boolean | null
          role: string
          suspended: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          is_linkedin_verified?: boolean | null
          is_verified?: boolean | null
          name: string
          photo_url?: string | null
          red_flag?: boolean | null
          role: string
          suspended?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_linkedin_verified?: boolean | null
          is_verified?: boolean | null
          name?: string
          photo_url?: string | null
          red_flag?: boolean | null
          role?: string
          suspended?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      battles: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          prompt: string
          start_date: string | null
          status: string | null
          theme: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          prompt: string
          start_date?: string | null
          status?: string | null
          theme?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          prompt?: string
          start_date?: string | null
          status?: string | null
          theme?: string | null
          title?: string
        }
        Relationships: []
      }
      blogs: {
        Row: {
          approved: boolean | null
          author_id: string | null
          content: string | null
          created_at: string | null
          id: string
          title: string
        }
        Insert: {
          approved?: boolean | null
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          title: string
        }
        Update: {
          approved?: boolean | null
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "blogs_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
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
      cms_pages: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          status: string | null
          title: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      communities: {
        Row: {
          cover_image: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          icon_image: string | null
          id: string
          member_count: number | null
          moderators: string[] | null
          post_count: number | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon_image?: string | null
          id?: string
          member_count?: number | null
          moderators?: string[] | null
          post_count?: number | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon_image?: string | null
          id?: string
          member_count?: number | null
          moderators?: string[] | null
          post_count?: number | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          ai_moderation_score: number | null
          community_id: string | null
          content: string | null
          created_at: string | null
          downvotes: number | null
          flag_reason: string | null
          id: string
          is_flagged: boolean | null
          is_pinned: boolean | null
          post_type: string | null
          reply_count: number | null
          status: string | null
          title: string
          updated_at: string | null
          upvotes: number | null
          user_id: string | null
        }
        Insert: {
          ai_moderation_score?: number | null
          community_id?: string | null
          content?: string | null
          created_at?: string | null
          downvotes?: number | null
          flag_reason?: string | null
          id?: string
          is_flagged?: boolean | null
          is_pinned?: boolean | null
          post_type?: string | null
          reply_count?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string | null
        }
        Update: {
          ai_moderation_score?: number | null
          community_id?: string | null
          content?: string | null
          created_at?: string | null
          downvotes?: number | null
          flag_reason?: string | null
          id?: string
          is_flagged?: boolean | null
          is_pinned?: boolean | null
          post_type?: string | null
          reply_count?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
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
      course_interactions: {
        Row: {
          course_id: string
          created_at: string
          id: string
          interaction_data: Json | null
          interaction_type: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          interaction_data?: Json | null
          interaction_type: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          interaction_data?: Json | null
          interaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_interactions_course_id_fkey"
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
      event_participants: {
        Row: {
          attended: boolean | null
          certificate_issued: boolean | null
          event_id: string | null
          id: string
          registered_at: string | null
          role: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          attended?: boolean | null
          certificate_issued?: boolean | null
          event_id?: string | null
          id?: string
          registered_at?: string | null
          role?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          attended?: boolean | null
          certificate_issued?: boolean | null
          event_id?: string | null
          id?: string
          registered_at?: string | null
          role?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_speakers: {
        Row: {
          bio: string | null
          created_at: string | null
          event_id: string | null
          id: string
          is_external: boolean | null
          linkedin_url: string | null
          name: string
          photo_url: string | null
          speaking_order: number | null
          talk_duration: number | null
          talk_title: string | null
          title: string | null
          user_id: string | null
          website_url: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          is_external?: boolean | null
          linkedin_url?: string | null
          name: string
          photo_url?: string | null
          speaking_order?: number | null
          talk_duration?: number | null
          talk_title?: string | null
          title?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          is_external?: boolean | null
          linkedin_url?: string | null
          name?: string
          photo_url?: string | null
          speaking_order?: number | null
          talk_duration?: number | null
          talk_title?: string | null
          title?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_speakers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          certificate_enabled: boolean | null
          certificate_template: string | null
          cover_image: string | null
          created_at: string | null
          current_participants: number | null
          description: string | null
          end_time: string | null
          event_type: string | null
          event_url: string | null
          host_id: string | null
          host_type: string | null
          id: string
          location: string | null
          max_participants: number | null
          slug: string
          start_time: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          certificate_enabled?: boolean | null
          certificate_template?: string | null
          cover_image?: string | null
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          end_time?: string | null
          event_type?: string | null
          event_url?: string | null
          host_id?: string | null
          host_type?: string | null
          id?: string
          location?: string | null
          max_participants?: number | null
          slug: string
          start_time?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          certificate_enabled?: boolean | null
          certificate_template?: string | null
          cover_image?: string | null
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          end_time?: string | null
          event_type?: string | null
          event_url?: string | null
          host_id?: string | null
          host_type?: string | null
          id?: string
          location?: string | null
          max_participants?: number | null
          slug?: string
          start_time?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      hackathon_submissions: {
        Row: {
          ai_analysis: Json | null
          code_url: string | null
          demo_url: string | null
          description: string | null
          hackathon_id: string | null
          id: string
          judge_scores: Json | null
          presentation_url: string | null
          project_title: string
          public_votes: number | null
          status: string | null
          submitted_at: string | null
          team_name: string | null
          user_id: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          code_url?: string | null
          demo_url?: string | null
          description?: string | null
          hackathon_id?: string | null
          id?: string
          judge_scores?: Json | null
          presentation_url?: string | null
          project_title: string
          public_votes?: number | null
          status?: string | null
          submitted_at?: string | null
          team_name?: string | null
          user_id?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          code_url?: string | null
          demo_url?: string | null
          description?: string | null
          hackathon_id?: string | null
          id?: string
          judge_scores?: Json | null
          presentation_url?: string | null
          project_title?: string
          public_votes?: number | null
          status?: string | null
          submitted_at?: string | null
          team_name?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hackathon_submissions_hackathon_id_fkey"
            columns: ["hackathon_id"]
            isOneToOne: false
            referencedRelation: "hackathons"
            referencedColumns: ["id"]
          },
        ]
      }
      hackathons: {
        Row: {
          brief: string | null
          cover_image: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          judging_deadline: string | null
          max_participants: number | null
          prize_pool: number | null
          prize_tiers: Json | null
          rules: string | null
          slug: string
          start_date: string | null
          status: string | null
          submission_deadline: string | null
          theme: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          brief?: string | null
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          judging_deadline?: string | null
          max_participants?: number | null
          prize_pool?: number | null
          prize_tiers?: Json | null
          rules?: string | null
          slug: string
          start_date?: string | null
          status?: string | null
          submission_deadline?: string | null
          theme?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          brief?: string | null
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          judging_deadline?: string | null
          max_participants?: number | null
          prize_pool?: number | null
          prize_tiers?: Json | null
          rules?: string | null
          slug?: string
          start_date?: string | null
          status?: string | null
          submission_deadline?: string | null
          theme?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      instructor_profiles: {
        Row: {
          average_rating: number | null
          bio: string | null
          created_at: string | null
          expertise_areas: string[] | null
          id: string
          teaching_experience: number | null
          total_students: number | null
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          average_rating?: number | null
          bio?: string | null
          created_at?: string | null
          expertise_areas?: string[] | null
          id?: string
          teaching_experience?: number | null
          total_students?: number | null
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          average_rating?: number | null
          bio?: string | null
          created_at?: string | null
          expertise_areas?: string[] | null
          id?: string
          teaching_experience?: number | null
          total_students?: number | null
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "instructor_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
      jobs: {
        Row: {
          approved: boolean | null
          company_name: string | null
          created_at: string | null
          description: string | null
          id: string
          job_type: string | null
          location: string | null
          title: string
        }
        Insert: {
          approved?: boolean | null
          company_name?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          job_type?: string | null
          location?: string | null
          title: string
        }
        Update: {
          approved?: boolean | null
          company_name?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          job_type?: string | null
          location?: string | null
          title?: string
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
      seo_metadata: {
        Row: {
          canonical_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_indexed: boolean | null
          keywords: string[] | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          page_path: string
          structured_data: Json | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_indexed?: boolean | null
          keywords?: string[] | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_path: string
          structured_data?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          canonical_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_indexed?: boolean | null
          keywords?: string[] | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_path?: string
          structured_data?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          created_at: string | null
          id: string
          learning_goals: string[] | null
          preferred_categories: string[] | null
          skill_level: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          learning_goals?: string[] | null
          preferred_categories?: string[] | null
          skill_level?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          learning_goals?: string[] | null
          preferred_categories?: string[] | null
          skill_level?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      system_logs: {
        Row: {
          action: string | null
          created_at: string | null
          details: Json | null
          id: string
          user_id: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
      user_learning_goals: {
        Row: {
          created_at: string
          id: string
          learning_objectives: string[] | null
          preferred_categories: string[] | null
          preferred_difficulty: string | null
          target_completion_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          learning_objectives?: string[] | null
          preferred_categories?: string[] | null
          preferred_difficulty?: string | null
          target_completion_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          learning_objectives?: string[] | null
          preferred_categories?: string[] | null
          preferred_difficulty?: string | null
          target_completion_date?: string | null
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
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_linkedin_verified: boolean | null
          is_verified: boolean | null
          name: string
          photo_url: string | null
          red_flag: boolean | null
          role: string | null
          suspended: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_linkedin_verified?: boolean | null
          is_verified?: boolean | null
          name: string
          photo_url?: string | null
          red_flag?: boolean | null
          role?: string | null
          suspended?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_linkedin_verified?: boolean | null
          is_verified?: boolean | null
          name?: string
          photo_url?: string | null
          red_flag?: boolean | null
          role?: string | null
          suspended?: boolean | null
          updated_at?: string | null
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
      has_admin_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["admin_role"]
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      admin_role: "superadmin" | "admin" | "moderator" | "editor" | "verifier"
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
      admin_role: ["superadmin", "admin", "moderator", "editor", "verifier"],
      subscription_status: ["trial", "active", "cancelled", "expired"],
      user_role: ["student", "instructor", "admin", "enterprise"],
    },
  },
} as const
