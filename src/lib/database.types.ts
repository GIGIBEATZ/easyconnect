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
          email: string
          full_name: string
          avatar_url: string | null
          bio: string | null
          location: string | null
          phone: string | null
          roles: string[]
          agent_specializations: string[]
          agent_rating: number
          total_tickets_resolved: number
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          phone?: string | null
          roles?: string[]
          agent_specializations?: string[]
          agent_rating?: number
          total_tickets_resolved?: number
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          phone?: string | null
          roles?: string[]
          agent_specializations?: string[]
          agent_rating?: number
          total_tickets_resolved?: number
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          type: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          type: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          type?: string
          description?: string | null
          created_at?: string
        }
      }
      support_services: {
        Row: {
          id: string
          title: string
          description: string
          category_id: string | null
          service_type: string
          price: number
          duration_minutes: number
          languages_supported: string[]
          is_active: boolean
          image_url: string | null
          features: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category_id?: string | null
          service_type: string
          price?: number
          duration_minutes?: number
          languages_supported?: string[]
          is_active?: boolean
          image_url?: string | null
          features?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category_id?: string | null
          service_type?: string
          price?: number
          duration_minutes?: number
          languages_supported?: string[]
          is_active?: boolean
          image_url?: string | null
          features?: Json
          created_at?: string
          updated_at?: string
        }
      }
      support_tickets: {
        Row: {
          id: string
          ticket_number: string
          customer_id: string
          assigned_agent_id: string | null
          service_id: string | null
          title: string
          description: string
          status: string
          priority: string
          category: string
          language: string
          attachments: string[]
          customer_rating: number | null
          customer_feedback: string | null
          resolution_notes: string | null
          created_at: string
          updated_at: string
          resolved_at: string | null
          closed_at: string | null
        }
        Insert: {
          id?: string
          ticket_number?: string
          customer_id: string
          assigned_agent_id?: string | null
          service_id?: string | null
          title: string
          description: string
          status?: string
          priority?: string
          category: string
          language?: string
          attachments?: string[]
          customer_rating?: number | null
          customer_feedback?: string | null
          resolution_notes?: string | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
          closed_at?: string | null
        }
        Update: {
          id?: string
          ticket_number?: string
          customer_id?: string
          assigned_agent_id?: string | null
          service_id?: string | null
          title?: string
          description?: string
          status?: string
          priority?: string
          category?: string
          language?: string
          attachments?: string[]
          customer_rating?: number | null
          customer_feedback?: string | null
          resolution_notes?: string | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
          closed_at?: string | null
        }
      }
      ticket_messages: {
        Row: {
          id: string
          ticket_id: string
          sender_id: string
          message: string
          is_internal_note: boolean
          attachments: string[]
          created_at: string
        }
        Insert: {
          id?: string
          ticket_id: string
          sender_id: string
          message: string
          is_internal_note?: boolean
          attachments?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          ticket_id?: string
          sender_id?: string
          message?: string
          is_internal_note?: boolean
          attachments?: string[]
          created_at?: string
        }
      }
      knowledge_base: {
        Row: {
          id: string
          title: string
          content: string
          summary: string | null
          category_id: string | null
          language: string
          tags: string[]
          view_count: number
          helpful_count: number
          not_helpful_count: number
          is_published: boolean
          author_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          summary?: string | null
          category_id?: string | null
          language?: string
          tags?: string[]
          view_count?: number
          helpful_count?: number
          not_helpful_count?: number
          is_published?: boolean
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          summary?: string | null
          category_id?: string | null
          language?: string
          tags?: string[]
          view_count?: number
          helpful_count?: number
          not_helpful_count?: number
          is_published?: boolean
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      service_bookings: {
        Row: {
          id: string
          customer_id: string
          service_id: string
          agent_id: string | null
          scheduled_time: string
          duration_minutes: number
          status: string
          meeting_link: string | null
          notes: string | null
          customer_rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          service_id: string
          agent_id?: string | null
          scheduled_time: string
          duration_minutes?: number
          status?: string
          meeting_link?: string | null
          notes?: string | null
          customer_rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          service_id?: string
          agent_id?: string | null
          scheduled_time?: string
          duration_minutes?: number
          status?: string
          meeting_link?: string | null
          notes?: string | null
          customer_rating?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          link: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      user_preferences: {
        Row: {
          user_id: string
          theme_mode: string
          color_scheme: string
          font_size: string
          compact_mode: boolean
          email_notifications: boolean
          notification_types: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          theme_mode?: string
          color_scheme?: string
          font_size?: string
          compact_mode?: boolean
          email_notifications?: boolean
          notification_types?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          theme_mode?: string
          color_scheme?: string
          font_size?: string
          compact_mode?: boolean
          email_notifications?: boolean
          notification_types?: Json
          created_at?: string
          updated_at?: string
        }
      }
      user_language_preferences: {
        Row: {
          user_id: string
          language_code: string
          updated_at: string
        }
        Insert: {
          user_id: string
          language_code?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          language_code?: string
          updated_at?: string
        }
      }
      languages: {
        Row: {
          code: string
          name: string
          native_name: string
          is_rtl: boolean
          is_active: boolean
          flag_emoji: string | null
          sort_order: number
        }
        Insert: {
          code: string
          name: string
          native_name: string
          is_rtl?: boolean
          is_active?: boolean
          flag_emoji?: string | null
          sort_order?: number
        }
        Update: {
          code?: string
          name?: string
          native_name?: string
          is_rtl?: boolean
          is_active?: boolean
          flag_emoji?: string | null
          sort_order?: number
        }
      }
      translation_keys: {
        Row: {
          id: string
          key: string
          namespace: string
          context: string | null
          created_at: string
        }
        Insert: {
          id?: string
          key: string
          namespace: string
          context?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          key?: string
          namespace?: string
          context?: string | null
          created_at?: string
        }
      }
      translations: {
        Row: {
          id: string
          key_id: string | null
          language_code: string | null
          value: string
          is_verified: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          key_id?: string | null
          language_code?: string | null
          value: string
          is_verified?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          key_id?: string | null
          language_code?: string | null
          value?: string
          is_verified?: boolean
          updated_at?: string
        }
      }
      static_pages: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
