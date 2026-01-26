
// assets/js/supabase-init.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Supabase configuration
const SUPABASE_URL = "https://pcwibkgvpxjbxnerctzy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjd2lia2d2cHhqYnhuZXJjdHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MzU1OTIsImV4cCI6MjA4MjUxMTU5Mn0.utuX_SvSr3NJJRrjv1e_spDEKWS77t6b5Rmg6DgG23o";

// Warn if using placeholder values
if (SUPABASE_URL === "YOUR_SUPABASE_URL" || SUPABASE_ANON_KEY === "YOUR_SUPABASE_ANON_KEY") {
    console.warn("Supabase is not configured. Please set your URL and Key in assets/js/supabase-init.js");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Expose to window for non-module scripts (like header-loader.js)
window.__SUPABASE_CLIENT__ = supabase;

console.log("Supabase initialized");
