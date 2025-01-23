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

      social_posts: {
        Row: {
          id: string
          content: string
          user_id: string
          media_urls: string[]
          file_urls: string[]
          created_at: string
          hashtags: string[]
          likes_count: number
          comments_count: number
          shares_count: number
        }
        Insert: {
          id?: string
          content: string
          user_id: string
          media_urls?: string[]
          file_urls?: string[]
          created_at?: string
          hashtags?: string[]
          likes_count?: number
          comments_count?: number
          shares_count?: number
        }
        Update: {
          id?: string
          content?: string
          user_id?: string
          media_urls?: string[]
          file_urls?: string[]
          created_at?: string
          hashtags?: string[]
          likes_count?: number
          comments_count?: number
          shares_count?: number
        }
      }
      social_comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
      }
      social_likes: {
        Row: {
          id: string
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          created_at?: string
        }
      }
      social_follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
      social_messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          content: string
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id: string
          content: string
          created_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string
          content?: string
          created_at?: string
          read_at?: string | null
        }
      }
    }
  }
}
