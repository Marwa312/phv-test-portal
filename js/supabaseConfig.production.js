/**
 * Supabase Configuration for Production
 * 
 * This file contains your Supabase project credentials for production deployment.
 * This file IS included in git and deployed to Vercel.
 */

// Your Supabase project credentials
const SUPABASE_URL = "https://csntvlumbsmcrgzlbmzk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzbnR2bHVtYnNtY3JnemxibXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NDM1OTAsImV4cCI6MjA3NjMxOTU5MH0.UE_qp5MXGE3GzpNBt2okQl8VeO_5luUsSUaqR5SZHfM";

// Export the configuration for use in other files
window.SUPABASE_CONFIG = {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY
};
