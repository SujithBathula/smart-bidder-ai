import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tmutzzzwmdilpsnjohyf.supabase.co';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your anon key securely

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
