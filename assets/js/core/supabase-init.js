
// assets/js/supabase-init.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// REPLACE THESE WITH YOUR ACTUAL SUPABASE URL AND ANON KEY
const SUPABASE_URL = "https://pcwibkgvpxjbxnerctzy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjd2lia2d2cHhqYnhuZXJjdHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MzU1OTIsImV4cCI6MjA4MjUxMTU5Mn0.utuX_SvSr3NJJRrjv1e_spDEKWS77t6b5Rmg6DgG23o";

if (SUPABASE_URL === "https://pcwibkgvpxjbxnerctzy.supabase.co") {
    console.warn("Supabase is not configured. Please set your URL and Key in assets/js/supabase-init.js");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Supabase initialized");
