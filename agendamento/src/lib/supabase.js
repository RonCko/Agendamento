import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// TODO: Substitua pelas suas credenciais do Supabase
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
