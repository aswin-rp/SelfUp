import { createClient } from '@supabase/supabase-js'

// These values come from your .env file (see .env.example).
// Vite only exposes variables that start with VITE_ to the browser.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  // This warning shows up in the browser console if the .env file
  // is missing or the values weren't filled in.
  console.warn(
    'Supabase environment variables are missing. Check your .env file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
