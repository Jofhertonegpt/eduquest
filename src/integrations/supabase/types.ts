export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assignment_feedback: {
        Row: {
          assignment_id: string | null
          created_at: string | null
          feedback: string
          grade: number | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assignment_id?: string | null
          created_at?: string | null
          feedback: string
          grade?: number | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assignment_id?: string | null
          created_at?: string | null
          feedback?: string
          grade?: number | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignment_feedback_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string
          grade: number | null
          id: string
          status: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date: string
          grade?: number | null
          id?: string
          status?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string
          grade?: number | null
          id?: string
          status?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          course_id: string | null
          created_at: string | null
          credits: number | null
          description: string | null
          id: string
          learning_objectives: Json[] | null
          metadata: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          credits?: number | null
          description?: string | null
          id?: string
          learning_objectives?: Json[] | null
          metadata?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          credits?: number | null
          description?: string | null
          id?: string
          learning_objectives?: Json[] | null
          metadata?: Json | null
          title?: string
          updated_at?: string | null
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
      course_progress: {
        Row: {
          completed_modules: number | null
          created_at: string | null
          current_grade: number | null
          id: string
          rank: number | null
          total_modules: number | null
          total_students: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_modules?: number | null
          created_at?: string | null
          current_grade?: number | null
          id?: string
          rank?: number | null
          total_modules?: number | null
          total_students?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_modules?: number | null
          created_at?: string | null
          current_grade?: number | null
          id?: string
          rank?: number | null
          total_modules?: number | null
          total_students?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string | null
          credits: number | null
          degree_id: string | null
          description: string | null
          id: string
          level: string | null
          metadata: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credits?: number | null
          degree_id?: string | null
          description?: string | null
          id?: string
          level?: string | null
          metadata?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credits?: number | null
          degree_id?: string | null
          description?: string | null
          id?: string
          level?: string | null
          metadata?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_degree_id_fkey"
            columns: ["degree_id"]
            isOneToOne: false
            referencedRelation: "degrees"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_modules: {
        Row: {
          content: Json
          created_at: string | null
          curriculum_id: string | null
          display_order: number | null
          id: string
          import_status: string | null
          import_step: number | null
          is_draft: boolean | null
          module_data: Json
          module_status: string
          module_type: string
          parent_id: string | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          curriculum_id?: string | null
          display_order?: number | null
          id?: string
          import_status?: string | null
          import_step?: number | null
          is_draft?: boolean | null
          module_data?: Json
          module_status?: string
          module_type: string
          parent_id?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          curriculum_id?: string | null
          display_order?: number | null
          id?: string
          import_status?: string | null
          import_step?: number | null
          is_draft?: boolean | null
          module_data?: Json
          module_status?: string
          module_type?: string
          parent_id?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_modules_curriculum_id_fkey"
            columns: ["curriculum_id"]
            isOneToOne: false
            referencedRelation: "imported_curricula"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "curriculum_modules_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "curriculum_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_progress: {
        Row: {
          active_course_id: string | null
          active_module_id: string | null
          created_at: string
          curriculum_id: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active_course_id?: string | null
          active_module_id?: string | null
          created_at?: string
          curriculum_id: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active_course_id?: string | null
          active_module_id?: string | null
          created_at?: string
          curriculum_id?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_progress_curriculum_id_fkey"
            columns: ["curriculum_id"]
            isOneToOne: false
            referencedRelation: "imported_curricula"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_versions: {
        Row: {
          created_at: string | null
          created_by: string | null
          curriculum: Json
          curriculum_id: string | null
          id: string
          metadata: Json | null
          version: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          curriculum: Json
          curriculum_id?: string | null
          id?: string
          metadata?: Json | null
          version: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          curriculum?: Json
          curriculum_id?: string | null
          id?: string
          metadata?: Json | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_versions_curriculum_id_fkey"
            columns: ["curriculum_id"]
            isOneToOne: false
            referencedRelation: "imported_curricula"
            referencedColumns: ["id"]
          },
        ]
      }
      degrees: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          program_id: string | null
          required_credits: number | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          program_id?: string | null
          required_credits?: number | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          program_id?: string | null
          required_credits?: number | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "degrees_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program_info"
            referencedColumns: ["id"]
          },
        ]
      }
      imported_curricula: {
        Row: {
          created_at: string
          curriculum: Json
          id: string
          last_modified_at: string | null
          metadata: Json | null
          user_id: string
          version: number | null
        }
        Insert: {
          created_at?: string
          curriculum: Json
          id?: string
          last_modified_at?: string | null
          metadata?: Json | null
          user_id: string
          version?: number | null
        }
        Update: {
          created_at?: string
          curriculum?: Json
          id?: string
          last_modified_at?: string | null
          metadata?: Json | null
          user_id?: string
          version?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read_at: string | null
          recipient_id: string | null
          sender_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id?: string | null
          sender_id?: string | null
        }
        Relationships: []
      }
      module_assignments: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          module_id: string | null
          points: number | null
          questions: Json[] | null
          status: string | null
          title: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          module_id?: string | null
          points?: number | null
          questions?: Json[] | null
          status?: string | null
          title: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          module_id?: string | null
          points?: number | null
          questions?: Json[] | null
          status?: string | null
          title?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "module_assignments_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      module_quizzes: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          module_id: string | null
          questions: Json[] | null
          status: string | null
          title: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          module_id?: string | null
          questions?: Json[] | null
          status?: string | null
          title: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          module_id?: string | null
          questions?: Json[] | null
          status?: string | null
          title?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "module_quizzes_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          accessibility_settings: Json | null
          avatar_url: string | null
          bio: string | null
          completed_degrees: string[] | null
          created_at: string
          current_degree: string | null
          email: string | null
          followers_count: number | null
          following_count: number | null
          full_name: string | null
          id: string
          language_preference: string | null
          level: string | null
          location: string | null
          notification_preferences: Json | null
          posts_count: number | null
          privacy_settings: Json | null
          theme_preference: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          accessibility_settings?: Json | null
          avatar_url?: string | null
          bio?: string | null
          completed_degrees?: string[] | null
          created_at?: string
          current_degree?: string | null
          email?: string | null
          followers_count?: number | null
          following_count?: number | null
          full_name?: string | null
          id: string
          language_preference?: string | null
          level?: string | null
          location?: string | null
          notification_preferences?: Json | null
          posts_count?: number | null
          privacy_settings?: Json | null
          theme_preference?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          accessibility_settings?: Json | null
          avatar_url?: string | null
          bio?: string | null
          completed_degrees?: string[] | null
          created_at?: string
          current_degree?: string | null
          email?: string | null
          followers_count?: number | null
          following_count?: number | null
          full_name?: string | null
          id?: string
          language_preference?: string | null
          level?: string | null
          location?: string | null
          notification_preferences?: Json | null
          posts_count?: number | null
          privacy_settings?: Json | null
          theme_preference?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      program_info: {
        Row: {
          compliance_standards: string[] | null
          created_at: string | null
          description: string | null
          id: string
          institution: string | null
          name: string
          program_outcomes: string[] | null
          updated_at: string | null
        }
        Insert: {
          compliance_standards?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          institution?: string | null
          name: string
          program_outcomes?: string[] | null
          updated_at?: string | null
        }
        Update: {
          compliance_standards?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          institution?: string | null
          name?: string
          program_outcomes?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          content: string | null
          created_at: string | null
          duration: string | null
          embed_type: string | null
          id: string
          module_id: string | null
          title: string
          type: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          duration?: string | null
          embed_type?: string | null
          id?: string
          module_id?: string | null
          title: string
          type: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          duration?: string | null
          embed_type?: string | null
          id?: string
          module_id?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      school_members: {
        Row: {
          created_at: string
          id: string
          school_id: string
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          school_id: string
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          school_id?: string
          student_id?: string
        }
        Relationships: []
      }
      school_posts: {
        Row: {
          comments_count: number | null
          content: string
          created_at: string | null
          created_by: string
          id: string
          likes_count: number | null
          school_id: string
        }
        Insert: {
          comments_count?: number | null
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          likes_count?: number | null
          school_id: string
        }
        Update: {
          comments_count?: number | null
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          likes_count?: number | null
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_posts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_posts_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          logo_url: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
        }
        Relationships: []
      }
      social_bookmarks: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      social_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      social_follows: {
        Row: {
          created_at: string | null
          follower_id: string | null
          following_id: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      social_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      social_posts: {
        Row: {
          comments_count: number | null
          content: string
          created_at: string | null
          hashtags: string[] | null
          id: string
          likes_count: number | null
          media_metadata: Json[] | null
          media_urls: string[] | null
          shares_count: number | null
          user_id: string
        }
        Insert: {
          comments_count?: number | null
          content: string
          created_at?: string | null
          hashtags?: string[] | null
          id?: string
          likes_count?: number | null
          media_metadata?: Json[] | null
          media_urls?: string[] | null
          shares_count?: number | null
          user_id: string
        }
        Update: {
          comments_count?: number | null
          content?: string
          created_at?: string | null
          hashtags?: string[] | null
          id?: string
          likes_count?: number | null
          media_metadata?: Json[] | null
          media_urls?: string[] | null
          shares_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      study_plans: {
        Row: {
          content: Json
          generated_at: string | null
          id: string
          metadata: Json | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          content: Json
          generated_at?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          content?: Json
          generated_at?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
