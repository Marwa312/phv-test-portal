/**
 * Supabase Configuration Example
 * 
 * INSTRUCTIONS:
 * 1. Copy this file to supabaseConfig.js
 * 2. Replace the placeholder values below with your actual Supabase project credentials
 * 3. Get your credentials from: https://supabase.com/dashboard/project/[your-project]/settings/api
 */

// Replace these with your actual Supabase project credentials
const SUPABASE_URL = "YOUR_SUPABASE_URL_HERE";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY_HERE";

// Example of what your real values should look like:
// const SUPABASE_URL = "https://your-project-id.supabase.co";
// const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

// Export the configuration for use in other files
window.SUPABASE_CONFIG = {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY
};
