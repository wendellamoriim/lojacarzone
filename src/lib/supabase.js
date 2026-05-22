import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oiryclylkfprjbplymlh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pcnljbHlsa2ZwcmpicGx5bWxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NzIxNjksImV4cCI6MjA5NTA0ODE2OX0.HsC9B1BGPB4KI3sfKGPlHAq9Q2thPHu70me2B7BCYk0';

// Cliente singleton com configurações de performance otimizadas
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
