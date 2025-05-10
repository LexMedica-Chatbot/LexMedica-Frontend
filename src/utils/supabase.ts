// Desc: Supabase client setup
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL || "https://no-url.supabase.co";
const supabaseKey =
  process.env.REACT_APP_SUPABASE_ANON_KEY || "no-key";

export const supabase = createClient(supabaseUrl, supabaseKey);
