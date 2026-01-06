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
          preferred_language: string
          timezone: string | null
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
          preferred_language?: string
          timezone?: string | null
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
          preferred_language?: string
          timezone?: string | null
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
          description: string | null
          type: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: string
          slug?: string
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
      products: {
        Row: {
          id: string
          seller_id: string
          category_id: string | null
          title: string
          description: string
          price: number
          stock: number
          images: string[]
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          category_id?: string | null
          title: string
          description: string
          price: number
          stock?: number
          images?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          category_id?: string | null
          title?: string
          description?: string
          price?: number
          stock?: number
          images?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          employer_id: string
          category_id: string | null
          title: string
          description: string
          job_type: string
          location: string
          salary_min: number | null
          salary_max: number | null
          requirements: string[]
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employer_id: string
          category_id?: string | null
          title: string
          description: string
          job_type: string
          location: string
          salary_min?: number | null
          salary_max?: number | null
          requirements?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employer_id?: string
          category_id?: string | null
          title?: string
          description?: string
          job_type?: string
          location?: string
          salary_min?: number | null
          salary_max?: number | null
          requirements?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          buyer_id: string
          seller_id: string
          total_amount: number
          status: string
          shipping_address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          buyer_id: string
          seller_id: string
          total_amount: number
          status?: string
          shipping_address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          buyer_id?: string
          seller_id?: string
          total_amount?: number
          status?: string
          shipping_address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
      job_applications: {
        Row: {
          id: string
          job_id: string
          applicant_id: string
          cover_letter: string
          resume_url: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          applicant_id: string
          cover_letter: string
          resume_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          applicant_id?: string
          cover_letter?: string
          resume_url?: string | null
          status?: string
          created?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string | null
          reviewer_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id?: string | null
          reviewer_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string | null
          reviewer_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          is_read?: boolean
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          is_read?: boolean
          created_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          theme: string
          language: string
          notifications_enabled: boolean
          email_notifications: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: string
          language?: string
          notifications_enabled?: boolean
          email_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: string
          language?: string
          notifications_enabled?: boolean
          email_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
      browsing_history: {
        Row: {
          id: string
          user_id: string
          product_id: string
          viewed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          viewed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          viewed_at?: string
        }
      }
      saved_searches: {
        Row: {
          id: string
          user_id: string
          search_type: string
          search_query: string
          filters: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          search_type: string
          search_query: string
          filters?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          search_type?: string
          search_query?: string
          filters?: Json
          created_at?: string
        }
      }
      footer_sections: {
        Row: {
          id: string
          title: string
          slug: string
          order_index: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          order_index?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          order_index?: number
          is_active?: boolean
          created_at?: string
        }
      }
      footer_links: {
        Row: {
          id: string
          section_id: string
          title: string
          url: string
          order_index: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          section_id: string
          title: string
          url: string
          order_index?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          section_id?: string
          title?: string
          url?: string
          order_index?: number
          is_active?: boolean
          created_at?: string
        }
      }
      static_pages: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      translation_keys: {
        Row: {
          id: string
          key: string
          category: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          key: string
          category: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          key?: string
          category?: string
          description?: string | null
          created_at?: string
        }
      }
      translations: {
        Row: {
          id: string
          key_id: string
          language_code: string
          value: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key_id: string
          language_code: string
          value: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key_id?: string
          language_code?: string
          value?: string
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
      saved_jobs: {
        Row: {
          id: string
          user_id: string
          job_id: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          job_id: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_id?: string
          notes?: string | null
          created_at?: string
        }
      }
      follows: {
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
    }
  }
}
