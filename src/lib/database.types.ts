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
          agent_specializations: string[] | null
          agent_rating: number | null
          total_tickets_resolved: number | null
          is_available: boolean | null
          created_at: string | null
          updated_at: string | null
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
          agent_specializations?: string[] | null
          agent_rating?: number | null
          total_tickets_resolved?: number | null
          is_available?: boolean | null
          created_at?: string | null
          updated_at?: string | null
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
          agent_specializations?: string[] | null
          agent_rating?: number | null
          total_tickets_resolved?: number | null
          is_available?: boolean | null
          created_at?: string | null
          updated_at?: string | null
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
          read: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          link?: string | null
          read?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          link?: string | null
          read?: boolean | null
          created_at?: string | null
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
      agent_pricing_profiles: {
        Row: {
          id: string
          agent_id: string
          hourly_rate: number
          base_rate: number
          minimum_charge: number
          currency: string
          allows_negotiation: boolean | null
          description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          agent_id: string
          hourly_rate?: number
          base_rate?: number
          minimum_charge?: number
          currency?: string
          allows_negotiation?: boolean | null
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          agent_id?: string
          hourly_rate?: number
          base_rate?: number
          minimum_charge?: number
          currency?: string
          allows_negotiation?: boolean | null
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      price_proposals: {
        Row: {
          id: string
          agent_id: string
          client_id: string
          ticket_id: string | null
          title: string
          description: string | null
          breakdown: Json
          subtotal: number
          discount_amount: number
          total_price: number
          currency: string
          payment_terms: string | null
          status: string | null
          expires_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          agent_id: string
          client_id: string
          ticket_id?: string | null
          title: string
          description?: string | null
          breakdown?: Json
          subtotal: number
          discount_amount?: number
          total_price: number
          currency?: string
          payment_terms?: string | null
          status?: string | null
          expires_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          agent_id?: string
          client_id?: string
          ticket_id?: string | null
          title?: string
          description?: string | null
          breakdown?: Json
          subtotal?: number
          discount_amount?: number
          total_price?: number
          currency?: string
          payment_terms?: string | null
          status?: string | null
          expires_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      agreed_pricing: {
        Row: {
          id: string
          ticket_id: string
          proposal_id: string | null
          agent_id: string
          client_id: string
          final_price: number
          breakdown: Json
          currency: string
          payment_terms: string | null
          agreed_by_agent_at: string | null
          agreed_by_client_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          ticket_id: string
          proposal_id?: string | null
          agent_id: string
          client_id: string
          final_price: number
          breakdown?: Json
          currency?: string
          payment_terms?: string | null
          agreed_by_agent_at?: string | null
          agreed_by_client_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          ticket_id?: string
          proposal_id?: string | null
          agent_id?: string
          client_id?: string
          final_price?: number
          breakdown?: Json
          currency?: string
          payment_terms?: string | null
          agreed_by_agent_at?: string | null
          agreed_by_client_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      price_negotiation_history: {
        Row: {
          id: string
          proposal_id: string
          from_user_id: string
          to_user_id: string
          action: string
          proposed_amount: number | null
          notes: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          proposal_id: string
          from_user_id: string
          to_user_id: string
          action: string
          proposed_amount?: number | null
          notes?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          proposal_id?: string
          from_user_id?: string
          to_user_id?: string
          action?: string
          proposed_amount?: number | null
          notes?: string | null
          created_at?: string | null
        }
      }
      learning_topics: {
        Row: {
          id: string
          title: string
          description: string
          icon: string
          color: string
          total_xp: number
          estimated_hours: number
          order_index: number
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          icon?: string
          color?: string
          total_xp?: number
          estimated_hours?: number
          order_index?: number
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          icon?: string
          color?: string
          total_xp?: number
          estimated_hours?: number
          order_index?: number
          created_at?: string | null
        }
      }
      learning_modules: {
        Row: {
          id: string
          topic_id: string
          title: string
          description: string
          level: number
          unlock_requirement: number
          xp_reward: number
          order_index: number
          created_at: string | null
        }
        Insert: {
          id?: string
          topic_id: string
          title: string
          description: string
          level?: number
          unlock_requirement?: number
          xp_reward?: number
          order_index?: number
          created_at?: string | null
        }
        Update: {
          id?: string
          topic_id?: string
          title?: string
          description?: string
          level?: number
          unlock_requirement?: number
          xp_reward?: number
          order_index?: number
          created_at?: string | null
        }
      }
      learning_lessons: {
        Row: {
          id: string
          module_id: string
          title: string
          description: string
          content: Json
          duration_minutes: number
          xp_reward: number
          order_index: number
          created_at: string | null
        }
        Insert: {
          id?: string
          module_id: string
          title: string
          description: string
          content?: Json
          duration_minutes?: number
          xp_reward?: number
          order_index?: number
          created_at?: string | null
        }
        Update: {
          id?: string
          module_id?: string
          title?: string
          description?: string
          content?: Json
          duration_minutes?: number
          xp_reward?: number
          order_index?: number
          created_at?: string | null
        }
      }
      learning_quizzes: {
        Row: {
          id: string
          lesson_id: string
          title: string
          passing_score: number
          xp_reward: number
          time_limit_seconds: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          lesson_id: string
          title: string
          passing_score?: number
          xp_reward?: number
          time_limit_seconds?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          lesson_id?: string
          title?: string
          passing_score?: number
          xp_reward?: number
          time_limit_seconds?: number | null
          created_at?: string | null
        }
      }
      quiz_questions: {
        Row: {
          id: string
          quiz_id: string
          question_text: string
          question_type: string
          points: number
          order_index: number
          explanation: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          quiz_id: string
          question_text: string
          question_type?: string
          points?: number
          order_index?: number
          explanation?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          quiz_id?: string
          question_text?: string
          question_type?: string
          points?: number
          order_index?: number
          explanation?: string | null
          created_at?: string | null
        }
      }
      quiz_options: {
        Row: {
          id: string
          question_id: string
          option_text: string
          is_correct: boolean
          order_index: number
          created_at: string | null
        }
        Insert: {
          id?: string
          question_id: string
          option_text: string
          is_correct?: boolean
          order_index?: number
          created_at?: string | null
        }
        Update: {
          id?: string
          question_id?: string
          option_text?: string
          is_correct?: boolean
          order_index?: number
          created_at?: string | null
        }
      }
      user_learning_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed: boolean
          xp_earned: number
          completed_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed?: boolean
          xp_earned?: number
          completed_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          completed?: boolean
          xp_earned?: number
          completed_at?: string | null
          created_at?: string | null
        }
      }
      user_quiz_attempts: {
        Row: {
          id: string
          user_id: string
          quiz_id: string
          score: number
          xp_earned: number
          passed: boolean
          time_taken_seconds: number | null
          answers: Json
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          quiz_id: string
          score?: number
          xp_earned?: number
          passed?: boolean
          time_taken_seconds?: number | null
          answers?: Json
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          quiz_id?: string
          score?: number
          xp_earned?: number
          passed?: boolean
          time_taken_seconds?: number | null
          answers?: Json
          created_at?: string | null
        }
      }
      user_xp_totals: {
        Row: {
          id: string
          user_id: string
          topic_id: string
          total_xp: number
          current_level: number
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          topic_id: string
          total_xp?: number
          current_level?: number
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          topic_id?: string
          total_xp?: number
          current_level?: number
          updated_at?: string | null
        }
      }
      daily_streaks: {
        Row: {
          id: string
          user_id: string
          current_streak: number
          longest_streak: number
          last_activity_date: string | null
          total_days_learned: number
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          current_streak?: number
          longest_streak?: number
          last_activity_date?: string | null
          total_days_learned?: number
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          current_streak?: number
          longest_streak?: number
          last_activity_date?: string | null
          total_days_learned?: number
          updated_at?: string | null
        }
      }
      achievements: {
        Row: {
          id: string
          title: string
          description: string
          icon: string
          badge_color: string
          requirement_type: string
          requirement_value: number
          xp_reward: number
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          icon?: string
          badge_color?: string
          requirement_type: string
          requirement_value?: number
          xp_reward?: number
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          icon?: string
          badge_color?: string
          requirement_type?: string
          requirement_value?: number
          xp_reward?: number
          created_at?: string | null
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          earned_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          earned_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          earned_at?: string | null
        }
      }
      chat_rooms: {
        Row: {
          id: string
          ticket_id: string | null
          room_name: string
          room_type: string
          status: string
          priority: string
          created_by: string
          created_at: string | null
          closed_at: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          ticket_id?: string | null
          room_name: string
          room_type?: string
          status?: string
          priority?: string
          created_by: string
          created_at?: string | null
          closed_at?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          ticket_id?: string | null
          room_name?: string
          room_type?: string
          status?: string
          priority?: string
          created_by?: string
          created_at?: string | null
          closed_at?: string | null
          metadata?: Json
        }
      }
      room_participants: {
        Row: {
          id: string
          room_id: string
          user_id: string
          role: string
          joined_at: string | null
          left_at: string | null
          is_active: boolean | null
          last_seen_at: string | null
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          role?: string
          joined_at?: string | null
          left_at?: string | null
          is_active?: boolean | null
          last_seen_at?: string | null
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          role?: string
          joined_at?: string | null
          left_at?: string | null
          is_active?: boolean | null
          last_seen_at?: string | null
        }
      }
      chat_messages: {
        Row: {
          id: string
          room_id: string
          sender_id: string
          message_type: string
          content: string
          metadata: Json | null
          reply_to_id: string | null
          is_edited: boolean | null
          is_deleted: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          room_id: string
          sender_id: string
          message_type?: string
          content: string
          metadata?: Json | null
          reply_to_id?: string | null
          is_edited?: boolean | null
          is_deleted?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          room_id?: string
          sender_id?: string
          message_type?: string
          content?: string
          metadata?: Json | null
          reply_to_id?: string | null
          is_edited?: boolean | null
          is_deleted?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      agent_availability: {
        Row: {
          id: string
          agent_id: string
          status: string
          status_message: string | null
          max_concurrent_rooms: number | null
          current_room_count: number | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          agent_id: string
          status?: string
          status_message?: string | null
          max_concurrent_rooms?: number | null
          current_room_count?: number | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          agent_id?: string
          status?: string
          status_message?: string | null
          max_concurrent_rooms?: number | null
          current_room_count?: number | null
          updated_at?: string | null
        }
      }
      agent_activity: {
        Row: {
          id: string
          agent_id: string
          room_id: string
          activity_type: string
          created_at: string | null
          expires_at: string | null
        }
        Insert: {
          id?: string
          agent_id: string
          room_id: string
          activity_type: string
          created_at?: string | null
          expires_at?: string | null
        }
        Update: {
          id?: string
          agent_id?: string
          room_id?: string
          activity_type?: string
          created_at?: string | null
          expires_at?: string | null
        }
      }
    }
  }
}
