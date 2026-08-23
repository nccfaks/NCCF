const SUPABASE_URL = "https://fzrlmbdplvbeanxwggju.supabase.co";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6cmxtYmRwbHZiZWFueHdnZ2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MjYxODYsImV4cCI6MjEwMzAwMjE4Nn0.9lReRIxrw8bbf4Q8bW_rH-4T7Ss83290QErG_7OUAO0";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);