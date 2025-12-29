
// assets/js/shared/auth-manager.js
// Centralized authentication manager (Supabase Adapter)
import { supabase } from "../supabase-init.js";

// Export auth and db instances (Adapting to Supabase client)
export const auth = supabase.auth;
export const db = supabase;

console.log("Supabase Auth and DB services initialized (Adapter)");
