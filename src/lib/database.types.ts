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
      eventos: {
        Row: {
          id: string
          created_at: string
          nome: string
          descricao: string | null
          data_evento: string
          local: string
          pix_key: string
          valor_inscricao: number
          max_participantes: number | null
          status: string
          banner_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          nome: string
          descricao?: string | null
          data_evento: string
          local: string
          pix_key: string
          valor_inscricao: number
          max_participantes?: number | null
          status?: string
          banner_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          nome?: string
          descricao?: string | null
          data_evento?: string
          local?: string
          pix_key?: string
          valor_inscricao?: number
          max_participantes?: number | null
          status?: string
          banner_url?: string | null
        }
        Relationships: []
      }
      inscricoes: {
        Row: {
          id: string
          created_at: string
          evento_id: string
          nome_participante: string
          email_participante: string
          telefone_participante: string | null
          status_pagamento: string
          comprovante_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          evento_id: string
          nome_participante: string
          email_participante: string
          telefone_participante?: string | null
          status_pagamento?: string
          comprovante_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          evento_id?: string
          nome_participante?: string
          email_participante?: string
          telefone_participante?: string | null
          status_pagamento?: string
          comprovante_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inscricoes_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          }
        ]
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
