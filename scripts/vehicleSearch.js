const { createClient } = supabase;

// Would usually be places in a .env file that is ignored by git
const SUPABASE_PUBLIC_KEY =
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
    .eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbHR3cnZyamhjY2p3bHlzeHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2MzI2MzIsImV4cCI6MjAzMTIwODYzMn0
    .OswQr77RtcQ3nmXeWsOYa5dhmwpIVB6of_aYqwQ1yIw;
const PROJECT_URL = "https://iqltwrvrjhccjwlysxyt.supabase.co";

const _supabase = createClient(PROJECT_URL, SUPABASE_PUBLIC_KEY);
