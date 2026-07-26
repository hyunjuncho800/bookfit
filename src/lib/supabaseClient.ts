import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://pawvavdbilsnkdxdhjmt.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_l18VLM60fzeb3xRF_tMinQ_w03QylZT";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
