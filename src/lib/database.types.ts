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
          phone: string | null
          bio: string | null
          location: string | null
          roles: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          phone?: string | null
          bio?: string | null
          location?: string | null
          roles?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          phone?: string | null
          bio?: string | null
          location?: string | null
          roles?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          type: 'product' | 'job'
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          type: 'product' | 'job'
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          type?: 'product' | 'job'
          description?: string | null
          created_at?: string
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
          status: 'active' | 'draft' | 'sold_out' | 'archived'
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
          status?: 'active' | 'draft' | 'sold_out' | 'archived'
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
          status?: 'active' | 'draft' | 'sold_out' | 'archived'
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
          location: string
          job_type: 'full_time' | 'part_time' | 'contract' | 'freelance'
          salary_min: number | null
          salary_max: number | null
          requirements: string[]
          status: 'open' | 'closed' | 'filled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employer_id: string
          category_id?: string | null
          title: string
          description: string
          location: string
          job_type: 'full_time' | 'part_time' | 'contract' | 'freelance'
          salary_min?: number | null
          salary_max?: number | null
          requirements?: string[]
          status?: 'open' | 'closed' | 'filled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employer_id?: string
          category_id?: string | null
          title?: string
          description?: string
          location?: string
          job_type?: 'full_time' | 'part_time' | 'contract' | 'freelance'
          salary_min?: number | null
          salary_max?: number | null
          requirements?: string[]
          status?: 'open' | 'closed' | 'filled'
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          buyer_id: string
          total_amount: number
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          buyer_id: string
          total_amount: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          buyer_id?: string
          total_amount?: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address?: Json
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
          status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          applicant_id: string
          cover_letter: string
          resume_url?: string | null
          status?: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          applicant_id?: string
          cover_letter?: string
          resume_url?: string | null
          status?: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted'
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          reviewer_id: string
          product_id: string | null
          seller_id: string | null
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          reviewer_id: string
          product_id?: string | null
          seller_id?: string | null
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          reviewer_id?: string
          product_id?: string | null
          seller_id?: string | null
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
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          read?: boolean
          created_at?: string
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
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          link?: string | null
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          link?: string | null
          read?: boolean
          created_at?: string
        }
      }
    }
  }
}
