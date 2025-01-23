export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          level: string
          current_degree: string | null
          completed_degrees: string[] | null
          created_at: string
          updated_at: string
          avatar_url?: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          level?: string
          current_degree?: string | null
          completed_degrees?: string[] | null
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          level?: string
          current_degree?: string | null
          completed_degrees?: string[] | null
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
        }
      }
      schools: {
        Row: {
          id: string
          name: string
          description: string | null
          logo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          logo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          logo_url?: string | null
          created_at?: string
        }
      }
      school_members: {
        Row: {
          id: string
          school_id: string
          student_id: string
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          student_id: string
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          student_id?: string
          created_at?: string
        }
      }
      school_posts: {
        Row: {
          id: string
          school_id: string
          content: string
          created_by: string
          created_at: string
          likes_count: number
          comments_count: number
        }
        Insert: {
          id?: string
          school_id: string
          content: string
          created_by: string
          created_at?: string
          likes_count?: number
          comments_count?: number
        }
        Update: {
          id?: string
          school_id?: string
          content?: string
          created_by?: string
          created_at?: string
          likes_count?: number
          comments_count?: number
        }
      }
    }
  }
}