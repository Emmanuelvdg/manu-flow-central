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
      invoices: {
        Row: {
          amount: number
          created_at: string
          due_date: string | null
          id: string
          invoice_number: string
          order_id: string | null
          paid: boolean | null
          payment_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date?: string | null
          id?: string
          invoice_number: string
          order_id?: string | null
          paid?: boolean | null
          payment_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string | null
          id?: string
          invoice_number?: string
          order_id?: string | null
          paid?: boolean | null
          payment_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          lead_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          lead_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          lead_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_attachments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          city: string | null
          company_name: string
          contact_name: string
          contact_title: string | null
          contract_end_date: string | null
          created_at: string | null
          current_system: string | null
          email: string | null
          expected_closing_date: string | null
          id: string
          last_contacted: string | null
          needs: string[] | null
          next_contact: string | null
          notes: string | null
          number_of_outlets: number | null
          phone: string | null
          price_quoted: number | null
          status: string | null
          suburb: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          city?: string | null
          company_name: string
          contact_name: string
          contact_title?: string | null
          contract_end_date?: string | null
          created_at?: string | null
          current_system?: string | null
          email?: string | null
          expected_closing_date?: string | null
          id?: string
          last_contacted?: string | null
          needs?: string[] | null
          next_contact?: string | null
          notes?: string | null
          number_of_outlets?: number | null
          phone?: string | null
          price_quoted?: number | null
          status?: string | null
          suburb?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          city?: string | null
          company_name?: string
          contact_name?: string
          contact_title?: string | null
          contract_end_date?: string | null
          created_at?: string | null
          current_system?: string | null
          email?: string | null
          expected_closing_date?: string | null
          id?: string
          last_contacted?: string | null
          needs?: string[] | null
          next_contact?: string | null
          notes?: string | null
          number_of_outlets?: number | null
          phone?: string | null
          price_quoted?: number | null
          status?: string | null
          suburb?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      materials: {
        Row: {
          category: string | null
          created_at: string
          id: string
          name: string
          status: string | null
          unit: string
          updated_at: string
          vendor: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id: string
          name: string
          status?: string | null
          unit: string
          updated_at?: string
          vendor?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          name?: string
          status?: string | null
          unit?: string
          updated_at?: string
          vendor?: string | null
        }
        Relationships: []
      }
      order_materials: {
        Row: {
          allocated: boolean | null
          created_at: string
          id: string
          material_id: string
          order_product_id: string
          quantity: number
          status: string
          unit: string
          updated_at: string
        }
        Insert: {
          allocated?: boolean | null
          created_at?: string
          id?: string
          material_id: string
          order_product_id: string
          quantity: number
          status?: string
          unit: string
          updated_at?: string
        }
        Update: {
          allocated?: boolean | null
          created_at?: string
          id?: string
          material_id?: string
          order_product_id?: string
          quantity?: number
          status?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_materials_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_materials_order_product_id_fkey"
            columns: ["order_product_id"]
            isOneToOne: false
            referencedRelation: "order_products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_products: {
        Row: {
          created_at: string
          id: string
          machines_progress: number | null
          materials_progress: number | null
          materials_status: string
          notes: string | null
          order_id: string
          personnel_progress: number | null
          product_id: string
          quantity: number
          recipe_id: string | null
          status: string
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          machines_progress?: number | null
          materials_progress?: number | null
          materials_status?: string
          notes?: string | null
          order_id: string
          personnel_progress?: number | null
          product_id: string
          quantity?: number
          recipe_id?: string | null
          status?: string
          unit: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          machines_progress?: number | null
          materials_progress?: number | null
          materials_status?: string
          notes?: string | null
          order_id?: string
          personnel_progress?: number | null
          product_id?: string
          quantity?: number
          recipe_id?: string | null
          status?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_products_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_products_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_name: string
          deposit_paid: boolean | null
          id: string
          order_date: string | null
          order_number: string
          parts_status: string
          products: Json
          quote_id: string | null
          shipping_address: string | null
          status: string
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          deposit_paid?: boolean | null
          id?: string
          order_date?: string | null
          order_number: string
          parts_status?: string
          products: Json
          quote_id?: string | null
          shipping_address?: string | null
          status?: string
          total: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          deposit_paid?: boolean | null
          id?: string
          order_date?: string | null
          order_number?: string
          parts_status?: string
          products?: Json
          quote_id?: string | null
          shipping_address?: string | null
          status?: string
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      personnel_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      productions: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          notes: string | null
          order_id: string | null
          progress: number | null
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          progress?: number | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          progress?: number | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "productions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          company_name: string | null
          created_at: string
          currency: string
          customer_email: string | null
          customer_name: string
          deposit_percentage: number | null
          estimated_delivery: string | null
          id: string
          incoterms: string | null
          payment_terms: string | null
          products: Json
          quote_number: string
          rfq_id: string | null
          risk_level: string | null
          shipping_method: string | null
          status: string
          total: number
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name: string
          deposit_percentage?: number | null
          estimated_delivery?: string | null
          id?: string
          incoterms?: string | null
          payment_terms?: string | null
          products: Json
          quote_number: string
          rfq_id?: string | null
          risk_level?: string | null
          shipping_method?: string | null
          status?: string
          total: number
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name?: string
          deposit_percentage?: number | null
          estimated_delivery?: string | null
          id?: string
          incoterms?: string | null
          payment_terms?: string | null
          products?: Json
          quote_number?: string
          rfq_id?: string | null
          risk_level?: string | null
          shipping_method?: string | null
          status?: string
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_rfq_id_fkey"
            columns: ["rfq_id"]
            isOneToOne: false
            referencedRelation: "rfqs"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          machines: Json | null
          materials: Json | null
          name: string
          personnel: Json | null
          product_id: string
          product_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          machines?: Json | null
          materials?: Json | null
          name: string
          personnel?: Json | null
          product_id: string
          product_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          machines?: Json | null
          materials?: Json | null
          name?: string
          personnel?: Json | null
          product_id?: string
          product_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      resource_allocations: {
        Row: {
          created_at: string
          id: string
          machines: Json | null
          materials: Json | null
          order_id: string | null
          personnel: Json | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          machines?: Json | null
          materials?: Json | null
          order_id?: string | null
          personnel?: Json | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          machines?: Json | null
          materials?: Json | null
          order_id?: string | null
          personnel?: Json | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_allocations_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      rfqs: {
        Row: {
          company_name: string | null
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          id: string
          location: string | null
          notes: string | null
          products: Json
          rfq_number: string
          status: string
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          products: Json
          rfq_number: string
          status?: string
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          products?: Json
          rfq_number?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      shipments: {
        Row: {
          carrier: string | null
          created_at: string
          delivery_date: string | null
          id: string
          invoice_id: string | null
          order_id: string | null
          quote_id: string | null
          rfq_id: string | null
          ship_date: string | null
          status: string
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          carrier?: string | null
          created_at?: string
          delivery_date?: string | null
          id?: string
          invoice_id?: string | null
          order_id?: string | null
          quote_id?: string | null
          rfq_id?: string | null
          ship_date?: string | null
          status?: string
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          carrier?: string | null
          created_at?: string
          delivery_date?: string | null
          id?: string
          invoice_id?: string | null
          order_id?: string | null
          quote_id?: string | null
          rfq_id?: string | null
          ship_date?: string | null
          status?: string
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_rfq_id_fkey"
            columns: ["rfq_id"]
            isOneToOne: false
            referencedRelation: "rfqs"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_documents: {
        Row: {
          content: Json | null
          created_at: string
          document_type: string
          file_name: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string
          shipment_id: string
          status: string
          updated_at: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          document_type: string
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          shipment_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          document_type?: string
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          shipment_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipping_documents_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_invitations: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string
          is_admin: boolean | null
          token: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          invited_by: string
          is_admin?: boolean | null
          token: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          is_admin?: boolean | null
          token?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_admin: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          is_admin?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_admin?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
