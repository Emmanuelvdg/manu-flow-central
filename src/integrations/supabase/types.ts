export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      access_matrix: {
        Row: {
          created_at: string
          group_id: string
          id: string
          permission_id: string
          resource_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          permission_id: string
          resource_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          permission_id?: string
          resource_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_matrix_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "user_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_matrix_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_matrix_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_product_documents: {
        Row: {
          created_at: string
          custom_product_id: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_product_id: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_product_id?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_product_documents_custom_product_id_fkey"
            columns: ["custom_product_id"]
            isOneToOne: false
            referencedRelation: "custom_products"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_products: {
        Row: {
          created_at: string
          description: string | null
          documents: Json | null
          id: string
          name: string
          quote_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          documents?: Json | null
          id?: string
          name: string
          quote_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          documents?: Json | null
          id?: string
          name?: string
          quote_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      financing_applications: {
        Row: {
          annual_revenue: number | null
          bank_statements: string | null
          bank_statements_sales_ledger: string | null
          beneficial_owner_structure: string | null
          business_licenses: string | null
          certificate_of_incorporation: string | null
          company_name: string
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at: string | null
          deed_of_establishment: string | null
          financial_statements: string | null
          financing_type: string
          historical_transactional_data: string | null
          id: string
          id_cards_management: string | null
          identification_docs: string | null
          notes: string | null
          sample_transactional_doc: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          annual_revenue?: number | null
          bank_statements?: string | null
          bank_statements_sales_ledger?: string | null
          beneficial_owner_structure?: string | null
          business_licenses?: string | null
          certificate_of_incorporation?: string | null
          company_name: string
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at?: string | null
          deed_of_establishment?: string | null
          financial_statements?: string | null
          financing_type: string
          historical_transactional_data?: string | null
          id?: string
          id_cards_management?: string | null
          identification_docs?: string | null
          notes?: string | null
          sample_transactional_doc?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          annual_revenue?: number | null
          bank_statements?: string | null
          bank_statements_sales_ledger?: string | null
          beneficial_owner_structure?: string | null
          business_licenses?: string | null
          certificate_of_incorporation?: string | null
          company_name?: string
          contact_email?: string
          contact_name?: string
          contact_phone?: string
          created_at?: string | null
          deed_of_establishment?: string | null
          financial_statements?: string | null
          financing_type?: string
          historical_transactional_data?: string | null
          id?: string
          id_cards_management?: string | null
          identification_docs?: string | null
          notes?: string | null
          sample_transactional_doc?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      fx_rates: {
        Row: {
          created_at: string
          effective_date: string
          from_currency: string
          id: string
          rate: number
          to_currency: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          effective_date: string
          from_currency: string
          id?: string
          rate: number
          to_currency: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          effective_date?: string
          from_currency?: string
          id?: string
          rate?: number
          to_currency?: string
          updated_at?: string
        }
        Relationships: []
      }
      fx_settings: {
        Row: {
          base_currency: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          base_currency: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          base_currency?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
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
      material_allocations: {
        Row: {
          allocation_type: string
          created_at: string
          id: string
          material_id: string
          order_id: string
          quantity: number
          updated_at: string
        }
        Insert: {
          allocation_type: string
          created_at?: string
          id?: string
          material_id: string
          order_id: string
          quantity: number
          updated_at?: string
        }
        Update: {
          allocation_type?: string
          created_at?: string
          id?: string
          material_id?: string
          order_id?: string
          quantity?: number
          updated_at?: string
        }
        Relationships: []
      }
      material_batches: {
        Row: {
          batch_number: string
          cost_per_unit: number
          created_at: string
          expiry_date: string | null
          id: string
          initial_stock: number
          material_id: string
          purchase_date: string
          remaining_stock: number
          status: string
          updated_at: string
        }
        Insert: {
          batch_number: string
          cost_per_unit: number
          created_at?: string
          expiry_date?: string | null
          id?: string
          initial_stock: number
          material_id: string
          purchase_date: string
          remaining_stock: number
          status?: string
          updated_at?: string
        }
        Update: {
          batch_number?: string
          cost_per_unit?: number
          created_at?: string
          expiry_date?: string | null
          id?: string
          initial_stock?: number
          material_id?: string
          purchase_date?: string
          remaining_stock?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "material_batches_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          abc_classification: string | null
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
          abc_classification?: string | null
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
          abc_classification?: string | null
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
          materials_status: string
          notes: string | null
          order_id: string
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
          materials_status?: string
          notes?: string | null
          order_id: string
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
          materials_status?: string
          notes?: string | null
          order_id?: string
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
      order_stage_progress: {
        Row: {
          completed_units: number
          created_at: string
          id: string
          in_progress_units: number
          order_product_id: string
          stage_id: string
          stage_name: string
          total_units: number
          updated_at: string
          yet_to_start_units: number
        }
        Insert: {
          completed_units?: number
          created_at?: string
          id?: string
          in_progress_units?: number
          order_product_id: string
          stage_id: string
          stage_name: string
          total_units?: number
          updated_at?: string
          yet_to_start_units?: number
        }
        Update: {
          completed_units?: number
          created_at?: string
          id?: string
          in_progress_units?: number
          order_product_id?: string
          stage_id?: string
          stage_name?: string
          total_units?: number
          updated_at?: string
          yet_to_start_units?: number
        }
        Relationships: []
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
      permissions: {
        Row: {
          created_at: string
          display_name: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          display_name: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          name?: string
        }
        Relationships: []
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
      product_variants: {
        Row: {
          attributes: Json
          created_at: string
          id: string
          image: string | null
          inventory: number | null
          price: number | null
          product_id: string
          sku: string
          updated_at: string
        }
        Insert: {
          attributes?: Json
          created_at?: string
          id?: string
          image?: string | null
          inventory?: number | null
          price?: number | null
          product_id: string
          sku: string
          updated_at?: string
        }
        Update: {
          attributes?: Json
          created_at?: string
          id?: string
          image?: string | null
          inventory?: number | null
          price?: number | null
          product_id?: string
          sku?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
          hasvariants: boolean | null
          id: string
          image: string | null
          lead_time: string | null
          name: string
          price: number | null
          updated_at: string
          varianttypes: Json | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          hasvariants?: boolean | null
          id: string
          image?: string | null
          lead_time?: string | null
          name: string
          price?: number | null
          updated_at?: string
          varianttypes?: Json | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          hasvariants?: boolean | null
          id?: string
          image?: string | null
          lead_time?: string | null
          name?: string
          price?: number | null
          updated_at?: string
          varianttypes?: Json | null
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
          dispute_resolution_method: string | null
          estimated_delivery: string | null
          force_majeure_terms: string | null
          governing_law: string | null
          id: string
          incoterms: string | null
          late_payment_penalties: string | null
          other_fees: Json | null
          payment_terms: string | null
          performance_guarantees: string | null
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
          dispute_resolution_method?: string | null
          estimated_delivery?: string | null
          force_majeure_terms?: string | null
          governing_law?: string | null
          id?: string
          incoterms?: string | null
          late_payment_penalties?: string | null
          other_fees?: Json | null
          payment_terms?: string | null
          performance_guarantees?: string | null
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
          dispute_resolution_method?: string | null
          estimated_delivery?: string | null
          force_majeure_terms?: string | null
          governing_law?: string | null
          id?: string
          incoterms?: string | null
          late_payment_penalties?: string | null
          other_fees?: Json | null
          payment_terms?: string | null
          performance_guarantees?: string | null
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
          routing_stages: Json | null
          totalCost: number | null
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
          routing_stages?: Json | null
          totalCost?: number | null
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
          routing_stages?: Json | null
          totalCost?: number | null
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
      resources: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
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
      routing_stages: {
        Row: {
          created_at: string
          description: string | null
          id: string
          stage_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          stage_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          stage_name?: string
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
      user_groups: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_groups_members: {
        Row: {
          created_at: string
          group_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_groups_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "user_groups"
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
      has_permission: {
        Args: { permission_name: string; resource_name: string }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
