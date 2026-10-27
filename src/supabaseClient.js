import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rjwxsjdayublcmcciuww.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key-placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  db: {
    schema: 'public'
  }
});

// 20-Row Cursor Pagination Helper to prevent mobile WebView RAM overload
export const fetchPaginatedTable = async (tableName, page = 0, pageSize = 20, categoryId = null) => {
  const from = page * pageSize;
  const to = from + pageSize - 1;
  let query = supabase
    .from(tableName)
    .select('*')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  return await query;
};