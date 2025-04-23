// Desc: Supabase client setup
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL || "https://edxnjclbtbkyohvjkmcv.supabase.co";
const supabaseKey =
  process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkeG5qY2xidGJreW9odmprbWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMzkyNzAsImV4cCI6MjA2MDkxNTI3MH0.NvMxxdyjzz9Nvc5sDdOrK3-mhmSWi7gtRLoEcC8N1PQ";

export const supabase = createClient(supabaseUrl, supabaseKey);
