import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ljjmucfjzjqtmxzojrik.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqam11Y2ZqempxdG14em9qcmlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMTc1NTgsImV4cCI6MjA3ODg5MzU1OH0.zCIp-mxGdU58IWq_WbHMOPlnPkqe9Qlt_mPb5WVM-Bw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Listener para tratar erros de autenticação
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
    console.log('Auth event:', event);
  }
  
  // Se houve erro de token, limpar sessão
  if (event === 'SIGNED_OUT' && !session) {
    AsyncStorage.removeItem('supabase.auth.token');
  }
});
