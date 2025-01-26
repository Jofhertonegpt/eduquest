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
