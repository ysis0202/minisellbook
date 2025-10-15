export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          profile_image: string | null;
          auth_provider: 'google' | 'kakao' | null;
          is_premium: boolean;
          premium_until: string | null;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          profile_image?: string | null;
          auth_provider?: 'google' | 'kakao' | null;
          is_premium?: boolean;
          premium_until?: string | null;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          display_name?: string | null;
          profile_image?: string | null;
          auth_provider?: 'google' | 'kakao' | null;
          is_premium?: boolean;
          premium_until?: string | null;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      accounts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'cash' | 'card' | 'bank' | 'other';
          is_default: boolean;
          archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type?: 'cash' | 'card' | 'bank' | 'other';
          is_default?: boolean;
          archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: 'cash' | 'card' | 'bank' | 'other';
          is_default?: boolean;
          archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          kind: 'income' | 'expense' | 'savings';
          emoji: string | null;
          color: string | null;
          sort: number;
          archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          kind: 'income' | 'expense' | 'savings';
          emoji?: string | null;
          color?: string | null;
          sort?: number;
          archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          kind?: 'income' | 'expense' | 'savings';
          emoji?: string | null;
          color?: string | null;
          sort?: number;
          archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      entries: {
        Row: {
          id: string;
          user_id: string;
          account_id: string | null;
          category_id: string | null;
          kind: 'income' | 'expense' | 'savings';
          amount: number;
          memo: string | null;
          entry_date: string;
          tags: string[] | null;
          attachment_url: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_id?: string | null;
          category_id?: string | null;
          kind: 'income' | 'expense' | 'savings';
          amount: number;
          memo?: string | null;
          entry_date: string;
          tags?: string[] | null;
          attachment_url?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_id?: string | null;
          category_id?: string | null;
          kind?: 'income' | 'expense' | 'savings';
          amount?: number;
          memo?: string | null;
          entry_date?: string;
          tags?: string[] | null;
          attachment_url?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Account = Database['public']['Tables']['accounts']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Entry = Database['public']['Tables']['entries']['Row'];

export type EntryWithDetails = Entry & {
  categories?: Category | null;
  accounts?: Account | null;
};